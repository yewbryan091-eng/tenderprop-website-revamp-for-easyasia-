# RUBRIC — the /100 scoring instrument

**Fixed. Do not tune mid-loop.** A rubric edited to make a score look better measures nothing. If
a band is genuinely wrong, Bryan changes it and every prior score is marked as scored under the
old instrument.

Scoring applies to **the active surface**, not the whole page — except at surface 11, where it
applies to the page as one object.

| # | Band | Points |
|---|---|---|
| 1 | TenderProp understood quickly | 20 |
| 2 | Visual hierarchy | 15 |
| 3 | Alignment + spacing | 15 |
| 4 | Design-system consistency | 10 |
| 5 | E-Tender / product accuracy | 10 |
| 6 | Desktop composition | 10 |
| 7 | Mobile / responsive | 10 |
| 8 | CTA clarity | 5 |
| 9 | Accessibility | 5 |
| | **Total** | **100** |

---

## Band anchors

Score against the anchors, not against how hard the work was.

### 1 · TenderProp understood quickly — 20

*Can a stranger who has never heard of e-tender say what this is, and what they can do here?*

| | |
|---|---|
| **18–20** | The method is legible in one read. A visitor could explain "you name your own price, sealed, by a deadline" after ten seconds. It could not be any other company's page |
| **13–17** | Understandable but takes a second pass, or leans on a word ("tender") the visitor has to already know |
| **8–12** | Reads as a property site; the *method* — the actual product — is not the message |
| **0–7** | Generic proptech. Swap the logo and nothing changes |

The **generic / AI-looking** axis is scored here. A page that measures perfectly and reads as a
template scores in the bottom half of this band no matter what else is true.

### 2 · Visual hierarchy — 15

*Name what the eye hits 1st, 2nd, 3rd. Does that order match what actually matters?*

| | |
|---|---|
| **13–15** | Three clear levels. First read is deliberate and correct. Nothing competes with it |
| **9–12** | Order is right but the gaps between levels are too small to feel — or there are five levels, not three |
| **5–8** | Two elements fight for first read |
| **0–4** | Flat. Everything is emphasised, so nothing is (`AGENTS.md` DESIGN SOP §3) |

### 3 · Alignment + spacing — 15

**Bryan's standing order, 3 Aug: the thing this project gets wrong most often.** Scored with
**numbers**, not impressions — see `AGENTS.md` ALIGNMENT AND SPACING COME FIRST.

| | |
|---|---|
| **13–15** | Every left edge and right boundary printed, and they collapse to a small set of repeated values. Every vertical gap is one number you can point at in the CSS |
| **9–12** | Edges agree; one or two gaps are produced by two mechanisms at once (a `gap` plus a `min-height` plus a margin) |
| **5–8** | Multiple near-miss edges — five values within 3px of each other. Right boundaries disagree with left ones |
| **0–4** | Not measured. **An unmeasured surface cannot score above 4 in this band**, however good it looks |

Traps this band exists to catch: `ch` is font-relative and cannot hold two typefaces to one
column · optical ≠ metric · dead space at the end of a block is a defect · the tallest child sets
the row height silently.

### 4 · Design-system consistency — 10

| | |
|---|---|
| **9–10** | Composed entirely from existing tokens and patterns. A reader could not tell which page it came from |
| **6–8** | Mostly systematic, with one new value that should have been a token |
| **3–5** | A new visual language appearing on one section — new card style, new radius, new type step |
| **0–2** | Off-brand: gradients, gloss, heavy shadow, or an imported palette |

**No new visual languages.** If a surface seems to need one, the surface is wrong, not the system
(`PLAN-AUGUST-DELIVERY.md` §1).

### 5 · E-Tender / product accuracy — 10

**Binary-ish and unforgiving.** Any single business-rule violation caps this band at **4** and is
automatically a **P0** — see `loop/regression-guards.md` §3.

| | |
|---|---|
| **9–10** | Every claim is founder-verified or derived. Nothing invented. Blocked content is marked honestly |
| **5–8** | Accurate but vague where it could be precise, or an unhedged negotiation claim |
| **0–4** | A hard rule is broken: reserve as floor, implied payment, auction framing, invented proof |

### 6 · Desktop composition — 10

*The picture, at 1440 and 1280.* Does the surface have a shape, or is it a stack of full-width rows?

| | |
|---|---|
| **9–10** | Deliberate composition. Whitespace is doing work. Reads as designed |
| **6–8** | Correct and unremarkable |
| **3–5** | Content poured into a container; the container was never questioned |
| **0–2** | Broken proportions, marooned elements, or dead space with no owner |

### 7 · Mobile / responsive — 10

| | |
|---|---|
| **9–10** | **Transforms** at 375/390 rather than degrading. Zero horizontal overflow. Tap targets ≥ 44px. Reading order still correct |
| **6–8** | Works, but is the desktop layout squeezed |
| **3–5** | Something wraps badly, or an element loses its meaning at width |
| **0** | **Any horizontal overflow at 375px is an automatic 0 in this band and a P0** |

### 8 · CTA clarity — 5

| | |
|---|---|
| **5** | One primary action, obviously primary. Secondary routes are second, not hidden — demoting is not hiding (`DESIGN-SYSTEM.md` §5) |
| **3–4** | Clear, but a secondary is loud enough to hesitate over |
| **1–2** | Two reds in one zone, or the primary is not the most valuable action |
| **0** | No discernible primary action |

### 9 · Accessibility — 5

| | |
|---|---|
| **5** | Focus rings present and visible · heading order sound · alt text real · AA contrast · `prefers-reduced-motion` honoured · live regions not hostile |
| **3–4** | One lapse |
| **0–2** | Focus rings missing, heading order broken, or AA failures in body copy |

`--red` fails AA on dark scrims (~3.4:1) — use `#FF8578` there (`DESIGN-SYSTEM.md` §5.6).

---

## Scoring discipline

1. **Score after the screenshot, never from the diff.** Bands 1, 2, 6 and 10-adjacent judgements
   cannot be made from source.
2. **Every band needs one line of evidence** — a measurement, a screenshot reference, or a named
   fault. A number with no evidence is not a score.
3. **Claude scores before Codex audits.** Scoring after seeing the audit is grading your own
   corrected paper.
4. **Do not round up toward the lock threshold.** A surface sitting at 89 across two iterations is
   information: either the remaining fault is real and worth fixing, or the changes have gone
   lateral and Bryan should call the lock. Inflating to 90 destroys that signal.
5. **A band can go down.** Fixing spacing by adding a new card style trades band 3 for band 4, and
   the total is the honest answer.

## Score history

| Iter | Surface | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | Total | Δ | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| — | Header + hero | — | — | — | — | — | — | — | — | — | — | — | not built |
