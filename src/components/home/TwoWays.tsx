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
          <p className="tw-kicker">Dua cara &middot; two ways to buy</p>
          <h2 id="tw-title">From Perlis to Sabah, the same house can be bought two ways.</h2>
          <p className="tw-deck">
            TenderProp opens Malaysian subsale property to sealed E-Tender and live Owner Auction.
            Same streets, same houses &mdash; a different way in.
          </p>

          <div className="tw-routes">
            <article className="tw-route">
              <h3>
                <SealIcon />
                E-Tender
              </h3>
              <p>
                Submit a sealed offer before the closing date. You name the price &mdash; even below
                the reserve.
              </p>
            </article>
            <article className="tw-route">
              <h3>
                <GavelIcon />
                Owner Auction
              </h3>
              <p>
                Bid live on auction day, in the open. The owner chose to sell this way &mdash; it is
                never a bank lelong.
              </p>
            </article>
          </div>

          <p className="tw-note">
            Illustration only. Live properties, reserve prices and closing dates are on the E-Tender
            and Owner Auction pages.
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
