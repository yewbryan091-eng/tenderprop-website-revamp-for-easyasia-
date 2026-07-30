import type { Tender } from "@/data/tenders";
import { AGENT_PHOTO, PROJECT_IMG } from "@/lib/images";
import { ClockIcon, HeartIcon, PhoneIcon, PinIcon } from "./icons";
import { areaSlot, daysLeft, depositOf, displayType, fmtDate, fmtPrice, hrefFor, tenderId, tenderStartOf } from "@/lib/tender-utils";

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
  /* Three fixed slots on every card, in this order, no exceptions: when the shape
     changes card to card there is nothing to compare across a batch. Missing values
     render as an em dash rather than collapsing the row. */
  const rows = [
    { label: "E-Tender start", value: tenderStartOf(x) },
    areaSlot(x),
    { label: "Tenure", value: x.tenure || "\u2014" },
  ];
  const typeLabel = displayType(x);
  const hasPropertyType = Boolean(typeLabel);
  const propertyType = hasPropertyType ? typeLabel : "Not specified";

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
            <span>{closeParts.date} · <b className="pc-left">{closeParts.left}</b></span>
          ) : (
            <span>{dlTxt}</span>
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
          <div className={"pc-type" + (hasPropertyType ? "" : " is-missing")}>
            <span className="pc-type-label">Property type</span>
            <strong className="pc-type-value">{propertyType}</strong>
          </div>
          {rows.length > 0 && (
            <dl className="pc-details">
              {rows.map((r) => (
                <div className="pc-detail" key={r.label}>
                  <dt>{r.label}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="pc-side">
          <div className="pc-money">
            <div className="pc-reserve">
              <span className="pc-money-label">Reserve price</span>
              <strong className="pc-money-value">{fmtPrice(x.reservePrice)}</strong>
            </div>
            <div className="pc-deposit">
              <span className="pc-money-label">Refundable deposit</span>
              <span className="pc-deposit-value">{depositOf(x)}</span>
            </div>
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
