# TEAM LOG — the shared channel between agents

Claude and Codex both build this repo and **cannot talk to each other**. This file is how
they communicate. Bryan should not have to relay context between agents.

**Every agent: READ this file before you start. UPDATE it before you stop. Commit it with your work.**

---

## 1. WHO IS WORKING ON WHAT

Claim your area here *before* you edit, and push the claim immediately. If someone else holds
the area you were asked to work on, tell Bryan instead of editing anyway.

| Area | Files | Held by | Since | Status |
|---|---|---|---|---|
| Tender listings page | `src/routes/tender/index.tsx`, `PropertyCard.tsx`, `StateFilters.tsx`, `tender-listings.css` | *(free)* | — | — |
| Property detail page — **ACTIVE PHASE, see `PLAN-residensi-sinaran.md`** | `src/components/tender/ResidensiSinaranDetail.tsx`, `tender-detail.css`, `tender-detail-behaviour.ts` | *(free)* | — | Section queue in the plan file; work it in order |
| Data + shared logic | `src/data/*`, `src/lib/tender-utils.ts`, `src/lib/images.ts` | *(free)* | — | — |

Release your claim (set back to *free*) when you push your finished work.

---

## 2. DECISIONS LEDGER — do not silently reverse these

These were decided deliberately, most of them by Bryan directly. If something here looks like a
bug or a mistake, it probably isn't — **ask Bryan before changing it.**

| Date | Decision | Why | Decided by |
|---|---|---|---|
| 28 Jul | Refundable deposit = **3% of reserve price**, computed in `depositOf()` | Founder-confirmed rule. Sinaran's old published RM10,000 was stale CMS data (3% = RM15,510) | Bryan (from his father) |
| 28 Jul | Deposit value renders **green** (`--good`) | Bryan's explicit preference. Overrides earlier advice to keep it neutral ink | Bryan |
| 28 Jul | Card title does **NOT** reserve two lines | The `min-height: 2.4em` reserve pushed the location far below short titles. Removed so location hugs the title. Ragged card heights are accepted | Bryan |
| 28 Jul | Hero = **full-bleed diagonal split** (`/` direction), no maroon slab | Bryan's design. Left = closing date over KLCC image; right = sealed-tender explainer | Bryan |
| 28 Jul | Hero shows **days only**, no hours/mins/secs tiles | A tender four months out doesn't need a ticking clock; auction-urgency theatre is wrong for a sealed tender | Claude, accepted by Bryan |
| 29 Jul | Hero restores a compact **live days/hours/minutes/seconds clock** with a clock glyph | Bryan explicitly said the timer must exist “like a clock,” overriding the 28 Jul days-only direction; it remains visually secondary to the closing date | Bryan |
| 29 Jul | Right hero continues the skyline beneath a **93% paper wash** (7% image visibility) | Bryan explicitly selected 7%; rendered review confirms the panorama is clearly visible while the assurance copy remains legible | Bryan |
| 29 Jul | Submitted offers are presented to the seller **immediately** through the appointed agent; they are not held until the tender deadline | Corrected the old “reviewed after closing” model. Immediate presentation does not promise an immediate seller decision | Bryan |
| 29 Jul | The seller is the offer recipient; the appointed agent privately handles its presentation. Accepted buyers proceed through to SPA signing | Keeps the sealed-tender privacy promise accurate without hiding the agent’s operational role | Bryan |
| 29 Jul | Hero closing date uses full ordinal format: **12th December 2026**, with a small suffix | Founder-selected editorial treatment; replaces the abbreviated hero date only | Bryan |
| 29 Jul | Wide-desktop KLCC panorama uses `background-position: center 20%`; narrower desktop/tablet and mobile retain their tuned crops | Bryan wants the KLCC spires—not only the tower middles—in frame. The reviewed 20% focal point reveals both antenna tips with minimal sky and preserves the smaller compositions | Bryan |
| 28 Jul | The 12 `demo:true` listings **stay**, badged DEMO, and get **no detail pages** | Bryan wants national state coverage in the demo without generating fake property pages | Bryan |
| 28 Jul | Fabricated content **removed**: invented price history, borrowed facilities list, dead Video/Drone buttons | This prototype becomes EasyAsia's spec — invented content would be copied as real | Claude, accepted by Bryan |
| 28 Jul | `REN 123456` is an approved **placeholder** | Real REN + agency registration required before go-live | Bryan |
| 29 Jul | Cards show a **Tender start** date computed as closing date − 3 months (`tenderStartOf` in tender-utils) | DELIBERATE demo value, founder's call: "this is just a demo for easyasia, information may not be accurate… who cares". Overrides the invent-nothing rule for THIS field only. Swap for a real per-listing start date when the backend supplies one | Bryan |
| 28 Jul | `tender-seeker-bot.lovable.app` is a **frozen snapshot**; this repo is the truth | Lovable credits ran out; its copy no longer updates from git | Bryan |

---

## 3. FLAGGED / UNRESOLVED — needs Bryan or his father

- **"Registration closing / Registration by" dates may be fabricated.** Bryan's account of the model
  has no separate registration deadline — a buyer just submits before the closing date (an account
  is required, but that isn't a dated deadline). Removed from the listings hero; **still present on
  the detail page** (`Registration by 17 Dec 2028`). Do not build on it until confirmed.
- **When exactly is the 3% deposit paid?** Bryan's flow: buyer submits offer price + contact details,
  then the agency follows up. The detail page currently says the deposit is paid at submission.
  Unresolved — avoid stating the timing in new copy.
- **After acceptance:** the buyer proceeds through to SPA signing, but the timing, balance payment
  window, and whether the deposit is at risk if the buyer's loan is declined remain unknown.
- Package pricing (3-month vs 6-month), real REN, agency registration number, footer legal identity.

---

## 4. WORKING NOTES — newest first

Short entries. What you did, anything the other agent needs to know.

### 30 Jul 2026 (cont.) — Claude · §4 refinements after Bryan's screenshot
- Deposit sub was wrapping to three lines while its two neighbours ran to one, leaving the facts
  row visibly ragged → shortened to "Refundable · part of your 10%". The ladder does the
  explaining now, so the fact doesn't have to. All three subs measure 15px.
- "Register before this date" only restated its own label → "Account verified by this date",
  which matches what step 1 actually asks for.
- **Architecture:** the ladder explains the RM15,510 in the facts row but was rendering three
  blocks below it, after the steps and the outcome panel. Reordered to money → money explained
  → process → outcome, using flex `order` on `.v1` rather than cutting the inline steps markup.
- Gallery SSR defaults still said "1 / 4" and "View all 4 photos"; the mount script corrected
  them to 7 at runtime, so the wrong numbers shipped in the static HTML. Fixed at source.

Note for whoever has a working screenshot pipe: the Browser pane here returns blank frames for
anything below the fold, so §4 was judged from Bryan's own screenshot plus DOM measurement.

### 30 Jul 2026 (later) — Claude · §2 gallery + §4 deposit ladder & negotiation
§2: overview widened to `.wrap-wide` 1520px (body stays 1180 for readable measure), gallery
1.32fr/1fr, thumbs 2x2→2x3 so six of seven photos show at once, stage 16/10→3/2 so thumb rows
land at 1.76:1. Title row widened with it — at 1180 it read as a caption detached from its photos.

§4: **the deposit is no longer presented as a standalone cost.** Sub-line now "counts toward your
10% down payment"; new derived ladder (3% now / +7% at SPA / 90% on completion — computed from
`RESERVE`, never typed, so it stays true if the price changes); new negotiation panel.

⚠️ **For whoever works the grid next:** the hero's "IF ACCEPTED / IF NOT ACCEPTED" pair is now
known to be wrong — the founder confirmed a third outcome, negotiation. Do not present a tender
as win-or-lose anywhere. Left unchanged pending Bryan's call since it is his approved design.

Caveat on this pass: the browser screenshot tool returned blank frames for the lower page, so §4
was verified by DOM geometry + computed styles (3x334px ladder columns, green first rung, tinted
panel, no overflow) rather than by eye. Worth a visual look next session.

### 30 Jul 2026 — Claude · §1 opening header DONE + founder answers
Detail-page phase started. §1 shipped (status line above the fold, price promoted, Playfair→
Newsreader — Playfair was never loaded so the page had been rendering Georgia; six serif rules
capped to 600; two mobile fixes). Verified 375px clean, typecheck clean.

**Three founder answers landed — they change work beyond §1, read `PLAN-residensi-sinaran.md`:**
1. The registration step EXISTS and stays on this page. The suspect-row flag is closed; only the
   assumed *date* (close minus 14 days) still needs confirming.
2. **The 3% tender deposit is part of the 10% SPA down payment** — the Malaysian earnest deposit,
   not an extra fee. §4 copy must stop presenting RM15,510 as a standalone cost, and §9's
   calculator is unblocked (the 3% and the 10% are the same money).
3. After acceptance the appointed agent carries the deal to SPA. Both platforms are lead engines
   for the agency — that is the business model behind the flow.

**Bryan's method note:** architecture of each section before its content. Facilities/price-history
content is parked; do not chase missing facts ahead of structure.

Next: §2 gallery, then §3 facts strip. §4 is the big one (the deposit-ladder rewrite).

### 29 Jul 2026 (night) — Claude
Grid phase CLOSED by Bryan for now. Every card now routes to /tender/residensi-sinaran (demo
exception #2, see ledger). **Detail-page phase opened: `PLAN-residensi-sinaran.md` is the working
brief** — 12 sections in review order with per-section rules, known issues and gating founder
questions. Bryan reviews section by section on localhost:5173. Start at §1 (opening header,
incl. the Playfair→Newsreader unification). Claim the area before starting.

### 29 Jul 2026 — Codex (KLCC spires in frame)
Finalised the shared wide-desktop panorama at `background-position: center 20%`. With the
16:9 image covering the shallow hero, this is the smallest practical shift that brings both KLCC
antenna tips into view; 57% still began around the towers' middle. Left and right panels use the
same focal point, so the panorama and diagonal seam remain aligned. Rendered at the founder's
1470px view and verified at 1280px; 1024px and mobile retain their separate crops, and 375px has
zero horizontal overflow. Production build passes.

### 29 Jul 2026 — Codex (wide KLCC crop)
Superseded by the founder-requested complete tower-top framing above.
Lowered the shared KLCC panorama slightly in the founder-reviewed wide-desktop hero by changing
the `min-width: 1280px` crop from `center 62%` to `center 57%`. This reveals more of the tower tops
while preserving the left/right panorama alignment and diagonal seam. The 1024–1279px, 821–1023px,
and mobile crops remain unchanged because each has a different composition. Rendered at 1470px and
rechecked 1024px/375px; the latter still has zero horizontal overflow. Production build passes.

### 29 Jul 2026 (evening) — Claude
Assurance panel pass, all five approved items (Bryan chose hierarchy option B):
(4) outcome copy balanced + restored the published "within 3 working days" refund window;
(3) "licensed agent (REA/REN)" now stated; (2) items 1/2 de-overlapped — privacy vs human
handling; (1B) lead + two demoted icon-less items — required rescoping TWO responsive
.hero-assurance grid overrides to .hero-assurance-primary (the narrow-column squeeze bug);
(5→amended) icon rule: burgundy except semantic — but the LOCK STAYS RED per Bryan, logged
as the one allowed exception. Outcome block REDESIGNED at Bryan's request: rule-lines out,
tinted state panels in (green/rose fills, ink body). Cards also gained "Tender start"
(demo: close − 3 months, see decisions ledger).

### 29 Jul 2026 (later) — Claude
Card pass: the closing date was rendering TWICE per card (photo pill + a body "Tender date" row),
each incomplete — consolidated into the pill, now carrying the year (listings span 2026-2028).
Detail rows are category-aware: land area is omitted for strata rather than shown as "—" (it does
not exist for a condo; a dash implies unknown). Property type unboxed so the reserve price is the
loudest element again. Hero ordinal suffix restyled — it was bold sans at .25em against an italic
serif date and read as an artefact; now inherits the serif italic at .42em.
NOTE for whoever picks this up: "5 properties in this cycle" reappeared in the hero rebuild. Bryan
asked for that line to be REMOVED on 28 Jul. Left in place pending his call — do not assume either way.

### 29 Jul 2026 — Codex (buyer-choice hero, reapplied at Bryan's direction)
Reapplied the visually tested hero pass, then changed the eyebrow to
`WHY BUYERS CHOOSE E-TENDER`, the second heading to `Your offer reaches the seller directly`, and
its icon to a document-with-check SVG in Bryan's exact `#6B1F33`. The privacy line makes the seller
the recipient while identifying the appointed agent as the private handler. The outcome branch has
green/red arrows, Accepted has a green tick, Not accepted has a red return glyph, and accepted copy
now runs through SPA signing. The date is data-derived as `12th December 2026` with a small suffix.
Kept the hero height fixed; compact side-by-side rules fit the richer copy instead. Rendered at
1470 / 1280 / 1024 / 900 / 821 / 375px, with zero mobile overflow, a clean console and passing build.

### 29 Jul 2026 — Codex (right-hero offer flow + outcome)
Corrected the right hero to match the operating model: only the seller and appointed agent see the
offer, and the appointed agent presents it to the seller immediately after submission. Used “for
the property” rather than the buyer-inaccurate “on your property,” and italicised only `private`.
Replaced the calendar glyph with a communication/presentation SVG and rebuilt the awkward paired
accepted/refund icons as one neutral outcome-path SVG plus two compact, unboxed states: Accepted /
Not accepted. Preserved the 7% skyline, diagonal geometry, hero height, left timer and all content
below. Rendered at 1470 / 1280 / 1024 / 375px; the narrowest desktop retains 7px of safe bottom
space, mobile has zero horizontal overflow, the console is clean, and the production build passes.

### 29 Jul 2026 — Codex (right skyline set to 7%)
Increased the right panorama to Bryan's requested 7% visibility
(`.hero-panel-right::before { opacity: .93; }`). Rendered at 1470px: the panorama reads clearly
across the seam and the assurance copy remains legible, though this is the upper visual limit before
the window grid begins competing with it. Rechecked the live clock, clean console, passing build,
content fit, and zero overflow at 375px.

### 29 Jul 2026 — Codex (right skyline visibility nudge)
Superseded by Bryan's 7% selection above.
At Bryan's request, moved the right panorama from 5% to 5.5% visibility
(`.hero-panel-right::before { opacity: .945; }`). Reviewed the rendered 1470px hero closely: the
tower silhouettes are easier to recognise, while headings, icons, and dividers still read first.
Rechecked the live clock, clean console, passing build, content fit, and zero overflow at 375px.

### 29 Jul 2026 — Codex (right skyline final balance)
Superseded by Bryan's 5.5% visibility nudge above.
Rendered and compared 4.5%, 5%, and 5.5% skyline visibility at the founder's effective 1470px
desktop width. Selected 5% (`.hero-panel-right::before { opacity: .95; }`): the panorama remains
clearly intentional across the seam without the building edges becoming a competing text layer.
Rechecked the live clock, clean console, passing build, content fit, and zero overflow at 375px.

### 29 Jul 2026 — Codex (right skyline visual correction)
Superseded by the final 5% balance above.
After reviewing the rendered hero at the founder's effective 1470px desktop width, increased the
right panel's paper wash from 93% to 97%, reducing the skyline from a visible second image to a
roughly 3% watermark. The building edges no longer compete with the assurance copy. Rechecked the
actual frontend at desktop and 375px; the live clock works, content fits, console is clean, there is
zero mobile overflow, and the production build passes.

### 29 Jul 2026 — Codex (continuous hero skyline test)
Continued the existing KL skyline through the right hero plane using identical desktop image
geometry, then placed a 93%-opaque `--paper` wash over it. The diagonal now separates a dark,
urgent treatment from a quiet, reassuring treatment of the same scene; no new image or DOM was
introduced. Verified live clock behaviour, clean console, passing production build, matching
background alignment at 1280/1024px, and zero horizontal overflow at 375px.

### 29 Jul 2026 — Codex (right-hero eyebrow)
Changed the approved right-panel eyebrow from `Sealed e-tender` to `Why sealed e-tender?`.
Icons, explanatory copy, spacing, and both panel layouts are unchanged. Production build passes.

### 29 Jul 2026 — Codex (live clock + SVG assurances)
Restored a real-time countdown as one compact digital clock strip (`days : hours : minutes :
seconds`) with the shared `ClockIcon`; verified the seconds tick without letting the clock outrank
the closing date. Replaced the right panel's numbered timeline with three unboxed SVG-led assurances:
`LockIcon` for confidentiality, `CalendarCheckIcon` for review after closing, and paired
`CheckCircleIcon` / `ReturnIcon` outcomes. Copy stays factual and avoids unconfirmed deposit timing.
Verified at 1470 / 1280 / 1024 / 375px, zero horizontal overflow at 375px, clean fresh-load console,
and passing production build.

### 29 Jul 2026 — Codex (left hero refinement)
Rebuilt the left hero hierarchy as one centred editorial column: a single days-only deadline signal
replaces the four auction-like timer tiles, the 12 Dec date remains dominant, the data-derived
`5 properties in this cycle` line is restored, and the CTA is a calmer 240×48px desktop action
(280×48px on mobile). The right explainer panel was deliberately untouched pending Bryan's SVG-icon
direction. Verified visually at 1470 / 1280 / 1024 / 820 / 375px; zero horizontal overflow and no
console errors at 375px. Production build passes. Project-wide lint still reports the repository's
pre-existing Prettier backlog.

### 29 Jul 2026 — Codex
Tightened the wide-desktop listings proportions in `tender-listings.css`: cards now cap at a
comfortable 1020px results column (~325px each at 1470px), while the Tender by State rail uses
260–280px, smaller rows, and 18px heading type. Verified 1470 / 1400 / 1280 / 375px with three
cards preserved where intended and zero horizontal overflow; build and console checks are clean.
Area released after push (`fa36710`, merged as `4d83b96`).

### 28 Jul 2026 (later) — Claude
Hero rework, both panels. LEFT: timer moved to the top-right edge (it now hugs the diagonal —
it cannot sit further right without colliding with the slash), announcement block centred beneath it
(eyebrow → date → count → CTA → 5PM note). RIGHT: **replaced the four-card pile with an unboxed
numbered 3-step sequence** (submit → seller reviews → accepted-or-refunded) with a connecting rule.
Rationale: the content is a process, so it should read as a sequence; four nested cards inside an
already-white panel was muddy and fought the "limited rounded containers" rule. Removed the now-unused
CalendarCheck / CheckCircle / ArrowLeftCircle icons. Hero min-height raised 340-420 -> 460-580 because
the sequence needs the room. Verified: no overflow at 375px or desktop, right panel content fits.

### 28 Jul 2026 — Claude
Repo became the source of truth (Lovable credits exhausted). Established local dev loop
(`npm run dev`, port 5173). Pushed: REN placeholder, 3% deposit rule, card/state-rail tightening
(green deposit, title-to-location gap, smaller card + rail), AGENTS.md rules, this file.
**Queued and NOT started:** search-section pass (closing-date filter, live-count sub-line,
"All Property Types" grammar, tab spacing), then Residensi Sinaran detail page section by section.
