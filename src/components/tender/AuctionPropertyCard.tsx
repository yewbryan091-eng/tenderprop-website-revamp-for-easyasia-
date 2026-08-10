import {
  AUCTION_COMPANY,
  AUCTION_START_MS,
  AUCTION_TIME_LABEL,
  OWNER_AUCTION,
  REGISTRATION_CLOSE_MS,
  REGISTRATION_DATE,
} from "@/data/owner-auction";
import type { Tender } from "@/data/tenders";
import { LOGO, PROJECT_IMG } from "@/lib/images";
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
  /* ⚠️ THE PHOTO PILL COUNTS TO REGISTRATION, NOT TO THE AUCTION (Bryan, 7 Aug:
     "127 days left" → "127 days left to register"). That is a semantic change, not a
     wording one: the label names the deadline, so the number has to be measured to the
     same deadline or the card lies. Registration closes at the END of 11 Dec; the
     auction starts 09:00 on the 12th — about nine hours apart, which means the two
     counts agree on most days and silently differ on the rest. Changing the words
     without changing `atMs` would have shipped a number that is right most of the time.

     Division of labour on this page: the HERO counts to the event ("Next Owner Auction
     in"), the CARD counts to the thing a buyer must DO. Neither is the other's spare. */
  const now = Date.now();
  const registrationOpen = now < REGISTRATION_CLOSE_MS;
  const auctionUpcoming = now < AUCTION_START_MS;
  const d = daysUntil(REGISTRATION_CLOSE_MS, now);
  /* `soon` follows registration too — a red-hot pill counting to an auction nobody can
     still register for is urgency pointed at the wrong thing. */
  const soon = registrationOpen && d <= 14;
  const leftCount = `${d} ${d === 1 ? "day" : "days"} left`;
  const leftTxt = `${leftCount} to register`;
  /* THREE states, not two. Between registration closing and the auction starting there
     is a real ~9-hour window where registration is shut but the auction has not
     happened — "Auction closed" would be false there, and it is the one moment on this
     card where a buyer most needs to be told the truth. */
  const pillText = registrationOpen
    ? leftTxt
    : auctionUpcoming
      ? "Registration closed"
      : "Auction closed";
  const href = hrefFor(x, "owner-auction");
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
        <span
          className={
            "pc-deadline" + (soon ? " is-soon" : "") + (!registrationOpen ? " is-closed" : "")
          }
        >
          <ClockIcon />
          <span className="pc-when">
            <b className="pc-left">{pillText}</b>
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

          {/* ── AUCTION DETAILS — two facts, one row (Bryan's sheet, 9 Aug) ──────
              A consolidation, not a restyle. What used to be a tinted registration panel
              stacked on top of a separate date|time row is now ONE row of two cells:

                REGISTRATION CLOSES · 11 Dec 2026 · (125 days left)
                AUCTION             · 12 Dec 2026 · 9:00 AM MYT

              Three things fall out of that and all three are improvements:
              · The tinted box is gone. It was a container drawn around two facts that
                were already grouped by the kicker above them — a second grouping doing
                the first one's job. Without it the block also reclaims the 28px of panel
                padding, which is most of what pays for the larger type here.
              · Auction date and auction time stop being two cells. They are one event;
                the date leads and the time is its qualifier underneath.
              · The countdown stops being its own cell. "(125 days left)" belongs to the
                registration date it counts to, and reads as a parenthetical because that
                is exactly what it is.

              Colour does the pairing: RED calendar and RED label for the deadline you act
              on, BRASS gavel and BRASS label for the event itself.

              Still not a redesign of the locked E-Tender timeline (6 Aug) — different
              product, different component, different fact. */}
          <div className="pc-period apc-details">
            <span className="pc-period-kick">Auction details</span>
            <div className="apc-when">
              <span className="apc-fact apc-fact-reg">
                <span className="apc-fact-icon" aria-hidden="true">
                  <CalendarIcon />
                </span>
                <span className="apc-fact-text">
                  <span className="apc-fact-label">Registration closes</span>
                  <b>
                    {REGISTRATION_DATE.day} {REGISTRATION_DATE.month.slice(0, 3)}{" "}
                    {REGISTRATION_DATE.year}
                  </b>
                  {/* Terminal state kept here too: once registration shuts, a card still
                      counting days left to do something nobody can still do is the one
                      place it would actively mislead. */}
                  <span className="apc-fact-sub">
                    {registrationOpen ? (
                      <>
                        (<em>{d}</em> {d === 1 ? "day" : "days"} left)
                      </>
                    ) : (
                      "(closed)"
                    )}
                  </span>
                </span>
              </span>
              <span className="apc-fact apc-fact-auction">
                <span className="apc-fact-icon" aria-hidden="true">
                  <GavelIcon />
                </span>
                <span className="apc-fact-text">
                  {/* "Auction date", not "Auction" (Bryan, 9 Aug). It names the value it
                      sits directly above; the time below is that date's qualifier, the
                      same shape as the left cell's "(125 days left)". */}
                  <span className="apc-fact-label">Auction date</span>
                  <b>{fmtDate(OWNER_AUCTION.date)}</b>
                  <span className="apc-fact-sub">{AUCTION_TIME_LABEL}</span>
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="pc-rail">
          {/* ── THE AUCTION COMPANY, where the tender card carries the listing agent ──
              Bryan, 7 Aug — it replaced a named "Licensed Auctioneer" with a licence
              number, which was the one genuinely unsafe thing on this card: an
              individual's auctioneer licence is a regulated credential and there was no
              real one to print. A company identity has none of that problem and every
              value here is real — `966357-V` is the SSM number already live on the
              detail page, and the logo is the shipped asset.

              The kicker sits OUTSIDE `.pc-foot` because `.pc-foot` is the row, and
              /tender's list-mode grid keys off that exact class. Wrapping it instead of
              restructuring it keeps list view working on this page. */}
          <div className="apc-co">
            <span className="apc-co-kick">{AUCTION_COMPANY.kicker}</span>
            <div className="pc-foot apc-foot">
              {/* Decorative: the company name sits right beside it in text, so an alt
                  string here would make a screen reader say it twice. */}
              <img className="apc-co-logo" src={LOGO} alt="" loading="lazy" />
              <span className="pc-agent apc-agent">
                <b>{AUCTION_COMPANY.name}</b>
                <span>({AUCTION_COMPANY.ssmNo})</span>
              </span>
              <a className="pc-tel apc-co-tel" href={AUCTION_COMPANY.phoneHref}>
                <PhoneIcon />
                <span>{AUCTION_COMPANY.phone}</span>
              </a>
            </div>
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
