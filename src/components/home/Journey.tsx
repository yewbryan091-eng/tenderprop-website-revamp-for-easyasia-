/* Section 3 is intentionally a compact business overview, not another process
   explainer. The approved order inside every card is fixed:
   number -> label -> heading -> description -> actions -> full-width image.

   The NUMBER leads, on the label's own line: "01 — Buying a Property"
   (Bryan, 16 Aug). It was 16px sans stacked above the label at the same
   weight, so the three cards had no visible ordering at all; as one marker
   line the sequence reads instantly and costs a row of height.

   Card 01 is the first to get actions. The section used to be a dead end:
   three descriptions of what TenderProp offers and no way to reach any of it.
   Its two method chips became those actions, which also clears a collision —
   chips meant METHODS on cards 01/02 but SERVICES on card 03, one shape doing
   two jobs across a single row. Cards 02 and 03 follow in their own pass. */

import { Link } from "@tanstack/react-router";

const INTRO_IMAGE_WIDTHS = [1200, 1800, 2400, 3200] as const;
const CARD_IMAGE_WIDTHS = [480, 760, 1140] as const;

const imageSrcSet = (base: string, widths: readonly number[], ext: "avif" | "webp") =>
  widths.map((width) => `${base}-${width}.${ext} ${width}w`).join(", ");

type Offer = {
  key: "buy" | "sell" | "services";
  number: string;
  label: string;
  title: string;
  description: string;
  /* What this offer INCLUDES — rendered as a ticked checklist. Same zone on
     every card, sized by the services card's five-item catalogue, so the
     row's CTAs and photos stay on shared baselines. */
  includes: string[];
  /* The sell card's headline giveaway, rendered as the gold highlight box. */
  highlight?: string;
  actions: { label: string; to: string; tone?: "gold" | "red" | "blue" }[];
  imageBase: string;
  imageAlt: string;
};

const OFFERS: Offer[] = [
  {
    key: "buy",
    number: "01",
    label: "Buying a Property",
    title: "Find your next property online.",
    description:
      "Discover subsale properties across Malaysia and choose how you want to make your offer.",
    includes: [
      "Private sealed offers",
      "Live open bidding",
      "See how E-Tender & Owner Auction work",
    ],
    actions: [
      { label: "View E-Tender", to: "/tender" },
      { label: "View Owner Auction", to: "/owner-auction", tone: "gold" },
    ],
    imageBase: "/assets/layout/home-offer-buy",
    imageAlt: "Rows of terrace homes in a Malaysian neighbourhood",
  },
  {
    key: "sell",
    number: "02",
    label: "Selling a Property",
    title: "Bring your property to market.",
    description:
      "Sell with professional marketing, valuation guidance and a selling method suited to your property.",
    highlight: "Fully subsidised valuation report",
    includes: ["Professional marketing & valuation guidance"],
    actions: [{ label: "Check Your Property Value Online", to: "/sell", tone: "red" }],
    imageBase: "/assets/layout/home-offer-sell",
    imageAlt: "Modern Malaysian bungalow lit at dusk",
  },
  {
    key: "services",
    number: "03",
    label: "One-Stop Property Solution",
    title: "Everything around your property, in one place.",
    description:
      "From financing to renovation, TenderProp connects every service your property needs.",
    includes: ["Investment", "Legal Matters", "Loan Matters", "Renovation", "Agent Services"],
    actions: [{ label: "Check Our Services", to: "/services", tone: "blue" }],
    imageBase: "/assets/layout/home-offer-services",
    imageAlt: "House keys handed over inside a new home",
  },
];

function OfferCard({ offer }: { offer: Offer }) {
  return (
    <article className={`jn-card jn-card--${offer.key}`}>
      <div className="jn-card-content">
        <p className="jn-card-eyebrow">
          <span className="jn-card-number">{offer.number}</span>
          <span className="jn-card-dash" aria-hidden="true" />
          <span className="jn-card-label">{offer.label}</span>
        </p>
        <h3>{offer.title}</h3>
        <p className="jn-card-description">{offer.description}</p>
        <div className="jn-card-zone">
          {offer.highlight ? <p className="jn-card-highlight">{offer.highlight}</p> : null}
          <ul className="jn-card-includes" aria-label={`${offer.label} — included`}>
            {offer.includes.map((item) => (
              <li key={item}>
                <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                  <path
                    d="M2.2 6.4 4.9 9 9.8 3.2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="jn-card-actions">
          {offer.actions.map((action) => (
            <Link
              key={action.to}
              className={`jn-cta${action.tone ? ` jn-cta--${action.tone}` : ""}`}
              to={action.to}
            >
              <span>{action.label}</span>
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                <path
                  d="M2.5 8h10M9 4.5 12.5 8 9 11.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      <figure className="jn-card-media">
        <picture>
          <source
            type="image/avif"
            sizes="(max-width: 619px) calc(100vw - 56px), (max-width: 979px) 44vw, 28vw"
            srcSet={imageSrcSet(offer.imageBase, CARD_IMAGE_WIDTHS, "avif")}
          />
          <source
            type="image/webp"
            sizes="(max-width: 619px) calc(100vw - 56px), (max-width: 979px) 44vw, 28vw"
            srcSet={imageSrcSet(offer.imageBase, CARD_IMAGE_WIDTHS, "webp")}
          />
          <img
            src={`${offer.imageBase}-760.jpg`}
            width={760}
            height={475}
            alt={offer.imageAlt}
            loading="lazy"
            decoding="async"
          />
        </picture>
      </figure>
    </article>
  );
}

export function Journey() {
  return (
    <section className="jn" id="beyond" aria-labelledby="jn-title">
      <div className="jn-inner">
        <div className="jn-stage">
          <div className="jn-visual" aria-hidden="true">
            <div className="jn-visual-clip">
              <picture>
                <source
                  type="image/avif"
                  sizes="(max-width: 1023px) 122vw, 116vw"
                  srcSet={imageSrcSet(
                    "/assets/layout/home-journey-interior",
                    INTRO_IMAGE_WIDTHS,
                    "avif",
                  )}
                />
                <source
                  type="image/webp"
                  sizes="(max-width: 1023px) 122vw, 116vw"
                  srcSet={imageSrcSet(
                    "/assets/layout/home-journey-interior",
                    INTRO_IMAGE_WIDTHS,
                    "webp",
                  )}
                />
                <img
                  className="jn-visual-img"
                  src="/assets/layout/home-journey-interior-1800.jpg"
                  width={1800}
                  height={1200}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <span className="jn-visual-wash" />
            </div>
            <svg className="jn-visual-edge" viewBox="0 0 1000 1000" preserveAspectRatio="none">
              <path d="M0 0 L1000 1000" />
              <path className="jn-edge-ghost" d="M30 60 L940 970" />
            </svg>
          </div>

          <div className="jn-head">
            <p className="jn-kicker">What we offer</p>
            <h2 id="jn-title">
              <span className="jn-h2-line">One place for</span>{" "}
              <span className="jn-h2-line">whatever comes next.</span>
            </h2>
            <p className="jn-lede">
              Buy, sell and access the services around your property &mdash; all through TenderProp.
            </p>
          </div>
        </div>

        <div className="jn-cards">
          {OFFERS.map((offer) => (
            <OfferCard key={offer.key} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  );
}
