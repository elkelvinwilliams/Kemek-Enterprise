# Kemek Enterprise

A premium, multi-page website for **Kemek Enterprise** — a UK family-run property company.

**Live offering:** buy & sell · rent-to-rent & lettings · property sourcing · done-for-you
investing · contractor accommodation · social housing (coming soon).

## Stack
- **HTML** + **Tailwind CSS** (compiled, no runtime build needed to view)
- Vanilla JS for nav, scroll reveals, animated counters, portfolio filter and quick-contact widget
- Fonts: Cormorant Garamond (serif) + Jost (sans), via Google Fonts
- **Theme:** navy & gold luxury

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home — hero, services, who-we-help, process, portfolio, investors, testimonials, CTA |
| `services.html` | The six service lines in detail |
| `about.html` | Family story, mission, values, team, investors |
| `contact.html` | Enquiry form, book-a-call, phone/WhatsApp/email, hours, socials |
| `pipeline.html` | Deal Pipeline — cards, filters, comparison table, Conservative / Base / Upside calculator, evidence drawer |
| `deal.html?id=KEM-001` | Property detail page for one pipeline record |
| `admin/pipeline-admin.html` | Private admin/edit screen (not linked, `noindex`, blocked in `robots.txt`) |

## Deal Pipeline — how the data works
- `data/pipeline.public.js` — the **only** dataset the website carries. It holds just the fields the admin has published (headline, area, guide, indicative range, confidence, date checked, stage). Committed.
- `data/pipeline.private.js` / `.json` — the full master (addresses, sources, evidence, corrections, costs). **Git-ignored — never commit.** Load it into the admin screen (drag-and-drop) to edit.
- Admin workflow: edit → *Save to this browser* → *Export PUBLIC* → replace `data/pipeline.public.js` → commit. The export refuses to run if any private field is present without its "publish" box ticked.
- **GO** in the admin promotes a record to the deal room; that is the explicit instruction to build the full deal pack from the Kemek templates.
- `js/pipeline-engine.js` is the calculation engine (mirrors the master spreadsheet exactly). Indicative end values are analytical ranges — never valuations; TBD costs count as £0 and are flagged. The cost model is acquisition + auction fee + transaction tax + legal + survey + refurb + professional + contingency + finance (interest + arrangement + lender costs) + holding (£/month × term).
- Stages: Screening → **Validating** (viewing booked, inputs being verified) → Shortlist → GO — Deal Room → Bid / Offer → Exchanged → Completed → Passed.
- Every record whose source is an auction lot carries a private `listing` block (lot, guide, address as the listing states them). A test fails if the deal's lot / guide / address drift from it — the check that would have caught the KEM-025 mix-up.
- `data/CHANGELOG.md` is the decision log — one line per correction or stage decision.

## Tests
```bash
npm test   # node --test tests/ — public export leak check, stage/guide validity, KEM-025 facts, engine cost terms, SDLT bands
```
The lot / guide / address consistency test and the appraisal reconciliation run beside the private dataset (`python3 -m unittest test_dataset -v` in the pipeline folder), because the source dataset carries addresses and is never committed.

## Develop
```bash
npm install
npm run build:css   # one-off compile of src/tailwind.input.css -> css/tailwind.css
npm run watch:css   # rebuild on change while developing
```
Then open any `.html` file in a browser (or run a static server, e.g. `python3 -m http.server`).

## Brand colours
| Token | Hex | Use |
|-------|-----|-----|
| Navy | `#0A1A30` | Hero / bands |
| Deep | `#050D1A` | Footer / darkest |
| Ink | `#0C1F38` | Buttons / primary text |
| Gold | `#C8A24B` | Accents, CTAs |
| Cream | `#F8F6F1` | Page background |
| Stone | `#ECE9E2` | Section backgrounds |

## To do / swap in real content
- [ ] Replace placeholder gradient tiles (`.ph-*`) with real property photography
- [ ] Add real logo (currently a "K" monogram wordmark)
- [ ] Real phone number, email and WhatsApp number (currently placeholders)
- [ ] Wire the contact form to an inbox / form service
- [ ] Confirm final copy for each service and the social-housing launch

## Backing
Supported by committed investment partners, including **Ten Talents Bank** as a heavy investor.

---
A family business. © 2026 Kemek Enterprise.
