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
| Tender listings page | `src/routes/tender/index.tsx`, `PropertyCard.tsx`, `StateFilters.tsx`, `tender-listings.css` | *(free)* | — | Expanded property filters shipped below Search |
| Property detail page — **ACTIVE PHASE, see `PLAN-residensi-sinaran.md`** | `src/components/tender/ResidensiSinaranDetail.tsx`, `tender-detail.css`, `tender-detail-behaviour.ts` | *(free)* | — | Baseline inspected at desktop and 375px; awaiting Bryan's next instruction |
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
| 30 Jul | Property filters live in an inline disclosure **directly below Search**: tender closing cycle, reserve-price range, built-up area, land area and tenure. Price moved out of the Sort row; Tender by State remains standalone | Keeps “what qualifies” together in Search and “how results are ordered” in the results toolbar, while retaining TenderProp’s event/cycle framing | Bryan + Codex |

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

### 30 Jul 2026 — Claude · REVERTED my own duplicate; card = one link; toolbar/rail aligned
1. **REVERTED the location-search browse list I added an hour earlier.** It listed states with
   counts — duplicating the "Tender by State" rail on the same screen, item for item, with no
   extra information. I had even noted the overlap in my own write-up and shipped anyway; Bryan
   called it. The data also kills the obvious alternative: **29 distinct areas across 36 records,
   25 holding exactly one property**, so an "areas" list is a column of 1s.
   **Division of labour, do not blur it again: the rail owns BROWSING by geography; the location
   field owns SEARCHING for a named project or town.** Empty focus shows nothing.
   Kept from that pass: `onFocus` (the field genuinely never opened on click — `setTaOpen` only
   fired `onChange`), the no-match message, and a placeholder that now teaches the field's job.
2. **Card is one link, not three.** Photo, title and CTA were three separate `<a>` to the same
   URL — the same destination announced three times to a screen reader, and only three small hit
   areas. Title is now the single link with `.pc-link::after` stretched over the card; photo is a
   `<span>`, CTA is a decorative `<span>` with a card-hover state so it doesn't read as disabled.
   Save button and phone sit at `z-index: 2` and still work.
3. **Toolbar/rail alignment.** The rail card started at the toolbar's top and its border cut
   through the toolbar's bottom rule, while the serif rail heading's baseline missed the count
   text's by ~7px. `.rail-title` is now a header band mirroring `.results-header`, and both
   min-heights come from **one `--head-band` variable on `.main-layout`** so they cannot drift.
   Verified at 1600px: tops both 864, rules both 921.

### 30 Jul 2026 — Codex · Residensi Sinaran baseline inspection
Read the full project rules, decisions ledger and active detail-page plan, then inspected the
component, dedicated CSS and mount-time behaviours without changing page code. Reviewed the
rendered opening, gallery and Tender Information panel at 1440px and 375px: the live timer ticks,
the console is clean, and document `scrollWidth` equals `clientWidth` at 375px. Confirmed the
plan's known mobile issue: the horizontal section nav sits beneath the tall sticky site header
while scrolling. Production build passes; repository-wide lint remains red on the pre-existing
Prettier backlog. Also note that the detail component currently computes its 3% deposit locally
instead of calling `depositOf()`; preserve the correct amount and route a future data refactor
through the shared utility.

### 30 Jul 2026 — Claude · Serviced Apartment rename + location search empty state
1. **"Serviced Residence" → "Serviced Apartment"** (Bryan). Data (2 records) + taxonomy label.
   The taxonomy's `types[]` and both sets in tender-utils **keep the old string as a matcher**, so
   a record arriving with the old spelling (real inventory, EasyAsia's CMS, a stale import) still
   resolves to floor area instead of silently falling through to land area. Filter count held at
   9, which is the proof matching still works.
2. **Location field now opens on click.** ROOT CAUSE: there was no `onFocus` at all — `setTaOpen`
   only fired `onChange`, so clicking the field did nothing and the dropdown existed only while
   typing. Added `onFocus`.
3. **Empty-focus list = inventory disclosure, not "popular searches".** A portal shows popular
   searches because it has 500k listings and the user must narrow down. TenderProp has ~36 across
   a handful of states, so the buyer's problem is the opposite — they do not know if anything
   exists near them. Typing "Cheras", getting silence, and concluding the platform is empty is
   the worst outcome on this page. Empty state now shows **"Where tenders are open now"** + states
   that actually have stock, with counts, busiest first (Selangor 18, KL 4, Johor 1…), capped at 8.
   Typing switches to the existing State/Area/Property matching.
4. **No-match state added** — a dead-silent dropdown reads as a broken site. Now:
   *No tenders match "X". Browse all 36.*
5. ⚠️ Could not eyeball the open dropdown: the browser pane went unresponsive, and programmatic
   `.focus()` races the 120ms `onBlur` timeout so the `show` class reads false from a tool call.
   Handler and data are verified present (`onFocus` on the input's React props, head + 8 rows with
   counts in the DOM). **Next session: click the field for real and confirm it drops down.**

### 30 Jul 2026 — Claude · card facts standardised; my own CSS collision fixed
1. **THREE FIXED SLOTS, no exceptions: Tender start / Land area|Floor area / Tenure.**
   New `areaSlot(x)` in tender-utils picks slot 2 by the property's FORM, not by which field
   happens to be populated — a bungalow buyer buys land, a condo buyer buys floor.
   **Townhouse = Floor area** (Bryan: "townhouse is not land area ya bro"): stacked strata.
   `FLOOR_AREA_TYPES` is deliberately a separate set from `NO_STOREY_PREFIX` even though the
   membership matches today — one is about naming, the other about what is being bought.
   `detailRows()` and `STRATA` deleted.
2. **DEMO FILL (extends exception #3):** the scraped baseline left 13 records with no tenure and
   8 landed records with no land area, so half the cards showed an em dash in a slot that is now
   permanent. Filled with plausible values (tenure alternating Freehold / Leasehold 99 yrs; land
   areas cycled per type). Replace with real data when the agency supplies it. Now 0 of 12 cards
   show a dash.
3. **BUG I CAUSED — read this one.** I had written `.props-grid.list-mode .pc-details` TWICE at
   identical specificity: `margin-top: auto` at line 624 and `margin-top: 16px` at 634. The later
   rule silently won, so the facts stayed pinned to the top and the void Bryan kept seeing never
   went away — which is why my "fixed" claim did not match his screenshot. Merged into one rule.
   `margin-top` now computes to ~96px and the facts row bottom aligns **exactly** with the CTA
   opposite (measured 0px delta). **Lesson: grep the selector before adding a rule for it.**
4. Pill reads "N days left"; the countdown is split into its own `<b class="pc-left">` so only
   the time pressure is coloured. On-dark uses `#FF8578`, not `--red` — the brand red manages
   only ~3.4:1 on the pill's near-black scrim, under AA.
5. PROPERTY TYPE label underlined, offset 3px so it reads as a rule, not a strikethrough.

### 30 Jul 2026 — Claude · property type standardised to label-above-value
My own `flex-wrap: wrap` fix created a hybrid: short types ("Condominium") stayed on the label's
line, long ones ("2-Storey Semi-Detached House") dropped below — so no two cards agreed. Now
`.pc-type` is **always** a flex column, label above value. Three wins at once: every card
identical, the value gets full column width so a type name is never truncated or broken
mid-phrase, and it is the same shape as the TENDER START / BUILT-UP / TENURE rows below it, so
the identity column reads in one pattern. Value scaled 13.5→16px (grid) and 16.5→19.5px (list).

Verified both modes: all stacked, zero clipping, every type on a single line, list cards uniform
at 308px.

⚠️ **Open for next session:** grid cards still vary 614 vs 637px (~23px, one text line). Pre-existing,
not from this change — likely `.pc-loc` wrapping on long "area, state" strings. Worth a look if
Bryan asks about grid consistency; a `min-height` on `.pc-loc` is the likely fix.

### 30 Jul 2026 — Claude · list-card consistency, type scale, phone icon, townhouse
1. **Root cause of "cards aren't consistent":** `detailRows()` filtered slots by
   `Boolean(value)`, so one card rendered "Tender start / Built-up" and the next
   "Tender start / Land area / Built-up" — **2 or 3 slots, three different schemas in one
   list.** Now `.slice(0, 2)` with no filter and an em dash for missing values, which is exactly
   what the `.pc-details` comment in the stylesheet has always claimed ("three permanent
   comparison slots... missing render as an em dash"). Code and comment finally agree.
   Verified: every card 308px tall, every card 3 slots.
2. **Long types were truncating**, not wrapping: `.pc-type` was `nowrap` + `overflow:hidden`, so
   "2-Storey Semi-Detached House" became "2-Storey Semi-Detached H." in the narrow grid card.
   Now wraps. Never truncate a property's own type name — abbreviating to "Semi-D" would have
   patched this one case and still clipped "Commercial Building/Bungalow".
3. **List type scale** (Bryan: bigger left side): title 19.5→25px, location 12.5→14.5,
   type label 9.5→11, type value 13.5→16.5, fact dt 9.5→11, dd 12→15.5. Scoped to list mode
   only — grid stays as approved.
4. **Image** 300→372px wide. NOTE: I first set `min-height: 292px` and the image floor started
   driving card height instead of content; back to 250 and `pc-foot`'s `margin-top:auto` removed,
   which was opening a gap under the money box. `.pc-ident` is now a flex column with the facts
   at `margin-top:auto`, so the identity column fills the card height.
5. **Townhouse loses the storey prefix** (Bryan: "townhouse is fine") — `HIGH_RISE` renamed
   `NO_STOREY_PREFIX` since it now holds a landed type. The name already implies the stacked form.
6. Phone icon added left of the agent number. The icon sits OUTSIDE the underline — only the
   number span carries the rule, because an underlined phone glyph reads as a rendering fault.

### 30 Jul 2026 — Claude · storey-specific property type labels
Bryan: landed stock should read "2-Storey Terrace House", not "Terrace House"; high-rise stays
plain. New `displayType(x)` in `tender-utils.ts` is the single source for the label:
- **High-rise strata and land take no prefix** — Condominium, Serviced Residence, Apartment,
  Flat, SOHO/SOVO/SOFO, and every *Land type. Never "18-Storey Condominium".
- **Landed and commercial-landed take `{n}-Storey `** — terrace, semi-D, townhouse, bungalow,
  villa, factory, shop.
- Two refinements fall out of the same field: **Bungalow → "Bungalow House"**, and
  **Shop → "Shop Lot" at 1 storey, "Shop-Office" at 2+**, which is how the market names them.
- ⚠️ **Display only — filters still match on the raw `propertyType`.** Do not switch any filter
  or taxonomy comparison to `displayType()`, or category counts break.

**DEMO EXCEPTION #3 (logged):** `storeys` is a new optional field on `Tender` and the values are
invented — deterministic cycles of typical Malaysian configurations per type (terrace 2/2/1/2/3,
semi-D 2/2/3/2/2/3, bungalow 2/3/2/2/3, townhouse 3, factory 1/1/2, shop 2) so labels vary
realistically instead of every terrace being identical. Replace with real per-listing storey
counts when the agency supplies them. Same standing as the tender-start-date and route-everything
-to-Sinaran exceptions.

Verified across all 36 records: 1/2/3-Storey Terrace House, 2/3-Storey Semi-Detached House,
2/3-Storey Bungalow House, 3-Storey Townhouse, 1/2-Storey Factory, 2-Storey Shop-Office,
plain Condominium / Serviced Residence / Agricultural+Commercial+Residential Land, and the one
blank record still falls through to "Not specified". Zero label clipping on any card.

### 30 Jul 2026 — Claude · filter popup, search-bar alignment, list card, copy
**Codex — credit where due, your filter LOGIC is kept wholesale and it is good:** closing-cycle
filter (the tender-native dimension), reserve min/max with cross-disabled bounds, per-option live
counts that disable zero-result choices, tenure/built-up/land ranges, aria-live match count,
active-filter badge. I changed only presentation, plus one real bug:

1. **Inline panel → modal.** Bryan asked for "the filter box pop up" like iProperty; the panel
   was an inline region that shoved the page down. Now a centred `role="dialog"` + scrim, Escape
   and backdrop close, scrollable body, sticky footer, full-screen sheet under 620px. Palette is
   TenderProp's — iProperty's navy/black chrome is *their* brand, not a spec.
   Footer's primary button reads **"Show N properties"** rather than "Apply": it names the outcome.
2. **BUG (list card).** `.props-grid.list-mode .pc-details` set `grid-template-columns` — which
   does NOT override the base rule's `grid-auto-flow: column`. So the three facts stayed in
   columns inside the ~250px rail and clipped to "1", "9.", "F". Fixed by moving `.pc-details`
   into `.pc-ident` (the wide column) in the TSX — safe for grid mode, where `.pc-ident`/`.pc-side`
   are `display:contents` and position comes from `order`, not DOM parent. Facts now 200/190/190px,
   no clipping; the rail keeps money + agent + CTA (the decision, not the description).
3. **Search bar.** `.search-actions` used `padding-top: 18px` to guess the label height while a
   stacked Search+Filters came to ~90px against a 66px label+input — so Search floated above the
   label line. Now one row; all four controls share a baseline. Also `All Property Type` →
   `Types` in `tender-taxonomy.ts`.
4. Hero cycle-count line removed (Bryan, second time — do not reinstate). Privacy and
   seller-presentation copy replaced with Bryan's own wording.

### 30 Jul 2026 — Codex · Tender listing property filters
- Studied the current iProperty / PropertyGuru / EdgeProp filtering patterns, then kept only
  buyer-relevant fields backed by this inventory. Omitted catalogue clutter such as furnishing,
  amenities, listing age, verification flags, bathrooms and car parks.
- Added a secondary outlined `Filters` control directly beneath the red Search action. It expands
  inside the existing search card—no modal or competing CTA—and updates the cards, counts, category
  facets, chips and active-count badge live.
- Filters: exact data-derived tender closing cycles; min/max reserve price; built-up presets; land
  area presets (mixed sqft/acre values are normalised for matching); and Freehold/Leasehold.
  `Tender by State` stays its own rail/mobile sheet, and Sort/Grid/List remain results controls.
- Removed the old Price popover from the Sort row so there is one clear property-filtering surface.
  Search collapses the disclosure and takes the buyer to the results.
- Rendered review at 1440px and 375px: balanced hierarchy, equal-width Search/Filters actions on
  mobile, 0px horizontal overflow and no console warnings/errors. Tested the 5-property closing
  cycle, built-up range and 1-acre+ land filters; build passes and targeted non-format lint is clean.

### 30 Jul 2026 — Claude · lock spans the copy block; assurance copy = Bryan's wording
- Assurance line is now Bryan's: *"Every e-tender offer is presented directly to the seller for
  fair and confidential consideration."* Passive voice removes the need to name who presents the
  offer at all — the cleanest resolution of the VOICE RULE rather than a workaround for it.
- **Lock now spans the full height of the copy beside it** (Bryan: "as big until it reaches
  'sealed until the tender closes'"). Two parts, and the first is the non-obvious one:
  1. `LockIcon`'s viewBox was `0 0 24 24` while the glyph only occupied y 3..21 — so ~25% of the
     box was empty and scaling the box never made the *lock* reach anything. Cropped to
     `3.2 2.2 17.6 19.6` (glyph bounds + half-stroke). Hero-only icon, safe to crop.
  2. The icon cell is `align-self: stretch` with the svg at 100%/100%, so it re-measures itself
     against the copy at every breakpoint — no magic per-breakpoint pixel values to maintain.
     `--hero-lock-box` now only sets the column WIDTH (66 base / 64 / 58 / 62 mobile);
     `--hero-lock` is retired.
  **Then scaled back** — full copy height was too big (Bryan: "ok maybe its too big haha").
  Now top-aligned at an explicit height: 52 base / 48 / 45 / 48 mobile, landing at ~61-67% of
  the copy block (title + first line) and 13% of row width on mobile. The stretch trick is gone,
  but the viewBox crop is what makes these numbers honest — the value now equals the visible
  lock height instead of a box that was ~25% padding. 0px overflow at 1280 and 375.

### 30 Jul 2026 (late) — Claude · voice rule + hero polish
**VOICE RULE ADDED TO AGENTS.md — read it.** TenderProp speaks as a platform in all marketing
copy; the licensed-agency/REN disclosure lives only in the footer, About, FAQ, agent block and
the apply point. Bryan: *"we cant put our licensed agent man... this must be like a startup."*
Swept 8 files: grid hero, homepage lede + frame, root + detail meta descriptions, sell, services,
about eyebrow, and the detail page's negotiation + step-3 copy.

Hero polish, all verified rendered at 1280 and 375:
- right panel wash .93 → **.84** via `--hero-right-wash`; the skyline now actually continues
  across the seam instead of being flattened to near-paper.
- lock icon 34px → **46px** base, now driven by `--hero-lock` / `--hero-lock-box` and scaled per
  breakpoint (40px at 1280–1375, 42px at 821–1279 and mobile) so it tracks `.hero-seal-title`
  instead of dwarfing it where the title drops to 18px.
- **"NOT ACCEPTED" was wrapping to two lines** while "ACCEPTED" stayed on one — pre-existing, not
  from the lock change, but they are a matched pair. Fixed with `white-space: nowrap` + tracking
  .07em → .05em. Both labels now 14px tall at 375 and 1280.

### 30 Jul 2026 (night) — Claude · house framed + §4 timer + forward roadmap
1. **Site frame shipped**: 5-item nav (E-Tender / Owner Auction / Sell / Services / About,
   router-driven active state), real homepage at `/` (cycle line + two product doors + frames),
   framed pages at /owner-auction /sell /services /about /member via `PageShell`, /buy→/tender
   and /rent→/owner-auction redirects, footer rewired (real address, next-cycle line).
   CORRECTION from Bryan: it is buy and RENT that die — SELL STAYS (owners pay us).
2. **§4 gets its timer** (Bryan asked): live D:HH:MM:SS in the tender rail, same segmented
   language as the grid hero, 1s tick, SSR-safe (null till mount). Serif date stays the
   headline; timer is the pulse under it.
3. **Recovered facts applied to §4 copy**: deposit is paid in the member account (ladder rung 1
   + step 2), results within 5 working days (step 3).
4. ⚠️ Browser pane collapsed to width 0 mid-session — timer verified ticking via DOM (values
   advance 1s apart, fits inside rail at last real measurement); no post-change eyeball. First
   agent with a working screenshot: look at /tender/residensi-sinaran §4 rail + the new
   homepage, and check 375px on both.
5. `PLAN-roadmap.md` added — the forward strategy beyond the current build. Read it.

### 30 Jul 2026 — DECISION: the portal is out. Two products only.
Bryan: *"there will be no more buy and sell anymore, only tender and owner auction."*
`/buy` and `/rent` are retired (redirect to E-Tender, don't 404). Nav goes to five items:
E-Tender · Owner Auction · List Your Property · Services · About. `PLAN-site-architecture.md`
rewritten around this — read §1 for the consequence that matters: inventory drops to ~5 tender
+ 2 auction records, so **every page must lead with the cycle and its deadline. A handful of
properties is an event; a handful presented as a catalogue is embarrassing.**

Note the seller door survives — owners are the paying side, so /sell is renamed and narrowed to
two routes, not deleted.

**Two blocked items closed from a second read of the live site** (see §8 of the site plan):
results are announced **within 5 working days** of closing, and the **deposit is paid in the
member account after the tender form is submitted** — not at the moment of offering. §4's copy
must not imply payment on submission. Also: membership is mandatory before tendering, and the
Owner Auction deposit is 3% of *bidding* price where tender is 3% of *reserve*.

**Correction to my earlier read:** the four Services pages are not a grab-bag. Every one carries
"special privilege for member" + "Become a Member" + the same 4-step funnel, and membership is
step 1 of tendering. Services → membership → tender is a real funnel. Build it as one page.

More live wounds found: a **fourth lorem ipsum** on /how-to-bid under "How To Bid?", and
/contact-us publishes **info@newproject1u.com** — the other company's domain.

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
