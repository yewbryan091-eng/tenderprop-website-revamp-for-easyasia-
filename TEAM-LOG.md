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
| **Homepage — ACTIVE PHASE, controlled loop. See `HOMEPAGE-LOOP-ENGINEERING.md`** | `src/routes/index.tsx`, `loop/**`, and the `.home-*` / `.door` / `.shell-*` rules in `src/styles/site-shell.css` | **Claude** | 5 Aug | **ITERATION 03 — NEW ARCHITECTURE from Bryan's reference.** Diagonal 45/55, "The smarter way to buy property.", maroon fade over a KL image. Structure pass only; **hero image is a placeholder** pending Bryan. Supersedes the 55/45 card of 01–02. **READ-ONLY on the homepage — do not edit `src/routes/index.tsx` or `src/styles/home.css`** |
| Tender listings page | `src/routes/tender/index.tsx`, `PropertyCard.tsx`, `StateFilters.tsx`, `tender-listings.css` | *(free)* | — | **Card rebuilt to Bryan's Buyer-POV reference 6 Aug** (`7b672de`), then 3 audit P1s fixed (`8992354`): list-mode price/title inversion, per-row CTA baselines, the period→agent seam minimum |
| Property detail page — **ACTIVE PHASE, see `PLAN-residensi-sinaran.md`** | `src/components/tender/ResidensiSinaranDetail.tsx`, `tender-detail.css`, `tender-detail-behaviour.ts` | Codex | 3 Aug | Rebuilding Mortgage Calculator only; coordinate before touching this section |
| Data + shared logic | `src/data/*`, `src/lib/tender-utils.ts`, `src/lib/images.ts` | *(free)* | — | — |

Release your claim (set back to *free*) when you push your finished work.

---

## 2. DECISIONS LEDGER — do not silently reverse these

These were decided deliberately, most of them by Bryan directly. If something here looks like a
bug or a mistake, it probably isn't — **ask Bryan before changing it.**

| Date | Decision | Why | Decided by |
|---|---|---|---|
| 1 Aug | **The reserve price is a GUIDE, not a floor** — buyers may offer below it | Founder: *"try to push their luck by placing an offer below the reserve price, the seller may agree or counter."* Copy saying "minimum offer considered" / "the floor" was factually wrong AND argued against the product: naming your own number **is** the e-tender | Bryan (from his father) |
| 1 Aug | **No money moves through TenderProp.** Apply → sign-in → tender form → lead | The 3% is collected afterwards by the agent into the agency's **client account**, as BOVAEP mandates. The platform is a lead engine for a licensed agency, exactly like iNewProject | Bryan |
| 1 Aug | **There is no registration deadline.** Deleted | An account is needed only at the moment of applying. Our "closing − 14 days" rule was invented | Bryan |
| 1 Aug | Buyer copy **may state that the agent negotiates where there is room** | Founder-verified: *"every e-tender submission, it's not about win or lose — there's always a chance / room for negotiation done by the agent."* Codex removed this twice as an unsupported claim — a fair instinct without the founder's word, hence this row. **Keep it hedged** ("where there is room to move"): it promises a route, never an outcome | Bryan (from his father) |
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
| 30 Jul | Tender Information is one **full-bleed, shallow 40/60 split dossier** across every real listing: universal monochrome KL deadline panel left; listing facts, process and action right. No capped card, pin or paperclip | Bryan explicitly chose the Pexels panorama, then asked that this shared listing-page system span the viewport and match the `/tender` hero's compact height | Bryan + Codex |
| 31 Jul | Tender Information's right panel follows **price → risk → privacy → outcome → action → optional learning**. Offer privacy means hidden from other buyers/the public; outcomes are accepted/countered/not accepted. Payment schedule and general process are separate utilities | Bryan approved the hierarchy brainstorm; three rendered treatments showed that named confidence blocks and one compact action band scan fastest without rebuilding the dossier as another card stack | Bryan + Codex |
| 6 Aug | **GRID title region reserves two lines again** (`min-height: 2.7em` on the title link, multi-column widths only), and titles hard-cap at two lines via line-clamp | Bryan's polish brief: long names were desynchronising the row — address, size, period, agent and CTA now start at ONE y on every card in a row (measured identical at 1440/1280/1024/768). **Supersedes the 28 Jul "title does not reserve two lines" row** for the grid; single-column phones keep NO reserve, which preserves what that ruling was protecting (no dead line under short titles where there is no row to align with) | Bryan |
| 6 Aug | **The listing card follows Bryan's annotated Buyer-POV reference**: image → reserve price (strongest text, **burgundy**) → type · name → address → built-up → E-TENDER PERIOD (starts/closes, days left under the close) → agent → **solid maroon** "View E-Tender Details" CTA | Bryan supplied the reference sheet explicitly ("this image looks very clear what i want to achieve"). **Knowingly reverses two 4-Aug rulings** — price to ink, and CTA as a wash-at-rest — and restores built-up via `areaSlot()`. The day count renders twice (photo pill + under CLOSES) because the sheet draws both | Bryan |
| 3 Aug | Price History returns as a **clearly labelled layout preview**: Buy/Rent comparable-evidence ledger with masked rows, no repeated subject-property strip, no dead `More` column and no gross yield until its basis is defined | Bryan wants buyers to reach the nearby evidence immediately; repeating the subject's price and specs added no decision value. The structure must remain reviewable without turning sample values into property claims | Bryan + Codex |

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

### 6 Aug 2026 — Claude · Listing card rebuilt to Bryan's Buyer-POV reference

Bryan supplied an annotated reference sheet for the card and said build exactly that. Done, in
`PropertyCard.tsx` + the card CSS. Scan order now: image (badge / heart / glass days-left pill,
all kept) → **RESERVE PRICE in burgundy, the strongest text** → type · name on one line
("Condominium · 222 Residency") → address (street when supplied, else area + state — never
invented) → built-up via `areaSlot()` → **E-TENDER PERIOD** band (STARTS / CLOSES, days left
under the close) → agent → **solid maroon "View E-Tender Details"** CTA.

**Codex: two of your 4-Aug rulings are knowingly reversed by the sheet** — price ink→burgundy,
CTA wash→solid — and built-up is back. Ledger row added. Your glass pill, the agent band and the
single stretched-link pattern all survive; DOM order now IS the visual order (the `order:` system
is gone). `.pc-main`/`.pc-rail` are `display: contents` in grid mode and become the description
column / right rail in list mode.

🐛 One catch worth knowing: the price sat OUTSIDE `.pc-main` at first, so list mode's row layout
put RM531,000 beside the title on one line. Caught in the render, not the code — the wrapper's
whole job is choosing what stacks in list mode, so the price had to live inside it.

Verified: 0 page overflow at 1440 / 800 / 720 / **681 (302px cards, narrowest 2-up)** / 375; no
element spills its card at any of those; list mode + both toggles work; tsc, eslint, build green.
Screenshots in `loop/screenshots/card-0*.png`. An adversarial multi-lens audit was running at
push time; its confirmed findings land as a follow-up commit.

### 5 Aug 2026 — Claude · ⚠️ TWO CLONES HAD DIVERGED. Merged and pushed. Read this before you pull

**There were two working copies of this repo on Bryan's Mac, and two dev servers.** Everyone was
looking at a different one:

| Port | Folder | State when found |
|---|---|---|
| **8080** | `~/Desktop/Claude.CLI/tenderprop.os/tenderprop-insight` — **the canonical clone, per `AGENTS.md` §Where things are** | **9 commits that had never been pushed** |
| 8081 | `~/Desktop/tenderprop-website-revamp-for-easyasia-` | Had the pushed homepage work, none of the 9 |

The 9 unpushed commits were the E-Tender **card and hero** pass — `d03dbe7` through `f51a140`:
duplicated day count out of the deal band, built-up/land area off, house icon for the type,
glass countdown pill, the "New to e-tender?" line dropped from the search band, and the right
hero panel rebuilt as *"E-Tender in 3 simple steps"*. **Good work that existed on one laptop only.**

**Resolved by merge, not by copying files.** They are the same repo, so: a `backup-before-homepage-merge`
branch at `f51a140` first, then `git merge origin/main` — **no rebase, nothing rewritten**, which
matters because rewriting pushed history breaks Lovable's sync. There was **zero file overlap**
(the 9 touch `PropertyCard.tsx`, `icons.tsx`, `routes/tender/index.tsx`, `tender-listings.css`;
the homepage work touches `routes/index.tsx`, `home.css`, `site-shell.css`), so the merge was clean
and `git diff f51a140 HEAD` over all four of their files is **empty** — their work is bit-identical.

All 10 commits are now on `origin/main` (`bf77bfd..457df9a`), and all three built routes were
smoke-tested on 8080 afterwards: `/`, `/tender`, `/tender/residensi-sinaran` — zero horizontal
overflow, zero console errors.

**🔴 THE LESSON, and it is a protocol one.** `AGENTS.md` already says *"make sure everyone is
editing the same 1 same file in the repo"* and names `tenderprop-insight` as the place to edit.
That is only true if every agent **pulls first and pushes every turn**. Nine commits sat unpushed
long enough for a second clone to diverge — which is exactly the failure the PUSH BEFORE YOU STOP
rule exists to prevent. **Work in `~/Desktop/Claude.CLI/tenderprop.os/tenderprop-insight`. Pull
before you start. Push before you stop.** The second clone has been brought up to date so it is
no longer a divergence trap, but it should not be edited.

### 5 Aug 2026 — Claude · Homepage ITERATION 03: **new hero architecture** — diagonal, maroon fade

Bryan supplied a reference design that supersedes the 55/45 card of iterations 01–02. His scope for
this pass was explicit and narrow: *"just build the diagonal left side right side 45/55 first, left
side ensure theres the smarter way to buy property title and right side ensure theres the maroon
fading, i will proceed to go find the image."*

**The hero is now a full-bleed diagonal**, ~45 light / ~55 dark, built with the SAME technique as
`/tender`'s — two `clip-path`'d planes on shared split tokens — but **mirrored**: `/tender` darkens
the left plane, the homepage darkens the right. Left carries "The smarter way to *buy property.*";
right carries the cycle over a KL image under a maroon fade.

⚠️ **The hero image is a PLACEHOLDER** (`tender-information-kl.jpg`). Bryan is sourcing the real
one. It swaps at a single value — `--hp-hero-image` in `home.css`.

**One alignment improvement worth stealing for `/tender`:** this hero derives its content edges
from `.wrap`'s own formula, so they land on the same x as the header, footer and every section
below. **`/tender`'s hero pads from the viewport and sits 114px outside the site's column at
1440** — a real misalignment on the canon page, yours to take or leave.

🐛 **Two traps this cost me, both invisible in the source:**

1. **An `inset: 0` panel is full-width even when clip-path makes it a wedge.** My maroon gradient
   ran dense→thin across 0–100% of the panel box, so the entire dense half landed in the
   clipped-away region and the visible wedge got only the thin tail — flat mauve over a photo.
   Stops have to start at the seam.
2. **`position: static` in a stacking media query reparents an absolute `::before`.** Collapsing
   the diagonal at 900px with `.hp-panel { position: static }` handed the fade's overlay to
   `.hp-hero`, stretching maroon across the WHOLE hero: ink-on-maroon body copy and the burgundy
   `buy property.` swallowed entirely. `position: relative` lays out the same and keeps it scoped.

**Verified:** 0 overflow at 1440/1280/1024/768/390/375, every text colour AA against its plane
(lowest 4.92), build + eslint + tsc green, all fourteen hard rules pass.

**NOT built from the reference, deliberately** — "36 properties open" (36 is the raw count and 12
of those are fabricated `demo:true` fillers; real is 24 open / 5 in cycle), "Verified & regulated ·
Licensed professionals" (agency voice in a marketing zone, H9), the four equal DAYS/HRS/MINS/SECS
cells (founder ruled that out — built as the ranked day-count-plus-strip `/tender` already uses),
and the search band (Q3 still stands).

### 5 Aug 2026 — Claude · Homepage ITERATION 02: ledger removed, hero rebalanced. **Codex, audit 02**

Judge verdict on iteration 01 was **LOOP AGAIN** with five accepted fixes; all five are done and
nothing else was touched. Self-score **90/100** — and **that is not a lock**: the condition needs
two consecutive iterations moving by under 2 points and this one moved +7, with one P1 still
deferred. Audit → `loop/reviews/iter-02-codex.md`.

**The five-row property ledger is out of the cycle panel.** Surface 1 establishes the product and
the current cycle; Surface 2 owns property-level inventory and proof. Nothing replaced it.

**The rebalance is the part worth knowing about.** Removing the ledger did not shrink the
imbalance — it **inverted and enlarged** it. The card fell 513.7 → 191.2px against a 386.9px
statement, so 127px of void under the statement became **196px of void under the card**.
`align-items: center` distributes it: 97.8 above / 97.9 below at 1440, 91.9 / 91.9 at 1024.
No content added. The two columns lose their shared top edge, which was only worth having while
their heights were comparable.

⚠️ **A trap worth adding to your mental list.** The 44px seller-link target first shipped as an
absolutely positioned `::after` overlay. It measured exactly 44px and hit-tested clean at 1440 —
and **failed at 375**, because an absolute child of a **wrapped inline** resolves against one
fragment, not the union, so the second line had no target at all. Only `elementFromPoint` caught
it; `getBoundingClientRect` reported the union and looked correct. Now done with vertical padding
on the inline box + `box-decoration-break: clone`, underline moved from `border-bottom` to a real
`text-decoration` so it stays on the text.

**CTA flattened in `home.css`, not in `tender-listings.css`** — the shared rule dresses every
button on `/tender` and the detail page, and this loop does not touch those. If you want the lift
and the `0 4px 12px` shadow gone site-wide, that is your call on your own surfaces.

**Still open and NOT mine to fix:** the 252px mobile header, the root meta description's
*"Sealed-bid property tenders"*, and `/tender` having no `<h1>`.

### 5 Aug 2026 — Claude · Homepage ITERATION 01 built: header + hero. **Codex, you are up**

Bryan settled the four hero questions (`loop/iteration-state.md` §2) and Surface 1 is built.
Self-score **83/100, zero P0**, all regression guards pass. **Audit it** with
`loop/codex-auditor-prompt.md` and write to `loop/reviews/iter-01-codex.md` only.

**What it is.** A 55/45 hero on the cream ground, no slab. Left: eyebrow, Newsreader headline,
one lede, one red CTA into `/tender`, seller route as a quiet ink link. Right: the cycle as a
document — day count, closing date, and a native table of the **five real listings** in the
12 Dec cycle against their reserve guides. `/` no longer uses `PageShell`, so this loop never
enters a file the other eight routes depend on.

**Q3 answered with evidence, and it failed:** `/tender` has **no** `validateSearch` / `useSearch`
/ `URLSearchParams` — its search is local `useState`. A homepage search box would submit a query
`/tender` ignores, so the box is out. Restoring it is work on `/tender`, not on the hero.

**Two shared-file things I flagged rather than touched** — both are yours to agree or disagree with:
1. **`SiteHeader` is 252px tall at 375px**, 38% of a phone viewport before the hero starts. Same
   header as the week-4 P0 in `PLAN-AUGUST-DELIVERY.md` §4.
2. **`.btn.red:hover` in `tender-listings.css`** carries `box-shadow: 0 4px 12px rgba(200,40,28,.2)`
   plus a lift, against a brand rule that caps shadow at `0 1px 2px rgba(23,19,15,.03)`.

Plus: the **root meta description** says *"Sealed-bid property tenders"* — bare "tender" breaks
§3c and "sealed-bid" is auction vocabulary — and **`/tender` has no `<h1>` at all**, which my
primary CTA now lands on.

**One shared file I DID edit, small and announced:** removed the dead `.home-doors` / `.door` /
`.cycle-line` rules from `site-shell.css` (25 lines). Zero hits across `src/` after the homepage
stopped using them; brace balance verified before and after.

**My own top fault, unfixed on purpose:** 127px of dead space under the statement column at
desktop (139px at 1024). Three fixes are available and each costs something, so I left it for the
judge rather than picking one and defending it.

### 5 Aug 2026 — Claude · 🔁 HOMEPAGE LOOP ENGINEERING started. Codex: read this before your next task

Bryan has put the homepage on a **controlled loop** instead of the usual build-and-review pass:
one surface at a time, adversarially audited, scored /100, and **LOCKED** before the next starts.
System is in **`HOMEPAGE-LOOP-ENGINEERING.md`** (root) with the working files under `loop/`.

**What changes for Codex.** Your role in this loop is fixed: **adversarial auditor, READ-ONLY.**
`loop/codex-auditor-prompt.md` is your standing brief — the eleven attack axes, the mandatory
finding format (SEVERITY / AXIS / EVIDENCE / WHY IT MATTERS / RECOMMENDED FIX), and the three
allowed verdicts (REJECT · LOOP AGAIN · LOCK CANDIDATE). **Write only to `loop/reviews/iter-NN-codex.md`.**
Findings are evidence for Bryan, not instructions to Claude: **only what Bryan places under
ACCEPTED FIXES in `loop/iteration-state.md` is binding.**

**Status: PLANNING. Nothing is built and no frontend file has been modified.** This turn created
the loop infrastructure, inspected the existing homepage, and claimed the area.

**What the inspection found** (full detail in `loop/iteration-state.md` §1): `/` is
`src/routes/index.tsx`, 60 lines, and there is no real homepage — a `PageShell` type stack, a
cycle line, two product doors, and the dashed "Page frame" to-do grid. No hero image, no search,
no listings, no primary CTA, **and nothing addressed to a seller at all.**

⚠️ **Two things worth your attention:**

1. **Only `src/routes/index.tsx` is homepage-only.** `PageShell`, `SiteHeader`, `SiteFooter` and
   `site-shell.css` are load-bearing for **eight other routes**. Per `PLAN-AUGUST-DELIVERY.md` §6
   I will either keep changes there tiny and push immediately, or grow homepage-owned components
   and leave the shared ones alone. Shout if you need any of them.
2. **Two copy lines already on `/` contradict canon** and will not be carried forward:
   *"your deposit counts toward the 10%"* (`index.tsx:20`) and *"or your deposit back in full"*
   (`index.tsx:42`). Both imply a deposit exists at offer time; deposit timing is still on the
   **unresolved** list in §3 of this log, and no money moves on this site.

**Your detail-page claim from 3 Aug is still open** in §1 — Mortgage Calculator. Release it when
you push so the table stays true.

### 3 Aug 2026 — Codex · Price History now jumps directly to nearby evidence
Removed the repeated subject-property strip (name, reserve guide, built-up and guide psf). Buyers
already receive those facts earlier, so Price History now runs heading + Buy/Rent switch straight
into the relevant comparable ledger. The Buy sublabel now reads **Past sale transactions**.

The prototype honesty marker remains, but it is folded into the ledger heading as a compact
`LAYOUT PREVIEW` tag rather than occupying a standalone explanatory row. Removed all orphaned
subject-strip and preview-row CSS; plan, design system and decision ledger now match the UI.

### 3 Aug 2026 — Codex · Price History introduction wording updated
Applied Bryan's supplied sentence exactly: “Comparable sale price transaction and rental evidence
for similar properties near Residensi Sinaran.” No layout, data or interaction changes.

### 3 Aug 2026 — Codex · Price History is now a buyer-facing comparable-evidence ledger
Built Bryan's father's Buy/Rent sketch as a real section after Location and before Agent. The
subject-property reference uses the page's real reserve guide, built-up and derived guide psf;
the three comparison rows remain deliberately masked under an explicit `LAYOUT PREVIEW` notice
until verified agency/JPPH records exist. Buy shows transacted price + derived psf. Rent switches
to monthly rent and distinguishes verified tenancy from asking evidence.

Compared three rendered treatments. The final version is the flattest: one burgundy-ruled subject
strip, then a hairline evidence ledger with the amount as the strongest value. Removed the vague
`More` column because there is no destination behind it, and withheld estimated gross yield until
its price basis is agreed. Buy/Rent is React state with native tab semantics and arrow-key switching.

Verified production build, pointer + keyboard switching, exact 1100px desktop rail alignment and
zero horizontal overflow at 375px. Mobile uses a compact 2x2 subject reference and two-column
record rows instead of a horizontally scrolling desktop table. `BACKEND-CONTRACT.md`,
`DESIGN-SYSTEM.md` and `PLAN-residensi-sinaran.md` document the production handoff. Claude's
shared-file commits `cf6c9b8` / `bc263ec` safely carried the TSX and documentation while finishing
the adjacent Agent section; this note and the final flat-ledger CSS complete the Codex scope.

### 3 Aug 2026 — Claude · The gap under the closing line was a missing EDGE, not spacing
Bryan, three times, and right each time. I tried `space-between`, then tightened the deadline
panel, then evened the paddings — none of it worked, because **most of that space was never the
panel's.**

**The dossier's right panel is white. Property Details below it is also white.** So the section
boundary was invisible: 31px of the panel's padding ran straight into **56px of the next section's
top padding**, giving **87px of unbroken white** under the sentence with no edge anywhere in it.
No amount of padding tuning inside the dossier could fix a boundary that does not render.

Fixed with a **1px bottom edge on `.v1-main`** — the panel's edge, not a rule under the paragraph
(the distinction Bryan drew earlier). Bottom padding also 30 → 22px, so the sentence sits **23px
from the edge**. Section **379 → 372px**.

**Recorded in DESIGN-SYSTEM §5: a gap you cannot close by editing padding is a missing edge.
Check the next section's background before tuning space.**

### 3 Aug 2026 — Claude · Both secondary links now share one rule
Bryan: *"talk to the agent should behave like see how e-tender works link, same colour, same font,
same design… but second option, apply should dominate."* Right, and for a reason beyond
consistency — **the muted grey was too quiet.** The Apply button is a filled red block and
dominates on fill alone; making its alternative nearly invisible added no hierarchy, it only made
a legitimate route hard to find. **Second, not hidden.**

New `.v1-textlink` carries the look — 13px / 600 / burgundy / solid burgundy underline / arrow
that travels on hover — and `.v1-howto` and `.v1-agent-alt` are now **placement only**. Verified
identical: both render `13px / 600 / rgb(87,28,46)` with a matching underline colour, both have
the arrow.

🐛 Found while doing it: **`.v1-agent-alt` had no rule at all** — an earlier bulk sweep had removed
it, so the link was rendering as unstyled default text and I had not noticed. Sharing a class now
makes that failure mode impossible.

### 3 Aug 2026 — Claude · The gap around the closing line was a FLOOR, not padding
Bryan, twice: the box should end under the outcome sentence, and *"why is there open gap space…
make them tidy."* I fixed the wrong thing first — `align-content: space-between` only **moved**
the slack, closing the gap under the last line by opening one between every zone. Then I tightened
the deadline panel, which changed nothing.

**The actual cause:** `.v1-grid` carried `min-height: clamp(340px, 28vw, 420px)` — a hard **412px
floor** set when the panel held more. The deadline side needs **248px** and the terms side
**370px**, so ~42px of forced height had to be absorbed somewhere, and it surfaced as gaps around
the last paragraph. Lowered to `clamp(280px, 22vw, 340px)`, so **content sets the height** and the
floor only stops a very short listing collapsing. Section **414 → 379px**, and both columns now
end on the same line.

Closing line evened: **30px above, 31px below** (was 15/31), matching the panel's own padding.
Reserve price **58 → 50px** — Bryan: *"too big like it has an ego."* It had gone 45 → 58 on the
previous request and overshot.

**Lesson worth keeping: when spacing looks wrong, check for a `min-height` before touching
padding.** Three edits went into redistributing slack that a single floor was creating.

### 3 Aug 2026 — Claude · CTA paired with the price · hero clock + full dates restored
**The button.** Bryan: too wide. Measured: **743px of button for a 143px label — 5.2× its own
text**, a banner not a button. And the price row ran **66% empty**, 487px of dead space beside
RM517,000. Those two facts solve each other, so the action moved **up beside the price**: natural
**232px (1.6×)**, agent whisper beneath. Safe to leave the closing position because the **sticky
bar carries the same CTA** all the way down the page. The panel now closes on the outcome line.

**Left panel, back to hero behaviour** (Bryan): the H/M/S strip **hangs off the numeral's
baseline** again rather than sitting under it as `HH:MM:SS`. Mirrored `1fr auto 1fr` columns hold
the numeral on the panel's axis.

**Dates now match the /tender hero exactly**: italic Newsreader with a true superior ordinal and
the month spelled in full — **"31st December 2028"**, never "31 Dec". New shared helper
`ordinalDateParts()` in `tender-utils`, so the hero and the detail page cannot drift.

🐛 **A script of mine failed silently and I shipped a panel with no Apply button.** The edit that
moved the CTA up threw before writing; the edit that removed it from the bottom succeeded. **A
multi-step refactor split across two scripts must be verified as a whole** — I checked the CSS and
the types, but not that the button still existed. Bryan's screenshot found it.

### 3 Aug 2026 — Claude · Reassurance block dissolved into the facts it belongs to
Bryan asked whether to delete the two notes (they repeat on /how-e-tender-works) or refine them.
Neither: **each moved to where its question forms.**
- The deposit reassurance now sits **under the RM15,510 figure** — "is this money at risk?" occurs
  while the eye is on the number, so it is answered there.
- The outcome line sits **immediately above the button** — it describes what happens after you
  press it.
- **The separate notes zone is gone.** Four zones → three, section **501 → 461px** (hero is 412).

🐛 **Two bad ones of mine, both caught by Bryan's screenshot rather than by me:**
1. **`.v1-terms b` was a descendant selector** and caught the `<b>` inside the relocated deposit
   note — "Not an extra charge." rendered as a **21px block heading** next to the figure it was
   meant to support. Now `> div > b`.
2. **My rule-removal script matched a class name inside a COMMENT.** A comment above `.about-quote`
   read *"the same emphasis language as .v1-reassure"* — so the sweep deleted the About pull-quote
   rule **and a media query's closing brace**. Restored; brace depth re-verified 0. **Do not
   bulk-delete CSS rules by substring.**

Both are now in DESIGN-SYSTEM §5.

### 3 Aug 2026 — Claude · Tender Information right panel rebuilt as FOUR ZONES
Bryan: *"i just dont know how to make it nice."* The fault was hierarchy, not styling.

**Before:** three equal columns (reserve / deposit / method) + two notes + a boxed CTA — five
blocks at roughly one weight, so the eye had nowhere to land. **The reserve price is the number
this entire page is about** — what a buyer decides against — and it carried the same weight as
"Method: E-Tender", the least surprising fact in the section.

**Now, descending weight, ending in the action:**
1. **Price** — `clamp(32px, 3.3vw, 45px)` Newsreader, alone on its row. **2.14:1 over the deposit.**
2. **Terms of entry** — deposit (green, 21px) + method, paired between hairlines. Same *kind* of
   fact, neither rivalling the price.
3. **The two notes** — supporting weight, green rule for money, burgundy for outcome.
4. **The action** — **the box is gone.** The zone hairline already separates it, so a container
   only competed with the button inside it. Full-width CTA, whisper link centred beneath.

Hairlines carry the rhythm, so nothing needs a container. Section **546 → 501px** after tightening
(the hero is 412px; Bryan's 30 Jul decision asks this panel to stay compact — 501 is the honest
number, flagged to him).

🐛 **Two `.v1-main` definitions again** — an old one at the top of the file declaring
`grid-template-areas: "facts facts"…`, and mine below. Same duplicate-selector trap as `.v1-timer`.
Consolidated to one, updated all three responsive tiers, and removed 8 dead `.v1-facts` rules.

### 3 Aug 2026 — Claude · Section headings were wearing the LISTINGS page's style
A spec came in saying the detail page's section headings should be Newsreader, not Inter. **It was
right, and it exposed a real bug rather than a style preference.**

`tender-detail.css` declares `--sec-title-size: clamp(1.75rem, 2.4vw, 2.25rem)` and
`--sec-title-gap: 26px` — but **it has no `.sec-title` rule at all.** So every heading on the
detail page was falling through to `tender-listings.css:762`, which sizes headings for CARD
sections: **23.5px Inter 800**. A dead token and a leaked rule, together, for weeks.

Fixed with `.tp-detail .sec-title` — scoped to the page wrapper so it wins regardless of
stylesheet order, using the tokens that already existed. **Weight 600, not 800**: Newsreader ships
400..700 and the browser fakes anything above (DESIGN-SYSTEM §2). All nine headings now measure
**Newsreader / 35.28px / 600**, identical.

❌ **Two other claims in the same spec were misreadings of a screenshot, and I did not act on them:**
Selling Points numbering was said to skip 03 — it renders **01–06 sequential**; and "TENURE"/
"Leasehold" were said to be clipped — **zero elements on the page have `scrollWidth > clientWidth`**.
Both verified in the DOM before answering.

**Vertical rhythm was also checked and is already uniform** — every section **56px/56px**, every
heading gap **26px**, one set of values across the page. It comes from `--sec-pad` and
`--sec-title-gap`, which is the system Bryan asked for on 30 Jul. Tender Information is `0/0`
deliberately: it is the full-bleed dossier.

### 3 Aug 2026 — Claude · Tender Information refactored to Bryan's spec
Spec delivered point by point; all of it implemented and verified in the render.

**Left panel** — live clock **moved below the day count and reformatted to plain `HH:MM:SS`**
(was h/m/s cells hanging off the numeral's right). Colons need no unit letters, and stacked it
reads as one instrument. Hidden on the final day, when the day count itself becomes hours+minutes.
Date label **"E-Tender started" → "Tender starts"**. Panel is single-column now, so the
`1fr auto 1fr` mirror grid is gone — **axis spread measured 0px** across eyebrow, numeral, unit
and clock.

**Right panel** — **the "Tender information" h3 is deleted** (the `top` grid row went with it, plus
5 orphaned rules). It now opens on the Reserve Price row.
**The two notes are visually distinct**, as the spec required: the deposit note is **filled** — a
6% green tint on paper, since it is reassurance about money and should read as a settled fact — and
the process note stays transparent on the card with a burgundy rule, since it is a sequence, not a
guarantee.
**"Submit your e-tender" label deleted**; the button says it.
**The agent route is DEMOTED** from an outlined peer button to a quiet 13px muted link under the
CTA — measured 13px/500 muted vs 15px/700 on the button. Bryan's reasoning, now in the code
comment: reaching the agent first turns this into a traditional sale and the tender never happens,
so the route stays available (still a lead) but must not read as an equal choice.

🐛 **Caught in the render, and it is a new trap for DESIGN-SYSTEM §5:** my splice left
`text-align: center` AND `text-align: left` **inside the same rule**. The last one wins, so the
numeral aligned left while its eyebrow inherited centre — the panel looked like two columns when
it was one. Neither the browser nor tsc warns. Swept the whole stylesheet for duplicate properties
per rule; this was the only one.

### 3 Aug 2026 — 🚨 **DEADLINE SET: complete revamp to Vicky by 31 Aug.** Plan in `PLAN-AUGUST-DELIVERY.md`
Bryan, today: *"we have to finish everything… all the pages (homepage, services, sell, about us),
basically a complete website revamp as a whole package and send to vicky before end of this
month."* **28 days, of which week 4 is handoff prep — so 21 build days.**

**Codex: read `PLAN-AUGUST-DELIVERY.md` before your next task.** The parts that change how we work:

- **Split by PAGE, never by layer.** One agent owns a page end-to-end — markup, styles, copy. Two
  agents in the same stylesheet on the same day is exactly how the duplicate-selector bugs
  happened. Claim before editing, release on push.
- **The detail page and grid are the DESIGN SYSTEM, not two pages.** Every remaining page composes
  from that vocabulary. **No new visual languages** — if a page seems to need one, the page is
  wrong, not the system.
- **The Sinaran detail page gets ONE more review pass, then it is FROZEN.** It is good. It could
  otherwise absorb the month.
- `/member` is **out of scope** (Bryan owns the dashboard design). `/owner-auction` is a **concept
  page only** — he has said repeatedly it is last to revamp. `/buy` and `/rent` get **deleted**.

**Order:** detail-page freeze → `/how-e-tender-works` (3 live links already point at it) → homepage
→ `/sell` → `/about` → `/services` → owner-auction concept → **week 4 hardening**: 375px pass,
compliance sweep, **strip the 12 `demo: true` records**, update `BACKEND-CONTRACT.md`, refresh both
briefs, production build.

**The real constraint is not build speed** — it is (1) content only the founder can supply,
(2) review latency, (3) scope creep on finished pages. Eight founder questions went to Bryan today
(§5), pricing being the one that blocks `/sell`.

### 1 Aug 2026 — Claude · `COLLABORATOR-BRIEF.md` — briefing a human/model joining as a reviewer
Bryan plans to bring DeepSeek in to review screenshots and give opinions, and asked what else it
needs beyond TenderProp — the family business, how he works, about him.

**Two files, sent as a pair, no overlap** (verified: 1 duplicated block out of 79, the design
tokens, deliberate):
- **`COLLABORATOR-BRIEF.md`** (204 lines) — the person and the context. Who Bryan is and how he
  communicates; The One Property Global and why an agency-first direction matters; BOVAEP / Act 242
  as design constraints; iNewProject vs TenderProp and the banned-vocabulary rule; his six standing
  working rules; **how to give feedback he can use**; the design system; and what is/isn't useful
  from a reviewer.
- **`TENDERPROP-BRIEF.md`** (274 lines) — the product.

The section that matters most for a reviewer is *"How to give feedback he can use"*: have a ranked
opinion, **numbers not adjectives**, **name the fault axis** before proposing a fix, say **what it
reads as**, and ask rather than guess.

⚠️ **Maintenance:** these are now a second and third source of truth. `AGENTS.md` carries the rule
— **when canon changes, update the briefs**, and the design tokens live in both on purpose.

### 1 Aug 2026 — Claude · `TENDERPROP-BRIEF.md` — the A–Z in one self-contained file
Bryan wants to hand the whole of TenderProp to DeepSeek. The repo is **private** (404 anonymously),
and even with access, TEAM-LOG is 1,600 lines of build history and the PLAN files are historical in
places — an outsider would have to navigate around our working notes to find the business.

So: **one file, 274 lines, no external dependencies.** Verified it points outward for nothing
essential. Covers the business and the moat, the money (off-platform, client account, BOVAEP), the
9-step buyer journey, the 8 rules that keep getting broken, E-Tender vs Owner Auction, what is
built vs framed, the data model including derived-do-not-store, design tokens and brand rules, the
settled decisions, the 6 open questions, and who does what.

`README.md` and `AGENTS.md` both now point at it as step 0. **Keep it in sync when canon changes** —
a second source of truth that drifts is worse than none.

### 1 Aug 2026 — Claude · README rewritten as the real entry point; stale reserve claims purged
Bryan asked whether he could hand the repo link to DeepSeek to digest all of TenderProp. Audited it.
**Two blockers, one now fixed.**

**Fixed — the README was teaching the wrong business model.** It said buyers "submit one sealed
offer **with** a refundable deposit of 3%", i.e. money moving through the platform, plus an
unsourced "refunded in full within 3 working days". Both wrong as of today's founder briefing.
`## What TenderProp is` is now the full model — lead engine, no money on-site, the 7-step buyer
flow, the four form fields, reserve-is-a-guide, the two-banner moat, and an E-Tender vs Owner
Auction table — with a line saying **this section wins over anything that contradicts it**, and a
numbered reading order for newcomers.

**Also purged the last stale "floor" claims**, which would have taught a newcomer the opposite of
the product: `BACKEND-CONTRACT.md` §2 (`reservePrice` was "The floor, not an asking price") and
`PLAN-residensi-sinaran.md` (annotated **[SUPERSEDED]** rather than rewritten — it is a historical
record of what shipped that day).

**Still a blocker, Bryan's call:** the repo is **PRIVATE** (GitHub returns 404 anonymously), so a
bare link gives an outsider nothing.

### 1 Aug 2026 — Claude · Tender information finished for today + **HANDOFF FOR CODEX**
Last edits: span **arrow between the two dates** (`E-Tender started → Closing date`) — the dates
are a span, not a list; `align-items: start` so both dates share a line, arrow measured onto it
(**0.1px** off). And **"See how e-tender works" moved inside the Method fact**, under
"Confidential" (Bryan) — it explains the method, so it sits with it instead of stranding at the
foot of the section — then made prominent: **11.5 → 13px, weight 600, full burgundy, solid
underline**.

---

## 🚨 CODEX — READ BEFORE YOUR NEXT EDIT

**1. `AGENTS.md` has a new top section: “WHAT TENDERPROP ACTUALLY IS”.** Bryan gave the full
founder briefing today after saying we were both building as if we did not know the business. It
is short. Read all of it. The one-line version: **TenderProp is a lead engine for a licensed
agency — no money moves through the site.** Apply → sign-in → a form taking name / email / phone /
bid price → a lead reaches the agency; the agent collects the 3% afterwards into the agency's
client account, per BOVAEP. Anything that implies an on-site transaction is wrong.

**2. Three new rows in the DECISIONS table.** All founder-sourced, all previously guessed wrong by
one of us:
- **The reserve price is a GUIDE, not a floor.** Buyers deliberately offer below it. "Minimum
  offer considered" / "the floor" is now banned copy — it makes the e-tender a fixed-price
  listing with extra steps.
- **No money moves through the platform** (above).
- **No registration deadline exists.** Our "closing − 14 days" was invented; deleted.

**3. On the negotiation line.** You removed *"the appointed agent negotiates on your behalf"*
twice as an unsupported claim. **Correct instinct, wrong on the facts** — Bryan has now confirmed
it twice, and it is in the DECISIONS table with his name. Keep it hedged ("where there is room to
move") and leave it in.

**4. What I changed in your `a840414` and why** — two of yours were better and I kept them
("3% of the reserve price"; plain-English privacy wording, now `Method / E-Tender / Confidential`).
The rest is in the entry above: submit block led with a caveat, the outcomes read as a clickable
control strip, the label layer added two accent colours, and `"ladder ladder"/"howto howto"` left
the process link stranded with 142px beside it.

**5. Still open, needs Bryan:** whether **"Or talk to the agent first"** deserves equal weight
beside Apply — his own reasoning is that reaching the agent first turns this back into a
traditional sale. My view: demote to a quiet link, keep the lead.

**6. Founder-blocked, unchanged:** Sinaran's real closing date (**885 days out** is not a tender),
the 5-working-day response window, `tenderStartOf`'s closing − 3 months, agency REN numbers,
seller package pricing. All in `BACKEND-CONTRACT.md` §6.

**Claims: all areas free.** Detail page verified — production build passes, tsc clean, no dead
selectors, section 414px, zero horizontal overflow.

### 1 Aug 2026 — Claude · 🚨 FOUNDER BRIEFING RECEIVED — read `AGENTS.md` § WHAT TENDERPROP ACTUALLY IS
Bryan: *"i feel like you and codex building this like you dont know what tenderprop is."* Fair.
He then gave the whole model. **It is now canon in `AGENTS.md`, above the backend section. Codex:
read it before touching another word of buyer copy.** Headlines:

- **TenderProp is a LEAD ENGINE for a licensed agency, not a transaction platform. No money moves
  through the site.** Apply → sign-in/sign-up (members only) → Tender Form Application → a lead
  reaches the agency. The **3% is collected afterwards by the agent into the agency's client
  account**, which BOVAEP mandates. Same shape as iNewProject.
- The form takes exactly four things from the buyer: **name, email, phone, bid price.** Everything
  else is pre-filled listing data. Contract §6b now specifies it.
- **The agent is the middleman for everything after submission** — takes the bid to the seller,
  relays accept/decline/counter, negotiates, and a buyer may resubmit.
- Listings come from the agency's own agents, who then pitch the e-tender concept to sellers.
  Tenders run **3–6 months**. The moat is **two banners outside every listing** — The One Property's
  and TenderProp's — so 100 listings advertise the platform from 100 locations for free.
- **E-Tender vs Owner Auction: a seller picks ONE.** Owner Auction is live bidding with a licensed
  auctioneer, 3% to enter the room (ref: `ownerauction.my`). **Last to revamp.** Public auction
  (bank foreclosures) is a future tab.

**Two factual errors on the page, fixed:**
1. **"The floor — offers start here" / "Minimum offer considered" were wrong.** The reserve is a
   **guide**; buyers deliberately offer below it and the seller may accept or counter. Now
   *"The seller's guide — you choose what to offer"* and *"Offer above or below it"*. This one
   mattered: a floor nobody may cross makes the e-tender a fixed-price listing with extra steps.
2. **The registration deadline never existed.** `REGISTER_LEAD_DAYS`/`REGISTER_BY_LABEL` deleted —
   an account is only needed at the moment of applying. My earlier note that it "appears nowhere"
   was right about the render and wrong about the fix: it should not appear anywhere.

⏭ Open, for Bryan: whether **"Or talk to the agent first"** belongs beside Apply at equal weight —
his own reasoning is that reaching the agent first turns this back into a traditional sale.

### 1 Aug 2026 — Claude · Tender information: Bryan's pass (facts, submit block, ladder out)
- Third fact is **Method / E-Tender / Confidential** (was Offer privacy / Private / long sub).
  It now says which of the two products this listing is sold under — E-Tender vs Owner Auction —
  which is real information; "Offer privacy: Private" restated its own label.
- **Submit block: two real buttons**, `Apply for E-Tender` + `Or talk to the agent first`, side by
  side on desktop and stacked full-width under 700px. The second was a text link, which made a
  genuine choice look like a footnote to the thing it is an alternative to — **a buyer who wants
  to talk before committing a 3% deposit is not a lesser case.** Outlined, not filled: still
  second, but second among buttons.
- Body copy removed (Bryan: too lengthy). Heading only.
- **Payments ladder deleted** — /how-e-tender-works owns the process. Took **27 dead CSS rules**
  with it plus `.btn-wa`; the section's last row is now the process link alone, aligned left so it
  does not strand the way it did right-aligned.

⚠️ **The registration deadline now appears NOWHERE on the page.** It left the deadline panel when
that panel was cut to two dates, and it was in the sentence Bryan just removed. `REGISTER_BY_LABEL`
is still derived and unused. Flagged to Bryan — needs a home or an explicit decision to drop it.

Section 414px, no overflow, two accent colours gone.

### 1 Aug 2026 — Claude · Reviewed Codex's `a840414` tender-information pass, fixed 5 things
Bryan: *"codex work, looks ugly"*. Reviewed the render and the diff. **Two of Codex's changes were
keepers and I have left them alone:** "3% of the reserve price" (the old sub-line duplicated the
callout below it), and **Offer privacy / Private / "Not shown to other buyers or the public"** —
plainer than "Sealed" for someone meeting the word for the first time.

Fixed:
1. **Submit block led with a caveat.** "Before you apply / Have your account verified by…" — the
   block whose whole job is to BE the submit point opened by telling you not to yet, and Bryan's
   brief for this section was explicitly *"a place where people submit their tender"*. Back to
   **"Submit your e-tender"**, with the precondition as the supporting line and the sentence that
   says what submitting *is* ("one confidential offer at or above the reserve") restored.
2. ❗ **The founder-verified negotiation line had been deleted** (second time — see the new
   DECISIONS row). Restored, hedged. Codex's three outcomes are right and stay, but as a **bold
   lead sentence** rather than three bold spans with dot separators, which read as a control strip
   you could click — and which now matches the pattern of the callout beside it.
3. **Dropped the `.v1-assurance-label` layer.** Uppercase "YOUR DEPOSIT" / "AFTER SUBMISSION" above
   each callout was a third layer of labelling on top of a bold lead and a coloured left rule —
   and it introduced **two accent colours** (green + burgundy) for no information.
4. **The process link was stranded.** Codex split the areas into `"ladder ladder"` / `"howto howto"`,
   putting the link alone on its own row with **142px of dead space** beside it. Back to one row.
5. **Ladder summary was wrapping to two lines** in the shared row — its "3% · +7% · 90%" sub-line
   restated, less precisely, the exact ladder inside the accordion. Removed; summary is one line.

Section is **414px** again (was 428), no overflow.

### 31 Jul 2026 — Codex · Tender Information right-panel decision hierarchy
Reworked only the shared right information plane; the approved deadline panel is unchanged. Facts
now answer reserve / 3% deposit / privacy, with privacy accurately limited to other buyers and the
public rather than claiming only the seller can see an offer. The two formerly unlabelled paragraphs
are now named confidence blocks: **Your deposit** and **After submission**, with the founder-confirmed
accepted / countered / not accepted paths visible before the CTA.

The action band is shorter and prerequisite-only: verified account by the existing derived date,
then one red Apply for E-Tender action plus agent enquiry. Payment schedule and process link no
longer fight inside one stretched footer. The closed payment control is compact; opening it spans the
full right plane so 3% / +7% / 90% figures do not collide. Mobile's old two-column submit bug is
fixed — action copy and buttons now stack at full width with 44px secondary targets.

Rendered three one-character-switch treatments and discarded the two weaker structures. Final
review: 426px @1440, 485px @1024, 549px @768, 633px @701, 1,061px @375; zero horizontal overflow
at every width. The live timer ticks, collapsed/expanded payment states work, browser console is
clean, `npm run build`, `npx tsc --noEmit`, and targeted ESLint (Prettier rule disabled because of
the repo-wide existing formatting backlog) pass. Independent design critique verdict: **Ship.**

### 1 Aug 2026 — Claude · Eyebrow → "E-Tender closes in" · numeral and unit tightened
Bryan: eyebrow wording, then *"885 and days left closer to each other"*.

Measured: the true glyph gap was **32.4px** while box geometry reported **4px**. Two leadings had
stacked — the numeral's own (uncorrected beyond the hero's `-.076em`) plus a `margin-top: 10px`
on the unit. The hero sits at 15.9px under a 112px numeral, so the proportional target for this
76px one is ~11px. Unit margin to 0 and numeral `margin-bottom` to **-.23em** → **10.7px**, with
16.7px above. Both in the numeral's own em, so the pair holds across the clamp.

**Note for reuse: the hero's `-.076em` is NOT portable.** It was tuned against a 16px unit with no
margin; this unit is 12.5px and had one. Re-measure with canvas TextMetrics whenever the numeral
or its unit changes size — box geometry is blind to all of it.

Eyebrow reads **"E-Tender closes in"** (his "close" → "closes"; singular subject). The /tender
hero still says "Offers close in", which is correct there — that countdown is the next e-tender
CYCLE across many listings, not one tender.

### 1 Aug 2026 — Claude · Left panel now mirrors the /tender hero · heading → "Tender information"
Bryan: *"we can copy exactly from the tender page, offers close in with the timer, and also a
closing date and a tender start date, thats all for the left side."*

Same composition as the hero, same technique: `.v1-timer .u` is a **`1fr · numeral · 1fr` grid**
with the H/M/S strip in column 3, so the empty first column mirrors it and the numeral holds the
panel's centre axis however wide the strip gets — **measured axis spread 0px** across eyebrow,
numeral and unit. Numeral `clamp(46px, 5.6vw, 76px)` (hero is 112px; this panel is 582px wide),
with the same `line-height: .8` + `margin: .15em 0 -.076em` leading correction, in the numeral's
own em. Strip carries the leading colon, as the hero does.

Below a hairline: **E-Tender started** and **Closing date**. "Register by" is gone from this panel
— it is already stated in the submit block, where it is actionable rather than a third date to
read. Panel is centred now, like the hero.

Heading is **"Tender information"** (Bryan), not "E-Tender terms".

🐛 Nearly shipped a duplicate-selector bug: there were **two** `.v1-timer` definitions, and the
later one (`display:flex`) silently beat the earlier — DESIGN-SYSTEM §5's exact trap. Consolidated
to one. Also removed `.v1-register` / `.v1-closing-date` rules, now dead.

⚠️ `tenderStartOf` is **closing − 3 months** and, like the 14-day registration lead, is a guess.
Both are flagged in BACKEND-CONTRACT §6 — if tenders do not all run the same length, start date
is a stored field, not a derivation.

**Next: Bryan wants the right panel worked heavily.**

### 1 Aug 2026 — Claude · E-Tender Information rebuilt as **E-Tender terms + submit**
Bryan approved a full remake. The brief he set: *"ensure this is terms of the tender, and also a
place where people submit their tender."* That settled the architectural question — the section
had been trying to be both *"what is an e-tender"* and *"what are the terms of THIS one"*, which
is why the right panel carried six stacked blocks with no ranking.

**Measured before:** left panel took **40% of the width for 27 words** (~4× less dense than the
right), the deadline was stated **four** ways, and the heading *"E-Tender closes in"* ran at
**39.7px against a 54px** day count — a **1.36:1** label-to-value ratio, the same fault the
listings hero had at 1.26:1 before it went to 2.6:1.

**Left panel** — one deadline. The 39.7px heading is gone; the eyebrow now carries that sentence
in the listings hero's own words ("Offers close in"), so the ratio is **4.9:1**. The date sits
under the day count as its subordinate. "Register by" is boxed separately because it is a
genuinely *different* obligation — you cannot submit without a verified account — and is now
**derived** from closing − 14 days rather than typed.

**Right panel** — heading is one label (`E-Tender terms`), not an eyebrow stacked on a label.
Third fact retitled from "E-Tender method: Sealed E-Tender" (a label answered by its restatement)
to "Your offer / Sealed / One offer, seen only by the seller". The two reassurances sit side by
side as peers. **New: the negotiation note** — founder-verified, and it was nowhere on the page
while "sealed, one confidential offer" reads as one shot, all or nothing.
**New: the submit block** — burgundy top rule on paper, same treatment as the /tender search form,
so "this is the control" reads the same sitewide.

🗑 **The 1-2-3 "How the e-tender works" is gone** — it was the THIRD explanation of the process on
this site. Nothing was lost: register/verify became the submit block's precondition, "one
confidential offer" is a term, the 5-day response is in the negotiation note. A quiet link points
at the page that owns the process. `.v1-steps`, `.v1-actions` and `.v1-deadline-meta` are deleted.

🐛 Found while reading the CSS: `.v1-timer` was still `grid-template-columns: repeat(4, 1fr)`
from the old four-cell D/H/M/S clock. With one cell left, **the number was sitting in the first
QUARTER of a full-width rule.**
🐛 Caught in the render: `justify-content: space-between` on the deadline panel opened a **~230px
hole** once it held two blocks instead of four; and the process link wrapped to two lines in its
column, so it dropped the "New to e-tender?" prefix — that framing belongs on the listings page,
where a visitor may not know the word yet.

**After: 32 / 137 words, deadline stated once, "sealed" once, section 452px.**

### 1 Aug 2026 — Claude · Reserve price → ink · data-driven media row · **BACKEND-CONTRACT.md**
- **Reserve price is `--ink`, not burgundy** — same call Bryan made on the RM369 psf. A price is
  a fact, not an accent; burgundy stays on the tender identity and the one action.
- **Media row is data-driven.** `media: { video, floorPlan, tour, aerialFrom }` on the Tender
  type; a button renders **only** when its key is present. Sinaran carries `aerialFrom: 1`, so it
  shows Drone and nothing else. *"Video viewing — on request"* is deleted — Bryan: *"bruh what is
  video viewing on request? lol"*. He was right: it advertised a feature the site does not have.
  **Absence should remove a control, not add an apology.**
- Brainstormed the subsale media set. Verdict: **floor plan is the missing button** — for a
  multi-storey home the layout is the one question photos cannot answer, and the site has none
  anywhere. The slot is built and waiting on the file. Street view is the free second win but
  belongs in the Location section beside the existing map, not the media row.

📌 **NEW STANDING CONTEXT — read this, Codex.** Bryan: *"easyasia is our backend… we give them the
frontend, they understand, and rebuild the backend."* So **every field we render must be one a
real admin can fill.** [`BACKEND-CONTRACT.md`](./BACKEND-CONTRACT.md) is now the handoff doc, and
`AGENTS.md` carries the rule: **no rendered field without a contract entry in the same commit.**

Its most important section is §1 **DERIVED — do not store**: days-left, psf, the 3% deposit and
batch grouping are computed from the listing. If EasyAsia builds admin inputs for them, an admin
can type a value that contradicts the source — which is the 885-vs-884 bug from this morning,
except at the data layer where nobody catches it. §6 lists the founder-blocked gaps so they know
what is still coming.

### 1 Aug 2026 — Claude · Sinaran gallery rebuilt in React. The "+1" click was deforming the page.
Bryan: *"the logic and image function, its broken"*. What was actually wrong:

1. **The "+1" tile APPENDED a 7th thumb** into a grid whose CSS declares
   `grid-template-rows: repeat(3, 1fr)`. Seven tiles in two columns = four rows with an orphaned
   cell — and since `.gallery` is `align-items: stretch`, the STAGE stretched to match and
   overrode its own `aspect-ratio: 3/2`. **517px → 683px**, hole in the bottom corner, permanent,
   from one click. That is the deformed layout in his screenshot.
2. **The viewer showed one photo with no navigation**, under a hint promising "View all 7 photos".
3. **Photo 7 was unreachable** except by first making the click in (1).
4. `#stagebox` was a `div` — **no keyboard access at all** — and the "View all photos" hint inside
   it was a `span` with `pointer-events: none`, i.e. decoration shaped like a control.

Now: gallery + viewer are **React state**; the imperative versions and `window.__resources` are
deleted from `tender-detail-behaviour.ts`. Grid holds **exactly six tiles forever**; the sixth
carries "+N" and **opens the viewer** instead of growing the grid — which is what its own label
always claimed. Viewer has prev/next, a counter, wrap-around, Escape and arrow keys, backdrop
close, scroll lock, `role="dialog"`/`aria-modal`. Stage is a `<button>` with a focus ring.

Verified: grid **6 tiles / 517px** before and after the overflow click, stage holds **3:2**;
open at 3 → arrow to 4 → close returns the stage to 4 from **all three exits**.

🐛 Two of my own, caught in the render: the badge read **"+2"** (I counted the visible sixth photo
as hidden — it is `PHOTO_COUNT - THUMB_SLOTS`), and **Escape did not hand the stage back** the
photo you ended on while the close button and backdrop did — three exits, two behaviours. Also
split the scroll-lock effect off `lightbox`, since keying it there tore down and rebuilt the lock
on every arrow press.

🔧 Measuring note: `.click()` on a React control does not update the DOM synchronously — read the
result in a SEPARATE tool call. And `requestAnimationFrame` never fires in a backgrounded tab, so
an rAF-based `await` hangs the evaluation until it times out.

### 1 Aug 2026 — Claude · Deadline maths unified. The page was contradicting itself by a day.
First thing I measured this morning on the Sinaran page: the header pill said **885 days left**
and the panel below it said **884 DAYS LEFT** — computed from the same `diff`, in the same
`calc()`, one with `ceil` and one with `floor`. Pulling that thread found **six** day-count
computations across four files, disagreeing on two axes:

- **Rounding:** `ceil` in `tender-utils.daysLeft` (→ every card) and the detail header; `floor`
  in the detail panel and the /tender hero. So the hero read **134** while its own cards read
  **135** for the same closing date.
- **Timezone:** `tender-utils.daysLeft` and one legacy block parsed `"…T23:59:59"` with **no
  offset** → host-local time. Proved it: on a UTC host that shifts the deadline **8 hours**, so
  SSR and the browser can land on different days. Masked locally only because Bryan's machine
  is MYT.

Now: `MS_DAY`, `closeAtMs`, `remainingMs`, `daysLeft` (ceil), `isFinalDay` in `tender-utils`, and
**no component divides by 86400000 any more** — verified by grep. `isFinalDay` reads the
remaining ms, not `days < 1`, so it cannot invert if the rounding changes.
Verified: detail header **885 = 885** panel; /tender hero **135 = 135** on all five cards
sharing its batch date.

🗑 Deleted two dead countdown blocks in `tender-detail-behaviour.ts`. They wrote into
`#tender-days-left`, `.t2-days-wrap`, `#cd-days`, `#cd-d` — **none of which exist** since the
panel revamp — while carrying a **hardcoded `2028-12-31`** that ignored the listing data. Dead
code with a wrong date in it is worse than dead code. The live sticky-bar and gallery code stays.

⚠️ **FOUNDER QUESTION, unresolved:** Sinaran closes **31 Dec 2028 — 885 days out**, while the
/tender hero's next cycle is **12 Dec 2026**. An 885-day tender is not a tender, and it makes the
days-led countdown we built for the founder look absurd. This is data, not code: Bryan needs to
confirm Sinaran's real closing date, and it should be one of the batch dates.

🔧 Note for measuring: this site sets `scroll-behavior: smooth`, which **silently swallows**
programmatic `scrollTo`/`scrollIntoView` from the console — scrollY stays 0. Use
`window.scrollTo({top, behavior: 'instant'})` when measuring.

### 31 Jul 2026 — Claude · Colons: visible, scaling correctly, and one added at the head
Bryan, twice: *"the : is not visible enough"*, then *"there should be a : in between 134 and 22,
or im tripping"*. He wasn't — the rule was `.hero-tick-cell + .hero-tick-cell::before`, which by
definition only punctuates joins BETWEEN cells, so the sequence started "134 22ʜ" unseparated.
`.hero-tick::before` now supplies the head colon. Reads **134 : 22ʜ : 10ᴍ : 37ˢ**.

Visibility: **.82em/500/45% → .72em/600/78%**.

🐛 Fixed while in there: the colons were `em`-relative to an **inherited 16px**, not to the
digits — so they stayed ~15px while the digits scaled 17→22px across their clamp, and the ratio
drifted at every width except the one I happened to be looking at. The digit scale now lives on
`.hero-tick` and both the value (`1em`) and the colons (`.72em`) derive from it.
**When you size a pseudo-element in `em`, check WHICH font-size it inherits — it is the element
the pseudo hangs off, not the sibling it visually pairs with.**

Spacing: strip `margin-left` 18 → 12px, and the head colon takes `margin-right: 6px` like the
others; with the flex gap it sits 12px clear on both sides while inner colons sit at 6px. The
extra air is deliberate — a 112px numeral beside 22px digits needs it to read as one sequence.
Block now 577px in a 720px panel, axis spread still 0.

### 31 Jul 2026 — Claude · H/M/S strip enlarged + colon separators
Bryan: *"make the larger abit, and perhaps add a :"*. Value **18 → 22px**, unit **10.5 → 12px**,
colons back between cells as `.hero-tick-cell + .hero-tick-cell::before` at `.82em` / 45% cream —
the same treatment the deleted pill used. Flex gap 6px and colon `margin-right: 6px` so the glyph
sits evenly between cells rather than clumping to one side.

⚠️ **Growing the strip moved the mobile breakpoint.** The mirrored grid columns now need ~418px
at the smallest numeral, and the diagonal leaves the left panel only ~400px at a 720px viewport —
so the collapse-to-one-column query went **700 → 820px**. Any further change to the strip's size
or copy must re-check this number: the strip is duplicated on BOTH sides of the numeral by the
`1fr auto 1fr` grid, so every pixel it gains costs two.
Day-count block now 553px inside a 720px panel; axis spread still 0.

### 31 Jul 2026 — Claude · Bryan's idea: corner pill deleted, H/M/S now hangs off the day count
His call and a good one — it kills the duplicated "134" (the pill repeated the page's biggest
number ~200px from it) and puts the fine grain where the scale is, so the panel reads as **one
instrument instead of two countdowns**. `.hero-clock`, `.hero-timer-cells`, `.hero-timer-cell`
and all their rules are deleted; the new classes are `.hero-tick*`.

**The layout trap and its fix:** anything placed beside the numeral makes a flex row centre the
BLOCK, which shoves the numeral off the panel's axis — the exact fault this panel already had
once. `.hero-timer-days` is now `grid-template-columns: 1fr auto 1fr` with the numeral in the
centre column and the strip in column 3 (`justify-self: start`); the empty first column mirrors
the third, so **axis spread stays 0px** no matter how wide the strip gets. The unit sits in row 2
of the same centre column.

🐛 Caught in the render: those mirrored columns widened the block to **493px**, so the
`border-bottom` divider ran wider than the date beneath it — a separator out-measuring what it
separates. The rule is now a `::after` with its own `clamp(190px, 20vw, 280px)` measure: 280px
against a 338px date, 207px numeral.

📱 Below 700px the grid collapses to one centred column and the strip drops to row 3 — side by
side it needed ~358px at the smallest numeral, more than a 375px phone has after padding.
Strip hides entirely on the final day, when `countdownValue` is already showing hours+minutes.

### 31 Jul 2026 — Claude · Same leading bug, other end: label was 1.7px off the digits
Bryan: *"something is wrong man"* — the eyebrow was touching the top of "134". My own regression:
`line-height: .8` makes the glyphs overflow the line box in **both** directions, and I had only
corrected the bottom. Digits rose 10.6px above their own box, so a 7px box gap rendered as a
**true 1.7px**. Now `margin: .15em 0 -.076em` on the numeral — **top 18.5px, bottom 15.9px**,
both measured with canvas TextMetrics, both in the numeral's own em so the pair scales together.
Panel 30px top and bottom, no overflow.

**Lesson for the next agent:** when you tighten `line-height` on display type, you have created
TWO spacing faults, not one. Measure above and below before you call it done.

### 31 Jul 2026 — Claude · Hero time showcase re-cut (positioning, size, hierarchy)
Bryan: *"make it eye stunning… mostly positioning and font size"*. Measured first: the day count
was **74px against a 58.8px date — a 1.26:1 ratio**, and the date string is 3.5x wider, so the
DATE was visually the headline. That inverts the founder's rule. Now:
- Day count **74 → 112px**, date **62 → 44px** (clamp caps). Ratio **2.63:1**, unambiguous.
- Corner chip **28 → 22px** (5:1 against the headline). It repeats the day count verbatim, so at
  equal weight it read as a second headline. Content unchanged — Bryan wants the D/H/M/S there.
- Unit **stacked under the numeral**. Inline, the block was centred, which put the numeral 53px
  off the shared axis. **Axis spread is now 0px** across all six elements.
- Clock glyph on "OFFERS CLOSE IN" deleted — it duplicated the live corner timer AND pushed the
  label 10px off that axis.
- Panel 38px top and bottom, no overflow.

❌ **I changed "days left" to "days" on a redundancy argument and Bryan caught it — that copy was
not mine to change.** Restored. Wording is the founder's; treat it as fixed unless he says
otherwise.
🐛 A regex edit merged two selectors into `.hero-panel-left.is-dark .hero-panel-left.is-dark
.hero-timer-label`, which matches nothing and would have killed the label colours on the dark
panel. Caught by reading the file back. **Don't use regex on selector lists.**

### 31 Jul 2026 — Claude · Hero CTA removed; the left panel is now purely the deadline
Bryan: *"should i remove the view etender properties button, its kinda redundant no? the
properties is literally right below... i kinda want to make the left side as like a proper
showcase of time only"*. Agreed and done.

**A CTA whose destination is the next thing on the page is not an action.** The visitor was
already going to scroll, and the button competed with the search bar directly below it — which
is the real entry point. `.hero-cta` and its mobile override are deleted; the closing-date line
is now the deadline's footnote (16px off the date, was 8px, which was spacing sized for a button).

Side effect worth having: **red now appears only on Register, Search and "Show 36 properties"** —
three real actions. The hero holds no action colour at all, which is correct for an
informational panel. Panel re-centred at 56px top and bottom, 111px of slack, no hole left.

⚠️ `id="listings"` is now unreferenced from this page. Left in place deliberately — it is still
a valid deep-link target. Don't "clean it up" without checking inbound links.

### 31 Jul 2026 — Claude · Only the link is a link now + link affordance settled (no blue)
Bryan: *"why can i click on the link when i click on new to e-tender? thats so weird"* — correct,
that was a real bug. The whole line was one `<a>`, so clicking apparently-inert text navigated.
**Hit area must match affordance.** `<b>New to e-tender?</b>` now sits OUTSIDE the anchor in a
`.howto-line` wrapper; only "See how it works →" is clickable. Verified by hit-testing
`elementFromPoint` at the centre of each: question `false`, link `true`.

The rule moved to `.howto-line::before` and answers the link's hover through
`:has(.howto-link:hover)`, so the divider still lights with the link.

**No blue.** Blue would be the only non-brand colour on the page and it is not needed: the link
already carries three affordances — burgundy, underline, arrow. Colour alone is never sufficient,
but colour + underline is the web's oldest convention and it works in any palette. Strengthened
the underline 38% → 55% burgundy (solid on hover) and took the link to weight 500 so it separates
from the 600 question. Classes `.howto-text` / `.howto-rest` are gone.

### 31 Jul 2026 — Claude · The line is now CENTRED on the rule, not baseline-aligned
Bryan: *"move it to the middle man"*. He was reading the 17px line as hanging at the foot of the
33px rule — because it was baseline-aligned to the heading, which is typographically correct and
optically wrong at this size gap. **Against 46px type, a 17px line sitting on the shared baseline
sinks.** `.howto-link` is now `align-items: center`.

The rule still ends exactly on the heading's baseline and rises to its cap (538→571 against a
536→586 heading box) — only the type moved. Rule centre and text centre both 554.9, arrow still
0 off the text.

**Rule worth keeping: baseline alignment stops being the right answer past roughly a 2:1 size
ratio.** Below that, share the baseline. Above it, optically centre the small element on the
large one's cap band, or it reads as sinking.

### 31 Jul 2026 — Claude · Fixed the floating arrow I introduced with the rule
Bryan caught it: the arrow was hovering up near the heading's cap line, detached from "See how it
works". **My own regression from the previous commit.** `align-self: center` centres against the
flex LINE — and the moment the 33px rule became a flex item, the line was twice the height of the
type, so the arrow dutifully centred on the rule.

Fix: `.howto-text` wraps `b + .howto-rest + svg`, so the rule is a sibling of that group rather
than of the arrow. Arrow centre and text centre now measure **identical (offBy 0)**, gap 4px
metric / ~7px optical. Also pulled the arrow left 3px — the path starts at x=5 of a 24 viewBox,
so the glyph carries its own left padding and the optical gap was wider than the metric one.

Recorded in DESIGN-SYSTEM §5 — it will bite anyone who adds a tall element to a text row.

### 31 Jul 2026 — Claude · Refined the shipped "New to e-tender?" line (Bryan: any improvements?)
Three fixes after judging the render at zoom:
1. **The rule was sagging.** As a `border-left` it was sized by the LINK's box: it started 16px
   below the heading's cap and stopped 4px short of the baseline — an arbitrary tick, not a
   divider. It is now a `::before` **flex item**: an empty block flex item baseline-aligns on its
   bottom edge, so the rule ends exactly on the shared baseline and rises to the heading's cap
   height. Height is `calc(var(--head-size) * .72)` off the new `--head-size` token (which also
   drives the h2), so it tracks the clamp instead of being a guessed pixel value.
2. **17px, up from 16px** — 16 whispered next to a 46px heading. 2.7:1 ratio now.
3. **Hover moves the rule too**, so the divider and the link read as one object.

⚠️ **The breakpoint is MEASURED — re-measure it if the copy changes.** The row needs 1080px of
content box at the heading's 46px cap and the band carries 80px padding, so it stops fitting at a
1160px viewport; the media query sits at 1200px for 40px of slack. The 17px bump moved this — at
the old 1020px the line would have wrapped while the rule was still shown (blockquote look).
`flex-wrap: wrap` remains only as an overflow guard, not as the layout mechanism.

### 31 Jul 2026 — Claude · "New to e-tender?" SHIPPED — treatment 2, set against the title
Bryan picked **treatment 2** and asked for it close to the title. Done, and **compare mode is
fully removed**: `HOWTO_TREATMENT`, the `.map()`, the `"all"` branch, `.howto-compare-row`,
`.howto-tag`, the unused `.howto-mark`, and treatments 1 and 3 are all deleted. One
`.search-intro`, one `.howto-link`.

Final: heading and line share a baseline, 22px apart, separated by a 30px 2px burgundy rule.
Why close beats far-right — it's not only looks: at the far right it sat ~375px from the
heading, outside the same fixation band, so it read as a section action ("View all →") rather
than part of the title. At 22px it is inside the heading's own reading unit.

🐛 Caught before shipping: the rule was removed by a `@media (max-width: 1020px)` while the
wrap itself was driven by `flex-wrap` and available width — so for a band of viewport widths
the divider vanished while the line was still inline, which reads as a render glitch. The
media query now forces `display: block` at the same breakpoint, so layout and rule change
together. **Rule: if a media query removes decoration, it must also own the layout change that
decoration depends on — never let flex-wrap and a breakpoint disagree.**

### 31 Jul 2026 — Claude · All 3 "New to e-tender?" treatments rendered together for Bryan to pick
`HOWTO_TREATMENT = "all"` in `src/routes/tender/index.tsx` renders three labelled copies of the
search heading row, one per treatment, stacked with dashed separators. **This is temporary.**
When Bryan picks, set the constant to that number, delete `.howto-compare-row` / `.howto-tag`
from `tender-listings.css`, delete the other two `[data-howto]` blocks, and drop the `"all"`
branch and the `.map()` in the route — the row goes back to a single `.search-intro`.
Only the first heading carries `id="property-search-title"`; duplicate ids would break the
section's `aria-labelledby`. Don't ship compare mode.

### 31 Jul 2026 — Claude · "New to e-tender?" is now TYPE, not a card — 3 treatments live
Bryan diagnosed it and he was right: **the solid maroon fill was the fault, not the position.**
This page is flat cream and restrained type, so a saturated block reads as an ad wherever it
sits — moving it just moved the ad. His idea: hang the line off the search heading as type.

`.howto-card` is deleted. New `.howto-link`, switched by `HOWTO_TREATMENT` in
`src/routes/tender/index.tsx` (a one-character change) → `data-howto` on `.search-intro`:
- **1 (live, Bryan's idea, my recommendation)** — sub-line under the heading. Reads as the
  heading's own second line. Zero chrome; prominent by POSITION, not colour.
- **2** — right of the heading behind a 2px burgundy rule.
- **3** — tinted pill (burgundy at 7% on the band, not a fill) at the right of the row.

Two of these get deleted once he picks. Below 1020px all three collapse to treatment 1,
since a side-by-side would wrap the heading to two lines.

**Design note worth keeping:** the fix for "this element is ugly" was to remove weight, not to
relocate it. Prominence on a restrained page comes from position and whitespace — a saturated
block is the loudest thing on the page and always reads as advertising.

### 31 Jul 2026 — Claude · "New to e-tender?" moved into the search heading row (FINAL)
The full-bleed band is **gone** — Bryan: "i dont like it, its ugly placement". It read as a cookie
bar: a third stacked horizontal band that cut the hero off from the search instead of belonging to
either. The signal is now a burgundy card sitting in the **right half of the search heading row**,
which carried one line of type and 279px of dead space. Still the right side his father asked for,
still on the scan path, but riding existing whitespace instead of manufacturing a new band —
and now it sits directly above the search bar, the exact moment a first-timer stalls.
Measured: 404px card, right edge flush with the search form (1392 = 1392), bottom flush with the
heading (0px offset), description on one line, 22px to the form. Stacks full-width under the
heading below 1020px; verified at 760px and 606px with zero overflow and a 76px tap target.
Classes are `.howto-card*` now — `.hero-howto*` is deleted, don't reference it.

### 31 Jul 2026 — Claude · "New to e-tender?" is now a full-bleed band under the hero (FINAL)
Bryan picked the filled treatment and asked for better placement. **The variant switch is GONE** —
`HOW_IT_WORKS_VARIANT`, variant B and the in-panel version are all deleted. The signal is now its
own full-bleed burgundy band between the hero and the search band: on the natural scan path,
spans the page, cannot clip, and costs the hero panel nothing. The panel's original padding and
assurance spacing are restored, since the thing that squeezed them has left the panel.
Band: serif `?` · "New to e-tender? See how the sealed-offer process works, step by step" ·
"See how it works →" right-aligned (hidden under 640px so a phone gets one message per line).
Links to `/how-e-tender-works` — verified 200 with the right H1. 58px tall, no overflow.

🐛 Mid-change the page went down with `CssSyntaxError: Missing opening {` — my CSS splice left an
orphan `}` at line 1161, the SAME failure as the earlier hero-CSS incident. Found via
`preview_logs`, fixed, brace depth re-verified 0. **The rule from DESIGN-SYSTEM applies to CSS as
much as JSX: splice by line boundaries and re-verify balance after every cut.**

### 31 Jul 2026 — Claude · "How E-Tender works" signal — TWO VARIANTS LIVE, Bryan is picking
Founder wants the how-to link impossible to miss on `/tender`. Placed at the foot of the RIGHT
panel — that panel already answers "why should I trust this?", and "how does it work?" is the next
question a first-timer asks, so it is the correct home rather than a free slot.
**⚠️ TEMPORARY: `HOW_IT_WORKS_VARIANT` in `src/routes/tender/index.tsx` switches between them.
Delete the loser and the constant once Bryan picks — this must not survive the decision.**
- **B** — quiet strip on the panel's own ground, burgundy on light, serif `?` mark.
- **C** — same footprint, filled burgundy. Loud vs restrained at equal height.
Both link to the new framed route **`/how-e-tender-works`**, created in the same commit so neither
is a dead control. Named "How E-Tender works", not "How To E-Tender" — the latter reads badly as a
verb phrase and the homepage already used this wording. Never red: red is the one action on this
site, and diverting a first-timer to a guide before they have seen a property is the wrong win.

🐛 **Two fit problems found and fixed, both worth knowing:**
1. Adding the signal put the right panel at **415px inside a 412px hero** — zero gap at either
   edge. Compressed `.hero-assurance` padding rather than growing the hero: Bryan rejected an
   unasked panel-height increase before, and fit-content-to-panel was the right instinct then too.
2. **C's first design carried a 1·2·3 step preview and overflowed badly** — it clipped its own CTA
   and cut the top assurance's heading. Compacted to B's footprint so the choice is purely weight,
   not a trade against hero height. If the step preview is ever wanted, it needs a taller hero.

**Timer (same session):** kept all four D/H/M/S units — dropping days was proposed and **rejected
by Bryan**, correctly: without the day count "23:45:15" reads as closing tonight. Now in a soft
dark pill for legibility over the towers, with `font-variant-numeric: tabular-nums` so a live
seconds counter cannot twitch — the base rule faked it with `min-width` per cell, which reserves
the box but not the glyphs.

### 30 Jul 2026 — Claude · ambient clock in the hero's top right
Bryan wanted a timer back, so the hero now carries the **D/H/M/S strip** top-right of the burgundy
panel. (I first built an invented hh:mm:ss clock — wrong; he meant *the* timer, the four-cell one
the hero used to lead with. Same markup and classes, just demoted to 19px.) **This does not contradict the founder's rule** — the day count is still the headline at
clamp(46–74px); the clock is 13px at 62% white, deliberately unable to compete. `aria-hidden`,
because the day count's label already announces the deadline and a second live region reading
seconds would be hostile to a screen reader.

⚠️ **Keep it in flow (`align-self: flex-end`), never absolutely positioned.** My first attempt used
`right: calc(100% - var(--hero-top-split) + 3%)` to clear the diagonal and it landed *beside* the
"135" instead of in the corner. The panel's own `padding-right` already tracks the diagonal
(`calc(100% - var(--hero-bot-split) + 2%)`), so aligning to the content box's right edge clears the
seam for free — and keeps clearing it if the split angle ever changes. Below 860px the diagonal
collapses, so it centres with the stacked panel.
Also note: the in-app browser pane collapsed to width 0 again mid-check and returned nonsense
measurements (it reported the mobile media query as active). Verified in real Chrome instead.

### 30 Jul 2026 — Claude · countdowns are DAYS-LED (founder guidance) + media buttons restored
**Bryan's father: buyers care how many DAYS are left, not the timer.** Applied to BOTH surfaces:
the `/tender` hero and the E-Tender Information dossier now show **one figure — the day count** —
with the closing date beneath. The 4-cell D/H/M/S strip is gone from both.
**Codex: do not restore it.** You and I both flagged the 885-day seconds column independently;
the founder has now settled it. Rule in DESIGN-SYSTEM §3d.
⚠️ **One exception is load-bearing:** inside the final 24 hours `cd.d < 1`, so "0 days left" would
say nothing — the display switches to `{h}h {mm}m` / "left today". Days when days remain, hours
only when hours are all that remain. Both surfaces share the rule and the aria-label follows it.

**Media buttons restored under the gallery** (Bryan asked where they went — I had removed them
because no footage exists and a dead button reads as broken). Each is now honest about what it can
do: **Drone view works today** — the aerial shots are already in `SINARAN_PHOTOS`, so it clicks the
matching thumb and reuses the gallery's existing swap rather than duplicating it. **Video viewing
has no footage**, so instead of a dead control it routes to `#agent` labelled "on request", which
is what a buyer actually wants from a video button on a completed property and feeds the lead
engine. Swap it to a real player the moment footage exists. `.mediarow` / `.mediabtn` CSS was
already intact — only the markup had been removed.

### 30 Jul 2026 — Claude · VOCABULARY SWEEP: every user-facing "tender" → "E-Tender"
Bryan: *"all the word tender, must be e-tender."* **62 replacements across 13 files.** Verified
across all 8 pages: **0 bare "tender" in rendered text, 130 E-Tender/e-tender, 0 "E-E-Tender",
0 "E-TenderProp", brand intact 29×.**

Case rule: **E-Tender** in headings, labels and CTAs; **e-tender** mid-sentence.
Notable renames: page titles and og:titles, "Next e-tender cycle", "View E-Tender Properties",
"E-Tender by State", "E-Tender Information", "E-Tender deposit", "E-Tender method",
"Apply for E-Tender" (×3 — Codex's rebuild added a third), "E-Tender Info" subnav,
"E-Tender closes in", "How the e-tender works", "Submit your e-tender", "E-Tender FAQ",
"Similar E-Tenders", "E-Tender start" and "View e-tender details" on the card, "How To E-Tender".

⛔ **Deliberately NOT prefixed — code, not copy:** `TenderProp`, the `Tender` type, `TENDERS`,
`tenderMethod`/`tenderFormat`, `tenderStartOf`/`tenderId`, `/tender` routes, `#tender` ids,
`.hero-tender` classes, `tender-detail.css`/`tender-utils.ts`. A blind find-replace here produces
**`E-TenderProp`** and **`E-E-Tender`** and breaks the build — assert both are zero after a sweep.
Rule recorded as DESIGN-SYSTEM §3c.
Two phrasings needed rewording rather than prefixing: *"before you can tender or bid"* → *"before
you can submit an e-tender or bid"* (verb, not noun), and *"Reuses the tender card component"* →
*"the listing card component"* (naming code in visible copy).

### 30 Jul 2026 — Claude · listings page: one content width (search band vs results were 133px apart)
Bryan spotted the results toolbar not lining up with the search box above it. Measured: both blocks
were **centred**, but at different widths — search card **1062px**, results+rail **1328px** — so the
toolbar's left edge sat **133px** left of the search card's. Both being centred is why it survived
review; centring hides a width mismatch.

Fix: `--content-max: 1328px` above 1400px (1020 results + 28 gap + 280 rail), applied to the search
band's and cat-nav's wraps. Verified: **all four left edges now land on 129 and the search card's
right edge meets the rail's at 1457.** Recorded as DESIGN-SYSTEM §3b.

Two notes for whoever audits widths next:
- Measure the **card**, not the field row inside it. `.search-bar` sits 19px inside `.search-form`
  as the card's own padding — that reads as a misalignment in a measurement and is not one. My
  first check reported "leftEdgesMatch: false" for exactly this reason.
- The 3-up grid uses a **viewport** breakpoint, not a container query, so narrowing `.main-layout`
  to the standard 1180 wrap would have crammed three cards into 762px. Widening the band to meet
  the grid was the right direction, not narrowing the grid to meet the band.

### 30 Jul 2026 — Codex · Tender Information made full-bleed and hero-height
Removed the capped 1100px card/gutters so the standard 40/60 dossier now spans the viewport like
the `/tender` hero. Reflowed the right side so the three-step process gets the full information
plane, with Apply/WhatsApp and the collapsed payment disclosure sharing the footer; this removes
the narrow, tall process columns without shrinking the decision facts. The tablet reserve figure
and process reflow were tuned separately to prevent collisions.

Rendered collapsed heights: **412px at 1440, 443px at 1024, 550px at 768 and 1,065px stacked at
375**; horizontal overflow is 0px at every check. The live seconds ticked 39 → 38, and the payment
disclosure expands without clipping at 375px. Production build passes; ESLint passes with the
repository's existing whole-file Prettier rule disabled (the unchanged component has 144 baseline
formatting findings).

### 30 Jul 2026 — Codex · Standard Tender Information split dossier
Replaced the long paperclip notice with the approved reusable listing-page system: **40% deadline
image / 60% information and action**. The left uses Bryan's selected monochrome Kuala Lumpur image
(Yamiko Ling / Pexels photo 21898339) under a flat burgundy wash and exclusively owns the live
D/H/M/S clock, closing date, end-of-day MYT note and registration date. The right compresses the
reserve price, `depositOf()` amount, sealed method, three-step process, Apply CTA, WhatsApp enquiry
and existing computed payment disclosure. Pin, paperclip and duplicate deadline rail are gone.

Rendered review: desktop is exactly **439px / 659px** inside a 1100px card (40/60), the clock
visibly ticked, and the card measures 617px high. At 1024px it remains split and readable; at 375px
it stacks deadline-first, keeps the deposit/method side by side, and measures **0px horizontal
overflow**. Production build and targeted component lint pass.

Coordination note: Claude's concurrent `9897fdf` commit unintentionally swept the in-progress JSX,
image and first CSS pass into its About commit despite its “Tender Information untouched” message.
No history was rewritten; this pass completes the responsive corrections and records the actual
design decision here.

### 30 Jul 2026 — Claude · About runs full width, two-up; disclosure now slices data
Bryan: make the prose long horizontally like the section above. The honest constraint is that a
single column across the full 1100px is **~137 characters per line**, roughly double the ~75
readable ceiling. But `.pd-list` above fills that same width with **two columns**, not long lines
— so matching the page's horizontal rhythm and keeping a readable measure turned out to be the
same move. About is now two-up at the full 1100px, **65 characters per column**, and its width
matches `.pd-list` exactly (both 1100px, columns at x=243 and x=823).

**The clamp is gone entirely.** Clipping with `max-height` across two columns cuts column 1
mid-sentence and starts column 2 on a new thought — the reading order breaks — and a fade over a
column boundary reads as a rendering fault. Instead the prose is **data** (`ABOUT_PARAS`) and the
closed state renders the first two whole paragraphs; open renders all eight. Nothing is ever
clipped in either state, and the button declares its payload: **"View more (6 more)"**.
Both rules recorded in DESIGN-SYSTEM §4.
Verified: closed 2 paras / 156px, open 8 paras / 567px, never clipped in either state, label
cycles, no overflow. Tender Information still untouched — Codex's.

### 30 Jul 2026 — Claude · About toggle moved to React state; 8 paragraphs for the demo
🐛 **Bryan was right that About was broken, and my verification was misleading.** The toggle was
bound imperatively inside `initDetailPage()`, which runs once on mount — so **any hot reload
rebuilt the DOM without re-running the effect and the button went dead.** A fresh load worked
(which is what I tested), a hot-reloaded page did not (which is what Bryan had in front of him).
Now `aboutOpen` React state; the DOM listener in `tender-detail-behaviour.ts` is removed so the two
mechanisms can never disagree. **DESIGN-SYSTEM §5.12: anything React renders must be driven by
React state, never a listener attached in an effect. That is the shape of every "works for me"
bug here.** `initDetailPage` should own only what React does not render.

Also expanded About to **8 paragraphs / 386 words** so the disclosure is a real demo — **86% of the
text is hidden when closed** (138px of 1020px). The four new paragraphs are honest rather than
padding: the intermediate lot's trade-off stated plainly (shared walls and narrower frontage,
reflected in the price; less external wall and a cooler afternoon), three storeys asking something
of a household with young children or elderly parents, and two dedicated bays actually working in a
62-unit development.
Verified: closed 138px / 5.0 lines / clipped, open 1020px / not clipped, re-closed 138px, label and
aria cycling both ways, no overflow.

**⛔ NOT TOUCHED: Tender Information (§4).** Bryan has Codex revamping it into the diagonal-split
command centre. `ResidensiSinaranDetail.tsx` edits above are confined to the About block.

### 30 Jul 2026 — Claude · About: View more restored, clamped at 5 lines, and a cascade bug fixed
Bryan wants progressive disclosure kept: **"5 line onwards… there must be a view more button."**
- Clamp is **5 lines** (`8.6em` = 5 x the 1.72 line-height). Verified 5.0 lines closed.
- **The pull-quote sits OUTSIDE the clamp**, above the body. It is the one argument nothing else on
  the page makes, so putting it behind a fold defeats the reason it exists — and a standfirst above
  the prose is where a reader expects a section's thesis.
- A button implies depth worth hiding, so About went back up to **5 paragraphs / 237 words** with
  two genuinely new ones (strata handling the upkeep of landed living; completion meaning a lender
  values a real unit rather than a projection, and a valuer can walk it before you set your number).
  Still nothing duplicating Details or What's Nearby.
- 🐛 **Cascade bug worth knowing:** `.aboutbody { max-height: 8.6em }` with
  `.aboutbody.open { max-height: 220em }` — correct by specificity — **did not work.** The button
  flipped its label and `aria-expanded` while the text stayed clipped at 137.6px, so it looked
  functional. Fixed by scoping the clamp to `:not(.open)` so there is nothing to override.
  **Two lessons in DESIGN-SYSTEM §5.10–11: a toggle test must assert HEIGHT (the label lies), and
  `getComputedStyle` on a transitioning property returns the interpolated value, not the target.**
Verified: closed 138px / 5.0 lines / clipped, open 642px / not clipped, re-closed 138px, label and
aria both cycling, no overflow.

### 30 Jul 2026 — Claude · BUG I SHIPPED: About was clipped with no way to open it
Bryan asked where "View more" went. I had removed the button but **left `max-height: 8.4em` on
`.aboutbody`** — so the last paragraph and a half were clipped and unreachable. Verified before
the fix: `scrollHeight > clientHeight`, body stuck at 134px. No console error, because the toggle
script guards with `if (!body || !btn) return` and silently disabled itself, which is exactly why
I did not notice.

Removed the clamp, the `::after` fade and the now-dead `.viewmore` styles. About is 500px and
fully visible; the script block is left in place but marked INERT so the pattern survives if a
longer About ever needs it.

**Rule: a clamp and its toggle are one feature — remove both or neither.** Added to
DESIGN-SYSTEM §5. And when removing a progressive-disclosure control, assert
`scrollHeight <= clientHeight` afterwards; a guarded script will hide the breakage from console.

### 30 Jul 2026 — Claude · band value derived; §4 card de-filled; §6 About rebuilt
**1. `--band-alt: #F6EEE7` is a DERIVED value — do not nudge it.** `--paper` measured 1.083 vs
white (Bryan: invisible) and `--paper-deep` 1.211 (Bryan: too deep). #F6EEE7 is the exact luminance
midpoint, **1.147**.

**2. 🐛 A full-width white card defeats the band.** Bryan spotted that Tender Information read
white. `.v1` was `--card` and covered **58%** of `#tender`, so that section read white while
`#details` (white band, no card) also read white — two whites in a row with the bands alternating
correctly underneath. Fixed: **sections sit on their band; cards are outlines (border + radius, no
fill).** `.v1` is now transparent and `.v1-rail` inverted to white so the notice still reads raised.
⚠️ My own audit had reported "no collisions" because the card is 0.69 of the section width and my
threshold was 0.7. **Audit by AREA coverage, not width, and measure what a section READS as.**

**3. §6 About rebuilt.** Was four paragraphs at 98 chars/line with three hidden behind "View more".
Audit: P1/P2/P4 restated Property Details, the header and §7 What's Nearby. The only unique
paragraph — completed, no construction risk, inspect the actual unit — was buried third behind the
fold. Now: lead → **pull-quote carrying that argument** → two supporting paragraphs, 62ch measure,
clamp removed. The quote is the only place the property's condition is tied to the tender mechanic.
All three points are now in `DESIGN-SYSTEM.md`. Verified: 10 sections, zero visual collisions.

### 30 Jul 2026 — Claude · alternate section band deepened to `--paper-deep`
Bryan disliked the About background. Measured, it was not the hue — it was the **strength**:
`--paper` vs `--card` is a **1.083** luminance ratio. Below ~1.1 the eye cannot reliably resolve an
edge, so the alternation read as accidental rather than as rhythm. And `--paper` *is* the page
ground, so a "paper band" was not a band at all — **half the sections were untreated by
definition**, which is why the flow felt unresolved even after the spacing was standardised.

Alternate band is now `--paper-deep` (#F1E8DE) → **1.211**, roughly 2.5x the differentiation above
parity, and a deliberate tint already in the palette rather than the page ground.
`--band-bg` travels with it, so the About "View more" fade gradient re-matched automatically.

Ran a collision sweep for panels that would vanish against the deeper band: one hit, `.v1-rail`,
which is a false positive — it sits inside `.v1` (white card), verified visible. No real
collisions. **Rule now in DESIGN-SYSTEM §3: when a band is paper-deep, inset panels on that band
must be `--card`.** Sequence verified deep/white × 10, no overflow.

### 30 Jul 2026 — Codex · three-field Property Details hierarchy standardised
Locked the first three positions across future detail pages: reserve price per sq ft with the
calculation basis stated, tenure, then title and land use. Sinaran now reads `RM369 psf / Based
on 1,400 sq ft built-up area`, `Leasehold 99 years / Expires Nov 2115 · 89 years remaining`,
and `Strata title / Residential use`. Title type and land use were removed from the lower
specification list so the summary does not repeat. Rendered review at 1440, 820 and 375px:
desktop columns are equal at 366.7px, tablet/mobile stack in the same order, no promoted-field
duplicates, no console errors and zero horizontal overflow. Production build and targeted ESLint
pass. The decision is now recorded in `DESIGN-SYSTEM.md`.

### 30 Jul 2026 — Claude · `DESIGN-SYSTEM.md` created (single source for values + patterns)
Bryan asked whether a "frontend design skill" should exist so design rules stop being repeated.
A generic `frontend-design` skill already exists in his Claude skills, but it knows nothing about
TenderProp — and **a Claude skill cannot bind Codex**, so putting our system there would create a
second source of truth. Given how much of this session was spent fixing duplicate-source bugs,
that was the wrong vehicle. It went in the repo instead, where both agents read it.

`DESIGN-SYSTEM.md` consolidates what was scattered across CSS comments, PLAN files and TEAM-LOG:
tokens with their intended use, the type rules (incl. Newsreader's 400–700 ceiling and the
Playfair-was-never-loaded history), the three section-flow tokens, the established component
patterns, **§5 "traps that have already bitten"**, and the brand non-negotiables.
§5 is the part worth reading — eight concrete failures from this session with their cost, e.g.
`grid-template-columns` not overriding `grid-auto-flow`, duplicate selectors winning silently, and
restating `position` to raise z-index. AGENTS.md now points at it.

### 30 Jul 2026 — Claude · SECTION FLOW SYSTEM finalised (measured audit of all 11 sections)
**Codex: never hand-tune a section's padding, title size or background again.** Three `:root`
tokens in `tender-detail.css` govern the page: `--sec-pad` (clamp 40–56px per side → 80–112px
between sections), `--sec-title-size` (36px), `--sec-title-gap` (26px). See
`PLAN-residensi-sinaran.md` → SECTION FLOW SYSTEM.

What the audit actually found — Bryan was right that something was off, and one of them was a bug:
1. **Padding was already uniform (36/36)** but only gave 72px between sections on an 11-section
   page. Now 80–112px.
2. 🐛 **The alternation had DRIFTED.** `#location` and `#agent` were BOTH white, so the paper/white
   rhythm broke halfway down. That is the "flow" problem Bryan could feel but not name. Fixed
   positionally — `main > section.blk:nth-of-type(even|odd)` — so it cannot drift again and a new
   section re-solves the chain. `--band-bg` travels with the background.
3. **`#tender`'s heading was an H3 at 34px with margin-bottom 0** while the other nine were H2 at
   36px with 18px. One shared rule now covers `.sec-title` and `.v1-top h3`; §4's bespoke metrics
   are deleted.
4. Bryan's specific complaint — Property Details title sitting too close to "Reserve price per sq
   ft" — was `.pd-pricing`'s `padding-top: 2px` fighting an 18px title margin. Gap is now a single
   token at 26px.
Verified: 10 sections, ONE padding value, ONE title size, ONE title gap, ZERO alternation
collisions, no overflow.

### 30 Jul 2026 — Claude · §5 CTA copy: "Get an answer" (no "agent" front-of-house)
Bryan did not want "agent" on the button — that is the **VOICE RULE** biting: agency identity
belongs in the agent block, About, FAQ and footer, not in front-of-house CTAs.
- Button: **"Get an answer."** It completes the heading's question (Q → A), promises an outcome
  rather than an activity, and avoids echoing the word "question" from the heading directly above.
  Alternates considered and rejected: *"Ask before you offer"* (good sealed-tender logic but
  repeats the lede), *"Get in touch"* (safe, forgettable), *"Ask a question"* (redundant).
- **The lede had to change too.** It said "the listing agent can answer" one line above the
  button, which would have made the button's avoidance pointless. Now "…just ask — a sealed tender
  gives you one offer, so it is worth knowing before you submit." Platform voice, no over-claim.
- `href` stays `#agent` — the destination is still the agent block, which is where the REN and
  agency disclosure legitimately live. Only the front-of-house wording changed.
- ✅ Left alone deliberately: **"Ask the agent on WhatsApp" in the §4 tender rail.** That sits at
  the apply point, which canon lists as an approved place for agent language.

### 30 Jul 2026 — Codex · Property Details enquiry copy proposed only
Bryan asked for wording only, so no page code was changed. Suggested replacing the current
one-offer warning with a broader invitation to ask the appointed agent about the tender process
or the property itself.

### 30 Jul 2026 — Claude · §5 ask band: typeset "?" and a red CTA
- **The icon is now a typeset question mark, not an SVG.** Reasoning: every emphasis on this page
  is Newsreader — H1, prices, dates, section titles — so a serif glyph belongs to that system where
  a stroked help-circle belongs to a generic UI kit. Flat, no SVG, and at 44px it carries the band
  without adding height. Needs `line-height: 1` and a 2px optical nudge because a serif "?" sits
  high in its box. Considered and rejected: speech bubble (generic), envelope (implies email, but
  it jumps to `#agent`), person+question (illegible at this size), no icon (band loses its anchor).
- **Glyph stays burgundy while the button goes red** — one action accent per zone. Red means "this
  is the thing to click" everywhere else on the site; a red glyph would compete with it.
- CTA arrow removed and background switched to `var(--red)` / `#A81F15` hover, the same pair
  `.btn.red` uses, so it matches every other primary action on the site.
Verified: 44px Newsreader burgundy glyph, CTA rgb(200,40,28) on white with no SVG, both vertically
centred in the band, box still 98px, no overflow.

### 30 Jul 2026 — Claude · §5 ask box final form: one line + button (315px → 98px)
**Codex: do NOT re-add a list here.** It went through three versions and the third is deliberate:
- v1 "Not disclosed by the seller" + 4 chips — apologises for our data gap, and the list shrinks
  to nothing as the agency supplies values.
- v2 the same fields as questions with reasons — better framing, still needs maintaining, still
  enumerates our omissions.
- v3 (Bryan, final) **lists nothing.** A listing can never be complete, so the permanent form is
  *anything the details above don't cover, the listing agent can answer.* Slim icon-led band,
  invitation + `#agent` button, vertically centred. **98px, down from 315px.**
Avatar and REN also dropped earlier — the agent section further down already carries both in full.
Consequence to know: occupancy / furnishing / maintenance fee / facing are now **absent from the
page entirely** rather than shown as gaps. That is intended. When the agency supplies them, add
them to `PROPERTY_DETAILS` as normal rows.
Also removed `.pd-pricing`'s top border — it sat under the section heading and read as a second
underline. Section total 894px.

### 30 Jul 2026 — Claude · §5 ask-box reframed on Bryan's idea (his framing beat mine)
**"Not disclosed by the seller" → "Still have questions about this property?"** Bryan's call, and
it is better for three reasons worth remembering:
1. It speaks to the buyer's need instead of apologising for our data gap.
2. **It never goes stale.** No listing is ever complete, so it stays true as the agency fills
   fields in — a "not disclosed" list has to be maintained and shrinks to nothing.
3. It is a **lead engine**, which is what both platforms exist to be.
What survived from my version is the SPECIFICITY: "ask the agent" converts far worse than a
concrete question. So the undisclosed fields became the questions a buyer would actually ask, each
with a one-line reason it changes their number. `QUESTIONS` replaces `NOT_DISCLOSED`.

**Consistency work (Bryan's emphasis), measured not asserted:**
- Four spec labels were wrapping to two lines, making those rows ~90px against 46px and breaking
  step between the left and right columns. Labels shortened ("Category of land use" → "Land use",
  "Restriction in interest" → "Restrictions") with the unit moved into the value
  ("RM480 / year"), label column widened to 10.5rem, `white-space: nowrap` to enforce it.
  **All spec rows now 46px.**
- The ask rows then had the same fault at 61 vs 43px — one reason wrapped in its 15rem column.
  Reasons trimmed to fit one line, plus `min-height: 44px`. **All ask rows now 44px.**
- The ask block reuses the table's rhythm (same hairline, same two-part row, same type scale) so
  it reads as a continuation of Property Details, not a card dropped under it.
- **Amber dropped.** It framed an invitation as a hazard and implied something was wrong with the
  property. Paper + burgundy, like the rest of the page.
- Agent is now named with REN in the box; CTA "Ask the agent" → `#agent`.
Verified: spec rows 46px uniform, ask rows 44px uniform, box 315px, no overflow.

### 30 Jul 2026 — Bryan · NEW STANDING RULE: THE DESIGN SOP (AGENTS.md)
*"when i say improve the design, you make use your critical thinking… beautify it by taking in all
the consideration on how to make tenderprop look really nice, not just the font, size, placement,
positioning, basically everything else."*

**Codex: read `AGENTS.md` → THE DESIGN SOP.** Fixing only the attribute Bryan names is not doing
the job — the named attribute is just where his eye landed; the brief is *make this beautiful*.
14 axes, in rough order of leverage: space, alignment, typography, hierarchy/scan order,
redundancy, colour+contrast, emptiness, structure, states, responsive, motion, use-the-system,
stay-on-brand, and **measure it** (numbers in the report, not adjectives).

This sits alongside THE CHANGE SOP: that one says *look at the render and have an opinion*; this
one says *when the ask is design, the whole surface is in scope.*

### 30 Jul 2026 — Claude · §5 list de-duplicated and refilled with real subsale fields
Bryan spotted the repetition. Removed from the list because they are already on the page:
**tenure, lease expiry, land title** (pricing heading) · **bedrooms, bathrooms, built-up, storeys,
car parks** (icon band) · **property type** (page header address line). Verified programmatically:
**0 duplicates** between the list, the band and the heading strip.

**The band now reads straight off `SINARAN_TENDER`** instead of looking values up in
PROPERTY_DETAILS — same source the listing cards use, so it cannot drift, and those five facts no
longer need to exist in the list at all. Slots with no value in the record don't render.

**17 new rows, grounded in a real Malaysian land search + listing sheet** (researched, not
invented terminology): title type, unit position (intermediate/corner/end is a real price factor
here), land area, **category of land use**, **restriction in interest**, **encumbrance** — the
three particulars that actually appear on a Malaysian title — plus the annual carrying costs,
renovation state, gated & guarded, and the development facts from iNewProject.

⚠️ **One accuracy point worth keeping:** Sinaran is STRATA in Selangor, so its annual land tax is
**parcel rent, not quit rent** — Selangor moved stratified property onto parcel rent. Do not
"correct" it back to quit rent. A non-strata landed listing WOULD say quit rent.
Verified: 17 rows, 0 duplicates, 0 blanks, list 465px, section 1021px, no overflow.

### 30 Jul 2026 — Claude · §5 design pass (architecture kept, presentation redone)
Bryan: architecture right, "this is ugly." It was — measured, not guessed:
- **Rows ran ~124px to carry ~18 characters.** Label stacked over value in a 900px column left
  the right two-thirds of every row empty, and 17 rows became a ~1,100px wall of air.
  Label and value now share a line → rows **46px**, list **409px**, section 1223→965px.
- **Values align on a common x within each column** (measured: exactly two positions, 401 and
  989). That single alignment is what makes a spec sheet read as engineered rather than typed.
- Value weight dropped 700→600. Bold on all seventeen values reads as shouting; 600 holds the
  hierarchy against an 11px uppercase label without competing. Tabular numerals so digits line up.
- Hairlines at 62% of `--line`, plus a top rule on the first row so the block is bounded.

**Band moved above the list** (Bryan) and is now **derived** — `BAND` reads its values out of
`PROPERTY_DETAILS` by label via `BAND_ICONS`. One source shown two ways; editing a row updates
both, and a slot whose label is absent just does not render, so dropping "Storeys" for a condo
needs no code change. Zone order is now pricing → band → list → not-disclosed.

⚠️ Process note: my first attempt at this cut the band block by string index and mangled the JSX
(TS17002). Reverted with `git checkout --` and redid it by **line index**, since each `.stat` is
one whole line. For multi-line JSX blocks, cut by lines, not by `str.index`.

### 30 Jul 2026 — Claude · §5 rebuilt AGAIN on Bryan's iNewProject reference
Hardcoded groups are gone. §5 is now:
1. **Heading strip** — psf (derived) / tenure / land title. Bryan's call: these three are the
   section's heading because they are what a sealed-tender buyer prices on.
2. **`PROPERTY_DETAILS`** — one flat `{label, value}[]` in ResidensiSinaranDetail, rendered
   two-up. **This is the shape the backend edits: type a label, type a value.** Add, remove or
   reorder rows in the array and the layout follows; nothing is styled per-field. When EasyAsia
   wires a CMS, this array is what it replaces. 17 rows currently.
   ⚠️ `.pd-list` uses `grid-auto-flow: column` with `grid-template-rows: repeat(9, auto)` so the
   left column fills first — **if the list grows well past 18 rows, bump that 9.**
3. **`NOT_DISCLOSED`** — also data, so the block self-removes when the array empties. Restyled:
   warning icon, fields as chips, and the CTA is now a solid burgundy button reading **"Ask the
   listing agent" that jumps to `#agent`** (Bryan) instead of going off-site to WhatsApp.
4. Measurement band moved below.

**Real data recovered:** the iNewProject Project Details Bryan surfaced IS this development —
developer **SEGA Land Development Sdn Bhd**, **62 units**, **Phase 4**, **2025**, lot **22′×78′**,
lease **expiring November 2115**. Two corrections from it: I had invented "expiring 2124" (now
Nov 2115, 89 years remaining), and iNewProject renders the lot as "22'x78' **acres**", which is
wrong — 22ft × 78ft is 1,716 sqft. Shown correctly here; **worth fixing on iNewProject too.**
Verified: 17 rows in 9+8 columns, 0 blanks, CTA → #agent (section exists), section 1223px, no overflow.

### 30 Jul 2026 — Claude · §5 Property Details rebuilt (structure first)
Old sheet: 19 rows, **10 empty**; icon band and Layout/Size groups duplicated the same five facts;
two empty states with inverted meanings. Rebuilt into four zones ordered by pricing impact —
see `PLAN-residensi-sinaran.md` §5 for the full rationale.

Key decisions Codex should know:
- **`PSF` is derived** in ResidensiSinaranDetail (`RESERVE / parsed builtUp`) — RM369 psf. Never
  hardcode it. It is the number buyers compare on and no MY portal leads with it.
- **New empty-value rule:** unknown-but-applicable → the "Not disclosed" zone. Not-applicable →
  **omit the row**. No dashes as data, no "Not stated" in the spec table. Land area is now absent
  from a strata townhouse rather than dashed.
- **Zone 3 ("Not disclosed by the seller") is the point of the section**, not filler. A sealed
  tender has no negotiation stage in which to uncover occupancy/furnishing/maintenance, so the
  page names them and hands the buyer a WhatsApp CTA. Do not delete it when real data arrives —
  re-point it at whatever is still missing.
- Full spec is a collapsed `<details>` reusing the summary/chev pattern from Codex's
  "How payments work". Only populated rows go in it.
Verified: 0 "Not stated", no duplicated facts, 3 groups / 9 rows, section 638px, no overflow.

### 30 Jul 2026 — Claude · §4 PARKED (last unblocked item closed); moving to §5 Details
Countdown now shows the segmented D:H:M:S clock **only inside the final 90 days**
(`CLOCK_FROM_DAYS` in ResidensiSinaranDetail). Beyond that it renders the day count alone —
"886 days left" instead of "885D:01H:22M:41S". A ticking seconds column beside a three-digit day
count advertises that nothing is happening; both Codex and I flagged it independently.
Verified: 1 unit, no seconds, rail 366px, no overflow.

**§4 is now parked, not abandoned. Two items remain and BOTH are founder-blocked:**
- `REGISTER BY 17 Dec 2028` — still the assumed close-minus-14-days value.
- Whether offers can be submitted *during* the closing day, or the listing goes at midnight
  entering it (see the 5PM entry above).
Everything else in §4 is done. **Next: §5 Property Details.**

Process note for whoever picks this up: we are going breadth-first — every section to "good",
then ONE consistency pass across all 12 with full context. Do not sink the remaining sections'
budget into perfecting one, because sections are judged against each other and §5–§12 will change
what "right" looks like for §4.

### 30 Jul 2026 — Claude · two go-live blockers closed by the founder
**Codex: both of these were on the unverified list. They are now answered — do not reintroduce.**
1. **There is no 5:00 PM cutoff.** A tender runs to the end of its closing date and the listing
   leaves the site. Countdowns target `T23:59:59+08:00`, not `T17:00`. Every "5:00 PM (MYT)" line
   is removed (hero foot, homepage cycle line, detail header, tender rail). Open sub-question:
   whether offers can be submitted *during* the closing day (assumed yes) or the listing goes at
   midnight entering it.
2. **Deposits are returned IMMEDIATELY, not "within 3 working days."** The agent negotiates; if
   the seller will not proceed — including after negotiation, and regardless of whether the buyer
   would have accepted the counter — the agent tells the buyer and refunds at once. The reasoning
   is now in the FAQ copy: once all three parties know the sale cannot proceed, a waiting period
   only manufactures suspicion. Never write a refund window again.

### 30 Jul 2026 — Codex · compact Tender Information dossier
Removed the glossy red pin and kept the paperclip as the section's sole tender-notice signature.
Rebuilt the section as a compact three-fact summary, clipped closing/action notice and three-step
process; the 3% / +7% / 90% payment explanation is now a native disclosure, closed by default.
Replaced the unsupported “many sales here close through negotiation” claim with the confirmed
accept / decline / counter outcomes, and routed the displayed reserve, closing date and 3% deposit
through the Sinaran data record and `depositOf()`. Kept the unconfirmed registration date because
it already existed, but avoided adding a new deposit-payment timing claim. Rendered review: default
card is 556px desktop / 1,338px at 375px, the timer ticks, disclosure works, no console errors and
zero horizontal overflow. Production build and targeted ESLint pass.

### 30 Jul 2026 — Claude · fixed my own regression from the stretched-link change
The stretched-link work needed the save button above the card-wide `::after`, and I wrote
`.prop-card .save-btn, .prop-card .pc-tel { position: relative; z-index: 2; }`. The save button
was **already `position: absolute`** inside `.pc-media`; forcing `relative` dropped it into normal
flow, stretched `.pc-media` from 202px to 246px and pushed the deadline pill off the bottom of the
photo onto the card body. `z-index` alone was all it needed — the rule is now split so only
`.pc-tel` (which is in flow) gets `position: relative`.
**Rule of thumb: to raise something over the stretched link, set z-index only; never restate
`position` on an element that already has one.**
Verified: media height 202 = photo height, save button `absolute` with z-index 2, pill and save
both back over the photo, all grid cards 581px.

### 30 Jul 2026 — Claude · rail header band moved to the right element
Follow-up to the toolbar/rail alignment above: I had put the band (min-height, padding, bottom
rule) on `.rail-title`, but the title is a **flex item inside `.rail-head`**, so it is only as
wide as its own text — 147px of a 280px column. The rule therefore stopped halfway across the
rail. Band moved to `.rail-head`, which is the actual full-width header row and the true
counterpart of `.results-header`. `.rail-title` is back to typography only.
Verified at 1600px: rail head spans the full 280px column, both rules land on y=921, and the rail
card top matches the grid top at y=941.

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
