# WHOLE-SITE REVAMP ARCHITECTURE — every page, what it's for, how to build it

Written 30 Jul 2026 after reading all 18 pages of the live site (`tenderprop.com`, local copy at
`tenderprop.os/tenderprop-website-copy/`). `PLAN-residensi-sinaran.md` covers the detail page;
this file covers everything else. Read both.

---

## 1. DECIDED 30 Jul 2026 — THE PORTAL IS OUT

**Bryan: *"there will be no more buy and sell anymore, only tender and owner auction."***

TenderProp stops being a general property portal. It is a two-product platform:
**E-Tender** (sealed offers, batched by closing date) and **Owner Private Auction** (live bidding,
licensed auctioneer). Private-treaty buying and renting are retired.

This is the right call. The portal side had 4 sale listings and 28 agents of whom 2 had any
listing — unwinnable against PropertyGuru and iProperty. The two auction-style methods are a
service almost nobody in Malaysia offers. The moat is the method, not the inventory.

### The consequence that has to be designed around

Retiring /buy and /rent removes real listings hosted for ~28 agents (Ken Ng, WH Low, yap khuan
sang and others, each with their own mobile on the card). What remains is roughly **five tender
records and two auction records**. The site goes from "hundreds of listings" to a handful.

**A handful of properties is fine — but only framed as a cycle, never as a catalogue.**
"5 properties, offers close 12 December" is an event with real scarcity. "5 properties" presented
as a browsable catalogue is embarrassing. Every page must lead with the cycle and its deadline.
This is the single most important framing decision in the revamp.

Second consequence: those 28 agents lose their listing shelf. That pushes them toward bringing
properties in as tender or auction stock instead — which is exactly what the exclusive-agency
model wants. Aligned, but it is a conversation the agency has to have with its own people.

### Where do sellers go now?

"No more buy and sell" retires the *private-treaty business*. It must not retire the **seller
door** — owners are the customers who actually pay (listing packages plus commission), and
without them there is no supply at all. Recommendation: the /sell page survives, renamed to match
the products and narrowed from three routes to two.

## 2. WHAT IS ACTUALLY BROKEN RIGHT NOW (live, today, on the public site)

Ranked by damage. Items 1–4 are credibility wounds and should be fixed before any redesign.

| # | Page | Problem |
|---|---|---|
| 1 | **/sell** | **Lorem ipsum in three places** — under "Sale By Tender", "How To Sell Via Tender" and "Owner Auction vs Tender". This is the revenue page. Latin placeholder is live. |
| 2 | **/sell** | **Eighteen fake sold properties** — "Project ABC, Bangsar" ×9 and "Project XYZ, Bangsar" ×9 under *Testimonial Properties Sold Via Owner Auction / Via Tender*. Fabricated track record on a licensed agency's site. Remove until real transactions exist. |
| 3 | **/about-us** | Says **"coming soon"**. 46 words. The page that proves you are a real licensed agency is empty — while other pages ask for a RM15,510 deposit. |
| 4 | **/agent** | Publishes **28 agents' personal Gmail/Yahoo addresses** in plain text. One reads `foongcarol@yahoo.comdemo` — a data-entry error shipped live. PDPA exposure and a scraping target. 26 of 28 show "0 Listing(s)". |
| 5 | **/owner-auction** | Live listings priced **"RM-"** and one literally titled **"Auction Property 2 test"**. Test data on the public site. |
| 6 | **/register** | H1 reads **"Memebr Registration"** — typo, live. |
| 6b | **/how-to-bid** | **A fourth lorem ipsum block**, directly under the heading "How To Bid?" — the one thing that page exists to explain. |
| 6c | **/contact-us** | TenderProp's public contact email is **`info@newproject1u.com`** — the *other* company's domain. A visitor checking who they are paying finds a different brand. |
| 6d | **/rent** | A rental listed at **RM5,200,000** ("pjs7 pj") — a sale price in a rent record. Retired with the page, but shows the data hygiene. |
| 7 | **all** | Nav has **eleven** top-level items with duplicates: "Tender" and "How To Tender", "Owner Private Auction" and "Owner Auction", plus a "Services" grab-bag of four unrelated businesses. |
| 8 | **all** | **No page has any internal structure.** Every page is one `<h1>` and a wall of text — not a single `<h2>` anywhere except Terms of Use. Nothing is scannable. |

---

## 3. THE NAV — eleven items down to five

Current: Tender · How To Tender · Owner Private Auction · Owner Auction · How To Bid · Sell ·
Services (Investment / Interior Design & Renovation / Loan Center / Legal Matter) · Agent ·
Register · Sign In

Proposed, under the two-product decision:

| Item | Contains | Serves |
|---|---|---|
| **E-Tender** | the built listings grid · how to tender · the cycle countdown | buyers |
| **Owner Auction** | auction listings · how to bid · next auction date | buyers |
| **List Your Property** | why tender vs auction · packages · the exclusive-agency terms | **owners — the revenue** |
| **Services** | loan, legal, renovation, investment — the membership benefits | members |
| **About** | licensed agency, the people, why your deposit is safe | **trust — gates everything** |

Sign In / Register sit right. "How To Tender" and "How To Bid" become sections inside their
product page — nobody navigates to a manual. **/buy and /rent are retired**; redirect both to
E-Tender rather than 404, since they hold whatever inbound links and search equity exist.

## 4. PAGE-BY-PAGE ARCHITECTURE

Each page: **its one job** → **the section stack to build** → notes. Same method as the detail
page: architecture first, content second, one section per review pass.

### 4.1 Homepage — *currently 501 words, leads with the wrong business*
**Job:** in ten seconds, make a stranger understand that this is where Malaysian property is sold
by sealed tender, and send them to Buy or Sell.

1. **Hero — the cycle as an event.** The batch date is the product's heartbeat and it is
   currently only visible on /tender. Lead with it: next tender cycle, live countdown, how many
   properties, one primary CTA. Reuse the diagonal-split hero already built for the grid.
2. **What E-Tender is, in three panels** — sealed / batched / refundable-deposit-that-counts.
   The existing "introducing e-tender" copy is decent but buried in a paragraph; break it up.
3. **The two routes** — E-Tender vs Owner Private Auction, one line each, links to Sell.
4. **Featured tender properties** — cards from the built grid component. *Tender only.* Not the
   private-treaty listings currently there.
5. **Why a licensed agency** — REN/REA, stakeholder-held deposit, Act 242. Trust before proof.
6. **Testimonials** — keep, but verify each is a real client first (see §2 item 2).
7. **Seller CTA strip** — free valuation + free inspection. Currently a form dropped mid-page
   with no framing.

Kill from the homepage: the four private-treaty "Properties for Sale" cards and the repeated
`0123938255 Stephen Yew` on every card.

### 4.2 Sell — *the revenue page. Currently 1,011 words, three of them lorem ipsum blocks.*
**Job:** convince an owner to sign an exclusive agency agreement.

1. **Hero** — "Sell by tender. One date, sealed offers, no drawn-out negotiation."
2. **THE COMPARISON TABLE — build this first, it is the highest-value page element on the site.**
   Private Treaty vs E-Tender vs Owner Private Auction, across: how price is set, how long it
   takes, who bids, what it costs, who runs it, what happens if it doesn't sell. The live site
   promises this comparison and delivers Latin. A seller cannot choose without it.
3. **Why tender works** — competitive sealed offers, a fixed end date, no endless back-and-forth.
4. **The banner flywheel — currently invisible online and it shouldn't be.** Per the operating
   model, dual physical banners on every listing are the real growth engine. An owner's first
   question is "how will you actually market my property?" Show the banner. It is concrete,
   local, and no portal can copy it.
5. **How to sell, step by step** — the 5 steps exist; rewrite them (they contain typos:
   "Real Estate Agent conduction sales", "Particicape in E-Tender").
6. **The exclusive-agency requirement, stated plainly** — owners must appoint the agency
   exclusively; selling through another agency still owes commission. Say it here, honestly,
   rather than letting an owner discover it at signing.
7. **Packages and pricing** — 3 or 6 month listing packages. ⛔ *Blocked: real RM figures needed.*
8. **Real sold results** — ⛔ *Blocked: remove Project ABC/XYZ until real transactions exist.*
9. **FAQ** — the existing Owner Auction FAQ is genuinely good copy. Keep and extend to tender.

### 4.3 Buy / the tender grid — **DONE.** See `PLAN-residensi-sinaran.md`.
The grid and the detail page are built. What remains: fold "How To Tender" and "How To Bid" in
as sections rather than separate pages.

### 4.4 Owner Auction — *238 words, showing test data*
**Job:** explain live bidding and show what is coming up.
1. Next auction date + countdown (already there, keep).
2. **How an owner auction differs from a bank auction** — this is the single most common
   confusion in Malaysia and the /sell page answers it well. Move that answer here too.
3. Listings grid — reuse the tender card component. ⛔ Strip "test" and "RM-" records first.
4. Licensed auctioneer note — legally load-bearing, currently absent.

### 4.5 About Us — *"coming soon". Rebuild from zero.*
**Job:** not a company bio — **"why your money is safe."** This page gates every deposit.
1. Who we are: The One Property Global, licensed estate agency, registration numbers.
2. The licence — Act 242 / BOVAEP, what it obliges the agency to do.
3. Where your deposit sits — stakeholder-held, refunded in full if no sale proceeds.
4. The people — founder, principal, the agents who actually run deals.
5. Contact + office. ⛔ *Blocked: real registration numbers and legal identity.*

### 4.6 Services — *I read these wrong the first time; correcting it*
Investment, Loan Center, Legal Matter and Interior Design are **not** four unrelated businesses.
Every one of them carries the same two lines — *"special privilege for member"* and *"Become a
Member"* — and the same four-step funnel: join as a member → submit an enquiry → get a
recommendation or quote → confirm. And membership is step 1 of tendering.

So the real chain is: **Services make membership worth having → membership is required to tender
→ tendering is the business.** That is a coherent funnel, not a grab-bag, and it should be built
as one page that says so out loud: *"Members get the whole transaction handled — financing,
conveyancing, renovation."* A portal cannot offer that; only a licensed agency with panels can.

Real assets already on these pages worth keeping: a **named CIMB financing partnership** ("up to
95% + 5% financing"), panel solicitors for SPA/tenancy/loan/refinancing, and a stated
secondary-market investment thesis.

### 4.7 Agent — *liability today*
Either rebuild as a credential showcase (photo, name, **REN number**, area, active listings,
contact via form only — never a raw email) or remove it. **Do not ship 28 public Gmail addresses
again.** Most useful version: show only agents with active listings.

### 4.8 Register / Sign In — parked
Bryan supplies the member-dashboard design first. Fix the "Memebr" typo now regardless.

### 4.9 Buy (private treaty) / Rent / Investment listings
Strategic call needed (§1). If the portal stays, these need real inventory; if it goes, redirect
to the tender grid. Do not invest design effort until Bryan decides.

### 4.10 Legal pages — Privacy Policy (867w) and Terms of Use (1,031w)
Structurally the healthiest pages on the site. Leave alone until the deposit and refund terms are
final, then reconcile the terms with what the tender pages promise.

---

## 5. CROSS-CUTTING — apply on every page
- One design system: the tokens and components already built for the tender grid and detail page.
- Newsreader is the one display serif site-wide (Playfair was never loaded — see §1 of the
  detail-page plan).
- Every page gets real `<h2>` structure. Nothing ships as an undifferentiated wall of text.
- The tender cycle countdown belongs in the footer of every page.
- No invented content. No lorem ipsum. No fabricated sold-property tiles.
- No personal email addresses or mobile numbers in public markup — contact forms only.
- 375px, zero horizontal overflow, always.
- Sealed-tender vocabulary; deposit always computed, never hardcoded.

---

## 6. BUILD ORDER

**Now — credibility, cheap and urgent (§2).** Remove the lorem ipsum, the 18 fake sold tiles,
the test auction records, the public email addresses; fix "Memebr". These need no design work
and every one of them is visible to anyone Bryan sends to the site today.

**Next — the two pages that make money.** (1) Sell, starting with the comparison table.
(2) Homepage, rebuilt around the tender cycle.

**Then — trust and consolidation.** About Us, then Services merged into one page.

**Later — the strategic call.** Portal in or out; Agent directory rebuilt or retired; member
area once Bryan supplies the dashboard design.

---

## 7. WHAT ONLY THE FOUNDER CAN UNBLOCK
1. Real REN / agency registration numbers + footer legal identity.
2. Package pricing — actual RM for 3-month vs 6-month.
3. Real sold results, or confirmation there are none yet to show.
4. Portal in or out (§1) — the one decision that shapes every remaining page.
5. Whether the homepage testimonials are real, named clients.


---

## 8. OPERATIONAL FACTS RECOVERED FROM THE LIVE SITE (30 Jul, second read)

The live /how-to-tender and /how-to-bid pages contain real process detail that was missing from
our canon and was sitting on the blocked list. Confirm each with Bryan's father, but these are
what the agency already publishes:

1. **Tender results are announced within 5 working days of the tender closing date.** This closes
   a gap in the detail page's step 3 and belongs in the FAQ.
2. **The deposit is paid inside the member account after the tender form is submitted** —
   live step 5: *"Log in to your member account to complete the Tender process and make the
   required deposit payment."* So it is not taken at the moment of submitting the offer. The
   detail-page copy should not imply otherwise.
3. **Membership is mandatory before tendering** — step 1 on both how-to pages. The apply flow must
   therefore open with an account gate, matching what the site already promises.
4. **Owner Auction deposit is 3% of the *bidding* price**, where the tender deposit is 3% of the
   *reserve* price. Same percentage, different base. Do not conflate the two in shared copy.
5. **Buyers may inspect and view the property before bidding**, and are told to contact the agent
   to arrange it — a genuine trust asset that appears nowhere in the revamped pages yet.
6. **Real office identity** for the About page and footer: No. 23B, Jalan USJ 10/1C, 47620 Subang
   Jaya, Selangor · (+603) 8021 6468. The email needs replacing (see §2 item 6c).
7. **Named CIMB financing partnership** — "up to 95% + 5% financing".
