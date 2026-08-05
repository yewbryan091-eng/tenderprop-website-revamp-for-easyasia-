# Homepage Iteration State

**The live state of the loop. This file is the brief.** Nothing binds the builder except what is
written under ACCEPTED FIXES.

---

**SURFACE:**
Header + hero / first viewport

**STATUS:**
**ITERATION 03 — NEW ARCHITECTURE, structure pass.** Bryan supplied a reference design on
5 Aug that supersedes the 55/45 card composition of iterations 01–02. Scope this pass was
deliberately narrow, in his words: *"just build the diagonal left side right side 45/55 first,
left side ensure theres the smarter way to buy property title and right side ensure theres the
maroon fading, i will proceed to go find the image."* **The hero image is a placeholder.**

**LOCKED:**
None

**DO NOT TOUCH:**
Existing completed `/tender` and `/tender/residensi-sinaran` pages except as design reference.

**OBJECTIVE:**
Establish the homepage hero architecture before implementation.

**CURRENT SCORE:**
N/A — nothing built

**ACCEPTED FIXES — from the Codex iteration-01 audit, accepted by Bryan 5 Aug. All five DONE.**

| # | Sev | Accepted fix | Status |
|---|---|---|---|
| 1 | P1 | **Remove the five-row property/reserve ledger** from the cycle panel. Retain the real cycle, the count of open E-Tenders where real data supports it, the countdown, the closing date and the cycle identity. **Do not replace it with new content merely to fill space** | ✅ removed; nothing put in its place |
| 2 | P1/P2 | **Rebalance the hero after removal.** Re-measure at 1440 and 1024; fix composition **only if a meaningful imbalance remains**. No filler to force equal heights | ✅ measured, imbalance was real and inverted, fixed with `align-items: center` |
| 3 | P2 | **Seller link ≥44px hit area**, keeping the quiet visual treatment and never competing with the primary CTA | ✅ 44px verified by hit test at 1440 and 375 |
| 4 | P2 | **Skip link** — the established TenderProp pattern, targeting homepage main content, reusing the existing implementation | ✅ same `.skip-link` class and placement as `/tender`; focus lands on `#main` |
| 5 | P2 | **Flatten the primary CTA** — remove the lift and oversized shadow; explicit property transitions, not `transition: all` | ✅ scoped to `.home` so `/tender` is untouched |

**NEXT ACTION:**
Codex audit of Iteration 02 → `loop/reviews/iter-02-codex.md`, using
`loop/codex-auditor-prompt.md`. Bryan then fills the next ACCEPTED FIXES.

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

### 🔴 AMENDMENT — Bryan, 5 Aug 2026, from a supplied reference design

**Q1 and Q2 are superseded.** The hero architecture is now:

| | Decision |
|---|---|
| **Composition** | Full-bleed **diagonal** split, **~45 left / ~55 right**. This reverses iterations 01–02's 55/45 and replaces the card with a two-plane hero |
| **Left, on paper** | The headline **"The smarter way to buy property."** — *buy property.* in burgundy italic |
| **Right** | A KL image under a **maroon fade**, carrying the cycle |
| **Image** | ⚠️ **Bryan is sourcing it.** Placeholder wired to `--hp-hero-image` in `home.css` — one value to swap |

Q2 previously said *"do NOT copy /tender's diagonal split verbatim."* That still holds and is not
violated: this diagonal is **mirrored** — `/tender` darkens the LEFT plane, the homepage darkens
the RIGHT. Same technique and tokens, opposite composition, so the two pages read as a pair rather
than a repeat.

**Q3 (no search) and Q4 (seller path secondary, never a second red button) are UNCHANGED and
still binding.** The reference shows neither; both are carried forward.

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

## 4. ITERATION 02 — CLAUDE SELF-CRITIQUE

Screenshots: `loop/screenshots/iter-02-hero-{1440,1024,390}.png`.

**WHAT I CHANGED.** Only the five accepted fixes. Hero architecture, copy, CTA hierarchy and the
buyer/seller priority are untouched; `SiteHeader`, `/tender` and the detail pages were not opened.

**BEFORE / AFTER — the hero columns.**

| | 1440 | 1024 | 390 |
|---|---|---|---|
| Statement height | 386.9 → **386.9** | 353.9 → **353.9** | 362.6 → **362.6** |
| Card height | 513.7 → **191.2** | 492.5 → **170.0** | 479.7 → **161.2** |
| Imbalance (card − statement) | +126.8 → **−195.7** | +138.6 → **−183.9** | stacked |
| After rebalance: space above / below card | — → **97.8 / 97.9** | — → **91.9 / 91.9** | stacked |
| Horizontal overflow | 0 → **0** | 0 → **0** | 0 → **0** |

**The rebalance was needed, and the measurement is why.** Removing the ledger did not reduce the
imbalance — it **inverted and enlarged** it, from 127px of void under the statement to 196px of
void under the card. `align-items: center` distributes that space instead of pooling it in one
corner: 97.8 above and 97.9 below at 1440, symmetric to a tenth of a pixel. **Nothing was added.**
The cost is the shared top edge the two columns had, which was only worth having while their
heights were comparable.

**Edges and gaps hold.** One left and one right edge per column at every width — statement
L170/R744.2, card L800.2/R1270 at 1440. Gaps: statement 12 / 16 / 30, action block 16, card
10 / 10 / 12. Every one a value in the CSS. No duplicate selectors in `home.css`; braces balanced.

**THE FIX THAT PASSED AND WAS STILL WRONG.** The 44px hit area first shipped as an absolutely
positioned `::after` overlay. It measured exactly 44px and hit-tested clean at 1440 — and **failed
at 375**, because an absolute child of a *wrapped* inline resolves against one fragment, not the
union, so the second line had no target. Replaced with vertical padding on the inline box plus
`box-decoration-break: clone`, and the underline moved from `border-bottom` to a real
`text-decoration` so it stays glued to the text. Verified by `elementFromPoint` at ±21px from each
line fragment, at both widths.

Then the fix created its own hazard: symmetric 14/14 padding left only **4px** between this hit
area and the primary CTA's, close enough that a tap meant for the button could land on the link.
Made asymmetric — 9 above, 19 below, into space nothing else uses — and the clearance is now 9px
with the button still winning its own bottom edge.

**SELF-SCORE — 90/100 (was 83, Δ +7).**

| Band | 01 | 02 | Why it moved |
|---|---|---|---|
| Understood quickly | 17 | **16** | ⬇ Honest cost of an accepted fix: the five real names and reserves were the concrete proof in the first viewport. "5 properties" is now a claim where it used to be something you could see, and a headline beside a small date card is a more common shape than a headline beside a live ledger. Understanding is unchanged; distinctiveness is slightly down |
| Visual hierarchy | 12 | **14** | ⬆ The card no longer out-weighs its rank. Three clean levels |
| Alignment + spacing | 12 | **14** | ⬆ Symmetric to 0.1px, all gaps declared, and a real spacing hazard caught by hit-testing rather than by eye |
| Design-system consistency | 9 | **10** | ⬆ Reuses the existing `.skip-link` rather than inventing one; CTA hover back inside the flat-brand rule |
| Product accuracy | 10 | **10** | — all fourteen hard rules pass |
| Desktop composition | 7 | **8** | ⬆ The void is gone. Held back because the 45% column now holds 191px of content in a 470px-wide track — it no longer earns its width |
| Mobile / responsive | 7 | **8** | ⬆ 44px target verified by hit test. Still carrying the 252px header |
| CTA clarity | 5 | **5** | — flat now, and the seller target does not steal from it |
| Accessibility | 4 | **5** | ⬆ Target size fixed, skip link verified to move focus to `#main` |

**⚠️ 90 IS NOT A LOCK.** The lock condition needs **two consecutive iterations improving by
< 2 points**; this one moved **+7**. It also needs zero unresolved P1, and one remains (below).
Reporting 90 as a candidate would be exactly the rounding-toward-the-threshold the rubric warns
about.

**UNRESOLVED.**

| Sev | Item | Why still open |
|---|---|---|
| **P1** | `SiteHeader` is 252px tall at 375px — 38% of a phone viewport before the hero starts | Shared header; Bryan's brief says do not redesign it, and `PLAN-AUGUST-DELIVERY.md` §4 already defers it to week 4. **Blocks a formal LOCK under a strict reading** |
| P2 | Root meta description says *"Sealed-bid property tenders"* and *"refundable deposits"* | Bare "tender" breaks §3c, "sealed-bid" is auction vocabulary. Shared `__root.tsx` |
| P2 | `/tender` has no `<h1>` — the primary CTA's destination | Canon page, outside this claim |
| P2 | **New:** the 45% column is 470px wide holding 191px of content | Fixing it means touching the founder-approved 55/45 split, so it is a judge question, not a builder decision |
| P3 | *"Single Storey Landed @ OUG"* | No longer rendered on the homepage — it left with the ledger. Still an agency data issue for Surface 2 |

---

## 5. ITERATION 03 — CLAUDE SELF-CRITIQUE (structure pass)

Screenshots: `loop/screenshots/iter-03-hero-{1440,1280,1024,768,390,375}.png`.

**SCOPE.** Bryan's four requirements only — the diagonal, the 45/55, the title, the maroon fade.
Not a full surface rebuild, and **not scoreable as one**: the hero image is a placeholder, and the
image is half of what this composition is.

**BUILT.** Two absolutely positioned planes clipped to a shared seam, driven by `--hp-top-split`
(48%) and `--hp-bot-split` (40%) — the light plane averages ~45% and leans the way the reference
does. Same technique as `/tender`'s hero, mirrored. Left carries the pill, the headline, the
lede, the red CTA, *How E-Tender works*, one assurance line and the seller route. Right carries
the cycle over the image under the maroon fade.

**One alignment improvement worth keeping:** the hero's content edges are derived from `.wrap`'s
own formula (`--hp-gutter`), so they land on the **same x as the header, footer and every section
below**. `/tender`'s hero pads from the viewport instead and sits 114px outside the site's column
at 1440. This one does not repeat that.

**THREE FAULTS FOUND BY LOOKING, NOT BY READING THE CSS.**

1. 🔴 **The maroon fade was washed out.** `.hp-panel` is `inset: 0`, so the panel's box spans the
   **whole hero** and only the clip-path makes it a wedge. My gradient ran dense→thin across
   0–100% of that box, which put the entire dense half in the clipped-away region — the visible
   wedge got only the thin tail and read as flat mauve over a photo. Stops now start at 55%, so
   the fade does all its work between the seam and the right edge.
2. 🔴 **P0 at 390px — the statement panel rendered on maroon.** In the stacked media query I set
   `.hp-panel { position: static }`. That reparents the fade's absolutely positioned `::before`
   to `.hp-hero`, stretching the maroon across the **entire** hero: ink-on-maroon body copy, and
   the burgundy `buy property.` disappeared into the background completely. `position: relative`
   lays out identically and keeps the overlay scoped. **One keyword, two failures, invisible in
   the source.**
3. 🟠 **The headline ran to three lines** at 54px in a 370px column, losing the reference's
   two-beat break. Capped at 47px with `max-width: 8.2em` — measured in the h1's own em, which is
   safe here because the measure and the type are the same element and the same face.

**VERIFIED.** Zero horizontal overflow at **1440 / 1280 / 1024 / 768 / 390 / 375**. Every text
colour passes AA against its plane — lowest is 4.92 (lede on paper) and 4.97 (clock labels on
burgundy); the day count, date and ghost button sit at 10.54. Build, `eslint` and `tsc` green.
Braces balanced, no equal-specificity duplicate selectors. All fourteen hard rules pass.

**PROVISIONAL SCORE — not comparable to 01/02.** The rubric measures a finished surface; this is a
structure pass on a placeholder image. Holding the score until the real image lands rather than
publishing a number that will move for reasons unrelated to the work.

**DELIBERATELY NOT BUILT FROM THE REFERENCE — each needs a decision.**

| Reference element | Why it is not here |
|---|---|
| **"36 properties open"** stat block | 36 is the raw record count and **12 of those are fabricated `demo: true` fillers**. The real number is 24 open, 5 in this cycle. Rendering 36 would ship an invented statistic |
| **"Verified & regulated · Licensed professionals"** | Agency voice in a marketing zone — the H9 Act 242 split puts that in the footer, About, FAQ and the apply point, never the hero |
| **DAYS / HRS / MINS / SECS as four equal cells** | The founder ruled that exact treatment out (DESIGN-SYSTEM §3d). Built as the approved compromise instead: day count as headline, H/M/S demoted beneath it and `aria-hidden` — the same ranked pair `/tender` already runs |
| **Search band** below the hero | Q3 stands: `/tender` still cannot receive a query |
| **"How E-Tender works" beside the CTA** | It does not fit. At the action row's height the seam is at x≈608 and the button alone ends at 522; adding the link inline pushes to 674 and crosses the diagonal. It sits below instead — see the open question |

**OPEN QUESTIONS FOR THE JUDGE.**

1. **Two CTAs, one destination.** The left red button and the right ghost button both go to
   `/tender`, as in the reference. Ranked correctly, but redundant. Keep both, or drop the ghost?
2. **The action row.** Shorten the button to *"Browse open E-Tenders"* so *How E-Tender works* fits
   beside it as the reference shows, or keep the long label and leave the link below?
3. **"Malaysia's E-Tender platform"** — the reference reads *"Malaysia's TRUSTED E-Tender
   platform."* I dropped "trusted": it is an unverifiable claim in a marketing zone on a platform
   with no completed e-tenders to point at yet. Put it back?
4. **The image.** Placeholder is the platform KL monochrome. The reference is a warm golden-hour
   KLCC shot — the fade is tuned for a bright top-right, so a darker image will need the stops
   re-tuned.

---

## 6. ITERATION HISTORY

| Iter | Surface | Score | Verdict | Notes |
|---|---|---|---|---|
| 00 | Header + hero | — | — | Loop infrastructure created; homepage inspected; planning only |
| 01 | Header + hero | 83 | **LOOP AGAIN** | New 55/45 composition. 0 overflow at 6 widths, guards pass. Judge accepted 5 fixes |
| 02 | Header + hero | 90 | superseded | Ledger removed, hero rebalanced, 44px target, skip link, flat CTA. Never audited — Bryan changed the architecture first |
| 03 | Header + hero | *held* | *structure pass* | **New architecture from Bryan's reference:** diagonal 45/55, "The smarter way to buy property.", maroon fade. 0 overflow at 6 widths, AA throughout. **Image is a placeholder** — score held until the real one lands |
