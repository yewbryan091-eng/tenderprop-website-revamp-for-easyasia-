import { MS_DAY, auctionStartAtMs } from "@/lib/tender-utils";

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

/* ── THE AUCTIONEER ────────────────────────────────────────────────────────────
   ⚠️ PLACEHOLDER, AND A MORE SENSITIVE ONE THAN THE OTHERS. A licensed auctioneer is a
   regulated role, so a name and licence number here is a professional CREDENTIAL, not
   demo dressing like the fabricated street addresses. These are the sample values off
   Bryan's own reference sheet, kept in one object so replacing them with the real
   auctioneer is a one-line change — and so nobody has to hunt for what is invented.
   `A12345` follows the same obviously-placeholder pattern as the approved REN 123456.
   MUST be replaced before go-live; listed with the other go-live blockers in TEAM-LOG.

   No photograph on purpose. The only headshot in the repo is Stephen Yew's, and putting
   a real person's face against a fabricated identity and licence number is a different
   kind of wrong from a placeholder string. The card draws initials instead, which also
   reads honestly as "no photo yet". */
export const AUCTIONEER = {
  role: "Licensed Auctioneer",
  name: "John Tan",
  licence: "A12345",
  phone: "012-345 6789",
  phoneHref: "tel:+60123456789",
};

export const AUCTIONEER_INITIALS = AUCTIONEER.name
  .split(/\s+/)
  .map((part) => part[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();
