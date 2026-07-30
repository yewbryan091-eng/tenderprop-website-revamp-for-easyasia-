import type { Tender } from "@/data/tenders";
import { AGENT_PHOTO, PROJECT_IMG } from "@/lib/images";
import { ClockIcon, HeartIcon, PinIcon } from "./icons";
import { daysLeft, depositOf, displayType, fmtDate, fmtPrice, hrefFor, tenderId, tenderStartOf } from "@/lib/tender-utils";

/* The photo pill is the card's ONLY date. It carries the year because listings
   span 2026-2028, so "12 Dec" alone would be ambiguous. Never hardcoded. */

/* Which two physical facts actually mean something for this property type.
   Land area is not "unknown" for a condo — it does not exist — so it is omitted
   rather than shown as a dash. Tenure fills the slot; it matters in Malaysia. */
const STRATA = ["Condominium", "Apartment", "Serviced Residence", "Flat", "SOHO"];
function detailRows(x: Tender) {
  const order: [string, string][] =
    x.propertyCategory === "land"
      ? [["Land area", x.landArea], ["Tenure", x.tenure], ["Built-up", x.builtUp]]
      : STRATA.includes(x.propertyType)
        ? [["Built-up", x.builtUp], ["Tenure", x.tenure], ["Land area", x.landArea]]
        : [["Land area", x.landArea], ["Built-up", x.builtUp], ["Tenure", x.tenure]];
  return order.filter(([, v]) => Boolean(v)).slice(0, 2).map(([label, value]) => ({ label, value }));
}

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
    d <= 0 ? "Tender closed" : `Closes ${fmtDate(x.closingDate)} · ${d} ${d === 1 ? "day" : "days"}`;
  const href = hrefFor(x);
  /* Start date leads the row: with the closing date in the photo pill, "Tender
     start" answers the other half of the window without duplicating the close. */
  const rows = [{ label: "Tender start", value: tenderStartOf(x) }, ...detailRows(x)];
  const typeLabel = displayType(x);
  const hasPropertyType = Boolean(typeLabel);
  const propertyType = hasPropertyType ? typeLabel : "Not specified";

  return (
    <article className="prop-card" data-demo={x.demo ? "1" : undefined} data-id={id}>
      <div className="pc-media">
        <a className="pc-media-link" href={href} tabIndex={-1} aria-hidden="true">
          <img src={PROJECT_IMG(x.image)} alt={`${x.name} — ${x.area}, ${x.stateName}`} loading="lazy" />
        </a>
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
          <span>{dlTxt}</span>
        </span>
      </div>

      <div className="pc-body">
        <div className="pc-ident">
          <h3 className="pc-title"><a href={href}>{x.name}</a></h3>
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
            <a className="pc-tel" href="tel:+60123938255">012-393 8255</a>
          </div>
          <a className="pc-cta" href={href}>View tender details</a>
        </div>
      </div>
    </article>
  );
}
