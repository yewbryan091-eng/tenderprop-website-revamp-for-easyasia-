/* Section 3 is intentionally a compact business overview, not another process
   explainer. The approved order inside every card is fixed:
   information -> full-width image. */

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
  badge?: string;
  chips: string[];
  imageBase: string;
  imageWidths: readonly number[];
  imageFallback: string;
};

const OFFERS: Offer[] = [
  {
    key: "buy",
    number: "01",
    label: "Buying a Property",
    title: "Find your next property.",
    description:
      "Discover properties and choose how you want to make your offer through TenderProp.",
    chips: ["E-Tender", "Owner Auction"],
    imageBase: "/assets/layout/home-offer-buy",
    imageWidths: CARD_IMAGE_WIDTHS,
    imageFallback: "/assets/layout/home-offer-buy-760.jpg",
  },
  {
    key: "sell",
    number: "02",
    label: "Selling a Property",
    title: "Bring your property to market.",
    description:
      "Sell with professional marketing, valuation guidance and a selling method suited to your property.",
    badge: "Fully subsidised valuation report",
    chips: ["E-Tender", "Owner Auction"],
    imageBase: "/assets/layout/home-offer-sell",
    imageWidths: CARD_IMAGE_WIDTHS,
    imageFallback: "/assets/layout/home-offer-sell-760.jpg",
  },
  {
    key: "services",
    number: "03",
    label: "One-Stop Property Solution",
    title: "Everything around your property, in one place.",
    description:
      "Investment, legal, loan, renovation and agent services — all connected through TenderProp.",
    chips: ["Investment", "Legal Matters", "Loan Matters", "Renovation", "Agent Services"],
    imageBase: "/assets/layout/home-journey-interior",
    imageWidths: INTRO_IMAGE_WIDTHS,
    imageFallback: "/assets/layout/home-journey-interior-1800.jpg",
  },
];

function OfferCard({ offer }: { offer: Offer }) {
  return (
    <article className={`jn-card jn-card--${offer.key}`}>
      <div className="jn-card-content">
        <span className="jn-card-number">{offer.number}</span>
        <span className="jn-card-label">{offer.label}</span>
        <h3>{offer.title}</h3>
        <p className="jn-card-description">{offer.description}</p>

        <div className="jn-card-meta">
          {offer.badge ? <span className="jn-card-badge">{offer.badge}</span> : null}
          <ul className="jn-card-chips" aria-label={`${offer.label} options`}>
            {offer.chips.map((chip) => (
              <li key={chip}>
                <span className="jn-chip-mark" aria-hidden="true" />
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <figure className="jn-card-media">
        <picture>
          <source
            type="image/avif"
            sizes="(max-width: 619px) calc(100vw - 56px), (max-width: 979px) 44vw, 28vw"
            srcSet={imageSrcSet(offer.imageBase, offer.imageWidths, "avif")}
          />
          <source
            type="image/webp"
            sizes="(max-width: 619px) calc(100vw - 56px), (max-width: 979px) 44vw, 28vw"
            srcSet={imageSrcSet(offer.imageBase, offer.imageWidths, "webp")}
          />
          <img
            src={offer.imageFallback}
            width={offer.key === "services" ? 1800 : 760}
            height={offer.key === "services" ? 1200 : 475}
            alt=""
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
