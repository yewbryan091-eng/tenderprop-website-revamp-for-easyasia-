# BACKEND CONTRACT — what the frontend needs from EasyAsia

> **Who this is for.** EasyAsia builds and owns the TenderProp backend. We build the frontend.
> They read what we ship and rebuild the backend behind it — the same way iNewProject worked.
> This file is the handoff: everything a listing must carry, in one place, so nothing has to be
> reverse-engineered out of our JSX.
>
> **Current live backend:** `https://www.tenderprop.com/admin/project/` — it will be rebuilt for
> the revamp. Nothing in this repo touches it. **We do not build backend.**

**The rule that keeps this file true:** no field may be rendered on a page unless it is listed
here, in the same commit. If you add a field to `src/data/tenders.ts`, add it here. A contract
that drifts is worse than no contract, because EasyAsia will build to it.

---

## 1. The part that matters most: DERIVED — do not store, do not build an admin field

These are computed by the frontend from fields below. **If the backend stores them, an admin can
type a value that contradicts the source, and the site will show two different answers for the
same fact.** That is not hypothetical — on 1 Aug the Sinaran page showed "885 days left" in its
header and "884 DAYS LEFT" in the panel beneath it, because the same number was computed twice.
At the data layer that bug becomes an admin typo nobody catches.

| Shown on the site | Derived from | Never store |
|---|---|---|
| "N days left", "closes today" | `closingDate` + now, in **MYT** | a day count |
| Reserve price **per sq ft** | `reservePrice ÷ builtUp` | a psf column |
| E-tender **deposit** amount | `reservePrice × 3%`, unless `deposit` is set | a computed deposit |
| The **batch** a listing belongs to | grouping by identical `closingDate` | a batch id |
| Listing **URL / slug** | `name` | — (see `url`, being retired) |
| "Open / closed" status | `closingDate` vs now | a status flag |

**One thing the backend MUST own that looks derived but is not:** the closing **date** itself.
Deadlines are MYT, end of day — `23:59:59+08:00`. Store a date, not a timestamp, and never a
date without a timezone.

---

## 2. Listing fields — required

Every e-tender listing must have all of these or it cannot render.

| Field | Type | Example | Notes for the admin form |
|---|---|---|---|
| `name` | string | `Residensi Sinaran` | Also becomes the page slug |
| `area` | string | `Shah Alam` | Town/locality |
| `stateKey` | enum | `selangor` | Lowercase key, drives filtering |
| `stateName` | string | `Selangor` | Display form of the above |
| `reservePrice` | integer (RM) | `517000` | **A guide, NOT a floor.** Buyers may bid below it — see §6b |
| `closingDate` | date | `2028-12-31` | End of day MYT. See §1 |
| `tenderMethod` | enum | `E-Tender` | `E-Tender` \| `Owner Auction` |
| `tenderFormat` | enum | `Sealed` | Sealed is the only format today |
| `propertyType` | enum | `Townhouse` | Drives the type filter — see §5 |
| `propertyCategory` | enum | `residential` | `residential` \| `commercial` \| `industrial` \| `land` |
| `builtUp` | string | `1,400 sqft` | Used to derive psf — see §1 |
| `landArea` | string | `1,700 sqft` | Empty string when not applicable |
| `tenure` | enum | `Freehold` | `Freehold` \| `Leasehold 99 years` \| … |
| `titleType` | string | `Strata` | May be empty |
| `image` | asset | `residensi-sinaran-1.jpg` | Card thumbnail |

**Nullable, but the key must exist** — `null` means *"the agency has not told us"* and the page
prints "Not stated". That is deliberately different from a field that does not apply.

| Field | Type | Notes |
|---|---|---|
| `bedrooms` | integer \| null | |
| `bathrooms` | integer \| null | |
| `deposit` | integer \| null | `null` ⇒ derive 3% of reserve. Only set to override |

---

## 3. Listing fields — optional

Absent key ⇒ the page prints **"Not stated"**. A field that does not *apply* to the property form
(floor level on a landed house) renders as an em dash instead — the frontend decides which,
the backend just stores or omits.

| Field | Type | Notes |
|---|---|---|
| `carParks` | integer \| null | |
| `storeys` | integer | **Landed only.** Drives the Malaysian label "3-Storey Townhouse" |
| `details.floorLevel` | string | High-rise only |
| `details.landTitle` | string | e.g. `Residential` |
| `details.bumiLot` | string | `Yes` / `No` — materially affects who can buy |
| `details.zoning` | string | |
| `details.yearCompleted` | string | |
| `details.facing` | string | |
| `details.powerSupply` | string | |
| `details.occupancy` | string | `Owner-occupied` / `Tenanted` / `Vacant` |
| `details.furnishing` | string | |
| `details.maintenanceFee` | string | Strata only |

## 3b. Media — added 1 Aug 2026

**Each key present ⇒ that button appears. Absent ⇒ no button.** The page never advertises media
it does not have. One plain field per key on the admin form.

| Field | Type | Notes |
|---|---|---|
| `media.video` | URL | Agent walkthrough — YouTube / Vimeo / MP4 |
| `media.floorPlan` | file (image or PDF) | **Highest-value missing asset for subsale.** For a multi-storey home the layout is the one question photos cannot answer |
| `media.tour` | URL | 360 / Matterport. Rare in subsale, not impossible |
| `media.aerialFrom` | integer | **1-based index into the photo array**, not an upload. Subsale aerials arrive inside the normal photo set |

---

## 3c. What's nearby — added 3 Aug 2026

A per-listing list of nearby places, grouped by category. **Category counts are deliberately
uneven** — Bryan, 3 Aug: *"not all the property has 3 what's nearby all the time, sometimes
transportation has 2, healthcare has 4."* The admin form must allow **any number of rows per
category, including zero**, and the frontend packs rather than aligning rows, so nothing breaks.

| Field | Type | Notes |
|---|---|---|
| `nearby[].category` | enum | `transportation` \| `education` \| `shopping` \| `healthcare`. Drives the icon; an unknown key renders no icon rather than failing |
| `nearby[].items[].name` | string | The place, e.g. `Hospital Shah Alam` |
| `nearby[].items[].kind` | string | One-line description, e.g. `Government hospital · Seksyen 7` |
| `nearby[].items[].km` | decimal | Road distance, NOT straight-line |
| `nearby[].items[].min` | integer | Typical drive time |

**A category with zero items is omitted entirely** — the page never prints an empty heading.

### ⚠️ `km` and `min` are the highest-risk fields on the page

Every place currently in `src/` is a real institution, but **the distances and drive times have
never been verified** against a routing engine or confirmed by the agency. They are the same class
of content as the Price History table that was deleted for being invented — except worse, because
a buyer can check a drive time in ten seconds and a wrong one costs the listing its credibility.

**Preferred:** the backend derives both from the listing's coordinates and the place's coordinates
via a routing API, and they are never typed by hand. **Acceptable:** an admin types them and the
agency owns their accuracy. **Not acceptable:** shipping the current placeholder figures.

---

## 3d. Facilities — added 3 Aug 2026

A flat list of facility names per listing. The frontend renders each as a capsule chip and
looks the icon up **by name** — the same shape iNewProject's own page uses. **A name with no
icon still renders**, label only, so the admin can type anything without breaking the page.

| Field | Type | Notes |
|---|---|---|
| `facilities[]` | string | Facility name, e.g. `Children's Playground`. Order is the display order |

**No icon field.** Icons live in the frontend, keyed on the name. If the agency needs a new
facility icon, that is a frontend change, not a data one.

**An empty or absent list omits the whole section** — the page never prints an empty Facilities
heading.

### ⚠️ Residensi Sinaran's list is inferred, not supplied

The five names currently in `src/` are each defensible from something already on the page
(`Gated & guarded` from Property Details, the guardhouse and shared grounds from the About
copy, the playground from the gallery photographs, visitor parking from the About copy). **They
are not a list the agency gave us.**

This section was deleted once already, on 30 Jul, because it carried **18 amenities borrowed
from a Tropicana Breeze Hill condominium** — infinity pool, flying fox, heated jacuzzi, games
room — on a 62-unit landed townhouse scheme. **Do not restore that list.** The agency's real
facilities are a founder input, tracked in `PLAN-AUGUST-DELIVERY.md` §5.

---

## 4. Photos

Ordered array per listing. Photo 1 is the card thumbnail and the gallery's opening frame.
The detail gallery shows **six tiles**; any beyond that are reachable through the viewer, so
there is **no maximum** — but there is a minimum of 1.

---

## 5. Enumerations

`propertyType`, `stateKey` and the category taxonomy live in
[`src/data/tender-taxonomy.ts`](src/data/tender-taxonomy.ts) — that file is the authority, not
this table. Export it rather than retyping it; the filters on `/tender` depend on exact matches.

---

## 6. Known gaps — founder input still needed

These block real data, not code. Listed so EasyAsia knows they are coming.

- ~~Registration deadline~~ — **RESOLVED 1 Aug, and it does not exist.** An account is needed only
  at the moment of applying; Apply raises the sign-in dialog. The 14-day lead was our invention and
  is deleted. **No field.**
- **Seller response window.** The terms panel states "accept, decline or counter within 5 working
  days". Fixed platform rule, or per-listing? Still unconfirmed.
- **E-Tender start date.** Shown on the cards and now in the detail panel, derived as
  **closing − 3 months** (`tenderStartOf`). Also unconfirmed. If tenders do not all run for the
  same length, this is a stored field, not a derivation.
- **Agency identifiers.** REN / E-number / agency registration for the Act 242 disclosure block.
  Currently placeholder text.
- **Seller package pricing.** Not modelled at all yet.
- **Residensi Sinaran's real closing date.** The demo data says `2028-12-31` — **885 days out**,
  which is not a tender. It should be one of the real batch dates.

---

## 6b. The submission — what the backend receives

**No money moves through this site.** Apply → sign-in/sign-up (members only) → **Tender Form
Application** → a lead lands with the agency. The 3% deposit is collected afterwards by the agent
into the agency's client account, as BOVAEP requires.

The form is mostly pre-filled listing data. **The buyer supplies exactly four things:**

| Field | Type | Notes |
|---|---|---|
| `name` | string | required |
| `email` | string | required |
| `phone` | string | required |
| `bidPrice` | integer (RM) | required — **may be below the reserve.** The reserve is a guide, not a floor |

Pre-filled from the listing: reference no., property type, address, built-up, land area, tenure,
reserve price, deposit, property code, tender date.

**Also needed:** each submission is a record on the member's dashboard (`/member/` → My Tender), so
a submission belongs to a member account and must be retrievable per member.

---

## 7. What we are NOT asking for

So nobody builds it twice:

- No bidding engine, no offer storage, no payment handling in the frontend — we render the
  *listing* and the *apply* entry point only.
- No user accounts in this repo. Sign in / Register are links.
- The legacy `url` field on each listing is being retired; routes are derived from `name`.
