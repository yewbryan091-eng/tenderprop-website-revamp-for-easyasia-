import type { Tender } from "@/data/tenders";
import { AGENT_PHOTO, PROJECT_IMG } from "@/lib/images";
import { ArrowRightIcon, BuildingIcon, CalendarIcon, ClockIcon, HeartIcon, PhoneIcon, PinIcon } from "./icons";
import { daysLeft, displayType, fmtDate, fmtPrice, hrefFor, tenderId } from "@/lib/tender-utils";

/* The photo pill is the card's ONLY date. It carries the year because listings
   span 2026-2028, so "12 Dec" alone would be ambiguous. Never hardcoded. */

/* One semantic tender-notice card. Grid mode stacks it; list mode splits it into
   media / identity / decision details — same render path, driven by the
   container class on .props-grid. */
export function PropertyCard({
  x, saved, onToggleSave,
}: {
  x: Tender;
  saved: boolean;
  onToggleSave: (id: string) => void;
}) {
  const id = tenderId(x);
  const d = daysLeft(x.closingDate);
  const soon = d > 0 && d <= 14;
  const dlTxt =
    d <= 0 ? "E-Tender closed" : `Closes ${fmtDate(x.closingDate)} · ${d} ${d === 1 ? "day" : "days"} left`;
  /* Split so the countdown can carry the accent on its own. The date stays neutral;
     only the time pressure is coloured — two accents in one pill would compete. */
  const closeParts =
    d <= 0 ? null : { date: `Closes ${fmtDate(x.closingDate)}`, left: `${d} ${d === 1 ? "day" : "days"} left` };
  const href = hrefFor(x);
  /* Start date leads the row: with the closing date in the photo pill, "Tender
     start" answers the other half of the window without duplicating the close. */
  /* CARD DIET — Bryan's father, 4 Aug: "one eye see all… information overload… font
     needs to be big… position as the reader, what the reader wants."

     Measured before: 24 pieces of text, 581px tall, smallest font 10px, EIGHT elements
     under 12px. The two sites he pointed at carry 7 (AuctionPro) and 10 (OwnerAuction).
     We were at 2.5-3x.

     Six of those 24 were LABELS — words naming other words, every one at 10px and STACKED
     above its value, so each cost a whole line. That is what was killing the space: not
     the words, the STACK. His test, sharpened: if a value cannot stand alone, either it
     does not belong on the card, or it is the one thing worth labelling.
       Condominium  stands alone            -> label killed
       Freehold     stands alone            -> label killed
       999 sqft     does NOT say WHICH area -> keeps a lowercase INLINE label, which costs
                                               no vertical space (OwnerAuction labels these too)
       12 Sep 2026  "E-Tender start" — a browser cares when it CLOSES, and two dates on one
                    card is one too many    -> whole row cut
       RM15,930     "Refundable deposit" — derived from the reserve and a detail-page fact,
                    not a browse decision   -> whole row cut
       RM531,000    could read as an asking price -> THE ONE LABEL THAT SURVIVES

     The agent block STAYS (Bryan, explicitly): a direct lead route needing no click-through,
     and how every Malaysian portal does it. */
  const typeLabel = displayType(x);
  /* Type only — tenure dropped, then built-up and land area dropped too (Bryan, 4 Aug).
     Size is a DECIDING fact, not a browsing one: nobody picks which card to open on square
     feet, they pick on what it is, where, what it costs and how long is left. It still lives
     on the detail spec sheet and, more importantly, in the grid's size FILTERS — which is the
     right home for it, because that is where a buyer actually acts on size. */
  const identity = typeLabel || "";

  return (
    <article className="prop-card" data-demo={x.demo ? "1" : undefined} data-id={id}>
      <div className="pc-media">
        <span className="pc-media-link">
          <img src={PROJECT_IMG(x.image)} alt={`${x.name} — ${x.area}, ${x.stateName}`} loading="lazy" />
        </span>
        <div className="pc-tags">
          <span className="pc-status">E-Tender</span>
          {x.demo && (
            <span className="demo-badge" title="Fabricated sample record — not real inventory">DEMO</span>
          )}
        </div>
        <button
          type="button"
          className={"save-btn" + (saved ? " saved" : "")}
          aria-label="Save to shortlist"
          aria-pressed={saved}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSave(id); }}
        >
          <HeartIcon />
        </button>
        <span className={"pc-deadline" + (soon ? " is-soon" : "") + (d <= 0 ? " is-closed" : "")}>
          <ClockIcon />
          {closeParts ? (
            <span className="pc-when">
              <b className="pc-left">{closeParts.left}</b>
            </span>
          ) : (
            <span className="pc-when"><b className="pc-left">{dlTxt}</b></span>
          )}
        </span>
      </div>

      <div className="pc-body">
        {/* Bryan found a reference card on 4 Aug and asked for it duplicated. Its idea: every
            fact gets a thin line ICON instead of an uppercase label, and hairline rules divide
            the card into four bands. That is what lets the labels go without the facts becoming
            ambiguous — the icon does the naming the label used to do, at zero vertical cost.
            Only the reserve price keeps a worded label, because a bare number could read as an
            asking price. */}
        <div className="pc-ident">
          <h3 className="pc-title"><a className="pc-link" href={href}>{x.name}</a></h3>
          <p className="pc-loc"><PinIcon /><span>{x.area}, {x.stateName}</span></p>
        </div>

        {/* BAND 1 — what it is. One cell now that the areas are gone (Bryan). */}
        <div className="pc-specs">
          <span className="pc-spec pc-spec-type"><BuildingIcon /><span>{identity}</span></span>
        </div>

        {/* BAND 2 — the decision: what it costs, and how long is left to act. */}
        <div className="pc-deal">
          <div className="pc-money">
            <span className="pc-money-label">Reserve price</span>
            <strong className="pc-money-value">{fmtPrice(x.reservePrice)}</strong>
          </div>
          {/* MIRRORS the money cell: small uppercase label, then the value, then a muted
              qualifier. "Closes" is a LABEL, not part of the value — inline it cost 48px of the
              value line and pushed the price into this cell's hairline on every listing over
              RM1m, which is 22 of our 36. As a label it costs nothing, because the label line
              was empty anyway.

              The day count does run twice (the photo pill carries it at 16.5px) and that is
              deliberate: the pill is the GLANCE cue you read off the image while scrolling,
              this is the same fact anchored to the price, where the decision gets made. */}
          <div className="pc-close">
            <CalendarIcon />
            <span className="pc-close-txt">
              <span className="pc-close-label">{d <= 0 ? "E-Tender" : "Closes"}</span>
              <b>{d <= 0 ? "Closed" : fmtDate(x.closingDate)}</b>
              {closeParts && <span className="pc-close-left">{closeParts.left}</span>}
            </span>
          </div>
        </div>

        {/* BAND 3 — who to call. */}
        <div className="pc-foot">
          <img className="pc-avatar" src={AGENT_PHOTO} alt="Stephen Yew, listing agent" loading="lazy" />
          <span className="pc-agent"><b>Stephen Yew</b><span>REN 123456</span></span>
          <a className="pc-tel" href="tel:+60123938255"><PhoneIcon /><span>012-393 8255</span></a>
        </div>

        {/* Filled, not outlined — in the reference this is the card's one solid block, and it
            anchors the bottom the way the photo anchors the top. */}
        <span className="pc-cta" aria-hidden="true">View e-tender details<ArrowRightIcon /></span>
      </div>
    </article>
  );
}
