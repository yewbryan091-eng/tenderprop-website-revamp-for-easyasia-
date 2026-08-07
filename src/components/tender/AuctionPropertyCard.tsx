import {
  AUCTIONEER,
  AUCTIONEER_INITIALS,
  AUCTION_START_MS,
  AUCTION_TIME_LABEL,
  OWNER_AUCTION,
  REGISTRATION_DATE,
} from "@/data/owner-auction";
import type { Tender } from "@/data/tenders";
import { PROJECT_IMG } from "@/lib/images";
import {
  areaSlot,
  daysUntil,
  displayType,
  fmtDate,
  fmtPrice,
  hrefFor,
  streetAddressOf,
  tenderId,
} from "@/lib/tender-utils";

import {
  AreaIcon,
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  GavelIcon,
  HeartIcon,
  HomeIcon,
  PhoneIcon,
  PinIcon,
} from "./icons";

/* ── THE OWNER AUCTION CARD (Bryan's reference sheet, 7 Aug) ───────────────────
   A SEPARATE component from PropertyCard rather than a `product` branch inside it.
   The two cards agree on the top half and disagree on everything below the address:
   a tender has a PERIOD (starts → closes), an auction has a MOMENT (one date, one
   time); a tender has a listing agent with a REN, an auction has a licensed
   auctioneer with a licence. Branching one component through two layouts that
   different would have made /tender's card harder to read and easier to break, and
   /tender's card is settled work.

   ⚠️ IT DELIBERATELY REUSES /tender's `.pc-*` CLASS NAMES. That is not laziness — the
   whole `.props-grid.list-mode` layout keys off `.pc-media`, `.pc-body`, `.pc-main`,
   `.pc-rail`, `.pc-foot` and `.pc-cta`. Rename them here and list view breaks on this
   page only, silently, because nothing else selects those names. New classes are added
   ONLY for the parts that genuinely have no counterpart (`.apc-*`).

   ⚠️ THE WORDS SAY AUCTION; THE DATA DOES NOT. Every record is still
   `tenderMethod: "E-Tender"`. The auction date, time and registration deadline come
   from the ONE shared event object, not from the listing — Bryan, 7 Aug: "the auction
   date is shared across all listings for now". The starting bid is the listing's
   `reservePrice` under a different label; see the comment at `.pc-money-label`. */
export function AuctionPropertyCard({
  x,
  saved,
  onToggleSave,
}: {
  x: Tender;
  saved: boolean;
  onToggleSave: (id: string) => void;
}) {
  const id = tenderId(x);
  /* Counts to the shared auction START (9:00 AM), not to the end of a closing date —
     `daysUntil` + `AUCTION_START_MS` are the auction-side helpers. Reaching for
     `daysLeft(x.closingDate)` here would count to a TENDER deadline this card no
     longer shows, and land ~15 hours out. */
  const d = daysUntil(AUCTION_START_MS);
  const open = d > 0;
  const soon = open && d <= 14;
  const leftTxt = `${d} ${d === 1 ? "day" : "days"} left`;
  const href = hrefFor(x);
  const typeLabel = displayType(x);
  const size = areaSlot(x);
  const sizeTxt = size.value === "—" ? null : size.value.replace(/sqft/i, "sq ft");
  const where = [x.name, x.address ? streetAddressOf(x.address) : `${x.area}, ${x.stateName}`].join(
    ", ",
  );

  return (
    <article className="prop-card apc" data-demo={x.demo ? "1" : undefined} data-id={id}>
      <div className="pc-media">
        <span className="pc-media-link">
          <img
            src={PROJECT_IMG(x.image)}
            alt={`${x.name} — ${x.area}, ${x.stateName}`}
            loading="lazy"
          />
        </span>
        <div className="pc-tags">
          {/* Espresso + brass with a gavel, not the burgundy text pill /tender uses.
              The product is recognisable before a word is read, which is the pill's
              entire job on a page that will eventually carry both. */}
          <span className="pc-status apc-pill">
            <GavelIcon />
            <span>Owner Auction</span>
          </span>
          {x.demo && (
            <span className="demo-badge" title="Fabricated sample record — not real inventory">
              DEMO
            </span>
          )}
        </div>
        <button
          type="button"
          className={"save-btn" + (saved ? " saved" : "")}
          aria-label="Save to shortlist"
          aria-pressed={saved}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSave(id);
          }}
        >
          <HeartIcon />
        </button>
        <span className={"pc-deadline" + (soon ? " is-soon" : "") + (!open ? " is-closed" : "")}>
          <ClockIcon />
          <span className="pc-when">
            <b className="pc-left">{open ? leftTxt : "Auction closed"}</b>
          </span>
        </span>
      </div>

      <div className="pc-body">
        <div className="pc-main">
          {/* ⚠️ "Starting bid" over `reservePrice`. There is no `startingBid` field, and
              the two are NOT the same idea: the 1 Aug ledger row says an e-tender
              reserve is a GUIDE buyers may bid under, while a starting bid is a floor.
              The label is Bryan's, from his reference sheet, and the structure is what
              is being built here — but this is a business fact that needs his father's
              word before go-live, and it is logged as such. */}
          <div className="pc-money">
            <span className="pc-money-label">Starting bid</span>
            <strong className="pc-money-value">{fmtPrice(x.reservePrice)}</strong>
          </div>

          <h3 className="pc-title">
            <HomeIcon />
            <a className="pc-link" href={href}>
              {typeLabel || x.name}
              {typeLabel && <span className="sr-only"> · {x.name}</span>}
            </a>
          </h3>
          <p className="pc-loc">
            <PinIcon />
            <span>{where}</span>
          </p>
          {sizeTxt && (
            <p className="pc-size">
              <AreaIcon />
              <span>{sizeTxt}</span>
            </p>
          )}

          {/* ── AUCTION DETAILS — a MOMENT, where the tender card shows a PERIOD ──
              Two facts side by side with a rule between them, then the one deadline a
              buyer has to act on. This is NOT a redesign of the locked E-Tender
              timeline (6 Aug): different product, different component, different fact.
              The vertical divider that ruling removed is fine here for the same reason
              — it was a ruling about that timeline, not about all dividers. */}
          <div className="pc-period apc-details">
            <span className="pc-period-kick">Auction details</span>
            <div className="apc-when">
              <span className="apc-fact">
                <span className="apc-fact-icon" aria-hidden="true">
                  <CalendarIcon />
                </span>
                <span className="apc-fact-text">
                  <b>{fmtDate(OWNER_AUCTION.date)}</b>
                  <span className="apc-fact-label">Auction date</span>
                </span>
              </span>
              <span className="apc-fact">
                <span className="apc-fact-icon" aria-hidden="true">
                  <ClockIcon />
                </span>
                <span className="apc-fact-text">
                  <b>{AUCTION_TIME_LABEL}</b>
                  <span className="apc-fact-label">Auction time</span>
                </span>
              </span>
            </div>
            {/* THE BAR. It replaced a countdown that repeated the day count already on
                the photo (Bryan, 7 Aug). Registration closing is the only thing on this
                card a buyer must ACT on, and it carries its own urgency — so the loudest
                element in the lower card now says what to do, not how long is left.
                It earns a second date because 11th ≠ 12th; a bar repeating the auction
                date under the auction date would be the hero's one-date-two-meanings
                fault again. Short form, not the hero's full sentence: that string wraps
                at card width. */}
            <p className="apc-reg">
              <CalendarIcon />
              <span>
                Registration closes {REGISTRATION_DATE.day} {REGISTRATION_DATE.month.slice(0, 3)}{" "}
                {REGISTRATION_DATE.year}
              </span>
            </p>
          </div>
        </div>

        <div className="pc-rail">
          {/* ── THE AUCTIONEER, where the tender card carries the listing agent ──
              Authority is the point: at auction the person running the room is the
              licensed auctioneer, not the listing negotiator.
              ⚠️ Name and licence are PLACEHOLDERS from Bryan's reference sheet, and a
              licence number is a regulated credential rather than demo dressing — see
              `AUCTIONEER` in data/owner-auction.ts. Initials, not a photograph: the only
              headshot in the repo belongs to a real person and must not be attached to a
              fabricated identity. */}
          <div className="pc-foot apc-foot">
            <span className="pc-avatar apc-avatar" aria-hidden="true">
              {AUCTIONEER_INITIALS}
            </span>
            <span className="pc-agent apc-agent">
              <span className="apc-role">{AUCTIONEER.role}</span>
              <b>{AUCTIONEER.name}</b>
              <span>Licence No. {AUCTIONEER.licence}</span>
            </span>
            <span className="apc-contact">
              <a className="pc-tel" href={AUCTIONEER.phoneHref}>
                <PhoneIcon />
                <span>{AUCTIONEER.phone}</span>
              </a>
              {/* No route for an auctioneer profile exists yet. Pointing at the listing
                  keeps it live rather than shipping a 404, and it is flagged. */}
              <a className="apc-profile" href={href}>
                View Profile <ArrowRightIcon />
              </a>
            </span>
          </div>

          <span className="pc-cta apc-cta" aria-hidden="true">
            <GavelIcon />
            <span className="pc-cta-txt">View Auction Details</span>
            <ArrowRightIcon />
          </span>
        </div>
      </div>
    </article>
  );
}
