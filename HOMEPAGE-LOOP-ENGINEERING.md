# HOMEPAGE LOOP ENGINEERING — the controlled build system for `/`

**Set by Bryan, 5 Aug 2026.** The homepage is the front door and the largest single win left in
the August delivery (`PLAN-AUGUST-DELIVERY.md` §3). It is being built under a **controlled loop**
rather than the usual build-and-review pass: one surface at a time, adversarially audited, scored
against a fixed rubric, and **locked** before the next surface starts.

**Why a loop.** Every expensive failure in this repo has the same shape — a section was rebuilt on
the wrong axis two or three times because nobody separated *building* from *judging* it. The loop
separates them by force: the builder does not get to be the judge, and the judge does not get to
edit. See `DESIGN-SYSTEM.md` §7, where every rejected item had already passed its own author's
review.

---

## 1. The system in one table

| File | What it holds | Who writes it |
|---|---|---|
| **This file** | The system itself — roles, protocol, build order, lock condition | Bryan / Claude |
| `loop/homepage-spec.md` | What the homepage must do, surface by surface | Claude, Bryan approves |
| `loop/rubric.md` | The /100 scoring instrument and how to score honestly | Fixed — do not tune mid-loop |
| `loop/regression-guards.md` | The pass/fail checks every iteration must clear | Fixed |
| `loop/iteration-state.md` | **The live state.** Current surface, score, ACCEPTED FIXES, next action | Claude, Bryan overrules |
| `loop/claude-builder-prompt.md` | The standing brief for the builder | Fixed |
| `loop/codex-auditor-prompt.md` | The standing brief for the auditor — paste into Codex | Fixed |
| `loop/reviews/` | One Codex audit per iteration, `iter-NN-codex.md` | Codex |
| `loop/screenshots/` | Rendered evidence, `iter-NN-<surface>-<viewport>.png` | Claude |

**This file does not restate the business.** TenderProp's model, product rules and design canon
live in `AGENTS.md`, `TENDERPROP-BRIEF.md`, `DESIGN-SYSTEM.md`, `BACKEND-CONTRACT.md` and
`PLAN-site-architecture.md`. Those win over anything written here. A contradiction between this
system and those files is a bug in this file.

---

## 2. Fixed roles

### CLAUDE CODE — sole builder and writer

**May:** modify homepage files · run the app · capture screenshots · fix defects its own changes
caused · commit coherent iterations · update `loop/iteration-state.md`.

**Must not:**
- autonomously redesign TenderProp
- change a **LOCKED** section
- revive generic Buy/Rent portal architecture (retired 30 Jul — `PLAN-site-architecture.md` §1)
- invent live bid counts, a highest/current bid, or any fake activity
- imply money is paid on TenderProp
- describe the reserve price as a floor or minimum
- implement reviewer suggestions automatically — **only ACCEPTED FIXES are binding**

### CODEX — adversarial auditor, READ-ONLY

Codex does not edit files during normal loop operation. It attacks eleven axes:

1. product accuracy · 2. information architecture · 3. visual hierarchy · 4. alignment ·
5. spacing · 6. responsive behaviour · 7. accessibility · 8. CTA hierarchy ·
9. design-system consistency · 10. generic / AI-looking design · 11. regressions

Every finding is emitted in this exact shape:

```
SEVERITY: P0 / P1 / P2 / P3
AXIS:
EVIDENCE:
WHY IT MATTERS:
RECOMMENDED FIX:
```

And the report ends with exactly one verdict:

```
REJECT          — a P0 exists, or the surface is on the wrong architecture
LOOP AGAIN      — real faults, right direction, iterate
LOCK CANDIDATE  — clears the lock condition; Bryan's call
```

### BRYAN — final judge

**Only findings Bryan places under ACCEPTED FIXES in `loop/iteration-state.md` become binding on
Claude.** A Codex finding is evidence, not an instruction. Bryan may accept, defer, or reject any
of them, and may add fixes Codex never raised.

---

## 3. Homepage build order

Locked surfaces are not revisited unless a genuine **system-level** problem appears — meaning the
fault cannot be fixed inside the surface that has it.

| # | Surface | Status |
|---|---|---|
| 1 | **Header + hero / first viewport** | ← **ACTIVE** (planning) |
| 2 | Open E-Tenders | — |
| 3 | E-Tender differentiation | — |
| 4 | How E-Tender works | — |
| 5 | Buyer / seller pathways | — |
| 6 | Seller valuation / pricing intelligence | — |
| 7 | Trust / professional process | — |
| 8 | Owner Auction teaser | — |
| 9 | Final seller CTA | — |
| 10 | Footer | — |
| 11 | Full-page integration pass | — |

Surface 11 is not optional. Ten locked sections do not make a locked page — band alternation, type
rhythm, CTA hierarchy across the whole scroll and the 375px pass are page-level properties and can
only fail page-level.

---

## 4. The iteration protocol

```
PLAN
  └─ state the intent, the architecture, and what would make it wrong
BUILD
RUN                       npm run dev  (Vite, port 5173)
SCREENSHOT DESKTOP        1440 primary, plus any breakpoint the change touches
SCREENSHOT MOBILE         390 and 375
CLAUDE SELF-CRITIQUE      own opinion, own score, named faults — before Codex sees it
REGRESSION GUARDS         loop/regression-guards.md, all of them
CODEX ADVERSARIAL AUDIT   loop/codex-auditor-prompt.md → loop/reviews/iter-NN-codex.md
JUDGE ACCEPTS / REJECTS   Bryan fills ACCEPTED FIXES
UPDATE iteration-state.md
PATCH
REPEAT → LOCK
```

**Claude and Codex must never edit the same files concurrently.** Claude holds the homepage claim
in `TEAM-LOG.md` for the whole loop; Codex is read-only for its duration. If Codex needs to write,
it writes to `loop/reviews/` and nowhere else.

**Screenshot before claiming anything is done.** Numbers verify correctness; only eyes detect
ugliness (`AGENTS.md` — THE DESIGN CRITIC).

---

## 5. Scoring and the lock condition

Full instrument in `loop/rubric.md`. Weights:

| Band | Points |
|---|---|
| TenderProp understood quickly | 20 |
| Visual hierarchy | 15 |
| Alignment + spacing | 15 |
| Design-system consistency | 10 |
| E-Tender / product accuracy | 10 |
| Desktop composition | 10 |
| Mobile / responsive | 10 |
| CTA clarity | 5 |
| Accessibility | 5 |
| **Total** | **100** |

**LOCK when all of these hold:**

- score ≥ 90
- zero P0
- zero unresolved P1
- responsive guards pass
- zero TenderProp business-rule violations
- two consecutive iterations improve by **< 2 points**

**OR** Bryan / the judge decides further changes are lateral. That override exists because a loop
that cannot stop is a worse failure than a surface scoring 88 — and "lateral" is a judgement, not
a measurement.

A locked surface is recorded in `loop/iteration-state.md` under **LOCKED** with its final score
and the iteration that locked it.

---

## 6. Starting an iteration

1. `git pull` — the claim table in `TEAM-LOG.md` is the coordination surface, and it is only true
   if you have pulled.
2. Read `loop/iteration-state.md` — **ACCEPTED FIXES is the entire brief.** Nothing else is binding.
3. Read `loop/homepage-spec.md` for the active surface.
4. Build → render → screenshot → self-critique → guards.
5. Write the self-critique and score into `loop/iteration-state.md`.
6. Commit and **push** — `AGENTS.md` PUSH BEFORE YOU STOP applies to every turn of this loop, WIP
   included.
7. Hand `loop/codex-auditor-prompt.md` to Codex with the iteration number.

---

## 7. What this loop does not cover

- `/tender` and `/tender/residensi-sinaran` are **design canon, reference only.** The loop reads
  them; it never edits them.
- Backend behaviour. Any new field the homepage renders needs a `BACKEND-CONTRACT.md` row **in the
  same commit** — that rule is not suspended inside the loop.
- Founder-blocked content (real sold results, package pricing, real REN/agency identity,
  testimonial verification). The loop marks these honestly on the page; it never invents them.
