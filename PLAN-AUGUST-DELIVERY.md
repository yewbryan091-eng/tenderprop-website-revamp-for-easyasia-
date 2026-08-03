# AUGUST DELIVERY PLAN — complete revamp to Vicky by 31 Aug 2026

**Set 3 Aug 2026 by Bryan.** *"we have to finish everything… all the pages (homepage, services,
sell, about us), basically a complete website revamp as a whole package and send to vicky before
end of this month."*

**28 days. 4 of them are already spoken for by handoff prep, so the real build window is 21 days.**

---

## 1. The thing that makes this possible

**The tender grid and the Residensi Sinaran detail page are not two finished pages — they are the
design system.** Tokens, cards, the facts row, the money box, the countdown, the section bands,
the type scale, the band alternation, the submit block. Every remaining page is **composed from
that vocabulary**, not invented.

That is why 21 days is realistic. It would not be if we were still deciding what the site looks
like. **So: no new visual languages. If a page seems to need one, that is a signal the page is
wrong, not that the system is short.**

---

## 2. The real constraint is NOT build speed

Three things will decide whether this lands, and none of them is how fast pages get built:

**① Content we do not have.** Sell cannot be finished without package pricing. About cannot be
written without the real company story. Services needs the real service list. The homepage needs
real proof. **These have the longest lead time because they need Bryan's father, not a build
session.** See §5 — those requests go out today, not in week 2.

**② Bryan's review loop.** Every section passes through him, and that is correct — it is what has
made the built pages good. But it is the throughput limit. Mitigation: batch reviews by page, send
a full page for one pass rather than a section at a time, and **lead every handoff with a
recommendation** so a reply can be one word.

**③ Scope creep on what is already built.** The detail page could absorb the entire month. It is
now good. **It gets one review pass, then it is frozen** unless something is actually broken.

---

## 3. Scope — what "everything" means

| Page | State today | Effort | Notes |
|---|---|---|---|
| `/tender` grid | **Built** | Review only | The design system |
| `/tender/residensi-sinaran` | **Built** | **1 review pass, then FREEZE** | The detail canon |
| `/how-e-tender-works` | Framed | **Small** | 3 live links already point at it — a broken promise today |
| `/` homepage | Framed | **Large** | The front door. Rebuild around the tender cycle |
| `/sell` | Framed | **Large** | The revenue page. **Blocked on pricing** |
| `/about` | Framed | Medium | Rebuild from zero — currently "coming soon" |
| `/services` | Framed | Medium | Merge into one page |
| `/owner-auction` | Framed | **Small — deliberately** | Bryan: "last to revamp". Explain the concept properly, do not build the product |
| `/member` | Framed | **OUT OF SCOPE** | Blocked by decision — Bryan owns the dashboard design |
| `/buy`, `/rent` | Stub | **Delete** | Portal retired 30 Jul |
| Nav, footer, legal | Partial | Medium | Cross-cutting, week 4 |

---

## 4. The schedule

### Week 1 · 3–9 Aug — the front door
- **Today (3 Aug):** finish the detail page. One pass over the 7 sections Bryan has not yet
  worked through (Selling Points, What's Nearby, Location, Agent, Mortgage, FAQ, Similar), then
  **freeze it**.
- **`/how-e-tender-works`** — small, and it is currently a promise the site does not keep.
- **Homepage** — the largest single win. Reuses the cycle hero, cards and section bands wholesale.

### Week 2 · 10–16 Aug — the money pages
- **`/sell`** — the revenue page. Comparison table first (normal sale vs e-tender vs owner
  auction), then the packages. **If pricing has not arrived by 10 Aug, build the page with the
  pricing block stubbed and clearly marked** rather than stalling the whole week.
- **`/about`** — trust. Real company story, the agency's licence and standing.

### Week 3 · 17–23 Aug — consolidation
- **`/services`** — merged into one page.
- **`/owner-auction`** — concept page only. Deliberately not the product.
- **Delete `/buy` and `/rent`.** Nav down to five items.
- **Every page reaches "content complete" by 23 Aug.**

### Week 4 · 24–31 Aug — harden and hand over
**No new pages this week.** This is the week that decides whether the package is credible:
- Full mobile pass at **375px**, every page, zero horizontal overflow.
  - **🔴 KNOWN P0, deferred here by Bryan on 3 Aug ("mobile is last").** On the detail page at
    375px the **sticky sub-nav is 100% hidden behind the header**. Verified live: header 253px
    tall at `z-index: 60`, sub-nav sticks at `top: 0` with `z-index: 55`, and
    `elementFromPoint` at the sub-nav's centre returns the header's own nav. So on every phone
    there is no section navigation at all. Compounded: `scroll-margin-top` is **128px** against
    that 253px header, so **every anchor link also lands underneath it**. Fix needs the header
    height to drive both values, or a non-sticky header below 860px — it changes header
    behaviour site-wide, which is why it waits for this week rather than being patched
    mid-section.
- Compliance sweep: Act 242 disclosure present, no banned vocabulary, no over-claims.
- **Strip the 12 `demo: true` records.** They must not reach EasyAsia.
- Cross-page consistency: nav, footer, section rhythm, type scale.
- Accessibility pass: focus rings, alt text, heading order, `prefers-reduced-motion`.
- **Update `BACKEND-CONTRACT.md`** with every field the new pages introduced — this is what Vicky
  actually builds from.
- Refresh `TENDERPROP-BRIEF.md` and `COLLABORATOR-BRIEF.md`.
- Production build green, then hand over.

---

## 5. Founder requests — these go out TODAY

Longest lead time, so they cannot wait for the week that needs them.

| # | Needed for | Question |
|---|---|---|
| 1 | **`/sell`, week 2** | **Package pricing.** Actual RM for the 3-month vs 6-month seller package. Without this the revenue page cannot be finished |
| 2 | `/sell`, homepage | **Real sold results** — any completed e-tender we can show, or confirmation there are none yet. Proof is what sells the concept to a seller |
| 3 | Every page, week 4 | **Real REN + agency registration + footer legal identity.** `REN 123456` cannot ship |
| 4 | `/about` | **The company story** — founding, size, what the agency is known for. Cannot be invented |
| 5 | `/services` | **The real service list.** What does the agency actually offer today? |
| 6 | Detail page | **Sinaran's real closing date.** `2028-12-31` renders as **885 DAYS LEFT** in 76px type |
| 7 | Homepage | Are the old testimonials **real, named clients**? If not they do not return |
| 8 | Tender terms | Is the **5-working-day** seller response a fixed rule? Is the tender **start date** real, or per listing? |

---

## 6. How the two agents split it

Two agents on one repo needs discipline, and the claim table is how it stays clean.

- **Claim in `TEAM-LOG.md` before editing. Release on push.** Never edit a claimed area.
- **Split by PAGE, never by layer.** Two agents in the same stylesheet on the same day is how the
  duplicate-selector bugs happened. One agent owns a page end-to-end — markup, styles, copy.
- **Shared files** (`tender-utils.ts`, tokens, `SiteHeader`/`SiteFooter`) are **high-collision**.
  Announce before touching, keep the change small, push immediately.
- **Both read the founder briefing in `AGENTS.md` before writing buyer copy.** Most rework this
  week came from copy that contradicted the business.

---

## 7. What "done" means for each page

A page is not done because it renders. It is done when:

1. Every section has real content, or is honestly marked as awaiting a founder input.
2. **375px:** zero horizontal overflow, tap targets ≥ 44px.
3. Compliance: Act 242 disclosure where required, no banned vocabulary, no unsupported claims.
4. States: hover, focus-visible, empty, loading, closed/expired.
5. It composes from the existing design system — no new visual language.
6. **Every field it renders is in `BACKEND-CONTRACT.md`.** Vicky builds from that, not from JSX.
7. Bryan has seen it rendered and approved it.

---

## 8. Honest risks

**The one that actually threatens the date:** founder-blocked content. If pricing and the company
story arrive on 25 Aug, `/sell` and `/about` will be rushed in the week reserved for hardening,
and the whole package gets weaker. **§5 going out today is the mitigation.**

**Second:** review latency. If a page waits three days for a look, three pages become a lost week.

**Third:** perfectionism on built pages. The detail page is good. Freeze it.

**What I would cut if we are behind on 24 Aug**, in this order: Owner Auction concept page → the
Services merge → homepage refinements. **Never cut** the mobile pass, the compliance sweep, the
demo-record strip, or the backend contract update — those are what make it a *handoff* rather than
a folder of pages.
