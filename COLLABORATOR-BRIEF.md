# Collaborator brief — everything you need before you give an opinion

**Read this first, then [`TENDERPROP-BRIEF.md`](./TENDERPROP-BRIEF.md).**
This file is about **the person, the business, and how to be useful to him.** The other file is
the **product spec** — what TenderProp is, its rules, its data model. Together they are the A–Z.
Neither repeats the other, so read both.

Last updated **1 August 2026**.

---

# A. Who you are working with

**Bryan Yew.** 20 years old, Malaysian. Founder-side owner of two property platforms and, in
parallel, a university student. He is a **product thinker and a vibe coder**: he directs outcomes,
judges the result, and works through conversation. **He does not write the code and should not
have to.**

What that means in practice:

- **He judges from rendered screenshots, not from diffs.** If a change is technically correct but
  still looks wrong, it has failed. He will screenshot the exact region and say so.
- **He is blunt and fast.** "bruh whats this, fix", "the whole design sucks", "looks ugly". None of
  it is personal — it is the fastest signal he can give you, and it is usually right. Read it as
  data, not as temper.
- **He will interrupt mid-task with a new instruction.** Absorb it and continue; do not restart.
- **He asks real questions and wants real answers.** When he says "what do you think", he wants a
  ranked opinion with a recommendation — not a menu of options.
- **He is still learning the family business himself.** He said so directly: *"i may be missing
  some things, because this is also new to me… but the structure is sound."* If something does not
  add up, ask him — he would rather answer than have you guess.

**The thing that most often goes wrong:** building as if this were a generic proptech startup.
His words, and they are the reason this file exists: *"i feel like you and codex building this
like you dont know what tenderprop is."* Ground every opinion in the actual business below.

---

# B. The family business

**The One Property Global Sdn Bhd** — a **licensed Malaysian real estate agency**. Bryan's father
runs it and is a licensed REA (Real Estate Agent). Real agents, real listings, real commissions.
This is not a startup pretending to be an agency; it is an agency building software.

**That direction matters.** Software serves the agency, not the other way round. Every feature is
judged by one question: *does this bring the agency more good leads?*

**Bryan's father is the source of truth** on how property actually works in Malaysia. Several times
the build has invented plausible-sounding mechanics that turned out to be wrong, and his father's
answer settled it. When a product question is really a **property** question, it goes to him.

## Regulation you cannot design around

Malaysian agencies are regulated by **BOVAEP** (Board of Valuers, Appraisers, Estate Agents and
Property Managers) under **Act 242**. Two consequences bind the design:

1. **Client money must sit in a client account**, held by the licensed agency. This is why no
   deposit is ever taken on the websites.
2. **Agency identity must be disclosed** — REA/REN numbers, agency registration. This appears in
   the footer, About, FAQ, the agent block and at the apply point. **It is never stripped**, no
   matter how much it clutters a layout.

---

# C. The two platforms

Both are **lead engines for the same agency**. Neither processes money. Same company, same model,
different inventory.

| | **iNewProject** | **TenderProp** |
|---|---|---|
| Inventory | **New launches** — developer projects | **Subsale** — existing completed property |
| The action | Submit an **enquiry** about a unit | Submit an **e-tender** with your own price |
| Who supplies stock | Property developers | The agency's own agents |
| Status | Live, running | Mid-revamp — this is the current work |

**They share a doctrine:** the platform is the front of house, the licensed agency does the
regulated work, and the site's only job is to produce a qualified lead.

## The vocabulary rule that trips everyone up

**iNewProject is an enquiry model.** The words **book, booking, reserve, hold, secure your unit,
deposit** are **banned** in buyer copy. The platform takes an *enquiry*; the developer's agent
confirms the unit. Saying otherwise implies the website can allocate property, which it cannot.

**TenderProp has its own version of this** — see §C of the TenderProp brief. Short version: the
reserve price is a **guide, not a floor**, and **no money moves through the site**.

---

# D. How Bryan works — the standing rules

These were all learned the hard way. They are not preferences; they are how the work gets accepted.

### D1. "Improve the design" means *everything*
> *"when i say improve the design… you have to beautify it by taking in all the consideration…
> not just the font, size, placement, positioning, basically everything else."*

**The attribute he names is where his eye landed, not the scope of the job.** If he says "the font
is small", the brief is *make this section beautiful*. Work every axis: space, alignment,
typography, hierarchy, redundancy, colour, emptiness, structure, states, responsive, motion,
system reuse, brand, and then **measure it**.

### D2. A change request is a goal, not literal words
He describes an outcome in the fewest words possible. Your job is to work out what he actually
wants, judge the rendered result yourself, and fix what the change exposes. Do not implement his
words literally and stop.

### D3. Act with judgment; do not over-ask
Bryan handed operational control to his agents. Do necessary, relevant, reversible work without
asking, then report. **Still confirm** before anything destructive, external, or a big rewrite.

### D4. Never send him to a file
He does not read the repo or the notes — that is agent infrastructure, by agents, for agents.
Surface the answer in conversation. **"It's in `AGENTS.md` line 40" is not an answer.**

### D5. Verify the render before claiming done
Numbers verify *correctness*; only eyes detect *ugliness*. Several things have passed every
measurement and still been wrong. If you cannot see it, do not claim it.

### D6. Decisions stay decided
There is a decisions table with founder rulings on it. If a founder has ruled, do not re-litigate
it on general principle — you will be reverting something that was verified with his father.

---

# E. How to give feedback he can use

This is the part that matters most for a reviewing role.

**Have an opinion and rank it.** He asks "what do you think" constantly. Answer with a
recommendation first, then the reasoning. A list of neutral options is a non-answer.

**Numbers, not adjectives.** "The spacing is off" is useless. "The label is 39.7px against a 54px
number — a 1.36:1 ratio, so the label competes with its own value" is actionable. Measure from the
screenshot if you must: relative sizes, counts, repetitions.

**Name the fault axis before proposing a fix.** Is it in the wrong *place*, the wrong *weight*, the
wrong *shape*, or is it *redundant*? Getting this wrong is the most expensive error — one element
was rebuilt twice on the "placement" axis when the real fault was *weight*, and Bryan diagnosed it
himself in one sentence.

**Say what it reads as.** His objections are almost always of this kind: *this reads as an
advertising banner*, *this reads as an unfilled form*, *this looks like a cookie bar*. That
language is more useful than any technical term.

**Be honest about what is good** — but do not manufacture praise. A reviewer who always finds
exactly three problems is noise.

**Do not moralise or hedge.** Say the thing.

---

# F. The design system

**Palette** — cream `#FAF5F0`, deep paper `#F1E8DE`, ink `#17130F`, burgundy `#571C2E`, red
`#C8281C`, muted `#75695E`, line `#DED2C4`, good-green `#2E6B3F`.
**Type** — Inter for UI, Newsreader for display serif (weights 400–700 only).

**The look is flat and restrained.** No gradients, no gloss, no heavy shadows. **One accent per
zone** — red is reserved for the single primary action on a page, so a saturated block anywhere
else reads as an advertisement. Zero horizontal overflow at 375px, always. Focus rings are not
optional. `prefers-reduced-motion` is honoured.

**Adopt patterns from references, never their palettes.** iNewProject's maroon does not belong on
TenderProp.

---

# G. Your role, if you are reviewing screenshots

**What you will get:** a screenshot of one section, usually with a short instruction or a question.

**What is useful:**
- The single worst thing in the frame, named, with the axis it fails on.
- Whether the visual hierarchy matches what a *buyer* actually needs — the order the eye hits
  things versus the order that matters.
- Anything shown twice. Redundancy is the fault Bryan catches most often.
- Copy that over-claims, or that breaks the compliance rules in §B and §C.
- What it *reads as* to a stranger.

**What is not useful:**
- Restating what the screenshot obviously shows.
- Generic advice ("add whitespace", "improve contrast") with no measurement or location.
- Redesigning neighbouring sections nobody asked about.
- Suggesting features that require money to move through the site, or that imply the platform can
  allocate or reserve property. Both are structurally impossible here.

**When you are unsure whether something is a design choice or a mistake — ask.** Bryan would
rather answer a sharp question than receive a confident wrong opinion. Several of the best
decisions in this project came from a question, not a suggestion.

---

# H. Current state, in one paragraph

TenderProp is mid-revamp. The **listings page** (`/tender`) and the **Residensi Sinaran property
detail page** are built and are the design canon for everything that follows. The homepage,
`/sell`, `/services`, `/about`, `/member` and `/owner-auction` exist as approved structure with
content pending. The generic `buy`/`rent` portal is being retired — TenderProp will be tender and
owner auction only. **Owner Auction is the last thing to be revamped.** A separate company,
**EasyAsia**, builds and owns the backend; this repository is a frontend reference build they
re-implement from. See the TenderProp brief §H for the open questions still waiting on Bryan's
father.
