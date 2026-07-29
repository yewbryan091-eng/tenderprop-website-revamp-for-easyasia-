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
