import type { Tender } from "@/data/tenders";
import { AGENT_PHOTO, PROJECT_IMG } from "@/lib/images";
import {
  BathIcon, BedIcon, CarIcon, ClockIcon, HeartIcon, PinIcon,
} from "./icons";
import { daysLeft, depositOf, fmtDate, fmtPrice, hrefFor, tenderId } from "@/lib/tender-utils";

function Spec({ label, children, icon }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="pc-spec">
      <span className="sr-only">{label}</span>
      {icon}
      <span>{children}</span>
    </span>
  );
}

/* "12 Dec" — short form of the listing's own closing date. Never hardcoded. */
function shortDate(iso: string) {
  return fmtDate(iso).split(" ").slice(0, 2).join(" ");
}

/* One semantic tender-notice card. Grid mode stacks it; list mode splits it into
   media / identity / financial columns — same render path, driven by the
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
    d <= 0 ? "Tender closed" : `Closes ${shortDate(x.closingDate)} · ${d} ${d === 1 ? "day" : "days"}`;
  const href = hrefFor(x);

  const facts: { l: string; v: string }[] = [];
  if (x.propertyType) facts.push({ l: "Property type", v: x.propertyType });
  if (x.tenure) facts.push({ l: "Tenure", v: x.tenure });
  if (x.builtUp) facts.push({ l: "Built-up", v: x.builtUp });
  if (x.landArea) facts.push({ l: "Land area", v: x.landArea });

  const hasSpecs = Boolean(x.bedrooms || x.bathrooms || x.carParks);

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
          {hasSpecs && (
            <p className="pc-specs">
              {x.bedrooms ? <Spec label="Bedrooms" icon={<BedIcon />}>{x.bedrooms}</Spec> : null}
              {x.bathrooms ? <Spec label="Bathrooms" icon={<BathIcon />}>{x.bathrooms}</Spec> : null}
              {x.carParks ? <Spec label="Car parks" icon={<CarIcon />}>{x.carParks}</Spec> : null}
            </p>
          )}
          {facts.length > 0 && (
            <dl className="pc-facts">
              {facts.map((f) => (
                <div className="pc-fact" key={f.l}>
                  <dt>{f.l}</dt>
                  <dd>{f.v}</dd>
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
            <span className="pc-agent"><b>Stephen Yew</b><span>REN 00000</span></span>
            <a className="pc-tel" href="tel:+60123938255">012-393 8255</a>
          </div>
          <a className="pc-cta" href={href}>View tender details</a>
        </div>
      </div>
    </article>
  );
}
