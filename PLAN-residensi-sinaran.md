# WORK PLAN — Residensi Sinaran detail page, section by section

**Status: ACTIVE PHASE (from 29 Jul 2026).** The `/tender` grid is done for now (founder's call).
All 36 cards route to `/tender/residensi-sinaran` — this page is the **design canon**: whatever is
decided here becomes the template for every future detail page. That is why it is done one section
at a time, with a stated UI/UX rule per section, and Bryan reviews each rendered result.

**Method (binding, from AGENTS.md):** one section per pass → state the section's UI/UX rule →
build → LOOK at it rendered (desktop + 375px) → judge and report with a view → Bryan reacts →
next section. Claim "Property detail page" in TEAM-LOG.md before starting a pass. Log every pass.

Files: `src/components/tender/ResidensiSinaranDetail.tsx` (~278 lines, one component),
`src/styles/tender-detail.css`, `src/lib/tender-detail-behaviour.ts` (mount-time behaviours).

---

## Section queue, in order

Each entry: what it is → its job for the buyer → known issues → the section's UI/UX rule to state
and apply. Work top of page downward, because that is how Bryan reviews.

### 1. Opening header (breadcrumb, status, title, price, Save/Share, Apply CTA)
- Job: orient in 3 seconds — what property, open or closed, floor price, what to do next.
- Known issues: serif is **Playfair Display here vs Newsreader on the grid** — unify to Newsreader
  (contract says one display serif). Check "Apply for Tender" CTA still says exactly that.
- Rule to apply: status → name → price → actions, nothing else above the gallery.

### 2. Photo gallery
- Job: proof the property is real; the emotional hook.
- Known state: 7 photos, stage + thumbs, works. Mobile swipe strip + "N / total" counter exist.
- Rule: photos never lie about count ("View all N photos" computed), selected thumb subtle,
  swipe on mobile. Mostly a verify-and-polish pass.

### 3. Facts strip (Reserve / Deposit / Closes / Days left)
- Job: the four numbers a buyer scans first.
- Known issues: deposit must read RM15,510 everywhere (3% rule). Days-left is computed now — verify.
- Rule: four numbers max, tabular, one accent (burgundy panel) — matches grid money box language.

### 4. Tender Information block (the v1 "Calm white" panel)
- Job: THE differentiating section — terms + how it works + apply rail.
- Known issues: **"Registration by 17 Dec 2028" row is SUSPECT** — founder says no separate
  registration deadline exists; remove or replace with "Tender opens" once Bryan confirms.
  **"deposit is paid when you submit your offer" states unresolved timing** — soften to avoid
  claiming the moment of payment (see TEAM-LOG flagged list). Steps end at "receive result" —
  extend to the confirmed accept/decline/negotiate/refund flow (mirror the grid hero's 3 steps).
- Rule: terms are facts in labelled rows; the how-it-works is a numbered sequence; one red CTA.

### 5. Property Details (19 labelled rows, 5 groups)
- Job: the comparison spec sheet — our biggest advantage over OwnerAuction (they have 5 fields).
- Known issues: 10 of 19 rows are "Not stated". Keep the honest convention ("Not stated" vs "—")
  but consider promoting the six deal-breakers (occupancy, furnishing, maintenance fee, title
  type, bumi lot, land area) into a "Before you bid" group per the design-direction study.
- Rule: labelled rows, never invented values, missing ≠ inapplicable.

### 6. About + Selling Points
- Job: the narrative case. About copy is good (real, specific).
- Known issues: Selling Points previously repeated About/Details facts — needs distinct content
  or merge. NO invented amenities (the fake facilities list was removed — do not resurrect).
- Rule: About = paragraphs, Selling Points = verifiable claims only, no repetition of spec rows.

### 7. What's Nearby + Location/map
- Job: place the property. Distances are stated to one decimal — unsourced precision; round or
  mark approximate ("~5 min drive"). Map iframe fixed height — check mobile.
- Rule: approximations declared as approximations.

### 8. Price History — REMOVED, stays out until real transactions exist (JPPH/agency).
  Layout is kept in git history; the amber SAMPLE badge style exists if Bryan ever wants sample
  rows shown honestly. Do NOT re-add invented rows (decisions ledger).

### 9. Agent + Mortgage calculator
- Job: trust + affordability. REN 123456 placeholder OK; "REA registration: Not stated" rows —
  fill when founder supplies. Calculator: pre-fills reserve, 10% down payment default does not
  reconcile with the 3% tender deposit — add the "cash at risk" line once deposit timing is
  resolved (blocked, see TEAM-LOG).
- Rule: the calculator never contradicts the tender terms shown above it.

### 10. FAQ
- Job: kill the last doubts. The "how many bidders" answer is the best copy on the site — keep.
  Add the two missing questions once founder answers: what if seller declines all offers
  (answerable NOW: decline → negotiate possible → full refund), and what happens after
  acceptance (SPA timeline — still blocked).
- Rule: every answer states only confirmed process.

### 11. Sticky bid bar + subnav
- Job: the persistent CTA. Known issue from the old audit: on mobile the subnav slides UNDER the
  sticky header (both top:0, header wins z-order) — verify in this build and fix if inherited.
- Rule: one sticky CTA, never two competing sticky layers.

### 12. Apply-for-Tender flow — **PARKED.** Bryan will supply his member-dashboard design first.
  Do not design the account gate, the offer form, or the dashboard until he shares it.

---

## Founder questions that gate sections (ask Bryan, never assume)
1. Does a registration step exist at all? (gates §4 row) — his model says no; site shows one.
2. When exactly is the 3% deposit paid? (gates §4 copy + §9 cash-at-risk line)
3. After acceptance: SPA timeline / loan-declined case (gates §4 step 5, §10 FAQ)
4. Real facilities list for Sinaran, if any (gates §6)
5. Real REN + agency registration numbers (gates §9; REN 123456 is interim)

## Standing constraints (from AGENTS.md — binding)
Sealed-tender vocabulary only · deposit computed at 3% of reserve, never hardcoded · no invented
content except the two logged demo exceptions (tender start date on cards; every card routing
here) · CSS class names stable for EasyAsia · 375px no-overflow · never force-push · claim the
area in TEAM-LOG.md first · follow THE CHANGE SOP (look, judge, report with a view).
