import type { Tender } from "@/data/tenders";
import { AGENT_PHOTO, PROJECT_IMG } from "@/lib/images";
import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  HeartIcon,
  HomeIcon,
  PhoneIcon,
  PinIcon,
  RulerIcon,
} from "./icons";
import {
  areaSlot,
  daysLeft,
  displayType,
  fmtDate,
  fmtPrice,
  hrefFor,
  tenderId,
  tenderStartOf,
} from "@/lib/tender-utils";

/* ── CARD REBUILT TO BRYAN'S BUYER-POV REFERENCE, 6 Aug 2026 ──────────────────
   His annotated sheet fixes the scan order: image → RESERVE PRICE (the strongest
   text on the card) → type · name → address → built-up → E-TENDER PERIOD
   (starts / closes, days left under the close) → agent → one solid maroon CTA.

   Two deliberate reversals of earlier rulings, both made BY the reference:
     · The reserve price returns to BURGUNDY (was moved to ink 4 Aug). The sheet
       renders it maroon and names it "most important info, large and high
       contrast" — and the card's other accents came off in the same pass, so the
       one-accent rule still holds: burgundy IS this card's accent.
     · Built-up returns (came off 4 Aug). The sheet lists it as scan item 4; it
       shows via areaSlot(), so a condo shows floor area and a bungalow shows land
       — the area a buyer is actually buying.

   The day count runs twice — the glass pill on the photo (the mid-scroll glance)
   and under CLOSES (anchored to the date, where the decision is made). Both are
   drawn explicitly in the reference: annotation 5 puts "days left under close
   date" while the Quick Scan Badge stays on the image. */
export function PropertyCard({
  x,
  saved,
  onToggleSave,
}: {
  x: Tender;
  saved: boolean;
  onToggleSave: (id: string) => void;
}) {
  const id = tenderId(x);
  const d = daysLeft(x.closingDate);
  const open = d > 0;
  const soon = open && d <= 14;
  const leftTxt = `${d} ${d === 1 ? "day" : "days"} left`;
  const href = hrefFor(x);
  const typeLabel = displayType(x);
  /* areaSlot picks WHICH area matters for this property form (floor for strata,
     land for landed) — the same rule the detail page uses. The data writes
     "1,400 sqft"; the reference reads "1,604 sq ft". Display-only normalise. */
  const size = areaSlot(x);
  const sizeTxt = size.value === "—" ? null : size.value.replace(/sqft/i, "sq ft");
  /* Street address when the agency has supplied one (only Sinaran today),
     otherwise the honest fallback every record can fill. Never invented. */
  const where = x.address || `${x.area}, ${x.stateName}`;

  return (
    <article className="prop-card" data-demo={x.demo ? "1" : undefined} data-id={id}>
      <div className="pc-media">
        <span className="pc-media-link">
          <img
            src={PROJECT_IMG(x.image)}
            alt={`${x.name} — ${x.area}, ${x.stateName}`}
            loading="lazy"
          />
        </span>
        <div className="pc-tags">
          <span className="pc-status">E-Tender</span>
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
            <b className="pc-left">{open ? leftTxt : "E-Tender closed"}</b>
          </span>
        </span>
      </div>

      <div className="pc-body">
        {/* pc-main dissolves (display: contents) in grid mode and becomes the
            description COLUMN in list mode — which is why the price lives inside
            it: as a direct child of the body it sat beside the title in list
            mode's row, price and name colliding on one line. */}
        <div className="pc-main">
          {/* 2 — the price, before anything else. The one worded label survives
              because a bare RM531,000 could read as an asking price. */}
          <div className="pc-money">
            <span className="pc-money-label">Reserve price</span>
            <strong className="pc-money-value">{fmtPrice(x.reservePrice)}</strong>
          </div>

          {/* 3 — what and where. Type and name share one line, reference format:
              "Condominium · Siti Apartment". The title is still the card's ONE real
              link; its ::after stretches over the whole card. */}
          <h3 className="pc-title">
            <HomeIcon />
            <a className="pc-link" href={href}>
              {typeLabel ? `${typeLabel} · ` : ""}
              {x.name}
            </a>
          </h3>
          <p className="pc-loc">
            <PinIcon />
            <span>{where}</span>
          </p>
          {/* 4 — the size a buyer is buying. Absent value ⇒ no row, never a dash:
              absence removes a control, it does not add an apology. */}
          {sizeTxt && (
            <p className="pc-size">
              <RulerIcon />
              <span>{sizeTxt}</span>
            </p>
          )}

          {/* 5 — the window. Start date is the founder-approved demo derivation
              (closing − 3 months, tenderStartOf) until the backend supplies a real
              per-listing date. Days-left sits under the close, tied to the date. */}
          <div className="pc-period">
            <span className="pc-period-kick">E-Tender period</span>
            <div className="pc-period-grid">
              <span className="pc-date">
                <span className="pc-date-label">Starts</span>
                <b>
                  <CalendarIcon />
                  {tenderStartOf(x)}
                </b>
              </span>
              <span className="pc-date">
                <span className="pc-date-label">Closes</span>
                <b>
                  <CalendarIcon />
                  {fmtDate(x.closingDate)}
                </b>
                <span className="pc-date-left">{open ? leftTxt : "Closed"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 6 + 7 — agent, then the action. Wrapped so list mode can lift the pair
            into its own rail; display: contents everywhere else. */}
        <div className="pc-rail">
          <div className="pc-foot">
            <img
              className="pc-avatar"
              src={AGENT_PHOTO}
              alt="Stephen Yew, listing agent"
              loading="lazy"
            />
            <span className="pc-agent">
              <b>Stephen Yew</b>
              <span>REN 123456</span>
            </span>
            <a className="pc-tel" href="tel:+60123938255">
              <PhoneIcon />
              <span>012-393 8255</span>
            </a>
          </div>

          {/* Solid maroon, per the reference — the card's bottom anchor. Decorative:
              the stretched title link takes the click. */}
          <span className="pc-cta" aria-hidden="true">
            View E-Tender Details
            <ArrowRightIcon />
          </span>
        </div>
      </div>
    </article>
  );
}
