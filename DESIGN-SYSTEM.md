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
- **Tender Information dossier** (`.v1`): one full-bleed, shallow 40/60 split on every real listing;
  desktop height should stay close to the `/tender` hero rather than becoming a tall card. The left
  is the same platform-level monochrome KL panorama under a **flat** burgundy wash and owns all
  timing information: a day-led live countdown with H/M/S subordinate, tender start and closing
  date. The right reads in decision order: reserve price → computed 3% deposit → offer privacy →
  deposit risk → accepted/countered/not accepted outcomes → account requirement → action. Keep one
  red Apply for E-Tender CTA. Payment terms are a compact native disclosure; the general process
  link is a separate tertiary row, not a competing utility in the same stretched footer. Never use
  a property photo here; never duplicate deadline information on the right; never restore the pin
  or paperclip. The diagonal collapses to a clean vertical stack at 700px, with timing first.
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
| *"i dont like it, its ugly placement"* — full-bleed maroon band between hero and search | **Weight, not placement.** A saturated block on a flat cream page reads as an ad wherever it goes; moving it just moved the ad | On a restrained page, prominence comes from **position and whitespace**, never from saturation. A filled block is the loudest object on the page — spend that on the primary action only |
| *"the deep/white alternating, its too deep"* | Band contrast set by taste, not by measurement | Derive the alternate band from the **luminance midpoint** of its neighbours, then check the ratio |
| *"btw tender information background is white colour"* | A full-width white card covering 58% of a band defeats the band | Judge what a section **reads as** — area coverage, not element width. A 0.69-width card still reads as the background |
| *"whats the point of showing the hour only?"* | Removing days from a countdown removes its scale | A countdown answers *how long have I got* before *how precise is it*. **Days lead, always** (§3d) |
| *"remove the circle and make the ? larger"* | A circled glyph is chrome around a mark that can carry itself | Prefer the mark to the container. If the container can go, it should go |
| Glossy red map pin, removed | Gloss and 3D on a flat brand | The brand is **flat**. Any gradient/gloss is a defect, not a flourish |

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
