# TenderProp — the whole thing, A to Z

**A single self-contained briefing.** Nothing here depends on reading another file. If you have
only this document, you have enough to understand the business, the product, the rules, what is
built, and what is deliberately not built yet.

Last updated **1 August 2026**. Owner: **Bryan Yew**, The One Property Global Sdn Bhd.
Everything below marked *founder-verified* came from Bryan or his father, who runs the agency.

---

# A. The business

## A1. What TenderProp actually is

**TenderProp is a lead engine for a licensed Malaysian real estate agency. It is not a
transaction platform, and it is not an auction site.**

The One Property Global is a licensed agency with real agents doing ordinary agency work —
winning listings, finding buyers, closing sales. TenderProp is a **new way to sell** those
listings and a **new way to buy**: instead of haggling against a fixed asking price, a buyer
names their own number.

> **No money ever moves through the website.** This is the single most misunderstood fact about
> the product. Every deposit is collected off-platform by a licensed agent.

The sister platform **iNewProject** does the same job for *new launches*. TenderProp does it for
**subsale** (existing, completed properties). Same company, same model, different inventory.

## A2. Why it exists

Malaysian subsale property is sold by asking price, and buyers rarely know whether that price is
real. Sellers wait months. TenderProp gives the seller a **deadline and a batch of competing
interest**, and gives the buyer **permission to offer what they think it is worth** — including
below the asking figure.

## A3. How the money actually works

| Step | Where it happens | Who handles it |
|---|---|---|
| Buyer submits a bid price | On tenderprop.com | Automated — it is a lead form |
| Agency receives the lead | Agency systems | Agent |
| **3% deposit collected** | **Off-platform, agent-to-buyer** | **Agent, into the agency's client account** |
| Negotiation, acceptance | Phone / in person | Agent, between buyer and seller |
| SPA and completion | Solicitors, bank | Normal Malaysian conveyancing |

The **3% deposit is not an extra charge**. It is the Malaysian earnest deposit and forms part of
the standard **10% down payment**. It is returned in full if no sale proceeds. Holding it in a
**client account is mandatory under BOVAEP** (the Board of Valuers, Appraisers, Estate Agents and
Property Managers) — it is not a TenderProp policy, it is the law for licensed agencies.

## A4. Where listings come from — and the moat

The agency's own agents collect listings the normal way. They then pitch the e-tender concept to
the seller: *sell faster, at no extra cost, while your normal listing continues in parallel.*
The seller gets **two routes for one property**. Tenders typically run **3–6 months** by
agreement, depending on the seller package.

**The growth engine is physical.** Every tendered listing gets **two banners outside the house** —
The One Property's usual banner, and a TenderProp banner beside it. 100 listings means 100
locations advertising the platform for free, in the exact neighbourhoods where buyers are already
looking. That, not paid acquisition, is the plan.

## A5. The two products — a seller picks ONE

| | **E-Tender** | **Owner Auction** |
|---|---|---|
| Mechanic | Private sealed offer at the buyer's chosen price | Live bidding, price climbs until sold |
| Visibility | Nobody sees anyone else's offer, ever | Bidders see the price rise |
| Where | On the website, then agent follow-up | Zoom or a physical room |
| Run by | The appointed agent | A licensed auctioneer the group will engage |
| 3% deposit | Collected by the agent after submission | Required to enter the auction |
| Outcome | Seller accepts, declines, or **counters** | Highest bid wins |
| Status | **Live focus of the revamp** | **Last to be revamped** — ref `ownerauction.my` |

A **public auction** tab (bank foreclosures, where a lender forces a sale) is a **future**
addition. Out of scope today. Do not build it.

---

# B. The buyer journey — exactly as it works

1. Buyer browses listings. Each shows a **reserve price** and a **closing date**.
2. Buyer opens a listing and reads the property and tender terms.
3. Buyer clicks **Apply for E-Tender**.
   - **Not signed in ⇒ a sign-in / sign-up dialog appears. Members only.**
4. Signed in ⇒ the **Tender Form Application** opens. Most of it is pre-filled from the listing.
   **The buyer supplies exactly four things: name, email, phone, and their bid price.**
5. Submit ⇒ **a lead reaches the agency.** No payment, no confirmation of winning, no escrow.
6. The agent contacts the buyer on those details and, if they are serious, **collects the 3%**.
7. The agent presents the bid to the seller. The seller may **accept, decline, or counter**.
8. **The agent negotiates as the middleman.** A buyer may end up resubmitting a higher offer.
9. The member's dashboard keeps a record of every e-tender they have submitted.

**Buyers usually offer BEFORE they view — but the viewing still happens.** ⚠️ An earlier version
of this file said buyers "do not normally view the property before offering", implying viewing is
excluded. **That was wrong** and was corrected by Bryan on 3 Aug 2026.

The real sequence: a buyer sees a listing, fears someone else will tender and take it, and so
submits an offer straight from the listing page. **That submission notifies the agent, the agent
follows up, and the agent takes them to view the property.** Only then does the offer go to the
seller. The agent guides the buyer **A–Z, viewing included**.

Offer-first is **buyer urgency, not a platform rule.** Never write copy saying buyers cannot or
should not view — and never treat the tender as something a viewing would spoil.

---

# C. The rules that keep getting broken

These are the errors that have been made repeatedly during the build. Each one is founder-verified.

### C1. The reserve price is a GUIDE, not a floor
Buyers deliberately offer **below** the reserve to try their luck; the seller may accept or
counter. **Banned copy:** "minimum offer considered", "the floor", "offers start here", "at or
above the reserve". A floor nobody may cross turns the e-tender into a fixed-price listing with
extra steps — **naming your own number is the entire product.**

### C2. No money moves through the site
Never imply payment, escrow, or a deposit taken at submission. See §A3.

### C3. There is no registration deadline
An account is needed **only at the moment of applying**. Any "register by" date is wrong.

### C4. Negotiation may be stated, but hedged
Founder: *"it's not about win or lose — there's always a chance / room for negotiation done by
the agent."* Say it as **"where there is room to move, the appointed agent negotiates on your
behalf"** — that promises a **route**, never an outcome.

### C5. It is not a live auction
Offers are sealed and private. **No** bid counts, **no** "current highest bid", **no** urgency
theatre beyond the closing date itself.

### C6. Voice — platform in front, agency where it legally matters
Front-of-house copy speaks as **TenderProp, the platform**. Words like *"our licensed agent"*,
*REA/REN numbers* and *"licensed agency"* belong in the **footer, About page, FAQ, the agent block
and the apply point** — this is the **Act 242** disclosure and must never be stripped. Same split
as iNewProject.

### C7. Deadlines are Malaysian
Tenders close at the **end of the closing date, 23:59:59 MYT (`+08:00`)**. There is no intra-day
cutoff. A closing date without a timezone is a bug.

### C8. Days lead, not clocks
Founder guidance: a buyer cares **how many days are left**, not a ticking clock. The day count is
the headline; hours/minutes only take over inside the final 24 hours, where "0 days" would say
nothing.

---

# D. What is built

A reference build in **React (TanStack Start) + Vite + TypeScript**. **The React layer is
scaffolding — what matters is the rendered HTML/CSS and the rules.** Class names are deliberately
stable and semantic so the markup can be lifted.

| Route | State | What it is |
|---|---|---|
| `/tender` | **Built** | Listings: hero with the batch countdown, search, filters, category tabs, property cards, sort, grid/list, pagination |
| `/tender/residensi-sinaran` | **Built** | Property detail page — **the design canon for every future detail page** |
| `/how-e-tender-works` | Framed | Owns the process explanation |
| `/`, `/sell`, `/services`, `/about`, `/member`, `/owner-auction` | Framed | Structure approved, content pending |
| `/buy`, `/rent` | Retiring | The generic portal is being dropped; only tender and owner auction remain |

**"Framed"** means the page exists with its approved section structure and says so on screen —
not a stub pretending to be finished.

## D1. The detail page, section by section
Overview + gallery → **Tender information** (the terms + where you submit) → Property details →
About → Selling points → What's nearby → Location → Listing agent → Mortgage calculator → FAQ →
Similar e-tenders.

**Tender information** is the heart of it: a full-bleed 40/60 split. Left is the deadline
(day count, live H/M/S, tender start date → closing date). Right is the terms (reserve, deposit,
method), two reassurance notes (the 3% is not an extra charge; not-accepted is not the end), and
the **submit block** where the buyer applies.

---

# E. The data model

## E1. Derived — the backend must NOT store these
Computing them twice is how a page ends up contradicting itself. This is not hypothetical: on
1 Aug the same listing showed "885 days left" in its header and "884 DAYS LEFT" in the panel
below, because two functions rounded differently.

| Shown | Derived from |
|---|---|
| "N days left" / "closes today" | `closingDate` + now, in MYT |
| Reserve price per sq ft | `reservePrice ÷ builtUp` |
| Deposit amount | `reservePrice × 3%` |
| Which batch a listing is in | grouping by identical `closingDate` |
| Listing slug | `name` |
| Open / closed status | `closingDate` vs now |

## E2. Required per listing
`name`, `area`, `stateKey`, `stateName`, `reservePrice`, `closingDate`, `tenderMethod`
(`E-Tender` | `Owner Auction`), `tenderFormat`, `propertyType`, `propertyCategory`, `builtUp`,
`landArea`, `tenure`, `titleType`, `image`.

**Nullable but present** (`null` = "the agency has not told us", rendered as *Not stated*):
`bedrooms`, `bathrooms`, `deposit` (null ⇒ derive 3%).

**Optional:** `carParks`, `storeys` (landed only), and a `details` block — `floorLevel`,
`landTitle`, `bumiLot`, `zoning`, `yearCompleted`, `facing`, `powerSupply`, `occupancy`,
`furnishing`, `maintenanceFee`.

**Media** — a button appears only if its key exists, so the page never advertises media it does
not have: `media.video`, `media.floorPlan`, `media.tour`, `media.aerialFrom` (a 1-based index into
the photo array, not an upload).

## E3. What a submission sends
`name`, `email`, `phone`, `bidPrice` — **and `bidPrice` may be below the reserve.** Everything
else on the form is pre-filled listing data. Each submission belongs to a member account and must
be retrievable per member for their dashboard.

---

# F. Design

**Palette** — cream `#FAF5F0`, deep paper `#F1E8DE`, ink `#17130F`, burgundy `#571C2E`, red
`#C8281C`, muted `#75695E`, line `#DED2C4`, good `#2E6B3F`.
**Type** — Inter (UI) + Newsreader (display serif, weights 400–700 only).

**Rules:** flat and restrained — no gradients, no gloss, no heavy shadows. **One accent per zone**;
red is reserved for the page's single primary action. Zero horizontal overflow at 375px, always.
Focus rings are not optional. `prefers-reduced-motion` honoured on every transition.

**A standing instruction from Bryan:** *"when I say improve the design, that means everything —
not just the font, size, placement, positioning."* The attribute he names is where his eye landed,
not the scope of the work.

---

# G. Decided — do not re-litigate

- Reserve = **guide, not floor** *(founder)*
- **No money on-platform**; 3% collected by the agent into the client account *(founder)*
- **No registration deadline** *(founder)*
- Negotiation may be stated, **hedged** *(founder)*
- Deposit = **3% of reserve**, always computed, never stored *(founder)*
- Deposit figure renders **green** *(Bryan's explicit preference)*
- Offers are presented to the seller **immediately** via the agent — not held until closing *(founder)*
- Days lead the countdown; hours/minutes only in the final 24h *(founder, via his father)*
- The generic **buy/rent portal is retired**; tender + owner auction only *(Bryan)*
- 12 listings marked `demo: true` are **fabricated fillers** for state coverage. They carry a DEMO
  badge, get **no detail pages**, and must be **deleted before go-live**
- `REN 123456` is an **approved placeholder** pending real numbers

---

# H. Open — nobody has answered these yet

1. **Residensi Sinaran's real closing date.** The demo data says `2028-12-31` — **885 days out**,
   which is not a tender. It should be one of the real batch dates.
2. **Seller response window.** The page states "accept, decline or counter within 5 working days".
   Fixed platform rule, or per listing?
3. **E-Tender start date.** Currently derived as closing − 3 months. Real, or per listing?
4. **Agency identifiers** — real REN / E-number / agency registration for the Act 242 disclosure.
5. **Seller package pricing** — not modelled at all.
6. Whether **"Or talk to the agent first"** belongs beside Apply at equal weight, given that
   reaching the agent first turns the sale traditional.

---

# I. Who does what

| | |
|---|---|
| **The One Property Global** | The licensed agency. Owns the listings, the agents, the client account, and every regulated act |
| **Bryan Yew** | Founder-side owner of the revamp. Every product decision routes through him |
| **Bryan's father** | Runs the agency. Source of truth on how tenders actually work |
| **EasyAsia** | **Builds and owns the backend.** They read this reference build and re-implement it on the live platform |
| **This repo** | Frontend reference build only. **We do not build backend** |

**The live backend today** is `tenderprop.com/admin/project/`. It will be rebuilt for the revamp.

## What we are NOT asking for
No bidding engine, no offer storage, no payment handling in the frontend. No user accounts in this
repo — sign in / register are links. Every field rendered on a page must be one a real admin can
type into a form or upload; if it cannot be, it does not belong on the page.
