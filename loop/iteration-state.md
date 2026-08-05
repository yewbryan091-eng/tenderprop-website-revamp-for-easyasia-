# Homepage Iteration State

**The live state of the loop. This file is the brief.** Nothing binds the builder except what is
written under ACCEPTED FIXES.

---

**SURFACE:**
Header + hero / first viewport

**STATUS:**
PLANNING

**LOCKED:**
None

**DO NOT TOUCH:**
Existing completed `/tender` and `/tender/residensi-sinaran` pages except as design reference.

**OBJECTIVE:**
Establish the homepage hero architecture before implementation.

**CURRENT SCORE:**
N/A — nothing built

**ACCEPTED FIXES:**
None

**NEXT ACTION:**
Bryan's call on the four open hero questions in §2 below. No building until then.

---

## 1. INSPECTION RESULT — completed 5 Aug 2026, Claude

The action this file opened with. Answers to all six questions.

### 1a. Exact route

`/` — file-based route, `src/routes/index.tsx`, registered as `createFileRoute("/")`.
Generated into `src/routeTree.gen.ts` (never hand-edited).

### 1b. Exact files involved

| File | Role | Shared? |
|---|---|---|
| `src/routes/index.tsx` | The homepage itself — 60 lines | **Homepage only** |
| `src/components/tender/PageShell.tsx` | Hero + "Page frame" scaffold wrapper | **Shared** — `/owner-auction`, `/sell`, `/services`, `/about`, `/member`, `/how-e-tender-works`, `/buy`, `/rent` |
| `src/components/tender/SiteHeader.tsx` | Header nav — **surface 1 owns this** | **Shared** — every page |
| `src/components/tender/SiteFooter.tsx` | Footer — surface 10 | **Shared** — every page |
| `src/styles/site-shell.css` | `.shell-hero`, `.shell-frames`, `.home-doors`, `.door` | **Shared** by all framed pages |
| `src/styles/tender-listings.css` | Tokens, `.wrap`, header/footer chrome | **Shared** — site-wide |
| `src/data/tenders.ts` | Listing data; drives the cycle line | **Shared** — read-only for this loop |
| `src/lib/tender-utils.ts` | `fmtDate`, all deadline maths | **Shared** — read-only for this loop |

⚠️ **High-collision warning.** Only `src/routes/index.tsx` is homepage-only. `PageShell`,
`SiteHeader`, `SiteFooter` and `site-shell.css` are load-bearing for **eight other routes**. Per
`PLAN-AUGUST-DELIVERY.md` §6, changes there are announced, small, and pushed immediately — or the
homepage grows its own components and leaves the shared ones alone.

### 1c. Current homepage section structure

There is **no real homepage.** What exists is honest scaffolding:

1. `SiteHeader` — logo, 5 nav items, Sign in / Register
2. `.shell-hero` — eyebrow *"A new way to buy property in Malaysia"*, h1 *"Property, sold by
   sealed e-tender"*, one lede paragraph. Plain stacked type, full width, no image, no CTA
3. `.home-doors` — a cycle line (*"Next e-tender cycle: 12 December 2026 · 5 properties"*) and
   **two product doors**: E-Tender (badged LIVE) and Owner Private Auction
4. `.shell-frames` — a dashed-border grid captioned *"Page frame — these are the sections this
   page will hold"*, listing four planned sections. **Deliberately visible as a frame**, not a
   stub pretending to be finished
5. `SiteFooter` — brand + disclaimer, cycle date, Platform / Company / Contact columns, legal bar

**No hero image. No search. No listings. No primary CTA. No seller path.** Nothing on the page
speaks to an owner at all.

### 1d. What can be reused

| Asset | Where | Note |
|---|---|---|
| **Tokens, type scale, band alternation** | `tender-listings.css` / `DESIGN-SYSTEM.md` | Non-negotiable — the homepage composes from these |
| **`SiteHeader`** | `SiteHeader.tsx` | Structurally right: 5 items, router-driven active state. Surface 1 audits it, does not rebuild it |
| **`SiteFooter`** | `SiteFooter.tsx` | Real content, real office address, cycle date. Surface 10 audits |
| **Diagonal-split hero** | `.hero-tender` in `tender-listings.css` | Available to reuse. **Not obligatory** — see the open question in §2 |
| **Day-led countdown** | `tender-utils.ts` + `.hero-timer*` | The correct countdown treatment, already solved |
| **`PropertyCard`** | `PropertyCard.tsx` | Surface 2 (Open E-Tenders) lifts this whole |
| **The cycle line** | `index.tsx:32-34` | The one genuinely right idea on the page — the cycle, not the catalogue |
| **`.wrap` / content width** | `tender-listings.css` | Keeps the homepage's edges agreeing with `/tender`'s |

### 1e. What should be removed

| Remove | Why |
|---|---|
| **`.shell-frames` block** (`frames` prop) | Honest scaffolding, but it is a to-do list rendered as a page. It goes the moment real sections land |
| **`PageShell`'s plain `.shell-hero`** for `/` | A left-aligned type stack is not a homepage hero. The homepage stops using `PageShell`'s hero and owns its own |
| **"your deposit counts toward the 10%"** (`index.tsx:20`) | Sails close to the banned "10% legal fees" wording and states deposit timing that `TEAM-LOG.md` §3 lists as **unresolved**. Do not carry this sentence forward |
| **"or your deposit back in full"** (`index.tsx:42`) | Same problem: implies a deposit exists at offer time. No money moves on this site |
| **The two-door layout as the page's main event** | Doors are surface 5 (pathways), not the hero. Owner Auction is "last to revamp" and must not sit at equal weight with the live product |
| **`lede` mentioning Owner Auction first-line** | Splits the ten-second message across two products before either lands |

### 1f. Hero architecture recommendation

See §2. Recommendation stated, decisions still Bryan's.

---

## 2. OPEN — Bryan's call before surface 1 builds

| # | Question | Claude's recommendation |
|---|---|---|
| Q1 | **What does the RIGHT panel hold?** A real listing card, the cycle/countdown, or the method explained | **The cycle + countdown.** It is the product's heartbeat, it is real data, it needs no founder unblock, and it cannot be mistaken for a portal. A listing card puts one property's photo above the value proposition and re-runs the catalogue framing |
| Q2 | **Reuse the `/tender` diagonal split, or a new hero for `/`?** | **New composition, same vocabulary.** Reusing the diagonal verbatim makes the front door look like the listings page — a visitor arriving at `/` and clicking through to `/tender` should feel progression, not repetition. Same tokens, same type, same restraint; different shape |
| Q3 | **Does the homepage search survive?** | **Yes, but small.** F4 in the guards is blunt: a search box that does not search is worse than none. It must submit into `/tender` with the query applied. If that plumbing is not wanted yet, drop the box and let the CTA carry the discovery path |
| Q4 | **Where is the seller door in the first viewport?** | **Present, secondary, not in the hero panel.** Sellers are the revenue but buyers are the message. One quiet line — *"Selling? See how e-tender works for owners"* — under the primary CTA. Not a second red button |

**Also flagged:** the "previous homepage proposal" referenced as inspiration was not received in
this session. Two candidates exist at `~/Downloads/tenderprop-revamp/TenderProp Homepage.dc.html`
and `~/Desktop/TenderProp-Review-For-ChatGPT/homepage.png` — `AGENTS.md` classes those directories
as pre-repo design archives, so neither is being treated as input until Bryan points at one.

---

## 3. ITERATION HISTORY

| Iter | Surface | Score | Verdict | Notes |
|---|---|---|---|---|
| 00 | Header + hero | — | — | Loop infrastructure created; homepage inspected; planning only, nothing built |
