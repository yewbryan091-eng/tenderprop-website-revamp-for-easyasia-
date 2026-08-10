import type { Tender } from "@/data/tenders";
import { TYPE_TAXONOMY } from "@/data/tender-taxonomy";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/* ── STREET ADDRESS — the full address minus the unit (Bryan, 6 Aug) ───────────
   Subsale buyers browse by street, not by suburb, so the card shows the real
   address — but never the exact unit a listing sits in:

     "No. 23A, Jalan Sri Kandi 25/15F, Taman Sri Muda, 40400 Shah Alam"
   →  "Jalan Sri Kandi 25/15F, Taman Sri Muda, 40400 Shah Alam"

   DERIVED, never stored — the backend keeps ONE address (the full one, unit
   included, which the detail page and the map need) and this trims it for
   display. A stored second copy could drift from the first.

   `Lot`/`PT` prefixes are deliberately NOT stripped: on a land parcel or a
   factory the lot number IS the property's identity, not the private unit
   Bryan is withholding. And the strip never runs unless two or more segments
   survive it, so a short address can never be reduced to a fragment. */
const UNIT_PREFIX = /^(?:no\.?\s*\d|unit\s|[a-z]?-?\d+-\d+)/i;

export function streetAddressOf(address: string) {
  const parts = address
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length >= 3 && UNIT_PREFIX.test(parts[0])) return parts.slice(1).join(", ");
  return parts.join(", ");
}

export function fmtPrice(p: number) {
  return p > 0 ? "RM" + p.toLocaleString("en-MY") : "On application";
}

export function fmtRM(n: number) {
  return n >= 1000000
    ? "RM" + (n / 1000000).toString().replace(/\.0$/, "") + "m"
    : "RM" + Math.round(n / 1000) + "k";
}

/* DEMO VALUE (Bryan, 29 Jul): the data model has no listing-start field yet, so the
   card shows closing date minus 3 months — the founder's standard package length.
   Replace with a real per-listing start date when the agency/backend supplies one. */
/* Full ordinal date, exactly as the /tender hero renders its cycle date — "1st October 2028",
   not "1 Oct 2028". Returns the parts so the ordinal can be a real <sup>. */
export function ordinalDateParts(closingDate: string) {
  const [year, month, day] = closingDate.split("-").map(Number);
  const lastTwo = day % 100;
  const suffix =
    lastTwo >= 11 && lastTwo <= 13
      ? "th"
      : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[day % 10] || "th";
  return { day, suffix, month: MONTHS_FULL[month - 1], year };
}

const MONTHS_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function tenderStartOf(x: Tender) {
  const d = new Date(x.closingDate + "T00:00:00");
  d.setMonth(d.getMonth() - 3);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/* The tender WINDOW as one string — "12 Sep – 12 Dec 2026".
   Both dates were on the card as two separate labelled rows and got cut in the diet. Bryan
   wants them back, and a range is how they come back for the price of ONE line instead of
   three: they are not two facts, they are one — the period this tender is open.
   The start year is dropped when both dates share it, which is the common case since tenders
   run about three months. */
export function tenderWindow(x: Tender) {
  const end = new Date(x.closingDate + "T00:00:00");
  const start = new Date(x.closingDate + "T00:00:00");
  start.setMonth(start.getMonth() - 3);
  const sameYear = start.getFullYear() === end.getFullYear();
  const s = `${start.getDate()} ${MONTHS[start.getMonth()]}${sameYear ? "" : ` ${start.getFullYear()}`}`;
  const e = `${end.getDate()} ${MONTHS[end.getMonth()]} ${end.getFullYear()}`;
  return `${s} \u2013 ${e}`;
}

/* ── HOW LONG IS LEFT — one definition, every surface ──────────────────────────────
   This was computed six separate ways and they disagreed on two axes:
     · ROUNDING — ceil on the cards and the detail header, floor on both big countdowns,
       so the same tender read "885 days left" in the page header and "884 DAYS LEFT" in
       the panel below it, from the same variable in the same function.
     · TIMEZONE — some call sites parsed "…T23:59:59" with NO offset, which resolves to
       the HOST's local time. On a UTC server that is the deadline moved 8 hours, so the
       SSR render and the browser produce different numbers. Malaysian tenders close at
       the end of the day MYT — the offset is not optional.
   Everything that displays a deadline now goes through here. */
export const MS_DAY = 86_400_000;

export function closeAtMs(closingDate: string) {
  return new Date(`${closingDate}T23:59:59+08:00`).getTime();
}

export function remainingMs(closingDate: string, now: number = Date.now()) {
  return Math.max(0, closeAtMs(closingDate) - now);
}

/* Ceil, deliberately. With 884 days and 22 hours to run a buyer has 885 days INCLUDING
   today, and the final day reads "1 day left" rather than a meaningless "0". */
export function daysLeft(closingDate: string, now: number = Date.now()) {
  return Math.ceil(remainingMs(closingDate, now) / MS_DAY);
}

/* A property of the time remaining, NOT of the rounded day count — deriving it from
   `days` silently inverts the moment the rounding convention changes. */
export function isFinalDay(closingDate: string, now: number = Date.now()) {
  return remainingMs(closingDate, now) < MS_DAY;
}

/* ── OWNER AUCTION is an EVENT, not a deadline ─────────────────────────────────
   `closeAtMs()` above hardcodes `23:59:59+08:00` because an e-tender runs to the END
   of its closing date — founder-confirmed, no intra-day cutoff. An auction is the
   opposite: it STARTS at a scheduled time. Reusing the tender helpers for it counts
   to the wrong moment by up to a full day (~15 hours for a 9am auction), which is the
   885-vs-884 bug again in a new place.

   So auction timing gets its own entry point, and lives HERE rather than in the route
   for the same reason everything else does: one definition, or the page and the card
   eventually disagree. Additive only — nothing above is touched. */
export function auctionStartAtMs(date: string, time24: string) {
  return new Date(`${date}T${time24}+08:00`).getTime();
}

export function remainingMsUntil(atMs: number, now: number = Date.now()) {
  return Math.max(0, atMs - now);
}

/* Ceil, matching `daysLeft` — with 127 days and 22 hours to run there are 128 days
   including today, and the final day reads "1 day left" rather than "0". */
export function daysUntil(atMs: number, now: number = Date.now()) {
  return Math.ceil(remainingMsUntil(atMs, now) / MS_DAY);
}

export function isFinalDayUntil(atMs: number, now: number = Date.now()) {
  return remainingMsUntil(atMs, now) < MS_DAY;
}

/* Deposit: listings with a published deposit carry `deposit`. Others fall back to
   3% of reserve, the figure published in the live How-To-Tender FAQ.
   Placeholder rule — verify with the agency before go-live. */
export function depositOf(x: Tender) {
  if (x.deposit) return "RM" + x.deposit.toLocaleString("en-MY");
  return x.reservePrice
    ? "RM" + Math.round(x.reservePrice * 0.03).toLocaleString("en-MY")
    : "On application";
}

export function tenderId(x: Tender) {
  return (x.name + "-" + x.area)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function inPriceRange(price: number, range: string) {
  if (range === "500k-below") return price > 0 && price <= 500000;
  if (range === "501k-1mil") return price > 500000 && price <= 1000000;
  if (range === "1mil-2mil") return price > 1000000 && price <= 2000000;
  if (range === "2mil-above") return price > 2000000;
  return false;
}

const TYPE_BY_VALUE: Record<string, (typeof TYPE_TAXONOMY)[number]> = {};
TYPE_TAXONOMY.forEach((t) => {
  TYPE_BY_VALUE[t.value] = t;
});
export { TYPE_BY_VALUE };

export function matchesTaxonomy(x: Tender, value: string) {
  const t = TYPE_BY_VALUE[value];
  if (!t || value === "all") return true;
  if (t.cat) return x.propertyCategory === t.cat;
  return (t.types || []).indexOf(x.propertyType) !== -1;
}

/* DEMO ROUTING (Bryan, 29 Jul): every card opens the one built detail page —
   Residensi Sinaran is the design canon, and for the EasyAsia demo every click
   should land somewhere real rather than a coming-soon wall. When more detail
   pages exist, route per-listing again (each record's own slug). */
/* Every card routes to Residensi Sinaran — the logged demo exception (29 Jul): it is the
   only listing with a real detail page. What changed on 10 Aug is that there are now TWO
   of them, one per product, so the destination depends on which grid the card is in.

   The PRODUCT is passed in rather than read off the record, and that is deliberate: all 36
   records are still `tenderMethod: "E-Tender"`, so reading the field would send every
   Owner Auction card to the E-Tender page — which is exactly the bug this fixes. When real
   auction records exist, switch this to the record's own method and delete the argument. */
export function hrefFor(_x: Tender, product: "e-tender" | "owner-auction" = "e-tender") {
  return product === "owner-auction"
    ? "/owner-auction/residensi-sinaran"
    : "/tender/residensi-sinaran";
}

/* Malaysian listing convention: landed and commercial-landed stock is named by its
   storey count — "2-Storey Terrace House" tells a buyer far more than "Terrace
   House" — while high-rise strata is not ("Condominium", never "18-Storey
   Condominium"). Land takes no prefix either. Two naming refinements fall out of
   the same data: a bungalow is a "Bungalow House", and a shop is a "Shop Lot" at
   one storey but a "Shop-Office" at two or more, which is how the market names it.
   Filters still match on the raw `propertyType` — this is display only. */
/* Types that are never storey-prefixed. High-rise strata for the obvious reason,
   plus Townhouse — per Bryan, "townhouse is fine" on its own: the name already
   implies the multi-storey stacked form, so "3-Storey Townhouse" is redundant. */
const NO_STOREY_PREFIX = new Set([
  "Apartment",
  "Condominium",
  "Serviced Residence",
  "Serviced Apartment",
  "Flat",
  "SOHO",
  "SOVO",
  "SOFO",
  "Townhouse",
]);

export function displayType(x: Tender) {
  const t = x.propertyType?.trim();
  if (!t) return "";
  if (NO_STOREY_PREFIX.has(t) || x.propertyCategory === "land") return t;
  const n = x.storeys ?? null;
  const base =
    t === "Bungalow"
      ? "Bungalow House"
      : t === "Shop"
        ? n && n >= 2
          ? "Shop-Office"
          : "Shop Lot"
        : t;
  return n ? `${n}-Storey ${base}` : base;
}

/* Slot 2 of the card's three fixed facts. Which area matters depends on the form of
   the property, not on which field happens to be populated: a bungalow buyer is
   buying land, a condo buyer is buying floor. **Townhouse is floor area** — it is
   stacked strata, not land (Bryan, 30 Jul). Same membership as NO_STOREY_PREFIX
   today but kept separate on purpose: one set is about naming, this one is about
   what a buyer is actually purchasing, and they can diverge later. */
const FLOOR_AREA_TYPES = new Set([
  /* "Serviced Residence" is retained alongside "Serviced Apartment" (renamed 30 Jul,
     Bryan) so any record still carrying the old spelling — real inventory, EasyAsia's
     CMS, a stale import — keeps resolving to floor area instead of silently falling
     through to land area. Cheap insurance; both are the same product. */
  "Apartment",
  "Condominium",
  "Serviced Residence",
  "Serviced Apartment",
  "Flat",
  "SOHO",
  "SOVO",
  "SOFO",
  "Townhouse",
]);

export function areaSlot(x: Tender) {
  return FLOOR_AREA_TYPES.has((x.propertyType || "").trim())
    ? { label: "Floor area", value: x.builtUp || "\u2014" }
    : { label: "Land area", value: x.landArea || "\u2014" };
}

/* ── Property Details: applicability, not just presence ────────────────────────
   A spec sheet has three states per field, and conflating them is what makes the
   section untrustworthy:
     value      — we know it
     "Not stated" — it APPLIES to this property but the agency has not supplied it
     "—"        — it does not apply to this property form at all
   The live page had these backwards in places: "Maintenance fee —" on a strata
   townhouse (every Malaysian strata property has one, so that is Not stated), and
   "Land area: Not stated" on the same townhouse (strata owners buy floor, not land,
   so that is genuinely not applicable). Deriving applicability from the property's
   FORM removes the hand-judgement that got it wrong. */

export type DetailRow = { label: string; value: string; state: "value" | "unstated" | "na" };
export type DetailGroup = { kick: string; rows: DetailRow[] };

const STRATA_FORMS = new Set([
  "Apartment",
  "Condominium",
  "Serviced Residence",
  "Serviced Apartment",
  "Flat",
  "SOHO",
  "SOVO",
  "SOFO",
  "Townhouse",
]);

export function formOf(x: Tender): "strata" | "landed" | "land" {
  if (x.propertyCategory === "land") return "land";
  return STRATA_FORMS.has((x.propertyType || "").trim()) ? "strata" : "landed";
}

/* Which fields even make sense for each form. Anything not listed renders as "—". */
const APPLIES: Record<string, Array<"strata" | "landed" | "land">> = {
  bedrooms: ["strata", "landed"],
  bathrooms: ["strata", "landed"],
  carParks: ["strata", "landed"],
  /* storeys is the one field that does not split cleanly on form: a townhouse is
     strata title but is genuinely multi-storey, which is the whole point of the
     type. Handled as an exception in cell() rather than fudging the form model. */
  storeys: ["landed"],
  floorLevel: ["strata"],
  builtUp: ["strata", "landed"],
  landArea: ["landed", "land"],
  tenure: ["strata", "landed", "land"],
  titleType: ["strata", "landed", "land"],
  landTitle: ["landed", "land"],
  bumiLot: ["strata", "landed", "land"],
  zoning: ["land"],
  propertyType: ["strata", "landed", "land"],
  yearCompleted: ["strata", "landed"],
  facing: ["strata", "landed"],
  powerSupply: ["land"],
  occupancy: ["strata", "landed"],
  furnishing: ["strata", "landed"],
  maintenanceFee: ["strata"],
};

function cell(x: Tender, key: string, raw: unknown): DetailRow["state"] {
  const townhouseStoreys = key === "storeys" && (x.propertyType || "").trim() === "Townhouse";
  if (!townhouseStoreys && !(APPLIES[key] || []).includes(formOf(x))) return "na";
  return raw === null || raw === undefined || raw === "" ? "unstated" : "value";
}

export function detailGroups(x: Tender): DetailGroup[] {
  const d = x.details || {};
  const mk = (label: string, key: string, raw: unknown): DetailRow => {
    const state = cell(x, key, raw);
    return {
      label,
      value: state === "value" ? String(raw) : state === "unstated" ? "Not stated" : "—",
      state,
    };
  };
  return [
    {
      kick: "Layout",
      rows: [
        mk("Bedrooms", "bedrooms", x.bedrooms),
        mk("Bathrooms", "bathrooms", x.bathrooms),
        mk("Car parks", "carParks", x.carParks),
        mk("Storeys", "storeys", x.storeys),
        mk("Floor level", "floorLevel", d.floorLevel),
      ],
    },
    {
      kick: "Size",
      rows: [mk("Built-up area", "builtUp", x.builtUp), mk("Land area", "landArea", x.landArea)],
    },
    {
      kick: "Ownership & title",
      rows: [
        mk("Tenure", "tenure", x.tenure),
        mk("Title type", "titleType", x.titleType),
        mk("Land title", "landTitle", d.landTitle),
        mk("Bumi lot", "bumiLot", d.bumiLot),
        mk("Zoning", "zoning", d.zoning),
      ],
    },
    {
      kick: "Building",
      rows: [
        mk("Property type", "propertyType", displayType(x)),
        mk("Year completed", "yearCompleted", d.yearCompleted),
        mk("Facing", "facing", d.facing),
        mk("Power supply", "powerSupply", d.powerSupply),
      ],
    },
    {
      kick: "Condition & terms",
      rows: [
        mk("Occupancy", "occupancy", d.occupancy),
        mk("Furnishing", "furnishing", d.furnishing),
        mk("Maintenance fee", "maintenanceFee", d.maintenanceFee),
      ],
    },
  ];
}

/* Honest completeness signal: only counts fields that actually apply, so a landed
   house is never marked down for lacking a floor level. */
export function detailCompleteness(x: Tender) {
  const rows = detailGroups(x)
    .flatMap((g) => g.rows)
    .filter((r) => r.state !== "na");
  return { known: rows.filter((r) => r.state === "value").length, applicable: rows.length };
}
