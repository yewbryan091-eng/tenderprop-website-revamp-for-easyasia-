# TenderProp — Website Revamp (Reference Build for EasyAsia)

This repository is the **approved reference build** for the revamp of
[tenderprop.com](https://tenderprop.com). It shows exactly how the new site should look,
behave, and be worded. Your job is to re-implement this on the live TenderProp platform —
treat everything here as the specification.

Maintained by Bryan Yew (The One Property Global) with AI build agents. Questions → Bryan.

---

## What TenderProp is

> Founder briefing, Bryan Yew, 1 Aug 2026. **If anything elsewhere in this repo contradicts
> this section, this section wins** — and the contradiction is a bug worth reporting.

**TenderProp is a lead engine for a licensed real estate agency. It is not a transaction
platform, and it is not an auction site.**

The One Property Global is a licensed Malaysian agency with real agents doing ordinary agency
work — winning listings, finding buyers. TenderProp is a new *way to sell* those listings, and a
new *way to buy*: instead of haggling against an asking price, a buyer names their own number.

**No money ever moves through this website.**

### How a buyer actually uses it

1. Browses listings, each with a **reserve price** and a **closing date**.
2. Clicks **Apply for E-Tender**. Not signed in ⇒ a sign-in / sign-up dialog. **Members only.**
3. Fills the **Tender Form Application**. Most of it is pre-filled listing data; the buyer
   supplies exactly four things: **name, email, phone, and their bid price**.
4. Submitting sends a **lead to the agency**. The agent follows up on those details.
5. **The 3% deposit is collected afterwards, by the agent, into the agency's client account** —
   which BOVAEP mandates. It is never paid on this site.
6. The agent takes the bid to the seller: **accept, decline, or counter**. The agent negotiates as
   the middleman, and a buyer may end up resubmitting. This is agency work, not an automated
   settlement.
7. The member's dashboard keeps their submitted e-tenders as a record.

### The two things people get wrong

- **The reserve price is a GUIDE, not a floor.** Buyers deliberately offer *below* it to try their
  luck; the seller may accept or counter. Copy that says "minimum offer considered" or "the floor"
  is **wrong** — a floor nobody may cross makes this a fixed-price listing with extra steps.
- **This is not a live auction.** Offers are sealed and private. No bid counts, no "current highest
  bid", no urgency theatre beyond the closing date.

### Where listings come from, and the moat

The agency's own agents collect listings as usual, then pitch the e-tender concept to the seller:
sell faster, at no extra cost, while normal selling continues in parallel. Tenders run roughly
**3–6 months** by agreement. Every listing then carries **two banners outside the house** — The One
Property's and TenderProp's side by side. 100 listings means 100 locations advertising the platform
for free. That is the growth engine.

### E-Tender vs Owner Auction — a seller picks ONE

| | E-Tender | Owner Auction |
|---|---|---|
| Mechanic | Private sealed offer at the buyer's chosen price | Live bidding, price climbs until sold |
| Where | On this site, then agent follow-up | Zoom or physical room, licensed auctioneer |
| Deposit | 3%, collected by the agent after submission | 3% to enter the room |
| Outcome | Seller accepts, declines or counters | Highest bid wins |

**Owner Auction is the last thing to be revamped** (reference: `ownerauction.my`). A future
**public auction** tab for bank foreclosures is planned but out of scope today.

---

## Read these, in this order

| # | File | What it gives you |
|---|---|---|
| 0 | **[`TENDERPROP-BRIEF.md`](./TENDERPROP-BRIEF.md)** | **Start here if you are new, or not a coding agent.** The whole thing A–Z in one self-contained file — business, rules, data model, what is built, what is still open. Nothing in it depends on any other file |
| 1 | This section, above | The business, in short. Nothing else makes sense without it |
| 2 | [`AGENTS.md`](./AGENTS.md) | How we work, brand voice rules, the design SOP, and the same founder briefing in full |
| 3 | [`BACKEND-CONTRACT.md`](./BACKEND-CONTRACT.md) | Every field a listing must carry, what is **derived and must not be stored**, and what the submission sends |
| 4 | [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) | Tokens, type, spacing, and the CSS traps that have already cost us time |
| 5 | [`TEAM-LOG.md`](./TEAM-LOG.md) | Full history + the **DECISIONS table**: every founder ruling and why |
| 6 | `PLAN-*.md` | Working plans. **Historical in places** — where they disagree with §1–3, they are out of date |

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
| "Apply for E-Tender" button | Not wired | Sign-in dialog → Tender Form Application → lead to the agency. Spec in `BACKEND-CONTRACT.md` §6b |
| Footer legal identity | Placeholder | Confirmed company details |

## For AI agents

If you are an AI coding agent: read `AGENTS.md` and `TEAM-LOG.md` before touching anything.
