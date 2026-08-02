<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# TenderProp Insight — rules for EVERY agent (Claude, Codex, anyone)

**This GitHub repo (`main` branch) is the ONLY source of truth for the TenderProp website build.**
Set by Bryan, 28 Jul 2026: *"make sure everyone is editing the same 1 same file in the repo."*

## Where things are
- **Edit here:** Bryan's Mac clone at `~/Desktop/Claude.CLI/tenderprop.os/tenderprop-insight` — or your own clone; either way, this repo is the destination.
- **See your changes:** local dev server — `npm run dev` (Vite, use port 5173). This is the LIVE view of the build.
- **https://tender-seeker-bot.lovable.app is a FROZEN SNAPSHOT.** It is Lovable's hosted copy from the morning of 28 Jul 2026, before Lovable credits ran out. It does NOT update from this repo. Use it as a visual reference only — never as the current state, and never edit anything based on the assumption it is current.
- Do NOT edit the old prototype copies elsewhere on Bryan's machine (`tenderprop.os/tenderprop-website-revamp*`, anything in `~/Downloads`). Those are design-reference archives from before this repo existed.

## 🔴 VOICE RULE — TenderProp speaks as a PLATFORM, not as an agency
Bryan, 30 Jul 2026: *"we cant put our licensed agent man, we cant [have] tenderprop as an agency
portal, this must be like a startup, similar to inewproject."*

- **Marketing copy — hero, product pages, meta descriptions, cards:** the subject is
  **TenderProp**. "TenderProp puts your sealed offer in front of the seller." Never "our licensed
  agent", "our appointed agent", "REA/REN", or "a licensed agency" in the front-of-house voice.
- **Disclosure zones — footer, About, FAQ, the agent block, and the apply/enquiry point:** the
  licensed-agency identity, REN/REA numbers and stakeholder-deposit wording MUST appear. This is
  a BOVAEP/Act 242 obligation, not a style choice. Never strip it from these places.
- The rule is the same one iNewProject follows: startup front, licensed disclosure where a buyer
  is about to commit money. Swept across the app 30 Jul — do not reintroduce agency voice
  upstream of the enquiry point.

## SITE-WIDE PLAN
`PLAN-site-architecture.md` — all 18 pages of the live site: what is broken today, the nav
redesign, the section stack for every page, and the build order. Read before starting any page
that is not the tender detail page.

## ACTIVE PHASE: the Residensi Sinaran detail page
`PLAN-residensi-sinaran.md` is the current working brief — read it before touching
`ResidensiSinaranDetail.tsx` or `tender-detail.css`. The `/tender` grid is done for now.

## FIRST: read TEAM-LOG.md

`TEAM-LOG.md` is the shared channel between agents (Claude, Codex, anyone else). It holds:
who is currently working on which files, a DECISIONS LEDGER of deliberate choices that must not be
silently reversed, unresolved questions waiting on the founder, and short working notes.

**Read it before you start. Update it before you stop. Commit it with your work.**
If something in the code looks wrong, check the decisions ledger before "fixing" it — it may be
deliberate, and reversing it wastes Bryan's time and ping-pongs the design.

## THE CHANGE SOP — how a request must be handled (Bryan, 29 Jul 2026)

**A change request is a GOAL, not a literal instruction. Executing the words and stopping is not
doing the job.**

Bryan's words: *"changing the code but not looking back at the frontend changes is not the right way
of doing things… you must go take a look of the changes in the frontend and have your own opinion…
whats the point of keep changing 1 thing over and over again if you can do it one time with the
right SOP."*

Example: *"move the button below the search button."* Moving it is step 2 of 6. You are not done
until you have looked at it and judged whether it actually works there.

**Every change follows these six steps:**

1. **Read the intent.** What outcome does Bryan actually want? The instruction is his best guess at
   how to get there — the outcome is the real target.
2. **Make the change.**
3. **Look at it rendered.** Open the page. Screenshot it. Measure it. Never judge from the code
   alone — code that looks right renders wrong all the time.
4. **Judge it, with your own opinion.** Is that the right placement? Does the size, weight and font
   still fit the hierarchy? Is spacing balanced against its new neighbours? Is it obvious to a user?
   Did it break, crowd or unbalance anything next to it? Does it still work at 375px?
5. **Finish the job.** Fix whatever the change itself broke or exposed — that is part of the request,
   not extra work. **But do not silently redesign adjacent things Bryan did not ask about.** If you
   think something nearby should also change, say so and let him decide.
   (Precedent: growing the hero panel to fit taller content was wrong — the content should have been
   fitted to the panel. Fix what your change requires; propose anything beyond that.)
6. **Report with a view.** Say what you saw when you looked, what you judged, and flag anything you
   disagree with or that needs his call. "Done" on its own is not a report.

**The point:** one careful pass instead of five sloppy ones.

## 🎨 DESIGN CANON: `DESIGN-SYSTEM.md`
**Values and patterns live in `DESIGN-SYSTEM.md`** — tokens, the type rules, the three
section-flow tokens, the established component patterns, the traps that have already cost us time,
and the brand non-negotiables. Read it before any visual work; add to it in the same commit as any
new design decision. This file holds the *behaviour* rules below; that file holds the *system*.

> 📄 **Handing this to someone outside the build?** Send **both**:
> [`COLLABORATOR-BRIEF.md`](./COLLABORATOR-BRIEF.md) (Bryan, the family agency, the platforms,
> compliance, how he works, how to give useful feedback) and
> [`TENDERPROP-BRIEF.md`](./TENDERPROP-BRIEF.md) (the product A–Z). They are a pair and do not
> repeat each other — except the **design tokens, which appear in both deliberately. If the
> palette or type changes, change it in both.** Keep both in sync when canon changes: a second
> source of truth that drifts is worse than none.

## 🏢 WHAT TENDERPROP ACTUALLY IS (founder briefing, Bryan, 1 Aug 2026) — READ THIS FIRST

Bryan: *"i feel like you and codex building this like you dont know what tenderprop is."* He was
right. This is his account of the model. **Build to this, not to what a proptech platform usually
looks like.**

**TenderProp is a LEAD ENGINE for a real estate agency. It is not a transaction platform.**
The One Property Global is a licensed agency with real agents doing normal agency work. TenderProp
is a new way for those agents to sell their listings — and a new way for buyers to buy. **No money
moves through this site. Ever.**

**The buyer flow, end to end:**
1. Buyer clicks **Apply for E-Tender**. Not signed in ⇒ a sign-in / sign-up dialog. **Members only.**
2. Signed in ⇒ the **Tender Form Application**. It captures **name, email, phone, and their bid
   price** — same shape as iNewProject's enquiry. Everything else on the form is pre-filled listing
   data (reference, address, built-up, tenure, reserve, deposit, tender date).
3. Submit ⇒ **the agency receives a lead** and the agent follows up on those contact details.
4. **The 3% deposit is collected AFTERWARDS, by the agent, into the agency's client account** —
   which BOVAEP mandates. It is never paid on TenderProp. The site must never imply otherwise.
5. The agent takes the bid to the seller. Accept, decline, or counter — **the agent negotiates as
   the middleman**, and a buyer may end up resubmitting. This is normal agency work, not an
   automated auction settlement.
6. The member's dashboard (`/member/`) keeps their submitted e-tender receipts as a record.
   **Due its own revamp later.**

**The reserve price is a GUIDE, not a floor.** Buyers deliberately offer *below* it to try their
luck; the seller may accept or counter. Copy that says "minimum offer considered" or "the floor"
is wrong and argues against the product — naming your own number **is** the e-tender.

**Where the listings come from:** the agency's own agents collect them as usual, then pitch the
e-tender/owner-auction concept to the seller — sell faster, no extra cost. The seller keeps normal
selling *and* gets the tender. Tenders run roughly **3–6 months** by agreement.

**The moat is physical.** Every listing gets **two banners** outside the house: The One Property's,
and TenderProp's beside it. 100 listings = 100 locations advertising the platform for free.

**E-Tender vs Owner Auction — a seller picks ONE, never both:**
- **E-Tender** — private sealed offer at the buyer's chosen price; seller accepts, declines or
  counters.
- **Owner Auction** — live bidding, Zoom or physical, run by a licensed auctioneer the group will
  hire; 3% deposit to enter the room; price climbs until sold. Reference: `ownerauction.my`.
  **Last thing to revamp.**
- **Public auction** (bank foreclosures) is a FUTURE tab. Not now.

## 🔌 EASYASIA OWNS THE BACKEND — build to the contract (Bryan, 1 Aug 2026)

His words: *"easyasia is our backend, we are not creating/revamping backend, thats their job, we
give them the frontend, they understand, and rebuild the backend."* Current live admin:
`https://www.tenderprop.com/admin/project/` — it will be **rebuilt** for this revamp.

**So every field we render must be a field a real admin can fill.** If a value cannot be typed
into a form or uploaded, it does not belong on the page.

**[`BACKEND-CONTRACT.md`](./BACKEND-CONTRACT.md) is the handoff document.** Two hard rules:

1. **No rendered field without a contract entry, in the same commit.** If you add a key to
   `src/data/tenders.ts`, add its row to the contract. A drifted contract is worse than none,
   because EasyAsia will build to it.
2. **Mark derived values DO-NOT-STORE.** Days-left, psf, the 3% deposit and batch grouping are
   computed from the listing — if the backend stores them too, an admin can enter a number that
   contradicts the source. That is exactly the "885 vs 884 days" bug from 1 Aug, except at the
   data layer where nobody notices.

**Design consequence, which is the useful part:** prefer *data-driven presence* over placeholder
copy. The media row used to say "Video viewing — on request" because no video existed; it now
renders a button only when `media.video` is set. **Absence should remove a control, not add an
apology** — and it gives EasyAsia a plain optional field instead of a special case.

## 👁 THE DESIGN CRITIC — never ship visual work you have only measured

Measuring is not judging. Every visual thing Bryan has rejected passed its measurements: aligned,
zero overflow, contrast fine, tap targets fine, and still ugly. **Correct and beautiful are
different tests, and only the second one is done with your eyes.**

Before any visual change reaches Bryan:

1. **Render it and look at the picture.**
2. **Build three treatments, ship one.** One attempt has nothing to be judged against and you will
   defend it because you made it. Put the variants behind a one-character switch, screenshot each,
   recommend one, delete the losers when he picks.
3. **Run the `design-critic` subagent** (`.claude/agents/design-critic.md`) on the screenshot. It
   did not build the thing. If it names a different fault axis than you did, it is probably right.
4. **Diagnose the AXIS before fixing** — place / weight / shape / redundancy. Fixing the wrong axis
   repeatedly is the most expensive failure in this repo: the "New to e-tender?" signal was rebuilt
   twice on the *placement* axis when the fault was *weight*, and Bryan had to diagnose it himself.
5. Log the verdict in `DESIGN-SYSTEM.md` §7 when he rejects something. Verdicts transfer; rules did
   not prevent any of these.

## 🎨 THE DESIGN SOP — "improve the design" means ALL of it (Bryan, 30 Jul 2026)

His words: *"when i say improve the design, you make use your critical thinking on how to improve
the designs… you have to beautify it by taking in all the consideration on how to make tenderprop
look really nice, not just the font, size, placement, positioning, basically everything else."*

**Fixing only the attribute he named is not doing the job.** If he says "the font is small", the
brief is *make this section beautiful* — the font is just where his eye landed. Work every axis
below, then report what you judged, not only what you changed.

**1. Space before anything else.** It is the biggest lever and the most common fault. Is a row
124px tall to carry 18 characters? Do related items sit *closer* to each other than to unrelated
ones? Density is a decision — make it deliberately.

**2. Alignment.** Do values share a common x? Do columns agree across a gap? A single consistent
alignment is what makes a table read as engineered rather than typed.

**3. Typography.** Size, weight, family, letter-spacing, line-height, case, optical sizing. Three
levels of hierarchy, not six. **If everything is bold, nothing is emphasised** — 600 usually beats
700 across a long list.

**4. Hierarchy & scan order.** Name what the eye hits 1st, 2nd, 3rd. Does that order match what
actually matters to a buyer? If not, re-order — don't restyle.

**5. Redundancy.** Is anything shown twice on the same screen? Bryan catches this every time. Cut
it or derive one from the other so they cannot drift.

**6. Colour.** One accent per zone. Does the accent earn its place? Check contrast (AA); the brand
red fails on dark scrims — use a lightened tint there.

**7. Emptiness.** What does this look like with missing data? Never ship something that reads as
an unfilled form. Omit inapplicable rows; collect unknown-but-relevant ones into a stated block.

**8. Structure.** Question the container itself. Table, list, chips, cards, one column or two —
the right shape often removes the styling problem entirely.

**9. States.** hover, focus-visible, active, empty, loading, closed/expired. Focus rings are not
optional.

**10. Responsive.** 375px, tablet, and very wide. Does it degrade, or does it transform properly?
Zero horizontal overflow, always.

**11. Motion.** Only where it clarifies. Always honour `prefers-reduced-motion`.

**12. Use the system.** Reuse existing tokens and components before inventing. New card styles
fragment the page.

**13. Stay on brand.** Cream / burgundy / red, Newsreader + Inter, restrained and **flat** — no
gradients, no glossy 3D, no imported iNewProject palette. Adopt patterns, never palettes.

**14. Measure it.** Do not claim it is better — measure it. Row heights, alignment positions,
contrast, overflow, before/after. Numbers in the report.

## 🔴 PUSH BEFORE YOU STOP — non-negotiable (Bryan, 30 Jul 2026)

*"why every time codex didnt push, he must push always, that means the agents.md is not good
enough."* He is right — the old protocol said how to push, never **when**. It does now.

**A turn is not finished until `git push origin main` has run and you have reported the result.**
Work that exists only in your working tree does not exist:
- Bryan reviews on `localhost:5173`, which serves the **working tree** — so *you* can see your work
  while the repo, EasyAsia and the other agent cannot.
- The other agent pulls before starting. Unpushed work is invisible to them, so they plan against
  a stale page and you get a conflict or duplicated effort.
- A session can end without warning. Anything unpushed is lost.

**Rules:**
1. **Push at the end of every turn.** Not "when the feature is done" — every turn.
2. **If the work is mid-flight, still commit and push it**, with `WIP:` in the subject and a note
   in `TEAM-LOG.md` saying what is half-built. A pushed WIP is infinitely better than a clean
   working tree nobody else can see.
3. **Say so in your reply.** State the pushed range (e.g. `af5c726..4add2bf`). "I've made the
   change" without a push line is an unfinished report.
4. **Never leave another agent's uncommitted files in your commit.** `git status` first; stage only
   your own paths. If the tree has someone else's work in it, say so rather than sweeping it in.
5. **Before starting, `git pull` and claim your area** in the TEAM-LOG claims table. Release it
   when you push.

## Git protocol (prevents agents clobbering each other)
1. `git pull` before you touch anything.
2. Leave the working tree CLEAN when you stop: commit + push, or discard. Never leave uncommitted edits for the next agent to trip over.
3. Push only working code to `main` — it is the demo surface.
4. NEVER force-push / rebase / amend pushed commits (see Lovable notice above).
5. One agent in the working tree at a time.
6. Claim your area in `TEAM-LOG.md` before editing, and release it when you push. If another agent
   holds the area you were asked to work on, tell Bryan rather than editing anyway.
7. If you hit a merge conflict, STOP and tell Bryan. Never resolve it by discarding the other
   agent's work.

## Product rules (non-negotiable, from the founder)
- **Vocabulary:** bid, tender, reserve price, tender closing date, "Apply for Tender". Never "Auction Date", never "starting bid", never live-auction devices (bid counts, "N bidding now") — this is a SEALED tender: nobody ever sees another buyer's offer.
- **Deposit rule:** the refundable deposit is **3% of the reserve price** (founder-confirmed 28 Jul 2026). It is computed in `src/lib/tender-utils.ts` (`depositOf`) — never hardcode deposit figures.
- **Never write "10% legal fees"** (known-wrong wording; it's a down payment).
- **Do not invent content:** no fake statistics, testimonials, transactions, or amenities. The 12 records flagged `demo: true` in `src/data/tenders.ts` are deliberate per-state fillers — keep them marked and strippable, and never give them detail pages.
- **REN 123456 is a placeholder** — a real REN + agency registration number are required before anything goes public.
- **Design tokens** live in `src/styles/tender-listings.css` `:root` (cream/burgundy/red palette, Inter + Newsreader). Keep CSS class names stable — a third-party dev shop (EasyAsia) will lift this markup into their own stack.
- **Mobile:** zero horizontal overflow at 375px, always. Verify before pushing.

## Context (why this repo exists)
Reference prototype for tenderprop.com's revamp, to be re-implemented by EasyAsia. Full business
canon and design history live in Bryan's Obsidian vault at `~/Desktop/Claude.CLI/tenderprop.os/`
(start with `Vision/operating_model.md` and `Vision/design_direction_ownerauction_gap.md`).
