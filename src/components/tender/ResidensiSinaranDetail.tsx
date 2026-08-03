import { useCallback, useEffect, useState } from "react";

import { TENDERS } from "@/data/tenders";
import { initDetailPage } from "@/lib/tender-detail-behaviour";
import { AGENT_PHOTO, PROJECT_IMG, SINARAN_PHOTOS } from "@/lib/images";
import { MS_DAY, closeAtMs, daysLeft, depositOf, displayType, fmtDate, isFinalDay, ordinalDateParts, remainingMs } from "@/lib/tender-utils";
import "@/styles/tender-detail.css";

/* Ported 1:1 from residensi-sinaran-detail.html — the design canon.
   Class names and DOM ids are unchanged so EasyAsia can lift the markup. */

const SINARAN_TENDER = TENDERS.find((tender) => tender.name === "Residensi Sinaran");
if (!SINARAN_TENDER) throw new Error("Residensi Sinaran tender data is missing");

/* Single source of truth for this listing's reserve, deposit and tender close. */
/* Pulled out at module scope, where the `if (!SINARAN_TENDER) throw` above has already
   narrowed it — TypeScript does not carry that narrowing into the effect's closure. */
const SINARAN_CLOSING = SINARAN_TENDER.closingDate;
/* Absent keys mean the agency has not supplied that asset — the corresponding button is
   simply not rendered. See the `media` block on the Tender type. */
const MEDIA = SINARAN_TENDER.media ?? {};
/* Full ordinal dates, same treatment as the /tender hero: "1st October 2028".
   ⚠️ The START is derived and founder-unconfirmed — closing − 3 months. */
const TENDER_START = ordinalDateParts(
  new Date(closeAtMs(SINARAN_CLOSING) - 92 * MS_DAY).toISOString().slice(0, 10),
);
const TENDER_CLOSE = ordinalDateParts(SINARAN_CLOSING);
/* Plain string form, for the sticky bar and FAQ prose where a <sup> would be wrong. */
const TENDER_CLOSE_LABEL = fmtDate(SINARAN_CLOSING);

/* The payment ladder is derived, never typed. Founder-confirmed 30 Jul 2026: the 3%
   tender deposit is the Malaysian earnest deposit — the first slice of the standard
   10% down payment, not a separate platform charge. Balance to 10% falls due at SPA,
   the remaining 90% on completion. */
const RESERVE = SINARAN_TENDER.reservePrice;
const DEPOSIT = depositOf(SINARAN_TENDER);
const rm = (n: number) => "RM" + Math.round(n).toLocaleString("en-MY");
/* Reserve price per square foot — DERIVED, never typed. This is the number a buyer
   actually compares properties on and decides an offer with, and no Malaysian portal
   leads with it. Parsed from the built-up string so it stays true if either changes. */
const BUILT_UP_SQFT = Number((SINARAN_TENDER.builtUp || "").replace(/[^0-9.]/g, "")) || 0;
const PSF = BUILT_UP_SQFT ? Math.round(RESERVE / BUILT_UP_SQFT) : 0;
const PRICE_BASIS = SINARAN_TENDER.builtUp.replace(/\s*sqft\b/i, " sq ft");
const TITLE_TYPE = "Strata title";
/* DERIVED, not typed. The hero had "3-Storey Townhouse" hardcoded, which quietly broke a
   rule the rest of the site already follows: Townhouse is in NO_STOREY_PREFIX because
   Bryan ruled the name already implies the stacked multi-storey form, so the prefix is
   redundant. The listing cards were right and this one page was wrong. Reading it through
   displayType() means the label cannot drift from the rule again. */
const TYPE_LABEL = displayType(SINARAN_TENDER);
const LISTING_NAME = SINARAN_TENDER.name;
/* The address was previously NOWHERE on this page as text — it existed only as a search
   string inside the Google Maps iframe URL, which means it was unselectable, invisible to a
   screen reader, invisible to Google Search, and gone the moment the iframe failed to load.
   For a property listing the address is a primary fact, not decoration. Founder-supplied by
   Bryan on 3 Aug, exact unit included. */
const ADDRESS = SINARAN_TENDER.address ?? "";
/* The map follows the address instead of a hand-typed search phrase, so the pin and the
   printed address can never disagree. TWO derivations, because the two Google endpoints do
   not accept the same string — verified by swapping the live iframe through each:

   EMBED (legacy `?q=…&output=embed`) is fussy. Fully percent-encoding the address rendered a
   BLANK GREY PANEL. Two causes: it wants `+` for spaces, and a leading unit number ("No. 23A")
   does not geocode — a unit is not a place. So the embed gets the development name plus the
   street-level address with the unit stripped, which drops the pin on the property and makes
   Google's own info card read back the same street, postcode and state we print above it.

   DIRECTIONS (modern `maps/dir/?api=1&destination=`) handles standard encoding and the unit
   fine, so it keeps the FULL address — that is the one a buyer actually navigates to. */
const MAP_FALLBACK = `${SINARAN_TENDER.name} ${SINARAN_TENDER.area}`;
const STREET_ONLY = ADDRESS.replace(/^\s*(?:No\.?|Lot|Unit)\s*[^,]*,\s*/i, "");
const MAP_EMBED_Q = encodeURIComponent(
  ADDRESS ? `${SINARAN_TENDER.name}, ${STREET_ONLY}` : MAP_FALLBACK,
).replace(/%20/g, "+");
const MAP_DIR_Q = encodeURIComponent(ADDRESS || MAP_FALLBACK);
const LAND_USE = SINARAN_TENDER.details?.landTitle;
if (!LAND_USE) throw new Error("Residensi Sinaran land-use data is missing");

/* PROPERTY DETAILS — one flat label/value list, rendered two-up: exactly the shape an
   admin form produces (type a label, type a value, save). Add, remove or reorder rows
   here and the layout follows; nothing below is written per-field. When EasyAsia wires a
   CMS, this array is what it replaces.

   NOTHING IN HERE IS ALREADY SHOWN ELSEWHERE ON THE PAGE. Removed as duplicates: tenure,
   lease expiry, title type and land use (the pricing heading above); bedrooms, bathrooms,
   built-up, storeys and car parks (the icon band, which now reads straight off the tender
   record); property type (the page header's address line). A spec sheet that repeats the
   summary above it is just noise.

   Fields are the ones a Malaysian subsale buyer actually gets from a land search and a
   listing sheet — title particulars (category of land use, restriction in interest,
   encumbrances), the annual carrying costs, and development facts. Values marked (iNP)
   are real, from iNewProject's own Project Details for this development. Note: Sinaran is
   STRATA in Selangor, so its annual land tax is PARCEL rent, not quit rent — Selangor
   moved stratified property onto parcel rent. Anything genuinely unknown is NOT here; it
   belongs in NOT_DISCLOSED so this table never carries a blank. */
const PROPERTY_DETAILS: { label: string; value: string }[] = [
  { label: "Unit position",           value: "Intermediate lot" },
  { label: "Land area",               value: "22\u2032 \u00d7 78\u2032 (1,716 sqft)" }, // (iNP), unit corrected
  { label: "Restrictions",            value: "Nil" },
  { label: "Encumbrance",             value: "Free of encumbrances" },
  { label: "Bumi lot",                value: "No" },
  { label: "Parcel rent",             value: "RM480 / year" },
  { label: "Assessment tax",          value: "RM620 / year" },
  { label: "Renovation",              value: "Original developer condition" },
  { label: "Gated & guarded",         value: "Yes \u00b7 single controlled access" },
  { label: "Year completed",          value: "2025" },                            // (iNP)
  { label: "Developer",               value: "SEGA Land Development Sdn Bhd" },    // (iNP)
  { label: "Total units",             value: "62 units" },                        // (iNP)
  { label: "Development phase",       value: "Phase 4 of 4" },                    // (iNP)
  { label: "Sale type",               value: "Subsale" },
  { label: "Listing reference",       value: "TP-SNR-0417" },
];


/* The icon band reads STRAIGHT OFF the tender record — the same source the listing cards
   use — so it can never drift from the data, and it no longer needs those five facts
   duplicated into PROPERTY_DETAILS. A slot with no value in the record does not render. */
type BandItem = { label: string; value: string; path: string };
const BAND: BandItem[] = ([
  ["Bedrooms",      SINARAN_TENDER.bedrooms,  "M3 18v-6h18v6M3 12V7M21 12v-1a3 3 0 0 0-3-3h-4v4M3 18v2M21 18v2"],
  ["Bathrooms",     SINARAN_TENDER.bathrooms, "M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2"],
  ["Built-up area", SINARAN_TENDER.builtUp,   "M4 4h16v16H4zM4 9h5M15 20v-5M9 4v5M15 4v5M4 15h5M15 15h5"],
  ["Storeys",       SINARAN_TENDER.storeys,   "M4 20h16M6 20V9l6-4 6 4v11M10 20v-5h4v5"],
  ["Car parks",     SINARAN_TENDER.carParks,  "M5 17h14M4 17v-4l2-5h12l2 5v4M4 17v2h2v-2M18 17v2h2v-2"],
] as [string, string | number | null | undefined, string][])
  .filter(([, v]) => v !== null && v !== undefined && v !== "")
  .map(([label, v, path]) => ({ label, value: String(v), path }));

/* WHAT'S NEARBY — data-driven, and deliberately UNEVEN.
   Bryan, 3 Aug: "not all the property has 3 what's nearby all the time, sometimes
   transportation has 2, healthcare has 4, so its inconsistent." Correct — and the old
   hard-coded markup quietly assumed exactly three per category. This is one array now, any
   category may hold any number of entries, and the layout below packs rather than aligning
   rows (see .amen in the stylesheet).

   ⚠️ DISTANCES AND DRIVE TIMES ARE UNVERIFIED. Every place named here is real, but the km/min
   figures have never been checked against a routing engine or confirmed by the agency. They
   are the same class of content as the Price History table that was DELETED for being invented
   — and worse, a buyer can check these in ten seconds. Before handoff they must either be
   confirmed, or derived from the listing's coordinates by the backend. See BACKEND-CONTRACT.md
   §3c: this belongs to EasyAsia as a stored per-listing field, not to our JSX. */
type NearbyItem = { name: string; kind: string; km: string; min: string };
const NEARBY: { key: string; label: string; items: NearbyItem[] }[] = [
  { key: "transportation", label: "Transportation", items: [
    { name: "Hab Taman Sri Muda", kind: "Rapid KL bus hub \u00b7 Route 751",   km: "1.2 km", min: "4 min" },
    { name: "KESAS Highway",      kind: "Shah Alam Expressway \u00b7 Sri Muda", km: "1.9 km", min: "5 min" },
    { name: "KTM Shah Alam",      kind: "KTM Komuter station",                  km: "3.8 km", min: "8 min" },
    { name: "Federal Highway",    kind: "Klang \u2013 Kuala Lumpur trunk road", km: "5.1 km", min: "9 min" },
    { name: "LRT Alam Megah",     kind: "Park-and-ride station",                km: "6.5 km", min: "11 min" },
  ]},
  { key: "education", label: "Education", items: [
    { name: "SK Taman Sri Muda 2", kind: "National primary school",   km: "1.8 km", min: "5 min" },
    { name: "SMK Taman Sri Muda",  kind: "National secondary school", km: "2.3 km", min: "6 min" },
    { name: "UiTM Shah Alam",      kind: "Public university",         km: "7.0 km", min: "14 min" },
  ]},
  { key: "shopping", label: "Shopping", items: [
    { name: "Pasar Moden Sri Muda", kind: "Fresh market & daily groceries",   km: "1.4 km", min: "4 min" },
    { name: "Lotus\u2019s Shah Alam", kind: "Hypermarket & retail",            km: "6.6 km", min: "12 min" },
    { name: "AEON Mall Shah Alam",  kind: "Shopping, dining & entertainment", km: "7.8 km", min: "14 min" },
  ]},
  { key: "healthcare", label: "Healthcare", items: [
    { name: "Watsons Sri Muda",          kind: "Pharmacy & personal care",   km: "1.3 km", min: "4 min" },
    { name: "Klinik Kesihatan Sri Muda", kind: "Government health clinic",   km: "2.1 km", min: "6 min" },
    { name: "Hospital Shah Alam",        kind: "Government hospital \u00b7 Seksyen 7", km: "4.2 km", min: "9 min" },
    { name: "KPJ Selangor Specialist",   kind: "Private specialist hospital", km: "4.8 km", min: "9 min" },
    { name: "Columbia Asia Bukit Rimau", kind: "24-hour emergency dept.",     km: "5.4 km", min: "10 min" },
  ]},
];

const NEARBY_ICON: Record<string, string> = {
  transportation:
    "<path d=\"M12 2.5c-3.6 0-6 2.3-6 5.6V16a2.5 2.5 0 0 0 2.5 2.5h7A2.5 2.5 0 0 0 18 16V8.1c0-3.3-2.4-5.6-6-5.6z\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M7.4 10.6c1.4-1 3-1.5 4.6-1.5s3.2.5 4.6 1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M9.3 14.5h.01M14.7 14.5h.01\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M9.2 18.6 7.2 22M14.8 18.6 16.8 22\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />",
  education:
    "<path d=\"M3 8l9-4 9 4-9 4-9-4z\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M7 10v5c0 1.5 2.5 3 5 3s5-1.5 5-3v-5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />",
  shopping:
    "<path d=\"M2.6 8.6h18.8l-1.8 9.5a2 2 0 0 1-2 1.6H6.4a2 2 0 0 1-2-1.6L2.6 8.6z\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M8.6 8.6 10.6 3.2M15.4 8.6 13.4 3.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M9 12.4v3.6M12 12.4v3.6M15 12.4v3.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />",
  healthcare:
    "<rect x=\"2.5\" y=\"7\" width=\"19\" height=\"13\" rx=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M9 7V5.6A1.6 1.6 0 0 1 10.6 4h2.8A1.6 1.6 0 0 1 15 5.6V7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M12 11.2v5M9.5 13.7h5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />",
};

/* FACILITIES — the iNewProject project-detail treatment, ported 1:1 from
   ~/Downloads/2-Milla-Residence.html (.plain-grid / .plain-card / .facility-icon, CSS at
   lines 18477-18520). GEOMETRY is exact: 999px capsule, .38rem/.8rem padding, .7rem grid
   gap, .5rem icon gap, .82rem/600/1.4 type, 20px icon at stroke-width 1.8, round caps.
   COLOUR is TenderProp's, per the standing rule that we adopt patterns from references and
   never their palettes - iNewProject's #F5F5F5 grey and #777 read cold on this page.

   ICONS ARE REDRAWN, not inherited. The Breeze Hill set was authored for another context
   and several glyphs collapsed into nothing at 20px - Bryan on the playground: "what the
   fuck is children's playground icon?" It was a bare diagonal and a line, which read as a
   flag. Every glyph here is drawn on the 20-grid for a 1.8 stroke and commits to ONE
   recognisable object rather than an abstraction.

   Held as a MAP keyed by NAME: a facility with no entry renders its label and no icon
   rather than breaking - the same graceful failure the iNewProject page shows on "Sky
   Deck", where the icon span is emitted empty. */
const FACILITY_ICON: Record<string, string> = {
  "Gated & Guarded":
    '<path d="M10 2.6l5.6 2.4v4.3c0 4-2.7 6.6-5.6 8-2.9-1.4-5.6-4-5.6-8V5L10 2.6z"/><path d="M7.8 9.9l1.6 1.6 3-3.2"/>',
  "24-Hour Security":
    '<circle cx="10" cy="10" r="6.9"/><path d="M10 5.9V10l2.8 1.7"/>',
  "CCTV Surveillance":
    '<path d="M3 7.9l11.1-3 1.1 4.1L4.1 12z"/><path d="M6 12.5l1 3.4"/><path d="M4.5 15.9h4.4"/><path d="M15.2 9l2-.6"/>',
  "Children's Playground":
    '<path d="M3.6 16.8 10 4.4l6.4 12.4"/><path d="M6.1 9.2h7.8"/><path d="M8.2 9.2v4.4M11.8 9.2v4.4"/><path d="M7.4 13.6h5.2"/>',
  "Landscape Garden":
    '<path d="M10 17.3v-4.2"/><path d="M10 13.1c-3.1 0-5.2-2-5.2-4.5S7.2 4 10 4s5.2 2.2 5.2 4.6-2.1 4.5-5.2 4.5z"/>',
  "Jogging Path":
    '<circle cx="12.6" cy="4.3" r="1.7"/><path d="M11.2 8.2 8.4 10.1l1.6 3-1.1 4.1"/><path d="M8.4 10.1 5.3 11.2"/><path d="M11.2 13.1l3 1.1 1.1 3.1"/>',
  "Multipurpose Hall":
    '<path d="M2.8 17h14.4"/><path d="M4.6 17V8.8M15.4 17V8.8"/><path d="M3 8.8 10 4.2l7 4.6"/><path d="M8.3 17v-4.3h3.4V17"/>',
  "Surau":
    '<path d="M3.4 17v-5.4a6.6 6.6 0 0 1 13.2 0V17"/><path d="M2.4 17h15.2"/><path d="M8.4 17v-3.2a1.6 1.6 0 0 1 3.2 0V17"/><path d="M10 6.8V5.2"/><circle cx="10" cy="4.3" r=".8"/>',
  "BBQ Area":
    '<path d="M10 17a4 4 0 0 0 4-4c0-3-4-6.5-4-6.5S6 10 6 13a4 4 0 0 0 4 4z"/><path d="M10 17a1.7 1.7 0 0 0 1.7-1.7c0-1.2-1.7-2.6-1.7-2.6s-1.7 1.4-1.7 2.6A1.7 1.7 0 0 0 10 17z"/>',
  "Swimming Pool":
    '<path d="M2.4 13.5c1.9 0 1.9-1.4 3.8-1.4s1.9 1.4 3.8 1.4 1.9-1.4 3.8-1.4 1.9 1.4 3.8 1.4"/><path d="M2.4 16.9c1.9 0 1.9-1.4 3.8-1.4s1.9 1.4 3.8 1.4 1.9-1.4 3.8-1.4 1.9 1.4 3.8 1.4"/><path d="M7 11.5V5.4a1.7 1.7 0 0 1 3.4 0"/><path d="M12.4 11.5V5.4a1.7 1.7 0 0 1 3.4 0"/><path d="M7 8.5h5.4"/>',
  "Wading Pool":
    '<path d="M3.2 9.6h13.6v3.2a3.6 3.6 0 0 1-3.6 3.6H6.8a3.6 3.6 0 0 1-3.6-3.6z"/><path d="M6 12.7c1 0 1-.9 2-.9s1 .9 2 .9 1-.9 2-.9 1 .9 2 .9"/><path d="M6.6 9.6V7.4M13.4 9.6V7.4"/>',
  "Gymnasium":
    '<path d="M4 7.4v5.2M6.8 5.6v8.8M13.2 5.6v8.8M16 7.4v5.2"/><path d="M6.8 10h6.4"/>',
  "Futsal Court":
    '<circle cx="10" cy="10" r="6.9"/><path d="M10 6.3l2.9 2.1-1.1 3.4H8.2L7.1 8.4z"/><path d="M10 6.3V3.2M12.9 8.4l2.9-.9M11.8 11.8l1.8 2.5M8.2 11.8l-1.8 2.5M7.1 8.4l-2.9-.9"/>',
  "Badminton Court":
    '<path d="M11.4 5.1a4.5 4.5 0 1 1-6.3 6.3 4.5 4.5 0 0 1 6.3-6.3z"/><path d="M11 11.3 16.1 16.4"/><path d="M6.5 6.2l4.6 4.6M8.9 5.2l3.6 3.6M5.2 8.9l3.6 3.6"/>',
  "Visitor Parking":
    '<path d="M4 13.6h12"/><path d="M5 13.6V10l1.5-3.2a1.4 1.4 0 0 1 1.3-.8h4.4a1.4 1.4 0 0 1 1.3.8L15 10v3.6"/><path d="M5 13.6v1.7h1.7v-1.7M13.3 13.6v1.7H15v-1.7"/><path d="M6.5 10.2h7"/>',
  "Perimeter Walkway":
    '<path d="M2.8 7.6h14.4"/><path d="M5.2 7.6v6.6M14.8 7.6v6.6"/><path d="M3.6 17.2h3.2M9 17.2h2.8M14 17.2h2.6"/>',
};

/* WARNING: DEMO CONTENT - NOT RESIDENSI SINARAN'S REAL FACILITY LIST.
   Bryan, 3 Aug: "ensure there are lots of facilities, for demo sake only." So this is a
   plausible list for a gated landed scheme, sized to show the section working at density.

   It is NOT what the agency told us this development has. Only these are supported by the
   page's own content: Gated & Guarded (Property Details), Landscape Garden (About para 3),
   Children's Playground (the gallery photographs), Visitor Parking (About para 7).
   EVERYTHING ELSE IS INVENTED FOR THE DEMO.

   Deliberately still excluded: infinity pool, flying fox, heated jacuzzi, sky deck, games
   room, cantilever deck. That is the Tropicana Breeze Hill CONDO set which got this section
   deleted on 30 Jul, and none of it is credible on a 62-unit landed township.

   STRIP OR REPLACE BEFORE HANDOFF - same treatment as the demo:true tender records.
   See BACKEND-CONTRACT.md 3d and founder question #9. */
const FACILITIES: string[] = [
  "Gated & Guarded",
  "24-Hour Security",
  "CCTV Surveillance",
  "Children's Playground",
  "Landscape Garden",
  "Jogging Path",
  "Multipurpose Hall",
  "Surau",
  "BBQ Area",
  "Swimming Pool",
  "Wading Pool",
  "Gymnasium",
  "Futsal Court",
  "Badminton Court",
  "Visitor Parking",
  "Perimeter Walkway",
];

const ABOUT_PARAS: string[] = [
  `Residensi Sinaran sits inside Taman Sri Muda, one of the older established          townships in Shah Alam &mdash; the kind of neighbourhood that finished growing a          decade ago. Sixty-two homes behind a single controlled entrance, which is small          enough that the place stays quiet.`,
  `Each home runs over three storeys, which puts the shared living areas downstairs          and the private rooms above &mdash; the practical reason a family chooses a          townhouse over an apartment of the same size, and the reason the layout still          works as a household grows rather than forcing a move.`,
  `Because it is stratified, the things that usually make landed property tiring are          handled collectively: the guardhouse, the shared grounds and the upkeep of common          areas sit with the management body rather than with you. It is landed living with          the administrative load of a strata development, which is an unusual combination          at this size.`,
  `Completion also changes what your lender is looking at. A bank valuing a finished          unit is valuing something that exists &mdash; a real floor plate, real finishes,          a real neighbourhood &mdash; rather than a projection off a masterplan. If you          want a valuer to walk it before you decide your number, that is possible here in          a way it is not with a launch.`,
  `The intermediate position is worth understanding rather than glossing over. It          means one shared wall on each side and a narrower frontage than a corner lot,          which is reflected in the price &mdash; and it also means less external wall to          maintain and a cooler interior through the afternoon than a west-facing corner          typically gets.`,
  `Three storeys ask something of a household, and it is fair to say so plainly:          there are stairs every day, and families with very young children or elderly          parents should walk the unit before deciding whether the layout suits them. That          is precisely the kind of judgement a completed property lets you make in advance.`,
  `Parking is two dedicated bays rather than a shared allocation, which in a          sixty-two unit development means the arithmetic actually works &mdash; visitors          included. It is a small detail that becomes a daily one.`,
  `That the township is older is the point. Everything around it already exists, and          nothing about living here depends on a masterplan being finished or a neighbouring          phase being sold.`,
];

export function ResidensiSinaranDetail() {
  useEffect(() => initDetailPage(), []);

  /* Days remaining is computed, never hand-typed. Starts neutral so SSR and a
     Malaysian browser can't disagree on the day count during hydration. */
  const [daysLabel, setDaysLabel] = useState<string | null>(null);
  /* Live countdown for the standard tender-information deadline panel. It is null
     until mount so the server and browser never disagree during hydration. */
  const [cd, setCd] = useState<{ days: number; h: number; m: number; s: number; finalDay: boolean } | null>(null);
  /* About's expand is REACT STATE, not a DOM listener. It was wired imperatively inside
     initDetailPage(), which runs once on mount — so after any hot reload React rebuilt the
     DOM while the effect did not re-run, leaving the button with no listener. A fresh load
     worked and a reloaded page was dead, which is exactly the "sometimes broken" Bryan saw.
     Anything React renders should be driven by React state. */
  const [aboutOpen, setAboutOpen] = useState(false);
  /* GALLERY — React state, like the About toggle. It was imperative DOM code in
     initDetailPage() and that is what Bryan saw as "broken": clicking the "+1" tile
     APPENDED a 7th thumb to a grid whose CSS declares `grid-template-rows: repeat(3, 1fr)`.
     Seven tiles in two columns is four rows with an orphaned last cell, and because
     `.gallery` is `align-items: stretch` the stage stretched to match — overriding its own
     `aspect-ratio: 3/2` and going 517px → 683px. One click permanently deformed the section
     and left a hole in the corner. The grid now holds exactly six tiles, always. */
  const [active, setActive] = useState(0);
  /* Index being viewed full-size, or null when closed. */
  const [lightbox, setLightbox] = useState<number | null>(null);
  const PHOTO_COUNT = SINARAN_PHOTOS.length;
  const THUMB_SLOTS = 6;
  const step = useCallback(
    (delta: number) => setLightbox((i) => (i === null ? i : (i + delta + PHOTO_COUNT) % PHOTO_COUNT)),
    [PHOTO_COUNT],
  );
  /* Closing hands the stage whatever you ended on, from ALL THREE exits. Escape used to
     skip the handover — browse to photo 4, press Escape, and the stage was still on 3. */
  const closeViewer = useCallback((at: number) => { setActive(at); setLightbox(null); }, []);
  /* Scroll lock keyed on open/closed only. Keyed on `lightbox` it tore down and rebuilt on
     every arrow press, restoring and re-hiding overflow on each step. */
  const viewerOpen = lightbox !== null;
  useEffect(() => {
    if (!viewerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [viewerOpen]);
  /* Keyboard belongs to the viewer, not the document — bound only while it is open. */
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeViewer(lightbox);
      else if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, step, closeViewer]);
  useEffect(() => {
    const calc = () => {
      /* ONE number feeds both the header pill and the panel below it. They used to be
         computed here side by side with different rounding — ceil for the pill, floor for
         the panel — so the page contradicted itself by a day. */
      const ms = remainingMs(SINARAN_CLOSING);
      const days = daysLeft(SINARAN_CLOSING);
      const finalDay = isFinalDay(SINARAN_CLOSING);
      setDaysLabel(ms <= 0 ? "Closed" : `${days.toLocaleString("en-MY")} ${days === 1 ? "day" : "days"} left`);
      /* h/m/s describe the final day only, where the day count stops being useful. */
      const h = Math.floor((ms % MS_DAY) / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const sec = Math.floor((ms % 60000) / 1000);
      setCd({ days, h, m, s: sec, finalDay });
    };
    calc();
    const id = window.setInterval(calc, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="tp-detail">
      <main>

        {/* The overview runs wider than the reading column below it (per Bryan's
            iNewProject reference). Photos want width; body copy wants ~70ch. The
            title row widens with the gallery — left at the old width it read as a
            caption floating away from its own photos. */}
        <section className="overview" id="overview">
          <div className="wrap wrap-wide">
            <div className="crumbs"><a href="#">Home</a> / <a href="/tender">E-Tender</a> / Residensi Sinaran</div>
            <div className="ovhead">
              <div className="ovtitle">
                {/* Tender state above the fold. Without this the detail page told the
                    buyer LESS about the tender than the card they clicked to get here —
                    open/closed and the deadline sat below the whole gallery. */}
                <p className="ovstatus">
                  <span className="status"><span className="dot" aria-hidden="true" />Open for e-tender</span>
                  <span className="ovcloses">Closes {TENDER_CLOSE_LABEL}{daysLabel ? " · " + daysLabel : ""}</span>
                </p>
                <h1>Residensi Sinaran</h1>
                <p className="addr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 21s-7-5.6-7-11a7 7 0 0114 0c0 5.4-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Taman Sri Muda, Shah Alam, Selangor &middot; {TYPE_LABEL}</p>
              </div>
              <div className="ovside">
                {/* "Reserve price" is auction vocabulary most subsale buyers have not met.
                    Say what it means right where the number is, or they read it as a fixed
                    asking price and the whole tender mechanic is misunderstood. */}
                {/* No RESERVE PRICE eyebrow (Bryan). The sub-line below names the number, so the
                    eyebrow was the same two words twice, two lines apart. */}
                <div className="ovprice"><div className="v num">RM517,000</div><div className="s">The Reserve Price &mdash; a guide, you choose what to offer</div></div>
                <div className="actions">
                  <button type="button" className="icobtn" id="save-btn" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 20.5l-1.4-1.3C5.4 14.5 2 11.4 2 7.6 2 4.9 4.1 3 6.7 3c1.5 0 2.9.7 3.8 1.8L12 6.2l1.5-1.4C14.4 3.7 15.8 3 17.3 3 19.9 3 22 4.9 22 7.6c0 3.8-3.4 6.9-8.6 11.6L12 20.5z" /></svg><span>Save</span></button>
                  <button type="button" className="icobtn" id="share-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg><span>Share</span></button>
                  <a className="btn red" href="#">Submit your offer</a>
                </div>
              </div>
            </div>

            <div className="gallery">
              {/* A real button: the old `div` could not be reached by keyboard at all, and
                  the "View all photos" hint inside it was a `span` with `pointer-events:none`
                  — the affordance was decorative. */}
              <button
                type="button"
                className="stagebox"
                id="stagebox"
                onClick={() => setLightbox(active)}
                aria-label={`View photo ${active + 1} of ${PHOTO_COUNT} full size`}
              >
                <img id="stage-img" src={SINARAN_PHOTOS[active]} alt={`Residensi Sinaran — photo ${active + 1}`} />
                <span className="stagecount" id="stagecount">{active + 1} / {PHOTO_COUNT}</span>
                <span className="zoomhint" id="zoomhint">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" strokeLinecap="round" /></svg>
                  <span className="zoomhint-label">View all {PHOTO_COUNT} photos</span>
                </span>
              </button>
              {/* Exactly six slots, forever — see the note on `active`. The last one carries
                  the overflow badge and opens the viewer rather than growing the grid, which
                  is also what its own label has always claimed to do. */}
              <div className="thumbgrid" id="thumbs">
                {SINARAN_PHOTOS.slice(0, THUMB_SLOTS).map((photo, i) => {
                  const isOverflow = i === THUMB_SLOTS - 1 && PHOTO_COUNT > THUMB_SLOTS;
                  return (
                    <button
                      type="button"
                      key={photo}
                      className={`thumb${!isOverflow && i === active ? " on" : ""}`}
                      aria-current={!isOverflow && i === active ? "true" : undefined}
                      onClick={() => (isOverflow ? setLightbox(i) : setActive(i))}
                      aria-label={isOverflow
                        ? `View all ${PHOTO_COUNT} photos`
                        : `Show photo ${i + 1} of ${PHOTO_COUNT}`}
                    >
                      <img src={photo} alt={isOverflow ? "" : `Residensi Sinaran photo ${i + 1}`} />
                      {isOverflow && (
                        <span className="more" aria-hidden="true">
                          {/* Photos NOT shown. The badge dims photo 6 but does not hide it,
                              so it is 7 - 6 = 1, not 2. */}
                          +{PHOTO_COUNT - THUMB_SLOTS}
                          <small>View all photos</small>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Restored 30 Jul (Bryan), under the gallery. They were removed because no
                footage existed and a button that does nothing when clicked reads as broken
                — worse in a demo than absent. So each one is honest about what it can do:

                DRONE works today. The aerial shots are already in SINARAN_PHOTOS, so this
                jumps the stage to the first of them by clicking the matching thumb, reusing
                the gallery's existing swap rather than duplicating it.

                VIDEO has no footage, so rather than a dead control it asks the agent for a
                viewing — which is what a buyer actually wants from a video button on a
                completed property, and it feeds the lead engine both platforms exist to be.
                Swap it to a real player the moment footage is supplied. */}
            {/* DATA-DRIVEN. Each button appears only when the listing actually carries that
                media — see `media` on the Tender type. The row this replaces rendered the same
                two buttons for every listing, so a missing video had to be papered over with
                "Video viewing — on request", which advertises a feature the site does not have.
                A button that cannot do its job should not exist; it should not apologise.
                FOR EASYASIA: one admin field per key (video URL, floor-plan file, tour URL,
                aerial start index). Nothing here is computed — it is all listing input. */}
            {(MEDIA.video || MEDIA.floorPlan || MEDIA.tour || MEDIA.aerialFrom) && (
              <div className="mediarow">
                {MEDIA.aerialFrom && (
                  <button type="button" className="mediabtn" onClick={() => setActive(MEDIA.aerialFrom! - 1)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 5l3 3M19 5l-3 3M5 19l3-3M19 19l-3-3" />
                      <rect x="9" y="9" width="6" height="6" rx="1.4" />
                      <circle cx="5" cy="5" r="2" /><circle cx="19" cy="5" r="2" />
                      <circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
                    </svg>
                    <span>Drone view</span>
                  </button>
                )}
                {MEDIA.floorPlan && (
                  <a className="mediabtn" href={MEDIA.floorPlan} target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="1.6" />
                      <path d="M3 10h7M10 3v18M10 15h11" />
                    </svg>
                    <span>Floor plan</span>
                  </a>
                )}
                {MEDIA.video && (
                  <a className="mediabtn" href={MEDIA.video} target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2.5" y="6" width="13" height="12" rx="2.2" />
                      <path d="M15.5 10.5l6-3.2v9.4l-6-3.2z" />
                    </svg>
                    <span>Video</span>
                  </a>
                )}
                {MEDIA.tour && (
                  <a className="mediabtn" href={MEDIA.tour} target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <ellipse cx="12" cy="12" rx="4" ry="9" />
                      <path d="M3 12h18" />
                    </svg>
                    <span>360° tour</span>
                  </a>
                )}
              </div>
            )}

          </div>
        </section>


        <nav className="subnav" id="subnav" aria-label="Section navigation">
          <div className="wrap">
            <div className="row"><a className="snav-lead" href="#tender">Tender Information</a> <a href="#details">Details</a> <a href="#about">About</a> <a href="#selling">Selling Points</a> <a href="#area">What's Nearby</a> <a href="#facilities">Facilities</a> <a href="#location">Location</a> <a href="#agent">Agent</a> <a href="#mortgage">Mortgage</a> <a href="#faq">FAQ</a></div>
          </div>
        </nav>


        <section className="blk tender-band band-paper" id="tender">
          <div className="wrap">
            <div className="v1">
              <div className="v1-grid">
                {/* Standard across every real listing: this is a platform-level tender
                    deadline image, not a photograph of the property. Source: Yamiko Ling
                    on Pexels, photo 21898339. */}
                <section className="v1-deadline-panel" aria-label="E-tender deadline">
                  <img
                    className="v1-deadline-image"
                    src="/assets/layout/tender-information-kl.jpg"
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  {/* ONE statement of the deadline. It used to make four — a 39.7px heading
                      "E-Tender closes in", the day count, "Closing date" and the date itself
                      — which is why 27 words here carried about two facts. The heading was
                      also 39.7px against a 54px number: a 1.36:1 label-to-value ratio, the
                      same fault the listings hero had before it went to 2.6:1. The eyebrow
                      now carries that sentence, in the hero's own words. */}
                  {/* Mirrors the /tender hero exactly (Bryan): eyebrow, day count with the
                      live H/M/S hanging off its baseline, unit beneath — then the two dates
                      that bracket the tender. Same three-column grid trick as the hero, so the
                      numeral stays on the panel's centre axis however wide the strip gets; a
                      plain row would centre the BLOCK and push the numeral off-centre. */}
                  <div className="v1-deadline-content">
                    <div className="v1-countdown">
                      <span className="v1-deadline-kicker">E-Tender closes in</span>
                      <div
                        className="v1-timer"
                        role="timer"
                        aria-label={
                          cd
                            ? cd.finalDay
                              ? `${cd.h} hours and ${cd.m} minutes remaining`
                              : `${cd.days} ${cd.days === 1 ? "day" : "days"} remaining`
                            : "Time remaining until the e-tender closes"
                        }
                        aria-live="off"
                      >
                        {/* FOUNDER RULE: days lead. Hours and minutes take over inside the
                            final 24 hours, where "0 days" says nothing. */}
                        <span className="u" aria-hidden="true">
                          <b>{!cd ? "\u00a0" : cd.finalDay ? `${cd.h}h ${String(cd.m).padStart(2, "0")}m` : cd.days.toLocaleString("en-MY")}</b>
                          {/* Hangs off the numeral's baseline, exactly as the /tender hero does
                              (Bryan). Mirrored 1fr columns keep the numeral on the panel's axis. */}
                          {cd && !cd.finalDay && (
                            <span className="v1-tick">
                              {[["h", cd.h], ["m", cd.m], ["s", cd.s]].map(([label, value]) => (
                                <span className="v1-tick-cell" key={label as string}>
                                  <span className="v1-tick-value">{String(value).padStart(2, "0")}</span>
                                  <span className="v1-tick-unit">{label as string}</span>
                                </span>
                              ))}
                            </span>
                          )}
                          <i>{!cd ? "" : cd.finalDay ? "left today" : cd.days === 1 ? "day left" : "days left"}</i>
                        </span>
                      </div>

                    </div>

                    {/* The two dates that bracket this tender. There is NO third "register by"
                        date: FOUNDER-CORRECTED 1 Aug — an account is only needed at the moment
                        you apply, when Apply raises the sign-in / sign-up dialog. The 14-day
                        registration lead we had been showing was our own invention. */}
                    <div className="v1-dates">
                      <div>
                        <span>Tender starts</span>
                        <b className="v1-date">{TENDER_START.day}<sup>{TENDER_START.suffix}</sup> {TENDER_START.month} {TENDER_START.year}</b>
                      </div>
                      {/* The two dates are a SPAN, not a list — the arrow says so. Decorative,
                          so aria-hidden; the labels already carry the meaning for a reader. */}
                      <svg className="v1-dates-arrow" viewBox="0 0 34 12" aria-hidden="true">
                        <path d="M0 6h31M26.5 1.5 32 6l-5.5 4.5" />
                      </svg>
                      <div>
                        <span>Closing date</span>
                        <b className="v1-date">{TENDER_CLOSE.day}<sup>{TENDER_CLOSE.suffix}</sup> {TENDER_CLOSE.month} {TENDER_CLOSE.year}</b>
                        <small>End of day, MYT</small>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="v1-main" id="tender-action-panel">
                  {/* FOUR ZONES, descending weight, ending in the action — not three equal
                      columns. The reserve price is the number this whole page is about: it is
                      what a buyer decides against. At a third of a shared row it carried the same
                      weight as "Method: E-Tender", which is the least surprising fact here. */}
                  <div className="v1-price">
                    <div className="v1-price-fig">
                      <span className="lbl">Reserve price</span>
                      <b className="num">{rm(RESERVE)}</b>
                      {/* FOUNDER-CORRECTED 1 Aug: never "minimum offer considered" or "the floor".
                          Buyers do offer below it; the seller may accept or counter. */}
                      <span className="sub">Offer above or below it</span>
                    </div>
                    {/* The action sits BESIDE the price, not at the foot of the panel. Two
                        measurements drove it: the full-width button was 5.2x the width of its own
                        label — a banner, not a button — and this row ran 66% empty, 487px of dead
                        space beside the number. Pairing them puts the decision and the response to
                        it in one glance. Safe to move off the closing position because the sticky
                        bar carries the same CTA the whole way down the page. */}
                    <div className="v1-act">
                      <a className="btn-red" href="#">Submit your offer</a>
                      {/* Same treatment as "See how e-tender works" (Bryan) — both are ways out
                          that are not the action, so they share `.v1-textlink`. */}
                      <a className="v1-textlink v1-agent-alt" href="https://wa.me/60123938255" target="_blank" rel="noopener">
                        <span>Or talk to the agent first</span>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
                      </a>
                    </div>
                  </div>

                  {/* What it costs to take part, and under what method. Paired because they are
                      the same kind of fact — terms of entry — and neither should rival the price. */}
                  <div className="v1-terms">
                    <div>
                      <span className="lbl">E-Tender deposit</span>
                      <b className="dep-amt">{DEPOSIT}</b>
                      <span className="sub">3% of the reserve price</span>
                      {/* Attached to the figure, not floated in a separate block. "Is this money
                          at risk?" forms while the eye is on the number — so it is answered
                          there, at the point of need. */}
                      <span className="v1-dep-note">
                        <b>Not an extra charge.</b> It forms part of your 10% down payment and is
                        returned in full if no sale proceeds.
                      </span>
                    </div>
                    <div>
                      <span className="lbl">Method</span>
                      <b>E-Tender</b>
                      <span className="sub">Confidential</span>
                      <a className="v1-textlink v1-howto" href="/how-e-tender-works">
                        <span>See how e-tender works</span>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
                      </a>
                    </div>
                  </div>

                  {/* No box around the button. The zone rule above already separates it, and a
                      container only competed with the thing inside it. */}
                  {/* Closes the panel with what happens after you apply. The action itself now
                      sits beside the price — see the note there.
                      FOUNDER-VERIFIED (Bryan, 30 Jul): "it's not about win or lose — there's
                      always a chance / room for negotiation done by the agent." Hedged, so it
                      promises a route and never an outcome. See the DECISIONS table. */}
                  <div className="v1-submit">
                    <p className="v1-outcome">
                      <b>Accepted, countered or not accepted</b> &mdash; the seller responds within
                      5 working days, and where there is room to move the appointed agent
                      negotiates on your behalf.
                    </p>
                  </div>

                  {/* The 1-2-3 "How the e-tender works" is gone. It was the THIRD explanation
                      of the process on the site, after the listings-page signal and the page
                      built for it — and this section's job is the terms of THIS tender, not a
                      tutorial. Nothing was lost: register/verify is the action precondition,
                      privacy is explicit, and the seller's three outcomes plus 5-day response
                      sit before the CTA. Anyone who wants the full process gets the page that
                      owns it. */}
                  {/* The payments ladder is gone (Bryan): /how-e-tender-works owns the
                      process, and repeating 3% / +7% / 90% here made this the third place on the
                      site explaining it. The deposit's own callout above still says the one thing
                      that belongs on a listing — that the 3% is not an extra charge. */}

                </div>
              </div>
            </div>
          </div>
        </section>




        {/* ── PROPERTY DETAILS ──────────────────────────────────────────────
            Rebuilt again 30 Jul on Bryan's iNewProject reference. The three pricing
            facts (psf / tenure / land title) act as the section's HEADING — they are
            what a sealed-tender buyer prices on. Everything else is one flat
            label/value list rendered two-up, which is the shape the backend actually
            edits: type a label, type a value. Hardcoded groups are gone; the array
            above is the single place a field is added or removed. */}
        <section className="blk band-card" id="details">
          <div className="wrap">
            <div className="blkcard dcard">
              <h2 className="sec-title">Property <span>Details</span></h2>

              {/* Fixed across every property-detail page: price basis, tenure, then
                  title and land use. The positions stay stable; only the correct
                  property-type area basis and listing data change. */}
              <div className="pd-pricing">
                <div>
                  <span className="lbl">Reserve price per sq ft</span>
                  <b className="pd-psf">{PSF ? `RM${PSF.toLocaleString("en-MY")}` : "\u2014"}<i>psf</i></b>
                  <span className="sub">Based on {PRICE_BASIS} built-up area</span>
                </div>
                <div>
                  <span className="lbl">Tenure</span>
                  <b>Leasehold 99 years</b>
                  <span className="sub">Expires Nov 2115 &middot; 89 years remaining</span>
                </div>
                <div>
                  <span className="lbl">Title &amp; land use</span>
                  <b>{TITLE_TYPE}</b>
                  <span className="sub">{LAND_USE} use</span>
                </div>
              </div>

              <div className="pd">
                <div className="band">
                  {BAND.map((b) => (
                    <div className="stat" key={b.label}>
                      <svg className="ic" viewBox="0 0 24 24"><path d={b.path} /></svg>
                      <div className="txt"><span className="v">{b.value}</span><span className="k">{b.label}</span></div>
                    </div>
                  ))}
                </div>
              </div>
              <dl className="pd-list">
                {PROPERTY_DETAILS.map((row) => (
                  <div className="pd-row" key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Bryan, 30 Jul: the box lists nothing. Enumerating four specific unknowns
                  only shrank as the agency filled them in, and it invited the buyer to
                  read the gaps as our omission. A listing can never be complete, so the
                  honest and permanent version is simply: whatever the details above do not
                  answer, the agent will. Slimmest possible form — invitation plus button. */}
              <section className="pd-ask">
                {/* A typeset question mark, not a stroked icon. Every emphasis on this page is
                    Newsreader — the H1, the prices, the dates — so a serif glyph belongs to the
                    same system, where a UI-kit help-circle belongs to a generic one. It is also
                    flat, needs no SVG, and at this size carries the band on its own. Burgundy,
                    not red: red is reserved for the action beside it. */}
                <span className="pd-ask-mark" aria-hidden="true">?</span>
                <div className="pd-ask-main">
                  <h3 className="pd-ask-title">Still have questions about this property?</h3>
                  <p className="pd-ask-lede">
                    If the details above don&rsquo;t answer everything, feel free to ask the appointed
                    agent anything &mdash; from how the e-tender process works to questions about the
                    property itself.
                  </p>
                </div>
                {/* "Get your answer" completes the heading's question — Q then A — and promises an
                    outcome rather than an activity. No "agent": the VOICE RULE keeps agency
                    identity in the agent block and the footer, not in front-of-house CTAs. It
                    also avoids echoing the word "question" from the heading directly above it.
                    Alternates considered: "Ask before you offer" (carries the sealed-tender logic
                    but repeats the lede), "Get in touch" (safe, forgettable), "Ask a question"
                    (redundant with the heading). */}
                <a className="pd-ask-cta" href="#agent">Get your answer</a>
              </section>

            </div>
          </div>
        </section>


        {/* ── ABOUT ─────────────────────────────────────────────────────────
            Rebuilt 30 Jul. The old version was four equal paragraphs at 98 characters
            per line (vs a ~68ch readable measure) with three of the four hidden behind
            "View more". A content audit found most of it restated the page:
              P1 "62 three-storey stratified townhouses"  → Property Details + header
              P2 "three practical storeys, shared vs private" → Storeys 3
              P4 schools / markets / KESAS / Federal Highway → §7 What's Nearby
              P3 completed, no construction risk, inspect the actual unit → UNIQUE
            So the only paragraph saying something nothing else on the page said was
            buried third, behind a fold. About now carries the ARGUMENT rather than
            re-describing the facts, and that argument is promoted to a pull-quote: on a
            sealed tender you commit one number with no second attempt, so a property you
            can physically walk through first is worth more than one you cannot. Nothing
            here duplicates Details or What's Nearby. Clamp removed — with the repetition
            gone it is short enough to read whole, which also drops the fade gradient's
            dependency on --band-bg. */}
        <section className="blk band-card" id="about">
          <div className="wrap">
            <div className="blkcard about">
              <h2 className="sec-title">About <span>Residensi Sinaran</span></h2>
              {/* The pull-quote sits OUTSIDE the clamp. It is the one argument nothing else
                  on the page makes, so putting it behind a fold would defeat the reason it
                  exists — and a standfirst above the prose is where a reader expects the
                  section's thesis anyway. Everything below it clamps at 5 lines. */}
              {/* A HOOK, not an argument (Bryan). Deliberately takes the one fact paragraphs 1
                  and 2 do not — those are the only two visible before "View more", and a
                  standfirst that repeats the paragraph directly beneath it is just an echo.
                  Landed-plus-strata is paragraph 3's content, behind the fold, so the hook
                  surfaces the thing that actually distinguishes this property.
                  The previous quote also has to go on its own merit: it argued "walk the unit
                  before deciding what to offer", and the founder briefing of 3 Aug says the
                  real sequence is the other way round — offer first, then the agent takes you
                  to the viewing. */}
              <blockquote className="about-quote">
                The 62 homes here are landed, gated and strata-managed &mdash; the guardhouse and
                the grounds are the management body&rsquo;s job, not yours.
              </blockquote>
              {/* Every paragraph is ALWAYS in the DOM; collapsing is a CSS height clamp, not a
                  slice (Bryan). Two reasons. The fade has to cut mid-sentence to read as a fade —
                  slicing on a paragraph boundary fades out empty space and looks like a rendering
                  fault. And a crawler should see the whole section either way. */}
              <div className={`aboutbody${aboutOpen ? "" : " is-clamped"}`} id="about-body">
                {ABOUT_PARAS.map((t) => (
                  <p key={t.slice(0, 24)} dangerouslySetInnerHTML={{ __html: t }} />
                ))}
              </div>
              <button
                type="button"
                className="viewmore"
                aria-expanded={aboutOpen}
                aria-controls="about-body"
                onClick={() => setAboutOpen((v) => !v)}
              >
                <span>{aboutOpen ? "View less" : "View more"}</span>
                <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 5.5 7 9.5l4-4" /></svg>
              </button>
            </div>
          </div>
        </section>


        <section className="blk band-card" id="selling">
          <div className="wrap">
            <div className="blkcard">
              <h2 className="sec-title">Selling <span>Points</span></h2>
              <div className="spgrid"><div className="sp-item"><h3>Completed Homes, Ready to View</h3><p>Inspect the actual home and its surroundings before you commit.</p></div><div className="sp-item"><h3>Low-Density Community of 62 Homes</h3><p>Just 62 three-storey stratified townhouses in total.</p></div><div className="sp-item"><h3>Three-Storey Townhouse Living</h3><p>Multi-level layouts separate shared and private family space.</p></div><div className="sp-item"><h3>Gated and Guarded Environment</h3><p>A controlled environment for greater privacy and peace of mind.</p></div><div className="sp-item"><h3>Two Parking Bays per Home</h3><p>Each residence includes two parking bays.</p></div><div className="sp-item"><h3>Established Taman Sri Muda Location</h3><p>A mature Shah Alam neighbourhood with schools, shops and healthcare nearby.</p></div></div></div>
          </div>
        </section>


        {/* Facilities section removed — the 18 amenities listed were borrowed
            condominium content, not this 62-unit townhouse scheme. */}


        <section className="blk band-card" id="area">
          <div className="wrap">
            <div className="blkcard">

              <h2 className="sec-title">What's <span>Nearby?</span></h2>
              {/* These figures sit on a page of exact numbers — RM517,000, 1,400 sqft,
                  Leasehold 99 years — so unqualified they inherit that precision. One
                  qualifier scoped to the whole section, placed ABOVE the data so it is in
                  the reading path, rather than a "~" on all sixteen rows or a footnote
                  underneath that nobody reaches. It answers three things at once: not exact,
                  by ROAD (not straight-line, which is what a map pin would give), and
                  measured from the property rather than from a nearby landmark. */}
              <p className="sec-note">
                Approximate driving distance and time from {LISTING_NAME}.
              </p>
              <div className="amen">
                {NEARBY.map((cat) => (
                  <div className="amencol" key={cat.key}>
                    <h3>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        aria-hidden="true" dangerouslySetInnerHTML={{ __html: NEARBY_ICON[cat.key] }} />
                      {cat.label}
                      {/* Labels the right-hand column, which until now carried bare numbers
                          with nothing to say what they were. Sits in the heading row so it
                          reads as a table header, not as a second category. */}
                      <span className="amenkey"><span>Distance</span><span>&middot; Drive</span></span>
                    </h3>
                    {cat.items.map((it) => (
                      <div className="amenrow" key={it.name}>
                        <div className="nm"><b>{it.name}</b><span>{it.kind}</span></div>
                        <div className="dist"><b>{it.km}</b><span>~{it.min}</span></div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FACILITIES — restored 3 Aug on Bryan's instruction, using iNewProject's own
            project-detail treatment (.plain-card capsules). It was deleted on 30 Jul because
            the 18 amenities it carried were Breeze Hill's condo facilities; the DESIGN was
            never the problem, the CONTENT was. See FACILITIES above for what replaced them. */}
        <section className="blk band-card" id="facilities">
          <div className="wrap">
            <div className="blkcard">
              <h2 className="sec-title">Facilities</h2>
              <ul className="fac-list">
                {FACILITIES.map((name) => (
                  <li className="fac-chip" key={name}>
                    {/* No icon for a name the map does not carry — the label still prints.
                        Same graceful failure the iNewProject page shows on "Sky Deck". */}
                    {FACILITY_ICON[name] && (
                      <svg viewBox="0 0 20 20" aria-hidden="true"
                        dangerouslySetInnerHTML={{ __html: FACILITY_ICON[name] }} />
                    )}
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>


        <section className="blk band-card" id="location">
          <div className="wrap">
            <div className="blkcard">
              <h2 className="sec-title">Property <span>Location</span></h2>
              {/* ABOVE the map, in OUR type, as selectable text (Bryan). Below it, it would be
                  a caption to Google's widget; above it, it is the section's own fact and the
                  map becomes the illustration. Also the only version a crawler or a screen
                  reader can reach — Google's iframe card is neither. */}
              <div className="addr-block">
                <div className="addr-lines">
                  <span className="lbl">Property address</span>
                  <p>{ADDRESS || "Not stated"}</p>
                </div>
                <a
                  className="v1-textlink"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${MAP_DIR_Q}`}
                  target="_blank"
                  rel="noopener"
                >
                  <span>Get directions</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
                </a>
              </div>
              <div className="mapbox">
                <iframe title="Map — Taman Sri Muda, Shah Alam" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${MAP_EMBED_Q}&output=embed`}></iframe>
              </div>
            </div>
          </div>
        </section>


        {/* Price History section removed — the transaction rows were invented sample
            data. Returns once real transactions are sourced (JPPH or agency records);
            the .sample-tag style in tender-detail.css is reserved for that. */}

        <section className="blk band-card" id="agent">
          <div className="wrap">
            <div className="blkcard">
              <h2 className="sec-title">Listing <span>Agent</span></h2>
              <div className="agentcard"><div className="ag-top"><img className="face" src={AGENT_PHOTO} alt="Stephen Yew" /><div className="meta"><b>Stephen Yew</b><div className="co">The One Property Global &middot; Licensed REA</div></div></div><dl className="ag-creds"><div><dt>REA registration</dt><dd className="na">Not stated</dd></div><div><dt>Agency registration</dt><dd className="na">Not stated</dd></div><div><dt>Role on this e-tender</dt><dd>Appointed agent</dd></div><div><dt>Direct line</dt><dd className="num">012-393 8255</dd></div></dl><div className="ag-foot"><a className="btn wa" href="https://wa.me/60123938255" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>WhatsApp</a><a className="btn burg" href="#">Send Enquiry</a></div></div></div></div></section>




        <section className="blk band-card" id="mortgage">
          <div className="wrap">
            <div className="blkcard calc">
              <h2 className="sec-title">Mortgage <span>Calculator</span></h2>
              <div className="calcgrid">
                <div>
                  <div className="field"><label htmlFor="c-price">Property price (RM)</label><input type="number" id="c-price" defaultValue="517000" min="1" /></div>
                  <div className="field"><label htmlFor="c-down">Down payment (%)</label><input type="number" id="c-down" defaultValue="10" min="0" max="90" /></div>
                  <div className="field"><label htmlFor="c-tenure">Tenure (years)</label>
                    <select id="c-tenure" defaultValue="35">
                      <option>10</option><option>15</option><option>20</option><option>25</option><option>30</option><option>35</option>
                    </select>
                  </div>
                  <div className="field"><label htmlFor="c-rate">Interest rate (% p.a.)</label><input type="number" id="c-rate" defaultValue="4.0" step="0.05" min="0.1" /></div>
                </div>
                <div className="calcout">
                  <div className="big"><b className="num" id="c-monthly">RM 0</b><span>Estimated monthly repayment</span></div>
                  <div className="line"><span>Loan amount</span><b className="num" id="c-loan">RM 0</b></div>
                  <div className="line"><span>Total interest</span><b className="num" id="c-interest">RM 0</b></div>
                  <div className="line"><span>Total repayment</span><b className="num" id="c-total">RM 0</b></div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="blk band-card" id="faq">
          <div className="wrap">
            <h2 className="sec-title">E-Tender <span>FAQ</span></h2>
            <div className="faqcard">
              <div className="faq-item">
                <button type="button" className="faq-trigger" aria-expanded="false">What is the reserve price?<svg className="chev" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                <div className="faq-body"><p>The reserve price (RM517,000) is the minimum the seller will consider. Bids below it will not be selected.</p></div>
              </div>
              <div className="faq-item">
                <button type="button" className="faq-trigger" aria-expanded="false">How many bidders are there now?<svg className="chev" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                <div className="faq-body"><p>E-Tender is a sealed-bid exercise — the number of bidders and their offers stay confidential until the e-tender closes, so every buyer submits their honest best offer.</p></div>
              </div>
              <div className="faq-item">
                <button type="button" className="faq-trigger" aria-expanded="false">When is the closing date?<svg className="chev" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                <div className="faq-body"><p>This e-tender closes on <b>31 Dec 2028</b>. Submit your sealed bid and place the deposit before then via your member account.</p></div>
              </div>
              <div className="faq-item">
                <button type="button" className="faq-trigger" aria-expanded="false">Is my deposit refundable?<svg className="chev" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                <div className="faq-body"><p>Yes. Deposits are held by the registered estate agency as stakeholder. If the seller does not accept your offer — including after any negotiation — the agent tells you and returns your deposit in full immediately. There is no waiting period: once all three parties know the sale will not proceed, there is nothing left to wait for.</p></div>
              </div>
            </div>
          </div>
        </section>


        <section className="blk band-card" id="similar">
          <div className="wrap">
            <h2 className="sec-title">Similar <span>E-Tenders</span></h2>
            <div className="simgrid">
              <a className="sim" href="/tender">
                <div className="im"><img src={PROJECT_IMG("ara-damansara-height.jpg")} alt="Ara Damansara Height" loading="lazy" /></div>
                <div className="bd"><span className="lc">Ara Damansara, Selangor</span><b>Ara Damansara Height</b><span className="pr num">RM1,000,000</span></div>
              </a>
              <a className="sim" href="/tender">
                <div className="im"><img src={PROJECT_IMG("meranti-terrace.jpg")} alt="Meranti Terrace" loading="lazy" /></div>
                <div className="bd"><span className="lc">Kota Kemuning, Selangor</span><b>Meranti Terrace</b><span className="pr num">RM615,000</span></div>
              </a>
              <a className="sim" href="/tender">
                <div className="im"><img src={PROJECT_IMG("kemuning-utama-corner-unit.jpg")} alt="Kemuning Utama corner unit" loading="lazy" /></div>
                <div className="bd"><span className="lc">Shah Alam, Selangor</span><b>Kemuning Utama Corner</b><span className="pr num">RM1,200,000</span></div>
              </a>
            </div>
          </div>
        </section>
      </main>


      <div className="bidbar" id="bidbar" aria-hidden="true">
        <div className="wrap in">
          <div className="identity"><span className="nm">Residensi Sinaran</span><span className="meta">E-Tender closes {TENDER_CLOSE_LABEL}</span></div>
          <div className="pr"><div className="k">Reserve price</div><div className="v num">RM517,000</div><span className="closes">Closes {TENDER_CLOSE_LABEL}</span></div>
          <a className="btn red" href="#">Submit your offer</a>
        </div>
      </div>


      {/* The old viewer showed ONE photo with no way forward — under a hint that promised
          "View all 7 photos". Photo 7 was reachable only by first clicking the "+1" tile,
          which is the click that deformed the grid. Now every photo is reachable from here,
          and closing hands the stage whatever you ended on. */}
      {lightbox !== null && (
        <div
          className="modal open imgmodal"
          id="imgmodal"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${lightbox + 1} of ${PHOTO_COUNT}`}
          onClick={(e) => { if (e.target === e.currentTarget) closeViewer(lightbox); }}
        >
          <button type="button" className="lb-close" aria-label="Close photo viewer"
            onClick={() => closeViewer(lightbox)}>&times;</button>
          <button type="button" className="lb-nav lb-prev" aria-label="Previous photo"
            onClick={() => step(-1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <img id="imgmodal-img" src={SINARAN_PHOTOS[lightbox]} alt={`Residensi Sinaran photo ${lightbox + 1}`} />
          <button type="button" className="lb-nav lb-next" aria-label="Next photo"
            onClick={() => step(1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
          <span className="lb-count">{lightbox + 1} / {PHOTO_COUNT}</span>
        </div>
      )}
    </div>
  );
}
