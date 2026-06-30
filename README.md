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
