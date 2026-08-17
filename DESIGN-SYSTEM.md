# TENDERPROP DESIGN SYSTEM — the single source for how this site looks

Created 30 Jul 2026 so nobody has to re-derive these and Bryan does not have to repeat himself.
**This file is canon for values and patterns.** `AGENTS.md` holds the two behavioural rules
(THE CHANGE SOP, THE DESIGN SOP); this holds the system they operate on. Keep it current — when a
design decision is made, it lands here in the same commit.

Defined in `src/styles/tender-detail.css` `:root` and mirrored by `tender-listings.css`.

---

## 1. Tokens — never hardcode a value that has a token

| Token | Value | Use |
|---|---|---|
| `--paper` | `#FAF5F0` | page ground only — **not** a section band (see §3) |
| `--card` | `#FFFFFF` | cards; every **odd** section band |
| `--band-alt` | `#F6EEE7` | every **even** section band — see §3 for why this exact value |
| `--paper-deep` | `#F1E8DE` | inset panels inside white cards |
| `--ink` | `#17130F` | body + all primary values |
| `--muted` | `#75695E` | labels, secondary copy, captions |
| `--line` | `#DED2C4` | borders. Hairlines inside a component use `color-mix(in srgb, var(--line) 62%, transparent)` |
| `--red` | `#C8281C` | **actions only.** Every primary button. Hover `#A81F15` |
| `--burgundy` | `#571C2E` | editorial accent — section-title spans, links, glyphs, secondary buttons. Hover `#411322` |
| `--burgundy-ink` | `#F5E4D8` | text on burgundy |
| `--good` | `#2E6B3F` | refundable deposit, "open for tender", accepted outcome |
| `--warn` | `#9A6A00` | reserved; currently unused on the detail page by choice |

**One accent per zone.** Red means *click this*. Burgundy means *this matters*. If both appear in
one block, one of them is wrong.

## 2. Type

- `--sans`: **Inter** 400–800. All UI, labels, body.
- `--serif`: **Newsreader** 400–**700**. Headings, money, dates, the `?` glyph.
- ⛔ **Newsreader only loads 400–700.** Asking for 800/900 makes the browser synthesise a fake
  bold that looks muddy. Cap at 700; 600 is the house weight.
- ⛔ **Playfair Display is NOT loaded** and never was. It sat in `--serif` for weeks while the page
  silently rendered Georgia. Do not reintroduce a face without adding it to `__root.tsx`.
- Labels: `11px / 700 / .07em / uppercase / --muted`.
- Values: `14.5px / 600 / --ink`, `font-variant-numeric: tabular-nums` for anything numeric.
- **If everything is bold, nothing is emphasised.** Across a long list, 600 beats 700.

## 3. Section flow — three tokens govern the whole page

| Token | Value | Governs |
|---|---|---|
| `--sec-pad` | `clamp(40px, 4vw, 56px)` | per side → **80–112px between sections** |
| `--sec-title-size` | `clamp(1.75rem, 2.4vw, 2.25rem)` | every section heading → 36px desktop |
| `--sec-title-gap` | `26px` | section heading → its first content |

- Change the page's rhythm by editing a token. **Never** by adding margin to one section.
- **Backgrounds alternate positionally:** `nth-of-type(even)` = `--paper-deep`, `(odd)` = `--card`.
  `--band-bg` travels with it. Inserting or removing a section re-solves the chain.
  `.band-card` / `.band-paper` exist only as deliberate opt-outs.
- ⛔ **`--band-alt` (#F6EEE7) is a derived value — do not nudge it by eye.** Measured against
  white: `--paper` = **1.083** (Bryan: invisible — below ~1.1 the eye cannot resolve an edge, and
  `--paper` *is* the page ground so it was never a band at all), `--paper-deep` = **1.211**
  (Bryan: too deep). `#F6EEE7` is the exact luminance midpoint at **1.147**.
- ⛔ **An uninterrupted full-width white card defeats the band.** The old all-white `.v1` covered
  58% of `#tender`, so that section read white while `#details` also read white. Sections normally
  sit directly on their band. The standard Tender Information dossier is the deliberate exception:
  it is itself a full-bleed, two-tone band — dark editorial image for the left 40%, white decision
  plane for the right 60% — with no capped outer card or surrounding paper gutter.
- When auditing this, measure what a section **reads as**, not what its `background` is — and use
  area coverage, not width. A 0.69-width card slipped under a 0.7 width threshold and produced a
  false "no collisions" result.
- One title treatment, shared by `.sec-title` and `.v1-top h3`.

## 3b. Page width — the listings page has ONE content width

Above 1400px, `--content-max: 1328px` is shared by the search card, the category tabs and the
results+rail block (1020 results + 28 gap + 280 rail = 1328). **All four left edges land on the
same x, and the search card's right edge meets the rail's.**

⛔ The fault this fixed: the search band and the results+rail block were both *centred* but at
different widths — search card 1062px, results+rail 1328px — so the toolbar started **133px** left
of the search box above it. Both were "centred", which is why it survived review. **A filter
control that does not span the width of what it filters reads as broken.**

When auditing this, measure the **card**, not the field row inside it: `.search-bar` sits 19px
inside `.search-form` as the card's own padding, which looks like a misalignment and is not one.

## 3c. Vocabulary — the product is **E-Tender**, always

Bryan, 30 Jul: *"all the word tender, must be e-tender."* Every user-facing reference to the method
reads **E-Tender** (title case in headings, labels and CTAs) or **e-tender** (mid-sentence). There
is no bare "tender" in rendered copy anywhere: verified 0 across all 8 pages.

✅ **The 6 Aug "Tender" nav exception is REVOKED** (Bryan, same day). The rule is
unconditional again — every front-facing reference reads E-Tender, the top-nav label
included, and H11 is back to plain "zero bare tender in rendered copy". The `/tender`
ROUTE is unaffected; it never was a copy question.

**Never touched by this rule** — these are code, not copy, and prefixing them breaks the build:
`TenderProp` (the brand), the `Tender` type, `TENDERS`, `tenderMethod` / `tenderFormat`,
`tenderStartOf` / `tenderId`, the `/tender` routes, `#tender` ids, `.hero-tender` and other class
names, and `tender-detail.css` / `tender-utils.ts` filenames.

Watch for two failure modes a blind find-replace creates: **`E-TenderProp`** and **`E-E-Tender`**.
Assert both are zero after any sweep.

## 3d. Countdowns — DAYS LEAD, always

**FOUNDER GUIDANCE (Bryan's father, 30 Jul):** *what a buyer really cares about is how many days
are left, not the timer.* Both the `/tender` hero and the E-Tender Information dossier now show
**one figure — the day count** — with the closing date beneath it.

⛔ Do not restore a D/H/M/S strip. A ticking seconds column beside a three-digit day count is
theatre: it advertises that nothing is happening. Codex and I flagged it independently before the
founder settled it.

**The one exception, and it matters:** inside the final 24 hours `cd.d < 1`, so "0 days left" would
say nothing — there the display switches to `{h}h {mm}m` with the label "left today". Days when
days remain; hours only when hours are all that remain.

The `/tender` hero carries **both readings of the same deadline, ranked**: the big day count is
the headline (`.hero-timer-days`, 46–74px), and the familiar **D/H/M/S strip** sits in the top
right of the burgundy panel at 19px (`.hero-clock` reusing `.hero-timer-cells`). Same markup as
the strip the hero used to lead with — just demoted, never replaced by something else.
It is `aria-hidden`: the day count's label already announces the deadline, and a second live
region reading seconds is hostile to a screen reader. **Keep it in flow with
`align-self: flex-end`, never absolutely positioned** — the panel's `padding-right` already tracks
the diagonal, so the content edge clears the seam for free. An absolute version had to re-derive
the seam from `--hero-top-split` and landed beside the day count instead of in the corner.
To sit it closer to the seam, pull with a negative margin **derived from the split tokens**:
`margin-right: calc(-1 * (var(--hero-top-split) - var(--hero-bot-split)) + 2%)`. The panel's
padding is sized for the diagonal at the BOTTOM edge, so ~14% of width goes spare at the top;
that expression reclaims it minus a safety gap and keeps working if the angle changes.
Zero the margin below 860px, where the diagonal collapses.

### 3e. Deadline maths — `tender-utils` owns it, nothing else computes days

Every surface that shows a deadline calls `remainingMs` / `daysLeft` / `isFinalDay` from
`src/lib/tender-utils.ts`. **Never divide by 86 400 000 in a component.** It was done six ways
and they disagreed on two axes at once:

- **Rounding.** `ceil` on the cards and the detail header, `floor` on both big countdowns — so
  Residensi Sinaran read *"885 days left"* in the page header and *"884 DAYS LEFT"* in the panel
  directly beneath it, off the same variable in the same function.
- **Timezone.** Some call sites parsed `"…T23:59:59"` with **no offset**, which resolves to the
  *host's* local time. On a UTC server that is the deadline moved 8 hours — the SSR render and
  the browser then disagree. **The `+08:00` is not optional**; `closeAtMs()` supplies it.

`daysLeft` is **ceil** on purpose: with 884 days and 22 hours to run a buyer has 885 days
including today, and the final day reads "1 day left" rather than "0".
`isFinalDay` is derived from the **remaining milliseconds, never from the rounded day count** —
`days < 1` inverts silently the moment the rounding convention changes.

## 4. Established patterns — reuse before inventing

- **Homepage opening**: one seamless Malaysian property panorama as a high-priority `<img>`, under
  one flat exposure wash (24% desktop / 28% mobile). The centred Newsreader thesis owns the quiet
  upper sky: “Find a property.” above “Choose how you *buy* and *sell* it.” The first line leads at
  72–104px desktop; the second steps down to 46–67px. `buy` is italic brass, `sell` italic wine
  (`#9F3C50` for readable hero type), and everything else is warm white. No eyebrow, search box,
  supporting paragraph, decorative dots, headline underline or text shadow.

  Beneath the thesis, E-Tender and Owner Auction share **one compact diagonal event instrument**,
  never two detached cards. Desktop is 286px tall: burgundy-tinted KL skyline at left, dark-tinted
  landed home at right, and one fine brass seam. Each half carries an underlined method marker in
  its outer top corner, the matching “closes/starts in” label, a day-led live H/M/S clock, full
  italic event date and one outlined listings action; Owner Auction alone adds its brass event
  time. The registration-closing sentence and homepage search stay out. At 650px the instrument
  stacks across a shallow diagonal seam at roughly 212px per half, keeps Owner Auction's marker at
  the upper-right, and fits both actions by the bottom of a 375×812 first viewport with zero
  horizontal overflow. The clocks derive from `tender-utils`; their ticking visual is
  `aria-hidden` and a non-live screen-reader reading carries the same duration.
  one flat exposure wash (18% desktop / 24% mobile), with **only** the centred Newsreader thesis:
  “Find a property.” above “Choose how you *buy* and *sell* it.” The first line leads at
  72–104px desktop; the second steps down to 46–67px. `buy` is italic brass, `sell` italic wine,
  and everything else is warm white. No eyebrow, finder, selector, card, countdown, action,
  decoration, underline or text shadow belongs in this section. Raise the lockup into the quiet
  sky rather than compensating for the busy skyline with heavier effects. On phones the first
  sentence remains one line while the second may wrap responsively.
- **Homepage section 2 — the showcase band** (14 Aug): a CINEMATIC illustration, never a tool.
  The editorial column remains unchanged. The right side is a premium static Peninsular Malaysia
  plate built from pinned Natural Earth 1:10m country and state-boundary vectors: warm limestone
  top, shallow layered extrusion, restrained brass rim, engraved state lines and one connected soft
  shadow, viewed at roughly 30° elevation. It is SVG/CSS only — no raster render, WebGL or map embed
  — and remains crisp across desktop sizes. Its final desktop camera width is `min(101%, 760px)`.
  Three coordinate-projected staged properties sit at the real George Town / Kuala Lumpur / Johor
  Bahru city points. Geography owns the pigment and 4.4px terminal; composition owns the placard.
  Placards paint at roughly 88% of the rejected UI-box baseline and use desktop offsets
  `+48 / -6 / -112px` with lifts `32 / 46 / 44px`, tracing the peninsula instead of standing in a
  row. Their leaders are only `32 / 30 / 34px`: one fading hairline from the placard toward the
  wash, deliberately stopping before it. Three displaced organic layers render at measured
  1440px footprints `106 / 119 / 120px`; dusty rose / muted ochre carry effective outer-to-inner
  opacities `.252–.319 / .264–.334 / .234–.296`, with Johor's rose separately desaturated.
  **Hard rules, founder-set:** West Malaysia only; no East Malaysia; no live listing data, state or
  Klang Valley category fill, map labels, clicks or interaction; the map stays `aria-hidden`. The
  staged cards and E-Tender / Owner Auction badges are a flat, non-interactive overlay and must not
  alter or approximate the published coastline geometry.
  **Top-surface material** (15 Aug): keep terrain as a second read, but never return to the blank
  slab. The published coastline clip owns every layer. Five broad authored height masks replace
  the rejected white crest and erosion strokes: three overlapping, broken Titiwangsa sections plus
  quieter Bintang/Kledang and Timur/Tahan ranges. Thirteen varied-width branching valley cuts and
  tapered tips are subtracted from the mask before a single matte diffuse-light pass (`azimuth
  235°`, `surfaceScale 18`, cluster opacity `0.50`), so ridges read as connected volume rather than
  drawn veins. A geography-masked two-scale field (`0.0095 0.0065` landform + `0.034 0.022`
  erosion at `80 / 20`) supplies restrained shoulders and micro-erosion; whole-sheet undulation is
  separate. Closed envelope contours stay almost subliminal at `0.06 / 0.16`, below the dotted
  state engraving (`0.78`). Whole-face warm mottle (`0.0042 0.0032`), mineral grain (`0.026
  0.019`) and isotropic paper tooth (`0.23`) remain independent of the terrain mask, so eastern and
  southern plains stay calmer but still tactile. Final CSS strengths are relief `0.86`, sheet
  `0.50`, cluster `0.50`, grain `0.48`, speckle `0.34`, mottle `0.82`. The authored zones are
  geographically grounded illustration, not claimed elevation precision.
- **Homepage section 3 — WHAT WE OFFER, approved equal-card reference** (17 Aug, final composition,
  superseding the asymmetric 01/02 tiles + burgundy 03 band): the diagonal architectural image and
  its single intro remain the section signature, but the business offer underneath is deliberately
  explicit — **three equal cards in one desktop row**, because Buying, Selling and the One-Stop
  Property Solution carry equal business weight.
  Every card uses one fixed reading architecture: **number → category → Newsreader promise → plain
  description → benefit/tags → flexible space → edge-to-edge photograph → dedicated CTA footer**.
  The grid stretches all three cards to the same total height; their 222px images and 66px footer
  strips therefore share exact top and bottom baselines regardless of copy length. Cards are warm
  white on `--paper`, held by one `--line` hairline and 12px corners with only the system's nearly
  invisible `0 1px 2px` shadow. Buying and Services use burgundy; Selling alone uses the
  header-vetted `#836A33` brass.
  Tags are small editorial records, not buttons: faint paper tint, thin outline, 7px corners and a
  quiet dot. Selling's FULLY SUBSIDISED VALUATION REPORT is a separate compact badge above its two
  method tags. The five Services tags are a two-column grid so the content cannot become one long
  row. Card photography is intentional: urban/property landscape → landed home → interior and
  renovation; no image receives internal padding.
  **Responsive**: 1280+ remains three equal cards; 620–979 renders two equal-width cards with the
  third centred at that same measure; below 620 all three stack naturally. The mobile cards may
  take content-driven heights, but the image and footer layers remain identical and the page must
  retain zero horizontal overflow at 375px.
- **Photographs ship as AVIF + WebP + a JPEG fallback, across four widths** (16 Aug): a 3200px
  AVIF of the section-3 interior is 201KB — smaller than the 1599px JPEG it replaced, at twice the
  resolution. Format buys more sharpness per byte than any upscaler. ⚠️ **When a photograph is
  scaled by CSS (a crop zoom, a parallax, a hover push-in), the `sizes` attribute must carry that
  factor** — it describes how many pixels are NEEDED, not how wide the box is. Section 3's image is
  laid out at ~52vw but scaled 1.66x, so its hint is 87vw. Omit the factor and every device fetches
  one step too small and the image goes soft for reasons nobody can find in the CSS.
- **Normalised-stage geometry — the pattern that stops drawings drifting** (16 Aug, generalised
  from sections 2 and 3): when a drawing and HTML have to stay registered to each other, give the
  container ONE normalised coordinate space, lock it with `aspect-ratio`, and place everything as a
  percentage of it. The SVG stretches with the box (`preserveAspectRatio="none"`) so it is in the
  same space, and `vector-effect: non-scaling-stroke` keeps hairlines true under the uneven scale.
  ⛔ **Dots and other round marks must be HTML, not `<circle>`** — a non-uniformly stretched circle
  is an ellipse. Generate curves from their anchors (Catmull-Rom → cubic Bézier) rather than
  hand-tuning control points, so the line provably passes through every mark. **Measure nothing at
  runtime.** Where one element genuinely cannot live in the space (section 3's photograph bleeds to
  the viewport edge by a distance no percentage can express), do not compute the join — hide it:
  start the line under the opaque element and let the element mask it, so it emerges from the edge
  exactly, at every width, precisely because nothing measured the edge.
- **Entrance animations ARM, they do not reveal** (13 Aug, load-bearing): CSS rests in the finished
  visible state; JS adds `.is-armed` to hide it and removes it on approach, toggled through
  `classList` rather than React state. Hide-by-default ships blank sections whenever the reveal
  never arrives — a throttled or hidden tab starves IntersectionObserver *and* React's scheduler,
  and the CMS lifts rendered HTML with no React behind it. Both observed live, twice.
- **Label/value list** (`.pd-row`): label column `10.5rem`, `white-space: nowrap`, value 14.5/600,
  `min-height: 46px`, hairline under each row. Two-up via `grid-auto-flow: column`.
- **Icon band** (`.band .stat`): scannable summary, always **derived** from the same source as the
  table beside it — never a second hand-written copy.
- **Money box**: label 11px muted over a serif figure; refundable deposit in `--good`.
- **Property pricing hierarchy** (`.pd-pricing`): every detail page starts with the same three
  positions, in order — reserve price per sq ft with its area basis stated, tenure, then title
  and land use. The correct area basis changes by property form; the position does not. These
  promoted facts do not repeat in the specification list below.
- **Facts strip** (`.v1-facts`): three cells, vertical rules between, label / value / sub-line.
- **E-Tender Information dossier** (`.v1`): one full-bleed, shallow 40/60 split on every real listing;
  desktop height should stay close to the `/tender` hero rather than becoming a tall card. The left
  is the same platform-level monochrome KL panorama under a **flat** burgundy wash and owns all
  timing information: a day-led live countdown with H/M/S subordinate, tender start and closing
  date. The right reads in decision order: reserve price → computed 3% deposit → offer privacy →
  deposit risk → accepted/countered/not accepted outcomes → account requirement → action. Keep one
  red Apply for E-Tender CTA. Payment terms are a compact native disclosure; the general process
  link is a separate tertiary row, not a competing utility in the same stretched footer. Never use
  a property photo here; never duplicate deadline information on the right; never restore the pin
  or paperclip. The diagonal collapses to a clean vertical stack at 700px, with timing first.
- **Owner Auction Bid Information dossier** (`.oa-dossier`): keep the same shallow 40/60 shell
  but never copy the E-Tender period into it. Owner Auction is one scheduled event. The left is
  an espresso/brass auction docket: auction day and time dominate; registration closing date and
  days left form one paired footer. Weekday, month/year and time are one right-hand stack beside
  the large day numeral so no label can collide with it. The right begins **Starting bid** (not
  reserve price) → 3% of the successful bid → live-bidding method → auction outcome → Register to
  bid. The section-nav label is **Bid Information**. At 700px it stacks with the auction docket first.
- **Slim invitation band** (`.pd-ask`): 44px serif glyph + title + one line + red CTA. ~98px tall.
- **Body prose**: **two columns at full width**, `line-height: 1.72`, with at most one pull-quote
  (`border-left: 2px solid var(--burgundy)`) as the anchor, placed *outside* any disclosure.
  A single column across the full 1100px is ~137 characters per line — roughly double the ~75
  readable ceiling — but two columns land at **~65 each**, so filling the width and staying
  readable are the same move. This is also how `.pd-list` fills the identical space, so the two
  sections share a horizontal rhythm.
- **Progressive disclosure over columns: render FEWER ITEMS, never clip with `max-height`.**
  Clipping across two columns cuts column 1 mid-sentence and starts column 2 on a new thought, so
  the reading order breaks; a fade over a column boundary reads as a rendering fault. Hold the
  prose as data and slice it (`ABOUT_PARAS.slice(0, N)`),. Keep the label plain — "View more",
  not "View more (6 more)": Bryan's call, and a bare label reads as an invitation while a count
  reads as a warning about how much is left.
- **Disclosure** (`<details>`): summary carries a `<b>` label and a `<small>` summary of what is
  inside, plus a chevron that rotates on `[open]`.
- **Pills / chips**: `999px` radius, `--card` background, 1px border, 13px/700.
- **Comparable evidence ledger** (`.price-history`): Buy/Rent is a real mode switch, not two
  side-by-side mini tables. It goes directly into a native semantic table rather than repeating
  the subject property's price or specifications. Amounts form the strongest right-hand column
  in Newsreader; everything else is quiet Inter with horizontal hairlines. At 620px the
  same table rows reflow into compact two-column records instead of forcing horizontal scrolling.
  Never add trend arrows, a dead `More` column, or estimated gross yield without a confirmed basis.
  Masked preview rows carry an explicit `LAYOUT PREVIEW` notice until verified records exist.

## 5. Traps that have already bitten — read before editing CSS

1. **`grid-template-columns` does not override `grid-auto-flow: column`.** Cost: card facts stayed
   in columns and clipped to "1", "9.", "F".
2. **Duplicate selectors at equal specificity — last one wins, silently.** Two
   `.props-grid.list-mode .pc-details` rules meant `margin-top: auto` was dead and a "fixed" layout
   never moved. **Grep the selector before adding a rule for it.**
3. **Never restate `position` to raise something.** `position: relative` on an element already
   `absolute` dropped the save button into flow and pushed the deadline pill off the photo.
   `z-index` alone.
4. **A wrapping label breaks a two-column table.** One 2-line label makes its row ~90px against
   46px and the columns stop marching in step. Shorten the label or widen the column; put units in
   the value (`RM480 / year`).
5. **A cropped viewBox is what makes an icon size honest.** `0 0 24 24` around a glyph occupying 18
   units means a 48px box draws a 36px mark. Crop to the artwork.
6. **`--red` fails AA on dark scrims** (~3.4:1 on the near-black photo pill). Use `#FF8578` there.
7. **Cut multi-line JSX by line index, not `str.index`.** Character offsets have mangled this file
   twice.
8. **SSR: anything clock-derived starts `null` until mount**, or server and client disagree.
9. **A clamp and its toggle are ONE feature — remove both or neither.** Removing About's "View
   more" button while leaving `max-height: 8.4em` clipped the text with no way to open it, and it
   threw nothing: the toggle script guards with `if (!btn) return` and silently disabled itself.
   After removing any progressive-disclosure control, assert `scrollHeight <= clientHeight`.
10. **Put a clamp on `:not(.open)`, never on the base class with `.open` overriding it.**
   `.aboutbody { max-height: 8.6em }` + `.aboutbody.open { max-height: 220em }` looks correct and
   is correct by specificity, but the open rule did not take effect — the button flipped its label
   and `aria-expanded` while the text stayed clipped at 137.6px. Scoping the clamp to the closed
   state removes the fight entirely: the rule stops matching instead of being overridden.
   **A toggle test must assert HEIGHT, not just the label** — the label lies.
11. **`getComputedStyle` on a transitioning property returns the interpolated value**, so reading
   it right after a class change measures the animation's start frame, not its target.
12. **Anything React renders must be driven by React state — never a DOM listener attached in an
   effect.** About's toggle was bound inside `initDetailPage()`, which runs once on mount, so any
   hot reload rebuilt the DOM without re-running the effect and the button silently went dead. A
   fresh load worked; a reloaded page did not. That is the shape of every "works for me" bug in
   this codebase. `initDetailPage` should only own things React does not render (scroll observers,
   the gallery's `window.__resources` swap).
13. **An expanding disclosure must own the width its contents need.** The closed payment summary
   can be a compact unit, but its three-column 3% / +7% / 90% illustration cannot remain in that
   half-width grid area when opened; the money figures collide even though the page itself reports
   zero overflow. Let the open `<details>` span the full information plane and verify the expanded
   state visually, not only the closed banner.

- **`align-self: center` centres against the flex LINE, not against the text.** Add one tall
  sibling — a rule, a divider, an icon — and every `align-self: center` item in that row silently
  re-centres against the new taller line and floats away from the type it belongs to. The arrow in
  `.howto-link` drifted up to the heading's cap line the moment the 33px rule became a flex item.
  **Fix: group the things that must align with each other inside their own flex container**, so
  the tall element is a sibling of the group, not of its members. Verify by measuring both
  centres — they must be equal, not merely close.

- **Hit area must match affordance.** If only part of a phrase looks clickable, only that part
  may be clickable. Wrapping a whole line in `<a>` while styling one clause as the link means a
  click on apparently-inert text navigates the page — Bryan hit this on "New to e-tender? See how
  it works" and called it weird, correctly. Either make the whole thing look like a link, or put
  the anchor around only the link text. Bigger tap targets are not worth surprise navigation.

- **Display type hides its gap in the leading — measure glyphs, not boxes, on BOTH sides.** A
  tight `line-height` makes glyphs overflow their own line box in both directions at once: under
  a 112px numeral sat 24.5px of dead leading (a 10px `gap` rendered as a **34.5px** hole, the unit
  orphaned) while the digits simultaneously rose 10.6px **above** the box, leaving the label
  **1.7px** off the caps — visually touching. Fixing one side does not fix the other, and both
  faults are invisible to `getBoundingClientRect`. `getBoundingClientRect()` cannot see this; canvas `TextMetrics`
  (`actualBoundingBoxDescent` / `fontBoundingBoxAscent`) can. Cancel it with a negative margin
  expressed **in the display element's own em** so the correction scales with its clamp.
- **Centring a unit is not centring its parts.** "134 DAYS LEFT" centred as one flex row put the
  numeral 53px off the axis every other element shared. Stack the unit under the numeral, or
  accept that the big element — the one the eye actually tracks — is off-centre.

- **A grid with fixed rows will not absorb an extra child — it deforms the section.** The
  Sinaran gallery appended a 7th thumb into `grid-template-rows: repeat(3, 1fr)`. Seven tiles in
  two columns is four rows with an orphaned cell, and because `.gallery` is `align-items: stretch`
  the *stage* stretched to match and overrode its own `aspect-ratio: 3/2` — 517px → 683px, with a
  hole in the corner, permanently, from one click. **Overflow belongs in a viewer, not in the
  grid**: keep the tile count fixed and let "+N" open something.
- **Anything React renders must be driven by React state.** Third time this has bitten: the About
  toggle, then hot-reload losing listeners, now the gallery. DOM handlers registered in an effect
  fight the render they are attached to and break in ways that look intermittent.

- **A property declared twice in one rule silently keeps the LAST value.** Splicing `display` and
  `text-align` into an existing block left `text-align: center` above and `text-align: left` below
  inside the same braces — so the numeral aligned left while its eyebrow inherited centre, and the
  panel read as two columns that were actually one. Neither the browser nor `tsc` warns. **After
  editing a rule, print the whole rule back and read it**, and sweep for duplicate properties:
  `re.finditer(r'([^{}]+)\{([^{}]*)\}')` then count property names per block.

- **A token nothing uses is worse than no token.** `--sec-title-size` and `--sec-title-gap` were
  declared in `tender-detail.css` — but that file had **no `.sec-title` rule at all**, so every
  heading on the detail page fell through to `tender-listings.css`, which sizes headings for CARD
  sections (23.5px Inter 800 instead of 35px Newsreader 600). The design system said one thing and
  the page did another for weeks, and nothing errored. **When two stylesheets load on one page,
  grep the selector in BOTH before assuming which rule is winning** — and scope page-specific
  rules (`.tp-detail .sec-title`) so order cannot decide it.

- **Descendant selectors catch what you did not mean, twice over.** `.v1-terms b` was written for
  the deposit figure — then a note was nested inside that zone and its `<b>` rendered as a **21px
  block heading**. Use `> div > b`. Related, and worse: a script that strips rules by matching a
  class name in the "selector" text will match that class inside a **preceding comment** — mine
  deleted the About pull-quote and a media query's closing brace because a comment above it said
  *"the same emphasis language as `.v1-reassure`"*. **Never bulk-delete rules by substring; and
  after any sweep, check brace depth AND diff what actually went.**

- **Same KIND of element ⇒ same class, not the same values typed twice.** "See how e-tender
  works" and "Or talk to the agent first" are both *ways out that are not the action*, so they
  share `.v1-textlink` and placement-only classes carry the rest. Two rules with matching values
  drift the moment one is edited — which is how the second link ended up muted grey while the
  first was burgundy.
- **Demoting is not hiding.** A filled button already dominates on fill alone; making its
  alternative near-invisible adds no hierarchy and just makes a legitimate route hard to find.
  Second, not hidden.

- **A gap you cannot close by editing padding is a MISSING EDGE, not spacing.** The dossier's
  white right panel butts onto Property Details, which is also white — so the section boundary was
  invisible and 31px of panel padding ran straight into 56px of the next section's, reading as
  **87px of unbroken white** under the closing line. Three separate spacing edits failed because
  most of that space did not belong to the panel. **Before tuning padding, check what colour the
  NEXT section is** — if it matches, the boundary needs an edge, not less air.

## 6. Brand — non-negotiable

- Cream / burgundy / red. **Never** import iNewProject's maroon palette. Adopt *patterns* from
  references (iProperty, iNewProject, Zillow); never their colours or chrome.
- **Flat and restrained.** No gradients, no glossy 3D, no drop shadows beyond
  `0 1px 2px rgba(23,19,15,.03)`. The glossy red pin was removed for exactly this reason.
- Zero horizontal overflow at 375px, always. Measure it.
- Focus rings are not optional: `outline: 2px solid var(--red)` / `var(--burgundy)`, offset.
- `prefers-reduced-motion` honoured on every transition.

---

## 7. Taste log — verdicts, not rules

Rules did not prevent the failures below; every one of them passed the rules. What prevents them
is remembering the **verdict**. Append a line every time Bryan rejects something on looks, in his
words where possible. Read this before designing anything new.

| Verdict | The real fault | The rule it hides |
|---|---|---|
| *"the background is too dark"* — homepage triptych after the product panel was removed | **Weight / exposure, not image choice.** The old gradient still protected a lower content panel that no longer existed, so it hid the photographs for no remaining reason | Re-audit every legibility wash when content is removed. Darken only as much image area as the live text requires; never preserve a blanket scrim designed for deleted content |
| *"he dont like the diagonal thing, he wants it full"* — former homepage hero | **Shape / architecture, not the angle itself.** The diagonal made one product the page and the other an afterthought; changing its slope would preserve the same mistake | When the homepage introduces two equal buying methods, use one full landing stage and place the choice in the content hierarchy. Product-page hero devices do not automatically belong on the platform entrance |
| *"i dont like it, its ugly placement"* — full-bleed maroon band between hero and search | **Weight, not placement.** A saturated block on a flat cream page reads as an ad wherever it goes; moving it just moved the ad | On a restrained page, prominence comes from **position and whitespace**, never from saturation. A filled block is the loudest object on the page — spend that on the primary action only |
| *"the deep/white alternating, its too deep"* | Band contrast set by taste, not by measurement | Derive the alternate band from the **luminance midpoint** of its neighbours, then check the ratio |
| *"btw tender information background is white colour"* | A full-width white card covering 58% of a band defeats the band | Judge what a section **reads as** — area coverage, not element width. A 0.69-width card still reads as the background |
| *"whats the point of showing the hour only?"* | Removing days from a countdown removes its scale | A countdown answers *how long have I got* before *how precise is it*. **Days lead, always** (§3d) |
| *"remove the circle and make the ? larger"* | A circled glyph is chrome around a mark that can carry itself | Prefer the mark to the container. If the container can go, it should go |
| Glossy red map pin, removed | Gloss and 3D on a flat brand | The brand is **flat**. Any gradient/gloss is a defect, not a flourish |
| *"by any chance reserve price dont make it bold"* … *"ok revert haha"* — card price 800 → 500, reverted same minute | **Nothing.** The 800 was right; the ask was worth testing and the answer was no | Some verdicts are only reachable by rendering it. Cheap to try, cheap to revert — but log the ANSWER, so 500 does not get proposed a third time. The card price is **800**: on a browse grid the price is the one figure a buyer scans for, and weight is what makes it findable at a glance, not just large |

**The pattern across all of them:** the fault was almost never the attribute Bryan named. He names
where his eye landed. Diagnose the axis before fixing — see the `design-critic` agent, step 3.

## 8. Before you show Bryan anything visual

1. **Render it and look at it.** Not the diff, the picture. Numbers verify correctness; they do
   not detect ugliness — everything in §7 measured perfectly.
2. **Build three, ship one.** A single attempt has nothing to be judged against, and you will
   defend the only thing you made. Three treatments make the right one obvious in one glance —
   that is exactly how the "New to e-tender?" line got solved after two failed rebuilds.
   Put them behind a one-character switch (`data-*` attribute + a constant), screenshot each
   cleanly, and delete the losers the moment he picks.
3. **Run the `design-critic` agent on the screenshot.** It did not build the thing and will not
   defend it. If it names a different fault axis than you did, it is probably right — you have
   already committed to a story about your own work.
4. **State an opinion.** Bryan asks for options but wants a recommendation. Give the number you
   would ship and why.
