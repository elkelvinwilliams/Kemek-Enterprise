# Kemek Property Prize Draw — module notes

**Status: internal planning tool. LEGAL APPROVAL REQUIRED. No consumer route, entry or payment functionality is live.**

## 1. Architecture assessment (what Kemek actually is)
- Static multi-page site on GitHub Pages: HTML + compiled Tailwind + vanilla JS. No server, **no database, no authentication**, no payment stack.
- "Admin" is an unlinked, `noindex`, robots-blocked page (`admin/pipeline-admin.html`) that holds state in `localStorage` and exports JSON/JS files that are committed by hand.
- "CRM" is the Investor CRM spreadsheet and the pipeline dataset; "documents" are the private deal file (never committed) and the solicitor's system.
- Design system: `css/style.css` tokens (navy/gold/cream, Cormorant Garamond + Jost) and the component classes used across pages; admin styles now live in `css/admin.css` (extracted from the pipeline admin so both admin screens share them).
- Tests: `node --test` over the shipped public data and engines.

**Consequence:** the module is built the same way — a data file, a pure engine, an admin page that persists to the browser and exports JSON, and a consumer page that renders only when the gating flags are on. Anything that needs a real backend (payments, entrant records, age verification, analytics) is *designed* here but not runnable on this stack; it will need the operator's platform or a separate service after legal sign-off.

## 2. Implementation approach
Modular extension, removable in one commit: `data/prize-draw.js`, `js/prize-draw-engine.js`, `admin/prize-draw.html`, `property-prize-draw.html`, `tests/prize-draw.test.cjs`, this file. Nothing in the pipeline engine, dataset or pages changed except a sidebar link and the shared admin stylesheet.

## 3. Data / schema
`window.KEMEK_PRIZE_DRAW`: property · controls (all OFF) · planning assumption · entry prices/caps · cost assumptions (ILLUSTRATIVE) · negotiation targets (blank) · structures · stages · operators (17 seed records, official-source contacts only, otherwise NOT PUBLICLY VERIFIED) · proposal fields · due-diligence register · legal register · consumer journey · consumer sections · analytics definitions. Admin state (edits, proposals, DD statuses, targets, controls) persists in `localStorage["kemek_prize_draw_v1"]` and exports/imports as JSON.

## 4. Routes
- `admin/prize-draw.html` — dashboard (noindex; `/admin/` is disallowed in robots.txt).
- `property-prize-draw.html` — consumer page architecture; renders a holding notice unless `consumerLive(controls)`; `?preview=1` shows the structure with a PREVIEW banner for internal review. Disallowed in robots.txt and `noindex` until launch.

## 5. Components
Admin cards and fields reuse `.adm-*`; the consumer page reuses the site nav, section, card and button classes. No new visual identity.

## 6–16. Dashboard · calculator · scenario table · operator CRM · pipeline · proposal comparison · due-diligence room · outreach · consumer page · controls · analytics · testing
All implemented in the two pages above and covered by `tests/prize-draw.test.cjs` (defaults OFF, gating, maths reconciliation, scenario grid/CSV, assumption labelling, blank targets, operator data integrity, legal register, outreach tone). Manual test plan: open the admin, change an assumption and confirm the grid updates; export CSV; add/edit an operator and move it through stages; add two proposals and compare; set DD statuses; generate outreach; switch every control on in order and confirm the consumer page only renders when legal approval and verification are recorded; reload and confirm persistence; import/export JSON.

## Legal position (summary, not advice)
Free draw vs genuine prize competition per Gambling Act 2005 s.14 / Sch.2; Gambling Commission guidance; DCMS Voluntary Code (published 20 Nov 2025, effective 20 May 2026): 18+, age verification, free route no less convenient, £250 monthly credit-card ceiling; CAP Code s.8 significant conditions and independent winner selection; consumer-protection and UK GDPR duties. Counsel must sign off the structure, T&Cs and marketing before any switch is turned on.
