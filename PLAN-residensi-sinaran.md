# WORK PLAN — Residensi Sinaran detail page, section by section

**Status: ACTIVE PHASE (from 29 Jul 2026).** The `/tender` grid is done for now (founder's call).
All 36 cards route to `/tender/residensi-sinaran` — this page is the **design canon**: whatever is
decided here becomes the template for every future detail page. That is why it is done one section
at a time, with a stated UI/UX rule per section, and Bryan reviews each rendered result.

**Bryan's standing instruction (30 Jul):** *"i want to talk about the UI/UX remakeover before
details, the architecturing of each sections before sections details."* Structure first — decide
what a section is FOR and how it is laid out before arguing about its copy or chasing missing
facts. A content gap is not a reason to stall a section's architecture.

**Method (binding, from AGENTS.md):** one section per pass → state the section's UI/UX rule →
build → LOOK at it rendered (desktop + 375px) → judge and report with a view → Bryan reacts →
next section. Claim "Property detail page" in TEAM-LOG.md before starting a pass. Log every pass.

Files: `src/components/tender/ResidensiSinaranDetail.tsx` (~278 lines, one component),
`src/styles/tender-detail.css`, `src/lib/tender-detail-behaviour.ts` (mount-time behaviours).

---

## Section queue, in order

Each entry: what it is → its job for the buyer → known issues → the section's UI/UX rule to state
and apply. Work top of page downward, because that is how Bryan reviews.

### 1. Opening header — ✅ DONE 30 Jul 2026
- Job: orient in 3 seconds — what property, open or closed, floor price, what to do next.
- **Rule applied:** status → name → address → price → actions, nothing else above the gallery.
  The tender's state and deadline must be visible without scrolling; the detail page may never
  tell a buyer less about the tender than the card they clicked to get here.
- Shipped: (a) new `.ovstatus` line — green dot + OPEN FOR TENDER + computed "Closes {date},
  5:00 PM · {n} days left", above the H1; (b) reserve price 24px→39px with the clarifier "The
  floor — offers start here", because "reserve price" is auction vocabulary a subsale buyer
  misreads as a fixed asking price; (c) **Playfair Display was never loaded in `__root.tsx`** —
  the page had been rendering Georgia while the grid used Newsreader; `--serif` switched to
  Newsreader and six serif rules capped 800/900→600 (Newsreader ships 400..700, above that the
  browser fakes the bold); (d) mobile: right column no longer right-aligns once the head stacks,
  map pin marks the first line of a wrapped address.
- Verified: 0px overflow at 375px, no console errors, typecheck clean.

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
- **RESOLVED 30 Jul (Bryan):** the registration step DOES exist and belongs on this page —
  "the listing page is the crucial information of the property, with my dad's sketches." Keep the
  row. (The *date* 17 Dec 2028 is still an assumed close-minus-14-days value — confirm the rule.)
- **THE BIG COPY CHANGE — the 3% is not an extra cost.** Founder: "the 3% is basically part of
  the booking fee from the 10% SPA." It is the standard Malaysian subsale earnest deposit: 2–3%
  on the Offer to Purchase, SPA signed within ~14–21 days with the balance topping it up to 10%,
  the remaining 90% on loan disbursement. So the tender deposit is the buyer's FIRST PAYMENT
  TOWARD THE HOUSE, not a platform fee — and it is refunded in full if the offer is not accepted.
  This section must say that plainly; today it reads as a standalone RM15,510 risk. Suggested
  ladder for this block: 3% now (refundable) → 7% more at SPA = 10% → 90% on completion. The
  agency fee is customarily deducted from that earnest deposit.
- ✅ **DONE 30 Jul:** deposit sub-line now "counts toward your 10% down payment"; added the
  derived payment ladder (3% now / +7% at SPA / 90% on completion, computed from RESERVE, never
  typed) and the negotiation panel. Step 3 changed "Receive the result" → "The seller responds".
  Still open in this section: the assumed registration date, and the rail's 5:00 PM claim.
- Rule: terms are facts in labelled rows; the how-it-works is a numbered sequence; one red CTA.

### 5. Property Details — ✅ REBUILT 30 Jul 2026
**Diagnosis of the old sheet:** 19 rows of which **10 were empty** (6 "Not stated", 3 em dashes),
so it read as an unfilled form; the icon band and the Layout/Size groups listed the **same five
facts twice**; and two competing empty states whose meanings had inverted (land area showed "Not
stated" on a strata townhouse where it does not apply, while zoning showed "—" where it does).

**The reframe that drove the redesign:** a sealed-tender buyer prices the property ONCE, with no
iterative negotiation to discover things in. So the section's job is not "describe the home" — it
is **"give me what I need to put a number on it."** Zones therefore run in decreasing pricing
impact, not in arbitrary categories:

1. **What you're pricing** — `RM369 psf` (**DERIVED** from reserve ÷ built-up, never typed),
   tenure with remaining term, land title. The psf is the metric buyers actually compare on and
   **no Malaysian portal leads with it**.
2. **Measurements** — the icon band, and *only* here. Nothing below repeats it.
3. **"Still have questions about this property?"** — one line and a button to `#agent`.
   ⚠️ This went through three versions; the reasoning matters so it does not get "improved" back.
   v1 listed the four undisclosed fields ("Not disclosed by the seller") — but that **apologises
   for our data gap** and **shrinks to nothing as the agency fills fields in**. v2 turned them
   into questions a buyer would ask — better, still needed maintaining. v3 (Bryan, final) lists
   **nothing**: a listing can never be complete, so the honest and permanent form is *whatever the
   details above don't answer, the agent will*. It is also the lead engine both platforms exist to
   be. Box went 315px → 98px across those versions.
4. **Full specification** — collapsed (`<details>`, the Zillow pattern), and only rows that carry
   a value, so the sheet can never look unfilled again.

**New empty-value rule, replacing the two-dash confusion:** *unknown but applicable* → goes in
zone 3. *Not applicable to this property type* → **row omitted entirely**. No dashes as data.

Result: 0 "Not stated" (was 6), no duplicated facts, section 638px. ⛔ Still needs real
occupancy/furnishing/maintenance data from the agency; the derived psf works today.

### 5b. Old notes (superseded)
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
  fill when founder supplies. Calculator: **UNBLOCKED 30 Jul** — the 10% down payment and the
  3% deposit are the same money, not two costs. Show the 3% as the first instalment of the 10%
  the calculator already assumes, so the two sections stop contradicting each other.
- Rule: the calculator never contradicts the tender terms shown above it.

### 10. FAQ
- Job: kill the last doubts. The "how many bidders" answer is the best copy on the site — keep.
  Add the two missing questions once founder answers: what if seller declines all offers
  (answerable NOW: decline → negotiate possible → full refund), and what happens after
  acceptance — **ANSWERED 30 Jul:** the appointed agent carries the deal forward with buyer and
  seller through to SPA. Both platforms are lead engines for the agency; a tender submission is
  a qualified lead an agent personally follows up. (Exact SPA day-counts still to confirm.)
- Rule: every answer states only confirmed process.

### 11. Sticky bid bar + subnav
- Job: the persistent CTA. Known issue from the old audit: on mobile the subnav slides UNDER the
  sticky header (both top:0, header wins z-order) — verify in this build and fix if inherited.
- Rule: one sticky CTA, never two competing sticky layers.

### 12. Apply-for-Tender flow — **PARKED.** Bryan will supply his member-dashboard design first.
  Do not design the account gate, the offer form, or the dashboard until he shares it.

---

## Facts recovered from the LIVE site, 30 Jul — two blocked items now answered
The live `/how-to-tender` page publishes process detail our canon was missing. Confirm with
Bryan's father before treating as final, but the agency already states these publicly:
- **Results announced within 5 working days of the closing date** → use in §4 step 3 and §10 FAQ.
- **The deposit is paid in the member account AFTER the tender form is submitted**, not at the
  moment of offering ("Log in to your member account to complete the Tender process and make the
  required deposit payment"). §4's copy must not imply payment happens on submission. This was
  the long-standing FLAG on deposit timing — largely closed.
- **Membership is mandatory before tendering** (step 1) → the parked apply flow opens with an
  account gate, as the live site already promises.
- **Buyers may inspect and view before bidding** — a trust asset absent from the rebuilt page.

## Founder answers — 30 Jul 2026, later (two GO-LIVE BLOCKERS closed)
**No 5:00 PM cutoff exists.** A tender runs to the end of its closing date; the listing simply
leaves the site. There is no intra-day deadline to communicate. All countdowns now target
23:59:59 MYT on the closing date. ❓ One detail still to confirm: whether offers can be submitted
*during* the closing day (assumed yes) or whether the listing goes at midnight *entering* it.

**Deposits are returned IMMEDIATELY, not "within 3 working days."** The agent negotiates between
buyer and seller; if the seller will not proceed — including after negotiation, and regardless of
whether the buyer would have accepted the seller's counter — the agent tells the buyer and
transfers the deposit back immediately. Bryan's reasoning, which is now the copy's reasoning:
once all three parties know the sale cannot proceed, a waiting period only manufactures
suspicion. *"It must be immediately... taking 3 business days seems kinda stupid, making the
buyer paranoid and suspicious for no reason."*

## Founder answers — 30 Jul 2026 (Bryan, direct)
0. ✅ **A tender outcome is NOT binary.** *"it's not about win or lose... there's always a
   chance/room for negotiation done by the agent, the agent can also pursue the buyer or the
   seller."* Accepted / negotiated / refunded are three outcomes, not two. Any copy that frames
   submission as win-or-lose is wrong — including the **grid hero's ACCEPTED / NOT ACCEPTED
   pair**, which should gain the middle path (flagged, not yet changed — Bryan's call).
1. ✅ **Registration step exists** and belongs on the detail page (Dad's sketches).
2. ✅ **The 3% is part of the 10%** — earnest deposit / booking fee, the first slice of the SPA
   down payment, not an additional charge. Refunded in full if the offer is not accepted.
3. ✅ **After acceptance:** the agency's agent proceeds with buyer and seller to SPA. Strategic
   framing — TenderProp and iNewProject are lead-collection engines for the agency; every
   e-Enquiry and tender is a lead an agent follows up.
4. ⏸️ Facilities for Sinaran — **parked by Bryan:** UI/UX architecture of each section comes
   before section content. Do not chase content answers ahead of structure.
5. ❓ Real REN + agency registration numbers — still open (REN 123456 is interim).
6. ❓ Exact SPA day-counts and the loan-declined case — still open.
7. ❓ Is "Registration by = close minus 14 days" the real rule? The shown date is assumed.

## SECTION FLOW SYSTEM — finalised 30 Jul 2026 (do not hand-tune per section)

Three variables in `tender-detail.css` `:root` govern the whole page's rhythm. Change the page's
feel by editing these, never by adding margins to individual sections:

| Token | Value | Governs |
|---|---|---|
| `--sec-pad` | `clamp(40px, 4vw, 56px)` | section padding per side → **80–112px between sections** |
| `--sec-title-size` | `clamp(1.75rem, 2.4vw, 2.25rem)` | every section heading → **36px** at desktop |
| `--sec-title-gap` | `26px` | section heading → its first content |

**Backgrounds alternate positionally**, not by hand-assigned class:
`main > section.blk:nth-of-type(even)` = paper `#FAF5F0`, `:nth-of-type(odd)` = card `#FFF`.
`--band-bg` travels with it so nested cards that match their band stay correct. Inserting or
removing a section re-solves the entire chain — which matters, because the hand-assigned version
**had already drifted**: `#location` and `#agent` were both white, breaking the rhythm halfway
down the page. `.band-card` / `.band-paper` remain as deliberate opt-outs only.

**One title treatment** shared by `.sec-title` and `.v1-top h3`. Before this, `#tender` used an
H3 at 34px with `margin-bottom: 0` while all nine other sections used an H2 at 36px with 18px.

Verified after the change: 10 sections, **one** padding value (56/56), **one** title size (36px),
**one** title gap (26px), **zero** alternation collisions, paper/white perfectly interleaved.

## Standing constraints (from AGENTS.md — binding)
Sealed-tender vocabulary only · deposit computed at 3% of reserve, never hardcoded · no invented
content except the two logged demo exceptions (tender start date on cards; every card routing
here) · CSS class names stable for EasyAsia · 375px no-overflow · never force-push · claim the
area in TEAM-LOG.md first · follow THE CHANGE SOP (look, judge, report with a view).
