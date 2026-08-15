import { useEffect, useRef } from "react";

import { WestMalaysiaMap } from "@/components/home/WestMalaysiaMap";

/* ── SECTION 2 — TWO WAYS TO BUY, ANYWHERE IN MALAYSIA ────────────────────────
   A SHOWCASE, not a tool. Bryan, 13 Aug: this section is cinematic only — it
   must not read as live inventory and nothing in it is clickable. Its whole job
   is to land one idea: the property you want can be bought by sealed E-Tender
   or at a live Owner Auction, and this happens across the country.

   The two illustrations are bespoke inline SVGs, drawn as editorial linework —
   thin ink outlines, cream paper fills, one wash of colour behind each — never
   raster art. They are inline (not <img>) so the entrance can move the flap,
   seal and gavel as separate parts. Every motion exists to explain the product:
   the flap closes and the padlock presses shut because an E-Tender is sealed; the gavel
   swings once because an Owner Auction is live. Nothing loops except the tiny
   LIVE dot. */

function EnvelopeArt() {
  return (
    <svg className="tw-ill" viewBox="0 0 160 130" aria-hidden="true">
      <path
        className="tw-ill-wash tw-ill-wash--tender"
        d="M30 60 C26 40 52 24 82 27 C108 29 140 38 137 60 C134 84 116 103 84 105 C56 107 34 86 30 60 Z"
      />
      <ellipse className="tw-ill-ground" cx="80" cy="112" rx="42" ry="4" />
      <g className="tw-envelope">
        <rect className="tw-env-body" x="30" y="42" width="100" height="64" rx="7" />
        <path className="tw-env-crease" d="M34 102 L80 71 M126 102 L80 71" />
        <path
          className="tw-env-flap"
          d="M31 45 C47 60 65 76 80 85 C95 76 113 60 129 45 L129 44 L31 44 Z"
        />
        {/* A PADLOCK, not a wax seal — Bryan: it should say "sealed" literally.
            Same centre (80,85) as the seal it replaces, so the press animation
            and its transform-origin carry over untouched. */}
        <g className="tw-env-lock">
          <path className="tw-env-lock-shackle" d="M76.4 84 v-3.4 a3.6 3.6 0 0 1 7.2 0 V84" />
          <rect
            className="tw-env-lock-body"
            x="73.2"
            y="83.6"
            width="13.6"
            height="11.4"
            rx="2.6"
          />
          <circle className="tw-env-lock-hole" cx="80" cy="88.2" r="1.5" />
          <path className="tw-env-lock-hole-stem" d="M80 89.4 v2.2" />
        </g>
      </g>
    </svg>
  );
}

function GavelArt() {
  return (
    <svg className="tw-ill" viewBox="0 0 160 130" aria-hidden="true">
      <path
        className="tw-ill-wash tw-ill-wash--auction"
        d="M32 68 C26 44 50 24 80 25 C110 26 138 44 135 70 C132 92 110 108 78 106 C50 104 38 90 32 68 Z"
      />
      <ellipse className="tw-ill-ground" cx="90" cy="113" rx="48" ry="4" />
      {/* +18% and nudged right/up so the gavel carries the same presence as the
          envelope — it was drawn smaller inside the same viewBox. The strike
          rotation still pivots correctly: `transform-box: view-box` resolves
          the origin in LOCAL viewBox units, which this wrapper scales whole. */}
      <g className="tw-gavel-scene" transform="translate(-9 -19) scale(1.18)">
        {/* REST POSE = CONTACT. The head is a vertical cylinder whose striking
            face sits flush on the block's top plate (both at y=99) — the old
            pose tilted the head 21°, so its corner stabbed through the block.
            The swing rotates this whole group about the handle butt (30,66):
            raised at -18°, landing exactly back on this flush contact. */}
        <rect className="tw-base" x="82" y="103.5" width="38" height="7" rx="3" />
        <rect className="tw-base-top" x="88" y="99" width="26" height="4.5" rx="2" />
        <g className="tw-gavel">
          {/* DEAD HORIZONTAL, and drawn before the head so the head covers the
              joint. The head is a vertical cylinder, so a raked handle met it
              off-axis and the junction read as a kink — a real gavel's handle
              is perpendicular to the head. y is the head's vertical midpoint
              (69..99 -> 84), so it enters dead centre. */}
          <rect className="tw-gavel-handle" x="28" y="81.5" width="67" height="5" rx="2.5" />
          <rect className="tw-gavel-head" x="91.5" y="69" width="17" height="30" rx="5.5" />
          <rect className="tw-band" x="91.5" y="71.5" width="17" height="4.5" rx="2" />
          <rect className="tw-band" x="91.5" y="92.5" width="17" height="4.5" rx="2" />
        </g>
        <path className="tw-strikes" d="M121 92 L129 85 M124 100 L134 98" />
      </g>
    </svg>
  );
}

export function TwoWays() {
  const sectionRef = useRef<HTMLElement | null>(null);

  /* ARM, NEVER REVEAL — and RE-ARM, so the entrance replays every time the
     section is scrolled back to (Bryan, 15 Aug), while a refresh or a deep
     link that lands already inside it stays still.

     Two observers, each with one job. The PLAY one is deliberately stricter
     (bottom inset) so the sequence starts once the section is properly in
     frame; the RESET one has no inset, so re-arming — which sets opacity 0 —
     can only happen when the section is FULLY off screen. Sharing one observer
     between both jobs would re-arm while a sliver was still visible and flash
     the copy away mid-scroll.

     The ledger's no-blank rule still holds: markup rests fully drawn, arming
     happens only through classList (never React state — EasyAsia lifts
     rendered HTML with no React behind it), and a guard forces the first play
     if the observer starves. That guard is FIRST-PLAY ONLY: once the section
     has animated once the observer is proven, and a repeating guard would
     fire while the user is away and silently consume the next replay. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    let guard = 0;
    let hasPlayed = false;

    const arm = () => {
      if (el.classList.contains("tw--armed")) return;
      el.classList.remove("tw--play");
      el.classList.add("tw--armed");
    };

    const play = () => {
      /* Only ever plays FROM the armed state, which is what keeps a refresh
         inside the section still: it was never armed, so this no-ops. */
      if (!el.classList.contains("tw--armed")) return;
      el.classList.remove("tw--armed");
      /* Forces the style change to land before `tw--play` is added, so the
         keyframes restart on every replay instead of being coalesced away. */
      void el.offsetWidth;
      el.classList.add("tw--play");
      hasPlayed = true;
      window.clearTimeout(guard);
    };

    /* Below the fold at mount: arm it. Already on screen: leave it drawn.
       Deferred two frames on purpose — a load straight into #how-it-works has
       NOT applied its anchor scroll by the time effects run, so measuring here
       reported the section as below the fold, armed it, and the observer then
       animated it the instant the browser jumped. Measuring after layout has
       settled reads its true position. */
    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;
        arm();
        guard = window.setTimeout(() => {
          if (!hasPlayed) play();
        }, 8000);
      });
    });

    const playObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) play();
      },
      { rootMargin: "0px 0px -14% 0px" },
    );
    const resetObserver = new IntersectionObserver(
      (entries) => {
        if (entries.every((entry) => !entry.isIntersecting)) arm();
      },
      { rootMargin: "0px" },
    );
    playObserver.observe(el);
    resetObserver.observe(el);

    return () => {
      playObserver.disconnect();
      resetObserver.disconnect();
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      window.clearTimeout(guard);
      el.classList.remove("tw--armed", "tw--play");
    };
  }, []);

  return (
    <section className="tw" id="how-it-works" aria-labelledby="tw-title" ref={sectionRef}>
      <div className="tw-inner">
        <div className="tw-copy">
          <p className="tw-kicker">Dua Cara &middot; Two Ways to Buy</p>
          {/* Two lines, not four. The map is the proof now, so the headline no
              longer narrates it. "the same house can be bought two ways" also
              implied one property runs BOTH routes, which is not the case —
              different properties, different places, two ways to buy.

              "Across Malaysia", not "Peninsular": the proposition is national
              and the listing data carries every state including Sabah and
              Sarawak. The illustration showing the peninsula is a drawing
              decision, not the limit of the offer. */}
          <h2 id="tw-title">Across Malaysia, two ways to buy.</h2>
          <p className="tw-deck">
            Discover Malaysian subsale properties offered through private E-Tender or live Owner
            Auction &mdash; each with its own price, place and closing date.
          </p>

          {/* A REMINDER, not an explainer. Section 1 already taught both routes
              in full. Each route is one drawing plus three quiet lines — the
              support sentences carry the one fact each method most needs:
              E-Tender's privacy phrasing follows the ledger (offers are hidden
              from OTHER BUYERS; they go to the seller immediately, so "stays
              confidential until closing" would be wrong). */}
          <div className="tw-routes">
            <div className="tw-route tw-route--tender">
              <div className="tw-route-art">
                <EnvelopeArt />
              </div>
              <div className="tw-route-text">
                <h3>
                  <span className="tw-route-num">1.)</span> E-Tender
                </h3>
                <p className="tw-route-sub">Private sealed offers</p>
                <p className="tw-route-note">
                  Name your price privately. Other buyers never see your offer.
                </p>
              </div>
            </div>
            <div className="tw-route tw-route--auction">
              <div className="tw-route-art">
                <GavelArt />
              </div>
              <div className="tw-route-text">
                <h3>
                  <span className="tw-route-num">2.)</span> Owner Auction
                  <span className="tw-live-tag">
                    <span className="tw-live-dot" />
                    Live Bidding
                  </span>
                </h3>
                <p className="tw-route-sub">Live online bidding</p>
                <p className="tw-route-note">Bid openly against other buyers on auction day.</p>
              </div>
            </div>
          </div>

          <p className="tw-note">
            Illustration only. View current properties on the E-Tender and Owner Auction pages.
          </p>
        </div>

        {/* MAP + staged cards. Nothing interactive. */}
        <div className="tw-scene" aria-hidden="true">
          {/* Study D, chosen by Bryan 15 Aug — the naturalistic country, not the
              stone plate. All iteration happens on THIS finish from here on. */}
          <WestMalaysiaMap finish="terrain" markers />
        </div>
      </div>
    </section>
  );
}
