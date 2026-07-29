# TenderProp — Website Revamp (Reference Build for EasyAsia)

This repository is the **approved reference build** for the revamp of
[tenderprop.com](https://tenderprop.com). It shows exactly how the new site should look,
behave, and be worded. Your job is to re-implement this on the live TenderProp platform —
treat everything here as the specification.

Maintained by Bryan Yew (The One Property Global) with AI build agents. Questions → Bryan.

---

## What TenderProp is

A Malaysian **subsale property e-tender platform** run by a licensed agency. Properties are
listed with a **reserve price** and a **closing date**. Buyers submit **one sealed offer**
(offers are never public) with a **refundable deposit of 3% of the reserve price**. After
closing, the seller accepts, declines, or negotiates through the agency's licensed agent.
Unsuccessful offers are refunded in full within 3 working days.

**This is NOT a live auction.** No bid counts, no "current highest bid", no countdown urgency
mechanics beyond the closing date itself.

## Run it locally

```bash
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev        # Vite dev server → http://localhost:5173
```

## What's built

| Route | What it is |
|---|---|
| `/tender` | Listing page: hero (next tender cycle + how e-tender works), search, category tabs, property cards, price/state filters, sort, grid/list, pagination |
| `/tender/residensi-sinaran` | Property detail page — **the design canon for all future detail pages** |

Built with React (TanStack Start) + Vite. **The React layer is scaffolding for iteration —
what you are meant to lift is the rendered HTML/CSS.** Class names are deliberately stable
and semantic for that purpose.

## Key implementation notes

- **Data model:** `src/data/tenders.ts` — every field your CMS must supply per listing
  (name, area, state, reservePrice, closingDate, propertyType/Category, builtUp, landArea,
  bedrooms, bathrooms, carParks, tenure, image…). 24 real records from the current site.
- **The 12 records marked `demo: true` are fabricated fillers** (one per state, for demo
  coverage). **Delete them before go-live.** They carry a grey DEMO badge and must never
  get detail pages.
- **Deposit is always computed**, never stored: 3% of reserve price — see `depositOf()` in
  `src/lib/tender-utils.ts`.
- **Design tokens:** `:root` in `src/styles/tender-listings.css` — cream `#FAF5F0` /
  burgundy `#571C2E` / red `#C8281C` / ink `#17130F`; type is Inter + Newsreader (Google Fonts).
- **Images:** `public/assets/**` — filenames match the current tenderprop.com uploads so you
  can map them to your CMS.
- **Mobile:** every page works at 375 px with zero horizontal scroll. Keep it that way.

## Placeholders — replace before go-live

| Item | Current value | Needs |
|---|---|---|
| Agent REN | `REN 123456` | Real REN + agency registration no. |
| All listing data | Mock (July 2026 snapshot) | Live CMS feed |
| "Apply for Tender" button | Not wired | Member account + application flow (spec to follow) |
| Footer legal identity | Placeholder | Confirmed company details |

## For AI agents

If you are an AI coding agent: read `AGENTS.md` and `TEAM-LOG.md` before touching anything.
