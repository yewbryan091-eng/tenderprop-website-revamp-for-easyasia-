# REGRESSION GUARDS — every iteration clears all of these

**Fixed. These are pass/fail, not scored.** A failure here is reported as a finding with its
severity, and §3 failures are **always P0**.

Run them **after** the screenshot, before writing the self-critique.

---

## 1. Functional

| # | Check | Fails when |
|---|---|---|
| F1 | Homepage loads | `/` renders without a console error or an error boundary |
| F2 | Header nav works | All five items route: E-Tender · Owner Auction · Sell · Services · About. Active state highlights the current route |
| F3 | Homepage primary CTA works | The one red action goes where it says it goes |
| F4 | Homepage search works, if present | Submits, and lands on `/tender` with the query applied — **a search box that does not search is worse than none** |
| F5 | Property links work | Every card links to a real detail page. **`demo: true` records must never link out** (`url: "#"`) |
| F6 | Sign in / Register entry points remain functional | Both still reach `/member`. They are links, not accounts — the loop must not break them |
| F7 | Production build green | `npm run build` — a page that only works in dev is not delivered |

## 2. Viewports

Screenshot and inspect at every width. **1440 and 375 are mandatory every iteration**; the rest
are mandatory whenever layout changed.

| Width | Why this one |
|---|---|
| 1440 | Primary desktop review width |
| 1280 | Common laptop — where a 55/45 split usually first strains |
| 1024 | Tablet landscape / small laptop |
| 768 | Tablet portrait — where two columns must decide to stack |
| 390 | Modern phone |
| 375 | **The contract width.** Zero horizontal overflow, always |

Overflow check, in the page console:

```js
document.documentElement.scrollWidth - document.documentElement.clientWidth   // must be 0
// find the culprit when it isn't:
[...document.querySelectorAll('*')].filter(el => el.getBoundingClientRect().right > innerWidth + 1)
```

## 3. Hard rules — a failure here is a P0, no discussion

Each maps to a founder-verified rule. Sources in brackets.

| # | Rule | Source |
|---|---|---|
| H1 | **Zero horizontal overflow at 375px** | `AGENTS.md`, standing |
| H2 | **No visible competing offers.** Nobody ever sees another buyer's number | `TENDERPROP-BRIEF.md` §C5 |
| H3 | **No highest / current bid** | §C5 |
| H4 | **No fake activity** — no "N viewing", no invented counts, stats, testimonials or sold results | `AGENTS.md` Product rules |
| H5 | **No live-auction framing for E-Tender.** No "Auction Date", no "starting bid", no countdown theatre beyond the closing date | §C5, `AGENTS.md` |
| H6 | **No online payment implication.** No money moves through this site, ever | §C2, §A3 |
| H7 | **Reserve price is never a floor or minimum.** Banned: "minimum offer considered", "the floor", "offers start at", "at or above the reserve" | §C1 |
| H8 | **Generic Buy/Rent portal architecture not reintroduced** | `PLAN-site-architecture.md` §1 |
| H9 | **Platform voice in front, agency disclosure where it legally matters.** No "our licensed agent" / REN / REA / "licensed agency" in hero, cards or marketing copy; **mandatory** in footer, About, FAQ, agent block and at the apply point | `AGENTS.md` VOICE RULE |
| H10 | **No invented backend field without a `BACKEND-CONTRACT.md` row in the same commit** | `BACKEND-CONTRACT.md`, opening rule |
| H11 | **The product is "E-Tender", always.** No bare "tender" in rendered copy | `DESIGN-SYSTEM.md` §3c |
| H12 | **Never "10% legal fees."** The 3% is part of the standard 10% down payment | `AGENTS.md` Product rules |
| H13 | **No registration deadline.** An account is needed only at the moment of applying | §C3 |
| H14 | **Negotiation may be stated, but hedged** — "where there is room to move". A route, never an outcome | §C4 |

### Runnable sweep

Catches the string-level violations. **It does not replace reading the rendered page** — H8, H9
and H10 are judgement calls no grep will make.

```bash
# banned vocabulary, rendered copy only
grep -rniE "highest bid|current bid|bids so far|bidding now|bidders online|[0-9]+ (people )?viewing" src/routes src/components
grep -rniE "minimum offer|the floor|offers start at|at or above the reserve|starting bid|auction date" src/routes src/components
grep -rniE "pay (now|online|your deposit)|checkout|secure payment|10% legal fee" src/routes src/components

# E-Tender vocabulary: bare "tender" in copy, and the two find-replace failure modes
grep -rnE "E-TenderProp|E-E-Tender" src/                      # must be zero
grep -rniE ">[^<]*\btender\b" src/routes/index.tsx            # inspect each hit by hand

# agency voice upstream of the disclosure zones
grep -rniE "our licensed agent|our appointed agent|licensed agency|\bREN\b|\bREA\b" src/routes/index.tsx
```

## 4. Visual guards

Not scored — these are the checks that make the score honest.

| # | Check | How |
|---|---|---|
| V1 | **Measure repeated left / right edges** | Print every left edge and right boundary in the surface. They must collapse to a small set of repeated numbers, not five values within 3px. **Right boundaries count as much as left ones** |
| V2 | **Measure spacing** | Every vertical gap between adjacent blocks is one number you can point at in the CSS. Never two mechanisms producing one gap |
| V3 | **Preserve design tokens** | No hardcoded value that has a token. `grep` the new CSS for raw hex and raw px where a token exists |
| V4 | **Red remains the controlled primary accent** | One red action per zone. Burgundy is emphasis, red is *click this*. Both in one block means one is wrong |
| V5 | **Duplicate selectors** | `grep` the selector before adding a rule for it — the later one silently wins, and this repo has been bitten twice |
| V6 | **Render + screenshot before claiming done** | Both mandatory widths, minimum |
| V7 | **Evaluate the screenshot visually, not the source** | Everything in `DESIGN-SYSTEM.md` §7 measured perfectly and was still rejected |

Measurement helper — paste in the console with the surface's root selector:

```js
const root = document.querySelector('SELECTOR');
const kids = [...root.children];
console.table(kids.map(el => {
  const r = el.getBoundingClientRect();
  return { el: el.className || el.tagName, left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), h: Math.round(r.height) };
}));
// vertical gaps between adjacent blocks
kids.slice(1).forEach((el, i) => console.log(
  kids[i].className, '→', el.className,
  Math.round(el.getBoundingClientRect().top - kids[i].getBoundingClientRect().bottom) + 'px'
));
```

⚠️ **Never size a layout from canvas `TextMetrics`.** It silently falls back to a different font
and under-read a real width by 23% on 3 Aug. Canvas answers *relative* questions (where the cap
line sits, how deep a descender goes); any width a layout depends on is measured from a real node
with its real computed style (`AGENTS.md`).

## 5. Reporting a guard failure

```
SEVERITY: P0
AXIS: regression / H7
EVIDENCE: hero subhead reads "offers start at the reserve price" — src/routes/index.tsx:41
WHY IT MATTERS: makes the reserve a floor. Naming your own number IS the product; this copy
                argues against it and contradicts a founder ruling (TENDERPROP-BRIEF.md §C1)
RECOMMENDED FIX: "the reserve is a guide — offer what you think it's worth"
```
