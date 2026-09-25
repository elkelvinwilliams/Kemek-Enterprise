// Public-dataset and engine checks. Run with `npm test` (node --test).
// The private dataset (addresses, sources, comps) is never committed, so the lot/guide/address
// consistency check lives beside the source dataset; this file checks what the site actually ships.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

globalThis.window = globalThis;
require(path.join(__dirname, '..', 'js', 'pipeline-engine.js'));
require(path.join(__dirname, '..', 'data', 'pipeline.public.js'));
const data = globalThis.KEMEK_PIPELINE;
const E = globalThis.KemekPipeline;

const PRIVATE_KEYS = ['address', 'auctioneer', 'source', 'research', 'correction', 'original_claim', 'comps', 'flags',
  'costs', 'scenarios', 'size_sqft', 'income_pcm', 'commercial', 'lot', 'listing', 'stage_note', 'sources', 'bid_analysis'];

test('public export carries no private fields', () => {
  for (const d of data.deals) {
    for (const k of PRIVATE_KEYS) assert.ok(!(k in d), `${d.id} leaks private field "${k}"`);
  }
  const text = fs.readFileSync(path.join(__dirname, '..', 'data', 'pipeline.public.js'), 'utf8');
  for (const needle of ['Claygate', 'CR0 0RA', 'auctionhouse.co.uk', 'Hale End']) assert.ok(!text.includes(needle), `public export contains "${needle}"`);
});

test('every deal has a valid stage and a well-formed guide / value', () => {
  for (const d of data.deals) {
    assert.ok(data.stages.includes(d.stage), `${d.id}: stage "${d.stage}" not in ${data.stages}`);
    assert.equal(d.guide.length, 2); assert.equal(d.value.length, 3);
    assert.ok(d.guide[0] <= d.guide[1], `${d.id}: guide low > high`);
    assert.ok(d.value[0] <= d.value[1] && d.value[1] <= d.value[2], `${d.id}: value range not ordered`);
  }
});

test('lot number and guide match the source listing wherever a listing is published', () => {
  // The private dataset always carries `listing`; if the admin publishes it, the same rule holds here.
  for (const d of data.deals.filter(x => x.listing)) {
    assert.equal(d.lot, d.listing.lot, `${d.id}: lot ≠ listing`);
    assert.equal(d.guide[0], d.listing.guide_low, `${d.id}: guide ≠ listing`);
    if (d.address) assert.equal(d.address, d.listing.address, `${d.id}: address ≠ listing`);
  }
});

test('KEM-025 ships the corrected public facts', () => {
  const d = data.deals.find(x => x.id === 'KEM-025');
  assert.ok(d, 'KEM-025 missing');
  assert.equal(d.type, 'Semi-detached house');
  assert.deepEqual(d.guide, [210000, 210000]);
  assert.deepEqual(d.value, [340000, 380000, 420000]);
  assert.equal(d.stage, 'Validating');
  assert.equal(d.auction_date, '2026-10-07');
  assert.equal(d.date_checked, '2026-09-25');
});

test('engine: cost model includes lender costs and holding when set', () => {
  const d = data.deals.find(x => x.id === 'KEM-025');
  const base = E.runCase(data, d, 'Base');
  const withExtras = E.runCase(data, d, 'Base', { lender_costs: 1500, holding_month: 270, term_months: 8 });
  assert.equal(withExtras.lender_costs, 1500);
  assert.equal(withExtras.holding, 2160);
  assert.ok(withExtras.total_cost > base.total_cost);
});

test('engine: SDLT higher-rate bands at £220,000 = £12,900', () => {
  assert.equal(E.taxFor(data.tax_tables.SDLT_RES_HIGHER, 220000), 12900);
});
