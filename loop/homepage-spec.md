# HOMEPAGE SPEC — what `/` has to do

Working spec for the homepage loop. **Business model, product rules, tokens and patterns are NOT
repeated here** — they live in:

| For | Read |
|---|---|
| What TenderProp is, the buyer journey, the rules that keep getting broken | `TENDERPROP-BRIEF.md` |
| Voice rule, change SOP, design SOP, alignment/spacing standing order | `AGENTS.md` |
| Tokens, type, section flow, established patterns, the traps, the taste log | `DESIGN-SYSTEM.md` |
| Every field a page may render, and what must not be stored | `BACKEND-CONTRACT.md` |
| The whole-site plan and the original homepage section stack | `PLAN-site-architecture.md` §4.1 |
| The August schedule and what "done" means | `PLAN-AUGUST-DELIVERY.md` §7 |

Where this file disagrees with those, **those win** and this file is the bug.

---

## 1. The job

**In ten seconds, a stranger understands that this is where Malaysian property is sold by sealed
E-Tender — and knows which door is theirs: buyer or seller.**

Two audiences arrive here and they are not equal in value:

| | Who | What they need | Where they go |
|---|---|---|---|
| **Buyer** | Someone who found a TenderProp banner outside a house, or searched | *What is an e-tender and can I actually offer my own number?* | `/tender` |
| **Seller** | An owner deciding how to sell — **the paying side** | *Why would I sell this way, and what does it cost me?* | `/sell` |

The seller is the revenue (`PLAN-site-architecture.md` §1). The buyer is the volume. **The
homepage serves the buyer first and the seller unmissably** — a buyer with nothing to browse is a
dead platform, and a seller who never sees their door is lost revenue. Both doors exist above the
fold or within one scroll; only one of them is the primary CTA.

## 2. The framing decision that governs everything

> **A handful of properties is fine — but only framed as a cycle, never as a catalogue.**
> — `PLAN-site-architecture.md` §1

"5 properties, offers close 12 December" is an event with real scarcity. "5 properties" presented
as a browsable catalogue is embarrassing next to PropertyGuru. **Every surface on this page leads
with the cycle and its deadline, not with inventory volume.**

## 3. What the page must never become

- A **property portal**. No Buy/Rent architecture, no "search 10,000 listings", no agent directory.
  Retired 30 Jul, permanently.
- An **auction site**. No bid counts, no current/highest bid, no "N people viewing", no ticking
  urgency beyond the closing date. Sealed means sealed (`TENDERPROP-BRIEF.md` §C5).
- A **checkout**. No money moves through TenderProp, ever (§C2). Nothing on this page may imply a
  payment, escrow, or a deposit taken at submission.
- An **agency brochure** above the fold. Platform voice in front, licensed disclosure in the
  footer / About / at the apply point — the Act 242 split (`AGENTS.md` VOICE RULE).
- **Generic.** If the hero could carry any proptech logo without changing a word, it has failed
  band 1 of the rubric regardless of how well it measures.

## 4. The surface stack

Build order is fixed. Each surface locks before the next starts.

| # | Surface | Its one job | Notes / source |
|---|---|---|---|
| 1 | **Header + hero / first viewport** | Say what TenderProp is, show the live cycle, open the buyer path | **ACTIVE.** Approved direction in §5 below |
| 2 | Open E-Tenders | Prove the product is real with actual listings | Reuse `PropertyCard` from `/tender`. **E-Tender stock only** — never the retired private-treaty cards |
| 3 | E-Tender differentiation | Why this beats a normal listing, for a buyer | The "reserve is a guide" insight is the strongest line the product owns — use it, correctly |
| 4 | How E-Tender works | The method in three or four beats, then out to the full page | `/how-e-tender-works` is framed and 3 live links already point at it. This surface is the teaser, not the manual |
| 5 | Buyer / seller pathways | The fork, stated once and clearly | Do not repeat the fork in five places; it is one section |
| 6 | Seller valuation / pricing intelligence | The group has **licensed valuation capability** — help a seller establish market value | **New proposition, founder-flagged 5 Aug.** Not in the hero unless Bryan says otherwise |
| 7 | Trust / professional process | Why your deposit is safe — licensed agency, client account, Act 242 | This is the disclosure zone. Agency voice is *correct* here |
| 8 | Owner Auction teaser | The second product exists; a seller picks ONE | **Deliberately small.** Bryan: last thing to revamp. Explain the concept, do not build the product |
| 9 | Final seller CTA | Convert the owner into `/sell` | ⛔ Blocked on package pricing for anything specific |
| 10 | Footer | Legal identity, Act 242 disclosure, cycle date, nav | Exists today in `SiteFooter.tsx`. Audit rather than rebuild |
| 11 | Full-page integration pass | The page as one object | Band alternation, type rhythm, CTA hierarchy across the whole scroll, 375px |

## 5. Surface 1 — approved architectural direction

**Approved by Bryan, 5 Aug 2026. Copy and visual treatment are NOT approved.**

A roughly **55/45 desktop composition**:

**LEFT (~55%)**
- The TenderProp value proposition — what this is, fast
- Homepage E-Tender search
- The primary CTA / discovery path

**RIGHT (~45%)**
- Product proof — a real E-Tender visual or real information
- **Must support the hero hierarchy, not compete with it.** Two things fighting for first read is
  the failure mode this split invites

**Open, not decided:**
- final hero copy
- final visual treatment
- whether the cycle countdown lives left or right
- whether the right panel is a real listing, the cycle, or the method

**Constraints that already apply:**
- Days lead any countdown; no D/H/M/S strip as the headline (`DESIGN-SYSTEM.md` §3d)
- One red primary action in this viewport. Red means *click this*, and nothing else
- No saturated full-bleed slab as decoration — prominence comes from position and whitespace
  (`DESIGN-SYSTEM.md` §7, first row: *"i dont like it, its ugly placement"*)
- The `/tender` diagonal-split hero is **available to reuse and not obligatory.** Reusing it keeps
  the system tight; repeating it verbatim makes the homepage a duplicate of the listings page.
  Whichever way this goes, it is a decision to argue for, not a default

**Explicitly parked:** seller valuation (surface 6) does not go in the hero automatically. It is a
major future proposition and it gets its own section unless the founder overrules.

## 6. Data the homepage can render today

From `src/data/tenders.ts` — 36 records, of which **12 are `demo: true` fabricated state-coverage
fillers that get deleted before go-live**, leaving **24 real records**. All 36 are
`tenderMethod: "E-Tender"`; **there is no Owner Auction record in the data at all.**

Batches, by closing date:

| Closing date | Listings | Note |
|---|---|---|
| **2026-12-12** | 5 | The next cycle — what `/` and the footer already show |
| 2026-12-30 | 5 | |
| 2027-03-20 | 8 | |
| 2027-06-18 | 9 | |
| 2027-09-24 | 8 | |
| 2028-12-31 | 1 | Residensi Sinaran — **885 days out, which is not a tender.** Founder question #6 |

**Derived, never stored:** days left, psf, the 3% deposit, batch grouping, slug, open/closed.
`src/lib/tender-utils.ts` owns all deadline maths — never divide by 86 400 000 in a component
(`DESIGN-SYSTEM.md` §3e).

**Any new field the homepage renders needs a `BACKEND-CONTRACT.md` row in the same commit.**

## 7. Founder-blocked — mark honestly, never invent

| Blocked | Blocks | Ref |
|---|---|---|
| Real sold results / completed e-tenders | Any proof or track-record surface | Founder request #2 |
| Are the old testimonials real, named clients? | Testimonials return only if yes | #7 |
| Seller package pricing (3-month vs 6-month) | Surface 9, anything specific | #1 |
| Real REN / BOVAEP agency registration (`E(1)xxxx`) | Footer legal identity, trust surface | #3 |
| Sinaran's real closing date | Any hero that features that listing | #6 |

The 18 fabricated "Project ABC/XYZ, Bangsar" sold tiles on the live site are the precedent for
what not to do here (`PLAN-site-architecture.md` §2, item 2).

## 8. Definition of done for the homepage

`PLAN-AUGUST-DELIVERY.md` §7 applies unchanged, plus the loop's own gate: **every surface LOCKED
per `HOMEPAGE-LOOP-ENGINEERING.md` §5, and surface 11 passed.**
