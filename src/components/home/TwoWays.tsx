import { WestMalaysiaMap } from "@/components/home/WestMalaysiaMap";

/* ── SECTION 2 — TWO WAYS TO BUY, ANYWHERE IN MALAYSIA ────────────────────────
   A SHOWCASE, not a tool. Bryan, 13 Aug: this section is cinematic only — it
   must not read as live inventory and nothing in it is clickable. Its whole job
   is to land one idea: the property you want can be bought by sealed E-Tender
   or at a live Owner Auction, and this happens across the country.

   The right side is intentionally at phase one: the West Malaysia plate only.
   Cards, markers, labels and a Klang Valley overlay come later, after the map's
   geography, material and camera are approved. */

function SealIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="m3 5 9 7.2L21 5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="14.4" r="2" fill="currentColor" />
    </svg>
  );
}

function GavelIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15">
      <path
        d="m14 13-7.5 7.5a2.12 2.12 0 0 1-3-3L11 10M16 16l6-6M8 8l6-6M9 7l8 8M21 11l-8-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function TwoWays() {
  return (
    <section className="tw" id="how-it-works" aria-labelledby="tw-title">
      <div className="tw-inner">
        <div className="tw-copy">
          <p className="tw-kicker">Two ways to buy &middot; Dua Cara</p>
          {/* Two lines, not four. The map is the proof now, so the headline no
              longer narrates it. "the same house can be bought two ways" also
              implied one property runs BOTH routes, which is not the case —
              different properties, different places, two ways to buy.

              "Across Malaysia", not "Peninsular": the proposition is national
              and the listing data carries every state including Sabah and
              Sarawak. The illustration showing the peninsula is a drawing
              decision, not the limit of the offer. */}
          <h2 id="tw-title">
            Across <span className="tw-flag">Malaysia</span>, two ways to buy.
          </h2>
          <p className="tw-deck">
            Discover Malaysian subsale properties offered through private E-Tender or live Owner
            Auction &mdash; each with its own price, place and closing date.
          </p>

          {/* A REMINDER, not an explainer. Section 1 already taught both routes
              in full; repeating that here was redundant, and two bordered
              boxes on the left fighting three property cards on the right made
              the section read as a dashboard. No boxes, no borders, no fills —
              just the term and what it means. */}
          <dl className="tw-routes">
            <div className="tw-route">
              <dt>
                <SealIcon />
                E-Tender
              </dt>
              <dd>Private sealed offers</dd>
            </div>
            <div className="tw-route">
              <dt>
                <GavelIcon />
                Owner Auction
              </dt>
              <dd>Live online bidding</dd>
            </div>
          </dl>

          <p className="tw-note">
            Illustration only. View current properties on the E-Tender and Owner Auction pages.
          </p>
        </div>

        {/* MAP ONLY. No cards, pins, labels or live data in this phase. */}
        <div className="tw-scene" aria-hidden="true">
          <WestMalaysiaMap finish="limestone" />
        </div>
      </div>
    </section>
  );
}
