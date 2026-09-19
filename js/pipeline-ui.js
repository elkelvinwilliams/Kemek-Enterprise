/* ══════════════════════════════════════════════════════════════════════════
   Kemek Deal Pipeline — public UI (cards, filters, comparison table,
   Conservative / Base / Upside calculator, evidence drawer, detail page).
   Reads window.KEMEK_PIPELINE (public dataset) + window.KemekPipeline (engine).
   Only fields the admin has published are present in the public dataset, so
   nothing private can be rendered here even by accident.
   ══════════════════════════════════════════════════════════════════════════ */
(() => {
  'use strict';
  const D = window.KEMEK_PIPELINE, E = window.KemekPipeline;
  if (!D || !E) return;
  const { gbp, gbpK, pct, range } = E;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const has = (d, f) => (d.public_fields || []).includes(f) && d[f] !== undefined && d[f] !== null;
  const fmtDate = iso => { const [y, m, d] = (iso || '').split('-'); return d ? `${d} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m - 1]} ${y}` : ''; };
  const confClass = c => /low/i.test(c) ? 'conf-low' : /high/i.test(c) ? 'conf-high' : 'conf-med';
  const stageClass = s => /GO/.test(s) ? 'stage-go' : /Passed/.test(s) ? 'stage-passed' : /Shortlist/.test(s) ? 'stage-short' : 'stage-screen';
  const base = d => E.runCase(D, d, 'Base');

  /* ─── Card ────────────────────────────────────────────────────────────── */
  const card = (d, i) => {
    const b = base(d);
    const cash = d.value_kind && /income/i.test(d.value_kind);
    return `
    <article class="deal-card reveal" data-id="${esc(d.id)}" style="transition-delay:${(i % 3) * 0.08}s">
      <div class="deal-card__media ph-prop-${(i % 6) + 1} ph-sheen">
        <span class="deal-card__id">${esc(d.id)}</span>
        <span class="deal-badge ${stageClass(d.stage)}">${esc(d.stage)}</span>
      </div>
      <div class="deal-card__body">
        <span class="section-label" style="margin-bottom:.35rem">${esc(d.category)} · ${esc(d.nation)}</span>
        <h3 class="font-serif text-2xl text-ink leading-tight">${esc(d.headline)}</h3>
        <p class="deal-card__area">${esc(d.area)}${d.outcode ? ' · ' + esc(d.outcode) : ''} — ${esc(d.type)}${d.config ? ' · ' + esc(d.config) : ''}</p>
        <dl class="deal-kv">
          <div><dt>Guide</dt><dd>${esc(d.guide_label || range(d.guide[0], d.guide[1]))}</dd></div>
          <div><dt>${cash ? 'Income value' : 'Indicative end value'}</dt><dd>${range(d.value[0], d.value[2])}<small>base ${gbpK(d.value[1])}</small></dd></div>
          <div><dt>Base uplift</dt><dd class="${b.gross_uplift < 0 ? 'neg' : ''}">${gbpK(b.gross_uplift)}<small>${pct(b.gross_uplift_pct)} of price</small></dd></div>
          <div><dt>Confidence</dt><dd><span class="conf ${confClass(d.confidence)}">${esc(d.confidence)}</span></dd></div>
        </dl>
        <p class="deal-card__note">${d.auction_date ? `<b style="color:var(--ink);font-style:normal">Auction ${fmtDate(d.auction_date)}</b> · ` : ''}${cash ? 'Commercial — valued on rent ÷ yield, not GDV.' : 'Analytical range — not a valuation.'} Checked ${fmtDate(d.date_checked)}.</p>
        <div class="deal-card__actions">
          <a class="btn-ink" href="deal.html?id=${encodeURIComponent(d.id)}">View deal</a>
          <button class="btn-outline-dark" data-calc="${esc(d.id)}">Run the numbers</button>
          <button class="deal-link" data-evidence="${esc(d.id)}">Evidence &amp; sources</button>
        </div>
      </div>
    </article>`;
  };

  /* ─── Calculator (modal on the pipeline page, inline on the detail page) ─ */
  const ASSUMPTION_GROUPS = [
    ['Purchase', ['bid_premium_pct', 'auction_fee', 'legal', 'survey']],
    ['Works', ['refurb', 'professional', 'contingency_pct']],
    ['Finance', ['ltv_pct', 'rate_month_pct', 'term_months', 'arrangement_pct']],
    ['Exit', ['exit_agent_pct', 'exit_legal']],
  ];
  const ROWS = [
    ['acquisition', 'Acquisition price'], ['auction_fee', 'Auction / buyer fee'], ['tax', 'Transaction tax (SDLT / LTT / LBTT)'],
    ['legal', 'Legal / conveyancing'], ['survey', 'Survey'], ['refurb', 'Refurbishment'], ['professional', 'Professional / planning'],
    ['contingency', 'Contingency'], ['finance', 'Finance (interest + arrangement)'], ['total_cost', 'TOTAL PROJECT COST', 'strong'],
    ['end_value', 'End value (indicative)', 'strong'], ['gross_uplift', 'Gross value uplift'], ['gross_profit', 'Gross project profit'],
    ['exit_costs', 'Exit costs'], ['net_profit', 'NET PROFIT', 'strong'], ['equity', 'Required equity'],
    ['roi', 'ROI (on equity)', 'pct'], ['roc', 'Return on cost', 'pct'], ['margin', 'Gross margin', 'pct'],
  ];
  const liveByDeal = {};
  const assumptionInputs = (d) => {
    const cur = E.assumptionsFor(D, d, liveByDeal[d.id]);
    return ASSUMPTION_GROUPS.map(([g, keys]) => `
      <fieldset class="calc-group"><legend>${g}</legend>
      ${keys.map(k => {
        const a = D.assumptions.find(x => x.key === k); if (!a) return '';
        const v = cur[k]; const tbd = v === null || v === undefined || v === '';
        return `<label class="calc-field ${tbd ? 'is-tbd' : ''}" title="${esc(a.note)}">
          <span>${esc(a.label)} <em>${esc(a.unit)}</em>${tbd ? '<b>TBD</b>' : ''}</span>
          <input type="number" step="any" data-key="${k}" value="${tbd ? '' : v}" placeholder="${tbd ? 'enter a quote' : ''}">
        </label>`;
      }).join('')}</fieldset>`).join('');
  };
  const scenarioTable = (d) => {
    const s = E.runDeal(D, d, liveByDeal[d.id]);
    const tbd = s.Base.tbd.length;
    const commercial = d.value_kind && /income/i.test(d.value_kind);
    return `
      ${tbd ? `<div class="calc-tbd"><b>${tbd} cost item${tbd > 1 ? 's' : ''} still TBD</b> — counted as £0 until a quote is entered. Net profit is therefore overstated by exactly those amounts.</div>` : ''}
      <table class="calc-table"><thead><tr><th></th>${E.CASES.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>
      ${ROWS.map(([k, label, kind]) => `<tr class="${kind === 'strong' ? 'strong' : ''}"><th>${label}</th>${E.CASES.map(c => {
        const v = s[c][k]; const neg = v < 0 ? ' neg' : '';
        return `<td class="num${neg}">${kind === 'pct' ? pct(v, 1) : gbp(v)}</td>`; }).join('')}</tr>`).join('')}
      ${commercial ? `<tr><th>Gross yield at purchase</th>${E.CASES.map(c => `<td class="num">${pct(s[c].gross_yield_at_purchase, 1)}</td>`).join('')}</tr>
      <tr><th>Reversionary yield (ERV ÷ price)</th>${E.CASES.map(c => `<td class="num">${pct(s[c].reversionary_yield, 1)}</td>`).join('')}</tr>` : ''}
      </tbody></table>
      <p class="calc-defs"><b>Conservative</b> buys at the top of the guide and sells at the low end of the evidenced range · <b>Base</b> buys at the guide mid-point and sells at the base figure · <b>Upside</b> buys at the bottom of the guide and sells at the high end. Development / planning upside is never included.</p>`;
  };
  const calcMarkup = (d) => `
    <div class="calc" data-calc-for="${esc(d.id)}">
      <div class="calc__inputs">
        <div class="calc__inputs-head"><span class="section-label" style="margin:0">Your assumptions</span><button type="button" class="deal-link" data-reset>Reset</button></div>
        ${assumptionInputs(d)}
        <p class="calc-defs">Amber defaults are Kemek's stated modelling assumptions; red fields are TBD and need a real quote. Everything here is editable and nothing is a valuation.</p>
      </div>
      <div class="calc__output">${scenarioTable(d)}</div>
    </div>`;
  const wireCalc = (root, d) => {
    const refresh = () => { root.querySelector('.calc__output').innerHTML = scenarioTable(d); };
    root.querySelectorAll('input[data-key]').forEach(inp => inp.addEventListener('input', () => {
      liveByDeal[d.id] = liveByDeal[d.id] || {};
      liveByDeal[d.id][inp.dataset.key] = inp.value === '' ? null : Number(inp.value);
      inp.closest('.calc-field').classList.toggle('is-tbd', inp.value === '');
      refresh();
    }));
    root.querySelector('[data-reset]')?.addEventListener('click', () => { delete liveByDeal[d.id]; root.innerHTML = calcMarkup(d); wireCalc(root, d); });
  };

  /* ─── Evidence drawer ─────────────────────────────────────────────────── */
  const evidenceMarkup = (d) => {
    const items = [];
    items.push(`<div class="ev-row"><dt>Date checked</dt><dd>${fmtDate(d.date_checked)} (research cut-off ${fmtDate(D.research_date)})</dd></div>`);
    items.push(`<div class="ev-row"><dt>Confidence</dt><dd><span class="conf ${confClass(d.confidence)}">${esc(d.confidence)}</span></dd></div>`);
    items.push(`<div class="ev-row"><dt>Value basis</dt><dd>${esc(d.value_kind)}</dd></div>`);
    if (d.auction_date) items.push(`<div class="ev-row"><dt>Auction</dt><dd>${fmtDate(d.auction_date)}${has(d, 'auctioneer') ? ' — ' + esc(d.auctioneer) : ''}</dd></div>`);
    if (has(d, 'source')) items.push(`<div class="ev-row"><dt>Primary source</dt><dd><a href="${esc(d.source)}" target="_blank" rel="noopener">${esc(d.source_name || 'Listing')}</a></dd></div>`);
    if (has(d, 'research')) items.push(`<div class="ev-row"><dt>Research basis</dt><dd>${esc(d.research)}</dd></div>`);
    if (has(d, 'correction')) items.push(`<div class="ev-row"><dt>Correction</dt><dd>${esc(d.correction)}${has(d, 'original_claim') ? ` <small>(retired figure: ${esc(d.original_claim)})</small>` : ''}</dd></div>`);
    if (has(d, 'comps') && d.comps.length) items.push(`<div class="ev-row"><dt>Comparable evidence</dt><dd><table class="ev-comps">${d.comps.map(c => `<tr><td>${esc(c.label)}</td><td class="num">${gbp(c.price)}</td><td>${esc(c.date)}</td><td>${esc(c.note)}</td></tr>`).join('')}</table></dd></div>`);
    if (has(d, 'flags') && d.flags.length) items.push(`<div class="ev-row"><dt>Watch-points</dt><dd><ul class="ev-flags">${d.flags.map(f => `<li>${esc(f)}</li>`).join('')}</ul></dd></div>`);
    if (has(d, 'address')) items.push(`<div class="ev-row"><dt>Address</dt><dd>${esc(d.address)}</dd></div>`);
    const gated = !has(d, 'comps') || !has(d, 'source');
    return `<dl class="ev-list">${items.join('')}</dl>
      ${gated ? `<div class="ev-gate"><b>Full evidence pack is released under NDA.</b> Comparable sales, the legal-pack review, the source listing and the address are on file for this record and are shared with registered clients and investors. <a href="contact.html#book">Request access →</a></div>` : ''}
      <p class="calc-defs">Indicative end values are analytical ranges built from the evidence above — they are not formal RICS valuations and must not be relied on as such.</p>`;
  };

  /* ─── Modal + drawer plumbing ─────────────────────────────────────────── */
  const overlay = document.getElementById('pl-overlay');
  const modal = document.getElementById('pl-modal');
  const drawer = document.getElementById('pl-drawer');
  const open = (el, title, html, sub) => {
    el.querySelector('[data-title]').textContent = title;
    el.querySelector('[data-sub]').textContent = sub || '';
    el.querySelector('[data-body]').innerHTML = html;
    el.classList.add('open'); overlay?.classList.add('open'); document.body.style.overflow = 'hidden';
    el.querySelector('[data-close]')?.focus();
  };
  const closeAll = () => { [modal, drawer].forEach(el => el?.classList.remove('open')); overlay?.classList.remove('open'); document.body.style.overflow = ''; };
  overlay?.addEventListener('click', closeAll);
  document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeAll));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
  const openCalc = d => { if (!modal) return; open(modal, d.headline, calcMarkup(d), `${d.id} · Conservative / Base / Upside — illustrative, built on the public guide and indicative range`); wireCalc(modal.querySelector('[data-body]'), d); };
  const openEvidence = d => { if (!drawer) return; open(drawer, 'Evidence & sources', evidenceMarkup(d), `${d.id} · ${d.headline}`); };
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-calc]'); if (c) { const d = D.deals.find(x => x.id === c.dataset.calc); if (d) openCalc(d); }
    const v = e.target.closest('[data-evidence]'); if (v) { const d = D.deals.find(x => x.id === v.dataset.evidence); if (d) openEvidence(d); }
  });

  /* ─── Pipeline page: filters + grid + comparison table ────────────────── */
  const grid = document.getElementById('deal-grid');
  if (grid) {
    const state = { nation: 'all', category: 'all', confidence: 'all', band: 'all', sort: 'uplift', q: '' };
    const bandOf = d => d.guide[1] < 250000 ? 'lt250' : d.guide[1] <= 400000 ? '250-400' : 'gt400';
    const sorters = {
      uplift: (a, b) => base(b).gross_uplift_pct - base(a).gross_uplift_pct,
      guide: (a, b) => a.guide[0] - b.guide[0],
      value: (a, b) => b.value[1] - a.value[1],
      id: (a, b) => a.id.localeCompare(b.id),
    };
    const visible = () => D.deals.filter(d =>
      (state.nation === 'all' || d.nation === state.nation || d.region === state.nation) &&
      (state.category === 'all' || d.category === state.category) &&
      (state.confidence === 'all' || d.confidence === state.confidence) &&
      (state.band === 'all' || bandOf(d) === state.band) &&
      (!state.q || `${d.id} ${d.headline} ${d.area} ${d.type} ${d.outcode}`.toLowerCase().includes(state.q))
    ).sort(sorters[state.sort]);

    const render = () => {
      const list = visible();
      grid.innerHTML = list.length ? list.map(card).join('') : `<p class="col-span-full text-center py-16" style="color:var(--muted)">No opportunities match those filters.</p>`;
      grid.querySelectorAll('.reveal').forEach(el => requestAnimationFrame(() => el.classList.add('visible')));
      document.getElementById('deal-count').textContent = `${list.length} of ${D.deals.length}`;
      renderTable(list);
    };
    document.querySelectorAll('[data-filter-group]').forEach(group => {
      group.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
        group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active');
        state[group.dataset.filterGroup] = btn.dataset.value; render();
      }));
    });
    document.getElementById('deal-sort')?.addEventListener('change', e => { state.sort = e.target.value; render(); });
    document.getElementById('deal-search')?.addEventListener('input', e => { state.q = e.target.value.trim().toLowerCase(); render(); });

    /* Comparison table (sortable by column) */
    const tbl = document.getElementById('compare-table');
    let tSort = { key: 'uplift_pct', dir: -1 };
    const cols = [
      ['id', 'Deal', d => d.id], ['headline', 'Opportunity', d => `${esc(d.headline)}<br><small>${esc(d.area)}</small>`],
      ['guide', 'Guide', d => esc(d.guide_label || range(d.guide[0], d.guide[1])), d => d.guide[0]],
      ['value', 'Indicative end value', d => `${range(d.value[0], d.value[2])}<br><small>base ${gbpK(d.value[1])}</small>`, d => d.value[1]],
      ['uplift', 'Base uplift', d => gbpK(base(d).gross_uplift), d => base(d).gross_uplift],
      ['uplift_pct', 'Uplift %', d => pct(base(d).gross_uplift_pct), d => base(d).gross_uplift_pct],
      ['tax', 'Tax (base)', d => gbpK(base(d).tax), d => base(d).tax],
      ['net', 'Net after known costs', d => `<span class="${base(d).net_profit < 0 ? 'neg' : ''}">${gbpK(base(d).net_profit)}</span><br><small>${base(d).tbd.length} TBD</small>`, d => base(d).net_profit],
      ['confidence', 'Confidence', d => `<span class="conf ${confClass(d.confidence)}">${esc(d.confidence)}</span>`, d => d.confidence],
      ['stage', 'Stage', d => `<span class="deal-badge ${stageClass(d.stage)}">${esc(d.stage)}</span>`, d => d.stage],
      ['auction', 'Auction', d => d.auction_date ? fmtDate(d.auction_date) : '—', d => d.auction_date || 'z'],
    ];
    const renderTable = (list) => {
      if (!tbl) return;
      const col = cols.find(c => c[0] === tSort.key);
      const rows = [...list].sort((a, b) => { const va = (col[3] || col[2])(a), vb = (col[3] || col[2])(b); return (va > vb ? 1 : va < vb ? -1 : 0) * tSort.dir; });
      tbl.innerHTML = `<thead><tr>${cols.map(c => `<th data-sort="${c[0]}" class="${tSort.key === c[0] ? (tSort.dir < 0 ? 'desc' : 'asc') : ''}">${c[1]}</th>`).join('')}<th></th></tr></thead>
        <tbody>${rows.map(d => `<tr>${cols.map(c => `<td class="${['guide','value','uplift','uplift_pct','tax','net'].includes(c[0]) ? 'num' : ''}">${c[2](d)}</td>`).join('')}<td><a class="deal-link" href="deal.html?id=${encodeURIComponent(d.id)}">Open →</a></td></tr>`).join('')}</tbody>`;
      tbl.querySelectorAll('th[data-sort]').forEach(th => th.addEventListener('click', () => {
        tSort = { key: th.dataset.sort, dir: tSort.key === th.dataset.sort ? -tSort.dir : -1 }; renderTable(visible());
      }));
    };
    render();
  }

  /* ─── Services page: live strip under Property Sourcing ───────────────── */
  const strip = document.getElementById('sourcing-pipeline');
  if (strip) {
    const top = [...D.deals].sort((a, b) => base(b).gross_uplift_pct - base(a).gross_uplift_pct).slice(0, 3);
    strip.innerHTML = top.map((d, i) => {
      const b = base(d);
      return `<a class="mini-deal reveal" href="deal.html?id=${encodeURIComponent(d.id)}" style="transition-delay:${i * 0.08}s">
        <span class="mini-deal__id">${esc(d.id)} · ${esc(d.nation)}</span>
        <b class="font-serif">${esc(d.headline)}</b>
        <span class="mini-deal__meta">${esc(d.type)}${d.config ? ' · ' + esc(d.config) : ''}</span>
        <dl><div><dt>Guide</dt><dd>${esc(d.guide_label || range(d.guide[0], d.guide[1]))}</dd></div>
            <div><dt>Indicative value</dt><dd>${range(d.value[0], d.value[2])}</dd></div>
            <div><dt>Base uplift</dt><dd class="${b.gross_uplift < 0 ? 'neg' : ''}">${gbpK(b.gross_uplift)} <small>(${pct(b.gross_uplift_pct)})</small></dd></div></dl>
        <span class="mini-deal__foot"><span class="conf ${confClass(d.confidence)}">${esc(d.confidence)}</span> <small>not a valuation · checked ${fmtDate(d.date_checked)}</small></span>
      </a>`;
    }).join('');
    const count = document.getElementById('sourcing-pipeline-count'); if (count) count.textContent = D.deals.length;
    strip.querySelectorAll('.reveal').forEach(el => {
      const io = new IntersectionObserver(en => en.forEach(x => { if (x.isIntersecting) { x.target.classList.add('visible'); io.unobserve(x.target); } }), { threshold: 0.1 });
      io.observe(el);
    });
  }

  /* ─── Detail page ─────────────────────────────────────────────────────── */
  const detail = document.getElementById('deal-detail');
  if (detail) {
    const id = new URLSearchParams(location.search).get('id');
    const d = D.deals.find(x => x.id === id);
    if (!d) {
      detail.innerHTML = `<div class="max-w-3xl mx-auto text-center py-24"><span class="section-label">Deal Pipeline</span><h1 class="font-serif text-4xl text-ink">That opportunity isn't published</h1><p class="mt-4" style="color:var(--muted)">It may have moved into a private deal room or been withdrawn. <a class="deal-link" href="pipeline.html">Back to the pipeline →</a></p></div>`;
      return;
    }
    document.title = `${d.headline} | Deal Pipeline | Kemek Enterprise`;
    const b = base(d);
    const commercial = d.value_kind && /income/i.test(d.value_kind);
    document.getElementById('deal-hero').innerHTML = `
      <span class="section-label fade-up fade-up-1" style="color:var(--gold)">${esc(d.id)} · ${esc(d.category)} · ${esc(d.nation)} · <span class="deal-badge ${stageClass(d.stage)}">${esc(d.stage)}</span></span>
      <h1 class="font-serif text-white text-4xl sm:text-5xl lg:text-6xl font-semibold fade-up fade-up-2">${esc(d.headline)}</h1>
      <p class="text-white/55 mt-4 max-w-2xl mx-auto fade-up fade-up-3">${esc(d.area)}${d.outcode ? ' · ' + esc(d.outcode) : ''} — ${esc(d.type)}${d.config ? ' · ' + esc(d.config) : ''}</p>`;
    detail.innerHTML = `
      <div class="deal-stats">
        <div><span>Guide</span><b>${esc(d.guide_label || range(d.guide[0], d.guide[1]))}</b></div>
        <div><span>${commercial ? 'Income value (rent ÷ yield)' : 'Indicative end value'}</span><b>${range(d.value[0], d.value[2])}</b><small>base ${gbpK(d.value[1])} · not a valuation</small></div>
        <div><span>Base gross uplift</span><b class="${b.gross_uplift < 0 ? 'neg' : ''}">${gbpK(b.gross_uplift)}</b><small>${pct(b.gross_uplift_pct)} of purchase price</small></div>
        <div><span>Confidence</span><b><span class="conf ${confClass(d.confidence)}">${esc(d.confidence)}</span></b><small>checked ${fmtDate(d.date_checked)}${d.auction_date ? ' · auction ' + fmtDate(d.auction_date) : ''}</small></div>
      </div>
      <p class="deal-basis"><b>Value basis:</b> ${esc(d.value_kind)}. ${commercial ? 'This is a commercial investment — its value is modelled from current rent, ERV, yield and occupancy, and is never described as GDV.' : 'The range is an analytical estimate built from local evidence; it is not a formal valuation.'} ${/development upside separate/i.test(d.value_kind) ? 'Any planning or development upside is kept separate and is not included in any case.' : ''}</p>
      <div class="deal-actions"><button class="btn-outline-dark" data-evidence="${esc(d.id)}">Evidence &amp; sources</button><a class="btn-primary" href="contact.html#book">Register interest</a><a class="deal-link" href="pipeline.html">← All opportunities</a></div>
      <section class="mt-14"><span class="section-label">Conservative · Base · Upside</span><span class="accent-line"></span><h2 class="font-serif text-3xl text-ink">Run the numbers</h2>
      <p class="mt-3 mb-6" style="color:var(--muted)">Every required calculation, live. Change any assumption and all three cases recalculate. Red fields are TBD — nothing is invented.</p>
      <div id="deal-calc">${calcMarkup(d)}</div></section>`;
    wireCalc(document.getElementById('deal-calc'), d);
  }
})();
