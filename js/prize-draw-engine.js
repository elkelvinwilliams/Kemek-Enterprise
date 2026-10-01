/* KEMEK Property Prize Draw — calculation and gating engine. Pure functions, no DOM; tested in node (tests/prize-draw.test.cjs). */
(function (root) {
  'use strict';
  const gbp = v => (v < 0 ? '−' : '') + '£' + Math.round(Math.abs(v)).toLocaleString('en-GB');
  const num = v => (v === null || v === undefined || v === '' || isNaN(+v)) ? 0 : +v;
  const assumptionsMap = list => Object.fromEntries((list || []).map(a => [a.key, num(a.value)]));

  /* Campaign economics for one scenario. Every input is a number the admin can edit; `a` is the assumptions map. */
  function campaign(entries, price, a) {
    const gross = num(entries) * num(price);
    const vat = gross * num(a.vat_pct) / 100;
    const net_of_vat = gross - vat;
    const marketing = gross * num(a.marketing_pct) / 100;
    const platform = gross * num(a.platform_pct) / 100;
    const payment = gross * num(a.payment_pct) / 100;
    const legal = num(a.legal_fixed);
    const operator = gross * num(a.operator_pct) / 100;
    const other = num(a.other_fixed);
    const consideration = num(a.consideration);
    const costs = marketing + platform + payment + legal + operator + other;
    const net = net_of_vat - costs - consideration;               // net campaign proceeds after the owner has been paid the consideration
    const owner_share = net > 0 ? net * num(a.owner_share_pct) / 100 : 0;
    return { entries: num(entries), price: num(price), gross, vat, net_of_vat, marketing, platform, payment, legal, operator, other, costs, consideration, net,
             owner_proceeds: consideration + owner_share, operator_proceeds: net - owner_share, breakeven_entries: price > 0 ? Math.ceil((legal + other + consideration) / (price * (1 - (num(a.vat_pct) + num(a.marketing_pct) + num(a.platform_pct) + num(a.payment_pct) + num(a.operator_pct)) / 100))) : null };
  }
  /* Entries × price grid of net campaign proceeds. */
  function scenarioTable(caps, prices, a, metric) {
    metric = metric || 'net';
    return caps.map(c => ({ entries: c, cells: prices.map(p => ({ price: p, value: campaign(c, p, a)[metric] })) }));
  }
  function scenarioCSV(caps, prices, a, metric) {
    const t = scenarioTable(caps, prices, a, metric);
    const head = ['Entries', ...prices.map(p => '£' + p)].join(',');
    return [head, ...t.map(r => [r.entries, ...r.cells.map(c => Math.round(c.value))].join(','))].join('\n');
  }
  /* Consumer-facing gating. Everything must be explicitly on AND legal approval recorded before any consumer route exists. */
  function consumerLive(controls) {
    const c = controls || {};
    return c.legal_approval === 'APPROVED' && c.campaign_on === true && c.consumer_page_on === true && c.property_verification === 'VERIFIED';
  }
  function entriesLive(controls) { const c = controls || {}; return consumerLive(c) && c.entries_on === true && c.free_entry_route_on === true; }
  function paymentsLive(controls) { const c = controls || {}; return entriesLive(c) && c.payments_on === true; }
  /* Outreach email — premium, commercial, no raffle language. */
  function outreach(o) {
    const s = o || {};
    const name = s.contact_name && !/NOT PUBLICLY/i.test(s.contact_name) ? s.contact_name.split(' ')[0] : 'there';
    const structure = s.structure ? ` We are open to a ${s.structure.toLowerCase()} and would value your view on the structure that has worked best for a property at this level.` : ' We are open to a fixed property consideration, a revenue share, a joint venture or a hybrid, and would value your view on which has worked best at this level.';
    const subject = `£1.2M residential property — prize-draw partnership enquiry`;
    const body = `Dear ${name},

Kemek Enterprise has access to a residential property with an indicative value of £1.2 million and is looking to appoint an established UK prize-draw operator to run a promotion around it.

The property is held under NDA at this stage. It is a substantial freehold home in the Home Counties with a recent lender valuation; full particulars, photography and the legal position are ready for review once terms of engagement are agreed.${structure}

What we would like to understand from ${s.company || 'you'}:
• the commercial structure you would propose, including any minimum guarantee and how unsold entries are treated;
• the entry price, campaign duration and expected entry volume for a property at this value;
• your free-entry mechanism, age-verification approach and position under the DCMS voluntary code;
• ownership of the entrant database and the property-transfer mechanism at the close.

Kemek is a UK property company and is treating this as a commercial appointment rather than a listing: we will run a structured comparison of proposals and move quickly with the right partner. A short discovery call in the next fortnight would be welcome.

Kind regards,

${s.sender_name || 'El Kelvin Williams'}
${s.sender_role || 'Director, Kemek Enterprise Ltd'}
${s.sender_contact || 'elkelvinwilliams@gmail.com · 07476 656712'}`;
    return { subject, body, mailto: (s.email && /@/.test(s.email) && !/NOT PUBLICLY/i.test(s.email)) ? `mailto:${s.email.split(' ')[0]}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : null };
  }
  root.KemekPrizeDraw = { gbp, num, assumptionsMap, campaign, scenarioTable, scenarioCSV, consumerLive, entriesLive, paymentsLive, outreach };
})(typeof window !== 'undefined' ? window : globalThis);
