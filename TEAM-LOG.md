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
| Tender listings page | `src/routes/tender/index.tsx`, `PropertyCard.tsx`, `StateFilters.tsx`, `tender-listings.css` | Codex | 29 Jul 2026 | Iterating the right skyline to a visible but quiet balance |
| Property detail page | `src/components/tender/ResidensiSinaranDetail.tsx`, `tender-detail.css`, `tender-detail-behaviour.ts` | *(free)* | — | — |
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
| 28 Jul | The 12 `demo:true` listings **stay**, badged DEMO, and get **no detail pages** | Bryan wants national state coverage in the demo without generating fake property pages | Bryan |
| 28 Jul | Fabricated content **removed**: invented price history, borrowed facilities list, dead Video/Drone buttons | This prototype becomes EasyAsia's spec — invented content would be copied as real | Claude, accepted by Bryan |
| 28 Jul | `REN 123456` is an approved **placeholder** | Real REN + agency registration required before go-live | Bryan |
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
- **After acceptance:** SPA timeline, balance payment window, and whether the deposit is at risk if
  the buyer's loan is declined. Unknown.
- Package pricing (3-month vs 6-month), real REN, agency registration number, footer legal identity.

---

## 4. WORKING NOTES — newest first

Short entries. What you did, anything the other agent needs to know.

### 29 Jul 2026 — Codex (right skyline visual correction)
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
