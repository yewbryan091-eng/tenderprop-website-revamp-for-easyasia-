import { MS_DAY, auctionStartAtMs, closeAtMs } from "@/lib/tender-utils";

/* ── THE OWNER AUCTION EVENT — one object, read by the hero AND every card ─────
   Lifted out of `routes/owner-auction/index.tsx` on 7 Aug when the auction CARD
   started needing the same date, time and registration deadline the hero prints.
   Two copies of an event date is how a page ends up disagreeing with itself.

   ⚠️ ONE SHARED EVENT, NOT PER-LISTING (Bryan, 7 Aug: "the auction date is shared
   across all listings for now"). Every card shows this same date and time. When the
   backend supplies per-listing auction datetimes, this object becomes the default and
   each listing overrides it — the card already reads its values through one helper,
   so that change lands in one place.

   ⚠️ PLACEHOLDER DATA. The repo holds NO Owner Auction records: all 36 listings are
   `tenderMethod: "E-Tender"`. These values are the event scaffolding, not data.

   `time24` is the source of truth; `timeLabel` is its display form. Two fields, not a
   parse, because 24-hour is what a backend stores and "9:00 AM" is what a buyer reads. */
const AUCTION_DATE = "2026-12-12";

/* Calendar arithmetic in UTC so a browser's own timezone (or a DST boundary anywhere
   in the world) can never shift the answer by a day. Dates in, dates out — no clock. */
export function dayBefore(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day) - MS_DAY).toISOString().slice(0, 10);
}

export const OWNER_AUCTION = {
  date: AUCTION_DATE,
  time24: "09:00:00",
  timeLabel: "9:00 AM",
  /* The zone the auction runs in. A separate field, not baked into `timeLabel`: it is
     styled differently on the hero (`.oa-tz`) and it is a real backend fact — every
     countdown resolves `time24` at +08:00 through `auctionStartAtMs()`, so this string
     and that offset must always describe the same zone. */
  timezone: "MYT",
  /* ✅ FOUNDER RULE, 7 Aug (Bryan, from his father): registration closes **one day
     before** the auction — 11 December for a 12 December auction.

     DERIVED, not typed as a second literal, so the two can never drift apart when the
     auction date moves. If a future auction sets its own deadline independent of this
     rule, this becomes a stored backend field. Note the 1 Aug "no registration
     deadline" ruling was an E-TENDER decision and does not apply here. */
  registrationClosesDate: dayBefore(AUCTION_DATE),
};

export const AUCTION_START_MS = auctionStartAtMs(OWNER_AUCTION.date, OWNER_AUCTION.time24);

/* ── TWO DEADLINES, NINE HOURS APART, AND THEY ARE NOT INTERCHANGEABLE ─────────
   The auction STARTS at a scheduled time (12 Dec, 09:00 MYT) — `auctionStartAtMs`.
   Registration CLOSES at the end of its date (11 Dec, 23:59:59 MYT) — `closeAtMs`,
   the same end-of-day rule every tender closing date uses, because "closes on the
   11th" means a buyer has the whole of the 11th.

   Anything labelled "to register" MUST count to this and not to the auction. They
   currently round to the same day count, which is exactly what makes the mistake
   invisible: the gap is ~9 hours, so the two answers agree on most days and quietly
   differ on the rest. Same class of bug as 885-vs-884. */
export const REGISTRATION_CLOSE_MS = closeAtMs(OWNER_AUCTION.registrationClosesDate);

const MONTH_NAMES = [
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

/* "2026-12-12" → { day: 12, suffix: "th", month: "December", year: 2026 }. One ordinal
   rule, shared by the hero date and the registration line. */
export function ordinalDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const lastTwo = day % 100;
  const suffix =
    lastTwo >= 11 && lastTwo <= 13
      ? "th"
      : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[day % 10] || "th";
  return { day, suffix, month: MONTH_NAMES[month - 1], year };
}

export const AUCTION_HERO_DATE = ordinalDate(OWNER_AUCTION.date);
export const REGISTRATION_DATE = ordinalDate(OWNER_AUCTION.registrationClosesDate);

/* Card-width forms. The hero has room for "Registration Closing Date: 11th December
   2026"; a ~325px card does not — that string wraps the bar. Same fact, same voice,
   one line. */
export const AUCTION_TIME_LABEL = `${OWNER_AUCTION.timeLabel} ${OWNER_AUCTION.timezone}`;

/* ── THE AUCTION COMPANY ───────────────────────────────────────────────────────
   Bryan, 7 Aug: the card names the COMPANY, not a named auctioneer. That replaced a
   "Licensed Auctioneer / John Tan / Licence No. A12345" block, and it solves the one
   genuinely unsafe thing on this card — an individual's auctioneer licence number is a
   regulated professional credential, and there was no real one to print. A company
   identity has no such problem, and every value below is REAL:

   · `966357-V` is TenderProp's SSM company registration, supplied by Bryan on 3 Aug and
     already rendering on the Residensi Sinaran detail page. Not a placeholder.
   · The logo is the existing shipped asset, not a new upload.

   ⚠️ ONE THING TO CONFIRM: `03-8011 6768` is a NEW number. Everywhere else on the site
   (SiteFooter, /about, PLAN-site-architecture) the office line is `(+603) 8021 6468`.
   Two different numbers is entirely plausible — a dedicated auction line — but the pairs
   differ in two places each (8021/8011, 6468/6768), so it is worth one glance before
   go-live rather than assuming either is a typo for the other.

   NOTE this is still not a BOVAEP agency registration (`E(1)xxxx`), which is what Act
   242 disclosure normally cites — the open item already tracked in PLAN-AUGUST-DELIVERY. */
export const AUCTION_COMPANY = {
  kicker: "Auction company",
  name: "TenderProp Auction",
  ssmNo: "966357-V",
  phone: "03-8011 6768",
  phoneHref: "tel:+60380116768",
};
