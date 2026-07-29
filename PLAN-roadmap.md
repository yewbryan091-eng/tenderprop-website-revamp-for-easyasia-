# THE ROAD AHEAD — strategy, predictions, risks (written 30 Jul 2026)

Where this revamp goes after the current build, what will break first, and what to do about it
before it breaks. Companion to `PLAN-site-architecture.md` (pages) and
`PLAN-residensi-sinaran.md` (detail canon).

## The phases

**Phase 1 — the demo (now → EasyAsia handoff).** Grid ✅, detail page (in progress), house frame ✅.
Decorate the framed pages in this order: Sell → Homepage sections → About → Owner Auction →
Services. Then strip the 12 demo records and hand over. The deliverable is rendered HTML/CSS +
this repo's plans — EasyAsia rebuilds inside EasyCMS, so **every clever behaviour must degrade
gracefully** (timer, filters: enhancement, not dependency).

**Phase 2 — real data.** The moment real listings replace demo records, three things bite:
(1) photos — Sinaran has 7 professional shots; most subsale listings will arrive with 3 phone
photos. The gallery must not look broken at 3 (design the 2-thumb and 4-thumb states).
(2) missing fields — the "Not stated" convention scales, but a listing with 12 of 19 rows unstated
looks worse than one with a shorter honest sheet; consider collapsing empty groups.
(3) the cycle — a cycle with ONE property must still look intentional ("1 property this cycle,
next cycle opens …").

**Phase 3 — the member area.** Blocked on Bryan's dashboard design BY DECISION — do not design
ahead. But pre-wire the seams now: every Apply CTA already points somewhere real (/member),
Save already implies an account. When it lands, the deposit flow inside the member account is
the single most regulated piece of the platform (client money, Act 242) — build it last, verify
it hardest.

**Phase 4 — growth loops.** The banner flywheel is physical; the site's job is to catch what it
throws. Predictions: (a) a QR on every banner → the property's detail page with a
`?src=banner` param = measurable flywheel; (b) the cycle calendar becomes an email/WhatsApp list
("next cycle opens 12 Mar — 6 properties") — the enquiry-notification Cloudflare/Telegram work
from iNewProject is directly reusable here; (c) every closed tender = a "sold via E-Tender"
banner on-site = the proof wall for /sell.

## Predictions — what will go wrong first

1. **The empty-shelf problem.** Two products, ~7 records. If a visitor lands mid-cycle with
   nothing open, the site dies. Mitigation is already decided (cycle framing), but add: closed
   tenders stay visible as "last cycle's results" — scarcity proof, not emptiness.
2. **The 28 agents.** Retiring /buy//rent removes their shelf. Some will churn; the ones who stay
   need a reason: "bring a property into the cycle" needs its own pitch page or PDF (an
   agent-facing version of /sell). Flag for the founder.
3. **SEO cliff.** The old site's pages hold whatever Google equity exists. When the new site
   ships, keep every old URL 301-redirecting to its successor (the /buy→/tender pattern,
   extended). Never let tenderprop.com 404 its own history.
4. **Compliance scrutiny.** A platform holding 3% deposits as stakeholder + advertising "refunded
   in full within 3 working days" invites BOVAEP/consumer scrutiny the moment it has real volume.
   Before go-live: real registration numbers in the footer, terms-of-use reconciled with the
   deposit copy, and the refund-days claim verified with the founder (the "3 working days" on the
   grid hero is still unverified).
5. **The countdown paradox.** Timers create urgency; 886-day timers create comedy. Rule: show the
   segmented timer only under ~90 days; above that show the date + "days left" text. Worth
   applying to both hero and rail when real (shorter) cycles arrive.

## The one-sentence strategy
TenderProp's moat is not software — it is a licensed agency willing to run a method nobody else
runs, with a physical banner network nobody online can copy. The website's only job is to make
that method legible and trustworthy enough that a stranger will hand a licensed agency 3% of a
house price. Every design decision that does not serve that sentence is decoration.
