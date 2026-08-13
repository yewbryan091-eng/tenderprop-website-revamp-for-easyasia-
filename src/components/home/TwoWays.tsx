import { useLayoutEffect, useRef } from "react";

import { CITIES, MAP_ASPECT, malaysiaDots, projectMap } from "@/data/malaysia";

/* ── SECTION 2 — TWO WAYS TO BUY, ANYWHERE IN MALAYSIA ────────────────────────
   A SHOWCASE, not a tool. Bryan, 13 Aug: this section is cinematic only — it
   must not read as live inventory and nothing in it is clickable. Its whole job
   is to land one idea: the property you want can be bought by sealed E-Tender
   or at a live Owner Auction, and this happens across the country.

   So the cards here are STAGED — the grammar of the iNewProject unit-card
   section: a scene with annotations floating off it, a leader line to the thing
   they describe, and a footnote saying plainly that they illustrate rather than
   list. No listing names, no addresses, no reserve prices lifted from the data:
   a mock that quoted a real house would read as inventory, which is exactly
   what this section must not do. The live market lives on /tender and
   /owner-auction, and the fold above already routes there. */

const DOTS = malaysiaDots();

/* The two annotated places. Deliberately far apart — one on the peninsula, one
   across the South China Sea — because the claim being made is "across
   Malaysia", and the eye should have to travel to read both. */
const TENDER_AT = projectMap(CITIES["Shah Alam"]);
const AUCTION_AT = projectMap(CITIES["Kota Kinabalu"]);

/* Quiet markers with no card attached: the country is not two properties. */
const AMBIENT = ["George Town", "Ipoh", "Kuantan", "Melaka", "Johor Bahru", "Kuching"].map(
  (name) => ({ name, ...projectMap(CITIES[name]) }),
);

/* ── WHERE THE CARDS SIT, AND WHY ─────────────────────────────────────────────
   Positions are percentages of the plane, kept here rather than in CSS so a
   card and the leader line that reaches it cannot drift apart. Chosen by
   counting how many land dots each candidate covers, not by eye: the first
   attempt parked the E-Tender card over the peninsula and hid 195 dots — 41% of
   Peninsular Malaysia — in a section headlined "From Perlis to Sabah".

   The E-Tender card now floats in the South China Sea gap between the peninsula
   and Borneo, which covers nothing at all; the Owner Auction card sits low and
   right, clipping ~5% of southern Sarawak, which a card floating over the scene
   is entitled to do. `lead` is where the dashed line meets each card. */
const TENDER_CARD = { left: 25, top: 3, lead: { x: 27, y: 46 } };
const AUCTION_CARD = { left: 68.5, top: 58.7, lead: { x: 82, y: 60 } };

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
  const ref = useRef<HTMLElement | null>(null);

  /* ── ARM, DON'T REVEAL ───────────────────────────────────────────────────────
     The scene rests fully drawn; JS hides it ready to animate and then releases
     it on approach. The inverse — hiding by default and revealing on scroll —
     ships a blank section whenever the reveal never arrives, and it does not
     arrive in two cases that matter here: the external CMS lifting rendered
     HTML with no React behind it, and a hidden or throttled tab, where both
     IntersectionObserver and React's scheduler stall (observed, not theorised).
     So the class goes on through the DOM, needing no scheduler, and any one of
     observer / scroll listener / failsafe is enough to release it. */
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const near = () => el.getBoundingClientRect().top < window.innerHeight * 0.82;
    if (near()) return;

    el.classList.add("is-armed");

    let done = false;
    const disarm = () => {
      if (done) return;
      done = true;
      el.classList.remove("is-armed");
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    const onScroll = () => near() && disarm();

    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && disarm(), {
            threshold: 0.15,
          })
        : null;
    io?.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const failsafe = window.setTimeout(disarm, 10000);

    return () => {
      window.clearTimeout(failsafe);
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="tw" id="how-it-works" ref={ref} aria-labelledby="tw-title">
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

        {/* THE SCENE. Decorative in full: aria-hidden, no links, no controls —
            a picture of the country with two annotations resting on it. */}
        <div className="tw-scene" aria-hidden="true">
          <div className="tw-plane">
            {/* The viewBox is the projection's own 0–100 square and the PLANE carries
                the country's true proportions (20.8° by 8.2°, matching MAP_BOUNDS),
                so stretching to fit distorts nothing. If either is ever changed
                alone, Malaysia stretches. */}
            <svg
              className="tw-map"
              viewBox={`0 0 ${100 * MAP_ASPECT} 100`}
              preserveAspectRatio="none"
            >
              <g className="tw-land">
                {DOTS.map((d, i) => (
                  <circle key={i} cx={d.x * MAP_ASPECT} cy={d.y} r="0.62" />
                ))}
              </g>
              {/* Leader lines run from each marker out to its card's edge. */}
              <g className="tw-leaders">
                <path
                  d={`M${TENDER_AT.x * MAP_ASPECT} ${TENDER_AT.y} L ${TENDER_CARD.lead.x * MAP_ASPECT} ${TENDER_CARD.lead.y}`}
                />
                <path
                  d={`M${AUCTION_AT.x * MAP_ASPECT} ${AUCTION_AT.y} L ${AUCTION_CARD.lead.x * MAP_ASPECT} ${AUCTION_CARD.lead.y}`}
                />
              </g>
            </svg>

            {AMBIENT.map((a) => (
              <span
                key={a.name}
                className="tw-ambient"
                style={{ left: `${a.x}%`, top: `${a.y}%` }}
              />
            ))}

            <span
              className="tw-marker tw-marker-tender"
              style={{ left: `${TENDER_AT.x}%`, top: `${TENDER_AT.y}%` }}
            />
            <span
              className="tw-marker tw-marker-auction"
              style={{ left: `${AUCTION_AT.x}%`, top: `${AUCTION_AT.y}%` }}
            />

            <figure
              className="tw-card tw-card-tender"
              style={
                {
                  "--l": `${TENDER_CARD.left}%`,
                  "--t": `${TENDER_CARD.top}%`,
                } as React.CSSProperties
              }
            >
              <figcaption>
                <SealIcon />
                Open for E-Tender
              </figcaption>
              <p className="tw-card-what">Sealed offers, one closing date</p>
              <p className="tw-card-line">Selangor</p>
            </figure>

            <figure
              className="tw-card tw-card-auction"
              style={
                {
                  "--l": `${AUCTION_CARD.left}%`,
                  "--t": `${AUCTION_CARD.top}%`,
                } as React.CSSProperties
              }
            >
              <figcaption>
                <GavelIcon />
                Owner Auction
              </figcaption>
              <p className="tw-card-what">Live bidding on auction day</p>
              <p className="tw-card-line">Sabah</p>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
