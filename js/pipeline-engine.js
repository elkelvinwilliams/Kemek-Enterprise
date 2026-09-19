/* ══════════════════════════════════════════════════════════════════════════
   Kemek Deal Pipeline — scenario engine (shared by the public pages and the
   admin screen). Mirrors the master spreadsheet exactly.

   Rules baked in:
   • End values are indicative analytical ranges — never a valuation.
   • Costs marked TBD count as £0 and are flagged, never invented.
   • Wigan-style commercial lots are valued on rent ÷ yield, not GDV.
   ══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  const CASES = ['Conservative', 'Base', 'Upside'];
  const TBD_KEYS = ['auction_fee', 'legal', 'survey', 'refurb', 'professional', 'exit_legal'];

  const num = v => (v === null || v === undefined || v === '' || isNaN(v)) ? 0 : Number(v);

  /* Marginal-band transaction tax (SDLT / LTT / LBTT) + optional flat % (ADS). */
  function taxFor(table, price) {
    const bands = table.bands;
    let tax = 0;
    for (let i = 0; i < bands.length; i++) {
      const lo = bands[i][0], rate = bands[i][1];
      const hi = i + 1 < bands.length ? bands[i + 1][0] : Infinity;
      if (price > lo) tax += (Math.min(price, hi) - lo) * rate;
    }
    tax += price * (table.flat_pct || 0);
    return Math.round(tax * 100) / 100;
  }

  /* Global defaults → plain object, then per-deal overrides, then any live edits. */
  function assumptionsFor(data, deal, live) {
    const a = {};
    (data.assumptions || []).forEach(x => { a[x.key] = x.value; });
    Object.entries(deal.overrides || {}).forEach(([k, v]) => { if (k[0] !== '_') a[k] = v; });
    Object.entries(live || {}).forEach(([k, v]) => { a[k] = v; });
    return a;
  }

  function commercialValue(deal, caseName) {
    const c = deal.commercial.cases[caseName];
    const rentUsed = c.erv_share_pct ? c.rent * (c.erv_share_pct / 100) : c.rent;
    return { value: Math.round(rentUsed / (c.yield_pct / 100)), rentUsed };
  }

  function runCase(data, deal, caseName, live) {
    const a = assumptionsFor(data, deal, live);
    const [glo, ghi] = deal.guide;
    const prem = 1 + num(a.bid_premium_pct) / 100;
    const acq = { Conservative: ghi * prem, Base: (glo + ghi) / 2 * prem, Upside: glo * prem }[caseName];

    let value, rentUsed = null;
    if (deal.commercial) { ({ value, rentUsed } = commercialValue(deal, caseName)); }
    else value = { Conservative: deal.value[0], Base: deal.value[1], Upside: deal.value[2] }[caseName];

    const tbd = TBD_KEYS.filter(k => a[k] === null || a[k] === undefined || a[k] === '');
    const tax = taxFor(data.tax_tables[deal.tax], acq);
    const refurb = num(a.refurb), prof = num(a.professional);
    const contingency = (refurb + prof) * num(a.contingency_pct) / 100;
    const loan = acq * num(a.ltv_pct) / 100;
    const interest = loan * num(a.rate_month_pct) / 100 * num(a.term_months);
    const arrangement = loan * num(a.arrangement_pct) / 100;
    const finance = interest + arrangement;
    const totalCost = acq + num(a.auction_fee) + tax + num(a.legal) + num(a.survey) + refurb + prof + contingency + finance;
    const equity = totalCost - loan;
    const exitCosts = value * num(a.exit_agent_pct) / 100 + num(a.exit_legal);
    const grossUplift = value - acq;
    const grossProfit = value - totalCost;
    const netProfit = grossProfit - exitCosts;

    const r = {
      case: caseName, acquisition: acq, end_value: value, rent_used: rentUsed,
      auction_fee: num(a.auction_fee), tax, legal: num(a.legal), survey: num(a.survey),
      refurb, professional: prof, contingency, loan, interest, arrangement, finance,
      total_cost: totalCost, equity, exit_costs: exitCosts,
      gross_uplift: grossUplift, gross_uplift_pct: acq ? grossUplift / acq : 0,
      gross_profit: grossProfit, net_profit: netProfit,
      roi: equity ? netProfit / equity : 0, roc: totalCost ? netProfit / totalCost : 0,
      margin: value ? netProfit / value : 0, tbd
    };
    if (deal.commercial) {
      r.gross_yield_at_purchase = deal.commercial.rent_pa / acq;
      r.reversionary_yield = deal.commercial.erv_pa / acq;
    }
    Object.keys(r).forEach(k => { if (typeof r[k] === 'number') r[k] = Math.round(r[k] * 100) / 100; });
    return r;
  }

  const runDeal = (data, deal, live) => Object.fromEntries(CASES.map(c => [c, runCase(data, deal, c, live)]));

  /* ─── Formatting helpers shared by the pages ─────────────────────────── */
  const gbp  = v => (v < 0 ? '−' : '') + '£' + Math.round(Math.abs(v)).toLocaleString('en-GB');
  const gbpK = v => (v < 0 ? '−' : '') + '£' + (Math.abs(v) >= 1e6 ? (Math.abs(v) / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'm' : Math.round(Math.abs(v) / 1000) + 'k');
  const pct  = (v, d = 0) => (v * 100).toFixed(d) + '%';
  const range = (lo, hi) => lo === hi ? gbpK(lo) : gbpK(lo) + '–' + gbpK(hi);

  global.KemekPipeline = { CASES, TBD_KEYS, taxFor, assumptionsFor, runCase, runDeal, gbp, gbpK, pct, range };
})(typeof window !== 'undefined' ? window : globalThis);
