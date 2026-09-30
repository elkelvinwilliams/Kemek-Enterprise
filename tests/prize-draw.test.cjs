// Prize-draw module checks. Run with `npm test`.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
globalThis.window = globalThis;
require(path.join(__dirname, '..', 'js', 'prize-draw-engine.js'));
require(path.join(__dirname, '..', 'data', 'prize-draw.js'));
const D = globalThis.KEMEK_PRIZE_DRAW, E = globalThis.KemekPrizeDraw;
const A = E.assumptionsMap(D.assumptions);

test('every consumer control defaults OFF / NOT APPROVED', () => {
  const c = D.controls;
  for (const k of ['campaign_on', 'consumer_page_on', 'payments_on', 'entries_on', 'free_entry_route_on', 'analytics_on']) assert.equal(c[k], false, k);
  assert.equal(c.legal_approval, 'LEGAL APPROVAL REQUIRED');
  assert.equal(c.property_verification, 'NOT VERIFIED');
  assert.equal(E.consumerLive(c), false); assert.equal(E.entriesLive(c), false); assert.equal(E.paymentsLive(c), false);
});
test('gating needs legal approval, verification and every switch', () => {
  const on = { legal_approval: 'APPROVED', campaign_on: true, consumer_page_on: true, property_verification: 'VERIFIED', entries_on: true, free_entry_route_on: true, payments_on: true };
  assert.equal(E.paymentsLive(on), true);
  assert.equal(E.paymentsLive({ ...on, free_entry_route_on: false }), false, 'no payments without a free route');
  assert.equal(E.consumerLive({ ...on, legal_approval: 'LEGAL APPROVAL REQUIRED' }), false);
  assert.equal(E.consumerLive({ ...on, property_verification: 'NOT VERIFIED' }), false);
});
test('campaign maths reconciles', () => {
  const r = E.campaign(1000000, 10, A);
  assert.equal(r.gross, 10000000);
  assert.equal(Math.round(r.vat), 2000000);
  const expected = r.net_of_vat - (r.marketing + r.platform + r.payment + r.legal + r.operator + r.other) - r.consideration;
  assert.ok(Math.abs(r.net - expected) < 1e-6);
  assert.ok(Math.abs(r.owner_proceeds + r.operator_proceeds - (r.consideration + r.net)) < 1e-6, 'owner + operator = consideration + net');
  assert.equal(E.campaign(0, 10, A).gross, 0);
});
test('scenario table covers every cap and price, CSV has header + rows', () => {
  const t = E.scenarioTable(D.entry_caps, D.entry_prices, A);
  assert.equal(t.length, 5); assert.equal(t[0].cells.length, 6);
  const csv = E.scenarioCSV(D.entry_caps, D.entry_prices, A).split('\n');
  assert.equal(csv.length, 6); assert.equal(csv[0], 'Entries,£1,£5,£10,£20,£25,£50');
});
test('every cost assumption is labelled ILLUSTRATIVE or quotation', () => {
  for (const a of D.assumptions) assert.ok(/ILLUSTRATIVE|quotation/i.test(a.basis), a.key);
});
test('negotiation targets are blank user inputs, not recommendations', () => {
  for (const t of D.targets.filter(t => !t.fixed)) assert.ok(t.value === null || t.value === '', t.key);
});
test('operator database: 15–20 genuine records, no fabricated contacts', () => {
  assert.ok(D.operators.length >= 15 && D.operators.length <= 20, 'count ' + D.operators.length);
  const ids = new Set(D.operators.map(o => o.id)); assert.equal(ids.size, D.operators.length);
  for (const o of D.operators) {
    assert.ok(o.company && o.source, o.id);
    for (const k of ['contact_name', 'email', 'phone']) assert.ok(String(o[k]).length > 0, `${o.id} ${k} blank — must be a value or NOT PUBLICLY VERIFIED`);
    assert.ok(!/example\.com|lorem|placeholder/i.test(JSON.stringify(o)), o.id);
    assert.ok(D.stages.includes(o.status), o.id + ' stage');
  }
  const priority = ['Raffle House', 'Best of the Best', 'Omaze', '7days', 'Elite Competitions', 'Tramway Path'];
  for (const p of priority) assert.ok(D.operators.some(o => o.company.includes(p)), p);
});
test('legal register is present and never claims approval', () => {
  assert.equal(D.legal.approval, 'LEGAL APPROVAL REQUIRED');
  assert.ok(D.legal.references.length >= 6);
  for (const r of D.legal.references) assert.ok(/^https:\/\//.test(r.url), r.title);
  assert.equal(D.legal.routes.length, 3);
  assert.ok(D.legal.safeguards.length >= 7);
});
test('outreach email is premium and never uses raffle language', () => {
  const o = E.outreach(D.operators[0]);
  assert.ok(o.subject.includes('£1.2M'));
  const bodyMinusName = o.body.split(D.operators[0].company).join('');
  assert.ok(!/raffle|ticket|jackpot|lucky|gamble|\bbet\b/i.test(bodyMinusName), 'no raffle language');
  assert.equal(o.mailto, null, 'unverified email yields no mailto');
  assert.ok(E.outreach({ company: 'X', email: 'team@omaze.co.uk (official)' }).mailto.startsWith('mailto:team@omaze.co.uk'));
});
