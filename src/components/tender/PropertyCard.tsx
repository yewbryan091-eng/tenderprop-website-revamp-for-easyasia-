import type { Tender } from "@/data/tenders";
import { AGENT_PHOTO, PROJECT_IMG } from "@/lib/images";
import { ClockIcon, HeartIcon, PhoneIcon, PinIcon } from "./icons";
import { daysLeft, displayType, fmtDate, fmtPrice, hrefFor, tenderId, tenderWindow } from "@/lib/tender-utils";

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
  /* Type and tenure share ONE line, no headings — two facts, zero scaffolding. */
  const identity = [typeLabel || null, x.tenure || null].filter(Boolean).join(" \u00b7 ");
  /* BOTH areas when both exist, which is what his key-information list asks for. The old
     card showed only one, picked by property type via areaSlot(). */
  const areas = [
    x.builtUp ? `Built-up ${x.builtUp}` : null,
    x.landArea ? `Land ${x.landArea}` : null,
  ].filter(Boolean).join(" \u00b7 ");

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
        <div className="pc-ident">
          {/* The card's single link. `.pc-title a::after` stretches it over the whole
              card, so the entire surface is clickable while the accessibility tree sees
              one link instead of the same URL announced three times (photo, title, CTA). */}
          <h3 className="pc-title"><a className="pc-link" href={href}>{x.name}</a></h3>
          <p className="pc-loc"><PinIcon /><span>{x.area}, {x.stateName}</span></p>
          {identity && <p className="pc-facts">{identity}</p>}
          {areas && <p className="pc-areas">{areas}</p>}
          {/* Both dates, as ONE line. The pill answers "how urgent"; this answers "when
              exactly" — different jobs, so there is no duplication between them. It replaces
              a stacked "E-TENDER START" row plus a date inside the pill: three lines' worth
              of card for one. */}
          <p className="pc-window">Tender period {tenderWindow(x)}</p>
        </div>

        <div className="pc-side">
          <div className="pc-money">
            <span className="pc-money-label">Reserve price</span>
            <strong className="pc-money-value">{fmtPrice(x.reservePrice)}</strong>
          </div>
          <div className="pc-foot">
            <img className="pc-avatar" src={AGENT_PHOTO} alt="Stephen Yew, listing agent" loading="lazy" />
            <span className="pc-agent"><b>Stephen Yew</b><span>REN 123456</span></span>
            <a className="pc-tel" href="tel:+60123938255"><PhoneIcon /><span>012-393 8255</span></a>
          </div>
          <span className="pc-cta" aria-hidden="true">View e-tender details</span>
        </div>
      </div>
    </article>
  );
}
