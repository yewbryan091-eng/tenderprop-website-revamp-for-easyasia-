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
  timing information: live D/H/M/S, closing date and registration date. The right owns reserve
  price, computed 3% deposit, sealed method, a full-width three-step process, then action and payment
  disclosure in one compact footer row. Never use a property photo here; never duplicate deadline
  information on the right; never restore the pin or paperclip. The diagonal collapses to a clean
  vertical stack at 700px, with the timing panel first.
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

## 6. Brand — non-negotiable

- Cream / burgundy / red. **Never** import iNewProject's maroon palette. Adopt *patterns* from
  references (iProperty, iNewProject, Zillow); never their colours or chrome.
- **Flat and restrained.** No gradients, no glossy 3D, no drop shadows beyond
  `0 1px 2px rgba(23,19,15,.03)`. The glossy red pin was removed for exactly this reason.
- Zero horizontal overflow at 375px, always. Measure it.
- Focus rings are not optional: `outline: 2px solid var(--red)` / `var(--burgundy)`, offset.
- `prefers-reduced-motion` honoured on every transition.
