# Homepage Iteration State

**The live state of the loop. This file is the brief.** Nothing binds the builder except what is
written under ACCEPTED FIXES.

---

**SURFACE:**
Header + hero / first viewport

**STATUS:**
ITERATION 01 BUILT — awaiting Codex audit

**LOCKED:**
None

**DO NOT TOUCH:**
Existing completed `/tender` and `/tender/residensi-sinaran` pages except as design reference.

**OBJECTIVE:**
Establish the homepage hero architecture before implementation.

**CURRENT SCORE:**
N/A — nothing built

**ACCEPTED FIXES:**
None yet — no audit has run. Surface 1 was built directly from the founder decisions in §2.

**NEXT ACTION:**
Codex audit of Iteration 01 → `loop/reviews/iter-01-codex.md`, using
`loop/codex-auditor-prompt.md`. Bryan then fills ACCEPTED FIXES.

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

## 2. FOUNDER DECISIONS — Surface 1, approved by Bryan 5 Aug 2026

**Binding.** These are settled and are not re-litigated by an audit finding.

| # | Decision | Bryan's words |
|---|---|---|
| **Q1** | **RIGHT PANEL = the real cycle + countdown** | *"Use the real cycle + countdown."* |
| **Q2** | **A NEW homepage hero composition.** Do **not** copy `/tender`'s diagonal split verbatim. Reuse TenderProp's established vocabulary, tokens, typography, spacing discipline and restraint | *"Create a new homepage hero composition."* |
| **Q3** | **REMOVE homepage search for Iteration 01** unless it can be proven to submit the query into `/tender` and have `/tender` initialise from it. **No fake or non-functional search for appearance.** The primary discovery CTA carries the buyer into `/tender` | *"Do not add fake/nonfunctional search just for appearance."* |
| **Q4** | **Seller path in the first viewport, secondary.** No second primary/red button. One quiet text/link treatment below or adjacent to the buyer CTA | *"Do not use a second primary/red button."* |

**Q3 — the proof Bryan asked for, and it fails.** `/tender` has **no search-param
initialisation**: `validateSearch`, `useSearch`, `URLSearchParams` and `location.search` return
zero hits across `src/routes/tender/index.tsx`, `src/router.tsx` and `src/routes/__root.tsx`. Its
search state is local `useState` only. A homepage search box could submit a query and `/tender`
would ignore it. **Condition not met ⇒ search removed.** Restoring it is a real piece of work on
`/tender` (add `validateSearch`, seed state from it), not a hero change.

### What Surface 1 must accomplish — Bryan, 5 Aug

1. A stranger understands TenderProp quickly
2. E-Tender is clearly the flagship action
3. The primary CTA leads to `/tender`
4. The right side proves the product with **real** cycle/countdown data
5. The seller has a secondary path that does not compete with buyer discovery

**Still unresolved:** the "previous homepage proposal" referenced as inspiration was never
received. Candidates exist at `~/Downloads/tenderprop-revamp/TenderProp Homepage.dc.html` and
`~/Desktop/TenderProp-Review-For-ChatGPT/homepage.png`; `AGENTS.md` classes those directories as
pre-repo archives, so neither is being treated as input until Bryan points at one.

---

## 3. ITERATION 01 — CLAUDE SELF-CRITIQUE

Written before any audit. Screenshots: `loop/screenshots/iter-01-hero-{1440,1280,1024,768,390,375}.png`.

**WHAT I BUILT AND WHY.** A 55/45 hero on the cream page ground — no slab, no scrim. Left is the
statement: eyebrow, a Newsreader headline carrying the product insight, one lede that defines the
mechanic, one red CTA into `/tender`, and the seller route as a quiet text link. Right is the
cycle as a **document**: kick, day count, closing date, then a native table of the five real
listings in that cycle against their reserve guides. The card is proof made of facts, not a
photograph — one property's picture above the value proposition would re-run the catalogue
framing the cycle exists to replace.

`/` no longer uses `PageShell`. Its plain type-stack hero and dashed "page frame" grid are
scaffolding for undesigned pages, and it is shared by eight routes — owning the composition keeps
this loop out of a high-collision file.

**WHAT I SEE IN THE SCREENSHOT.** The type does the work: Newsreader at 52px with the burgundy
italic on *your own price* looks intentional rather than templated, and the card reads like a
record of a real event. The eye order is right — headline, then 130, then the red button.
**And the bottom-left of the hero is empty.** The statement column ends at the seller link while
the card runs on for another 127px. That hole is the first thing I see now that I have looked.

**MEASUREMENTS.**

| | 1440 | 1024 | 375 |
|---|---|---|---|
| Horizontal overflow | **0** | **0** | **0** |
| Left column edges | L 170 · R 744.2 | L 130 · R 566 | L 18 · R 357 |
| Card edges | L 800.2 · R 1270 | L 610 · R 1024\* | L 18 · R 357 |
| Column gap | 56px (clamp max) | 44px | n/a — stacked |
| h1 / day count | 52 / 44px | 42 / 33.8px | 31 / 30px |
| Lede measure | 66ch | 62ch | 45ch |
| `.hp-say` vs `.hp-cycle` height | 386.9 / 513.7 | 353.9 / 492.5 | 362.6 / 479.7 |

\*inside the `.wrap` padding. Verified 0 overflow at **1440, 1280, 1024, 768, 390 and 375**.

**Gaps — every one a value in the CSS, none produced by two mechanisms:** statement 12 / 16 / 30;
action block **16** (a single flex gap with zeroed child margins — the fix for the 6px-renders-as-21px
trap); card 10 / 10 / 18 / 14. **Edges collapse to one left and one right per column**, which is
what V1 asks for.

**FAULTS I ALREADY SEE.**

1. 🔴 **P1 — 127px of dead space under the statement column** (139px at 1024). The composition is
   top-heavy on the left and the hero's bottom-left corner is a gap with no owner. This is the
   defect I most want a second opinion on, because the three obvious fixes each cost something:
   centre the statement (loses the shared top edge with the card), shorten the card (the five
   listings *are* the cycle), or add content to the left (out of scope for a hero, and Bryan did
   not ask for it). **I did not pick one — this is the judge's call.**
2. 🔴 **P1 — `SiteHeader` is 252px tall at 375px**, eating 38% of a 667px phone viewport before
   the hero begins. Not my element, and Bryan's brief says preserve it, so I flagged rather than
   fixed. It is the same header that `PLAN-AUGUST-DELIVERY.md` §4 already logs as a week-4 P0.
3. 🟠 **P2 — the seller link's target height** is 37.3px at 375 and 17px at desktop, under the
   plan's flat ≥44px rule. It is an inline text link inside a sentence, which is normally exempt,
   but the rule as written does not carve that out.
4. 🟠 **P2 — `.btn.red:hover` carries `box-shadow: 0 4px 12px rgba(200,40,28,.2)` and a
   `translateY(-1px)`** in the shared `tender-listings.css`. The brand is flat: "no drop shadows
   beyond `0 1px 2px rgba(23,19,15,.03)`". Pre-existing and shared, so flagged not touched.
5. 🟠 **P2 — the root meta description** reads *"Sealed-bid property tenders across Malaysia"* and
   *"refundable deposits"* (`src/routes/__root.tsx`). Bare "tender" breaks §3c, "sealed-bid" is
   auction vocabulary, and the deposit line touches the unresolved timing question. Shared file.
6. 🟠 **P2 — `/tender` has no `<h1>`.** My primary CTA lands on a page whose highest heading is an
   `h2`. Canon page, outside my claim — flagged.
7. 🟡 **P3 — "Single Storey Landed @ OUG"** reads as raw CMS data in a hero. A real listing name is
   an agency input, not a frontend fix.
8. 🟡 **P3 — the CTA says "Browse open E-Tenders", not "Browse the December cycle"**, which would be
   stronger. It cannot, because `/tender` has no way to receive a filter — the same missing
   `validateSearch` that failed Q3.

**SELF-SCORE — 83/100.**

| Band | Pts | Evidence |
|---|---|---|
| TenderProp understood quickly | **17**/20 | Method legible in one read; could not be another company's page. But nothing yet says what happens *after* you offer, and "name your own price" is momentarily readable as "get it at your price" until the lede lands |
| Visual hierarchy | **12**/15 | Three levels, measured: h1 52 / count 44 / CTA. Ratio holds 0.85 at every width. Docked because the card's *mass* (514px vs 387px) reads heavier than its rank |
| Alignment + spacing | **12**/15 | One left and one right edge per column at every width; gaps 12/16/30, 16, 10/10/18/14, all declared. Docked for the 127px imbalance — a spacing defect, not a hierarchy one |
| Design-system consistency | **9**/10 | Tokens only; Newsreader 600 overriding the global `h1{800}` that would have synthesised a fake bold; reuses `.btn.red`, the eyebrow idiom, the ordinal date, the native-table ledger pattern. One new stylesheet, zero new visual language |
| E-Tender / product accuracy | **10**/10 | All 14 hard rules pass by grep and by reading. Reserve stated as a guide twice. No deposit, no payment, no auction device, no invented content. Zero bare "tender" in rendered copy. No new backend field |
| Desktop composition | **7**/10 | It has a shape and the whitespace works — but dead space with no owner is exactly what this band exists to catch |
| Mobile / responsive | **7**/10 | Transforms rather than squeezes; 0 overflow at six widths. Docked for the 252px header and the link target |
| CTA clarity | **5**/5 | One red action; seller route present, quiet, and only the link text is clickable |
| Accessibility | **4**/5 | One h1, correct order, `scope` on the table, one aria-label on the figure with parts hidden, focus rings, reduced-motion guarded. Docked for the link target |

**REGRESSION GUARDS — all pass.** F1 zero console errors · F2 all five nav items route · F3 CTA →
`/tender` · F4 n/a, search removed per Q3 · F5 n/a, no property links (none of the five has a
detail page; linking them would be F5's failure, not its pass) · F6 Sign in and Register → `/member`
· F7 `npm run build` green · `eslint` clean · `tsc --noEmit` clean.

**WHERE I DISAGREE WITH THE BRIEF.** Nowhere on the founder decisions. One note on process: the
design SOP says build three treatments and ship one. I built one, because the loop replaces that
method with an adversarial audit and three variants would triple the audit surface. If Codex or
Bryan would rather judge against alternatives, say so and iteration 02 builds them.

---

## 4. ITERATION HISTORY

| Iter | Surface | Score | Verdict | Notes |
|---|---|---|---|---|
| 00 | Header + hero | — | — | Loop infrastructure created; homepage inspected; planning only |
| 01 | Header + hero | **83** | *awaiting Codex* | New 55/45 composition. 0 overflow at 6 widths, guards pass, zero business-rule violations. Top open fault: 127px dead space bottom-left |
