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

## Git protocol (prevents agents clobbering each other)
1. `git pull` before you touch anything.
2. Leave the working tree CLEAN when you stop: commit + push, or discard. Never leave uncommitted edits for the next agent to trip over.
3. Push only working code to `main` — it is the demo surface.
4. NEVER force-push / rebase / amend pushed commits (see Lovable notice above).
5. One agent in the working tree at a time.

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
