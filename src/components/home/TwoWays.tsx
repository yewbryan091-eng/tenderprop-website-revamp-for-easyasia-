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

  /* ARM, NEVER REVEAL — and replay on every return (Bryan, 15–16 Aug).
     ONE observer, ONE boundary, watching the ROUTES block rather than the
     section. Both choices are load-bearing:

     · One boundary cannot oscillate. Two observers with different insets both
       claim the band between them, so scrolling into it made them fight —
       play, arm, play — on every frame.
     · The routes block, not the section. `.tw` starts 802px down an 801px
       viewport, so "the section has fully left the screen" was only true
       within a pixel of the very top: scroll up to the hero and a sliver
       stayed, so it never re-armed and never replayed. The illustrations sit
       ~400px lower, so they clear the viewport on any normal scroll back up.

     Resetting is SILENT: the resting state IS the finished state, so dropping
     `tw--play` mid-scroll changes nothing on screen. Only the very first play
     needs `tw--armed` to hide the content beforehand, and that only ever
     happens while the section is off screen.

     No rAF and no manual measurement anywhere. rAF does not fire in a
     backgrounded tab — the exact starvation the 13 Aug ledger entry records —
     and a one-shot measurement at mount cannot see an anchor jump or a browser
     scroll restoration. If the observer never delivers at all, nothing arms
     and the section simply rests fully drawn. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;
    const routes = el.querySelector(".tw-routes");
    if (!routes) return;

    let guard = 0;
    let hasPlayed = false;
    let first = true;

    const arm = () => {
      el.classList.remove("tw--play");
      el.classList.add("tw--armed");
      if (guard) return;
      guard = window.setTimeout(() => {
        if (!hasPlayed) play();
      }, 8000);
    };

    const play = () => {
      if (el.classList.contains("tw--play")) return;
      el.classList.remove("tw--armed");
      /* Flush the class removal so the keyframes restart on a replay instead
         of the two mutations being coalesced into no change at all. */
      void el.offsetWidth;
      el.classList.add("tw--play");
      hasPlayed = true;
      window.clearTimeout(guard);
      guard = 0;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[entries.length - 1].isIntersecting;
        if (first) {
          first = false;
          /* Already on screen at mount — a refresh or a deep link. Leave it
             drawn and count it as played, so scrolling away and back still
             replays from then on. */
          if (visible) {
            hasPlayed = true;
            return;
          }
          arm();
          return;
        }
        if (visible) play();
        else if (hasPlayed) el.classList.remove("tw--play");
      },
      /* -8%, and the number is measured, not chosen. The routes block sits
         ~380px down the section, so a -20% inset put the trigger line ABOVE
         where the illustrations reach on a normal scroll-in — measured 578 vs
         a 571 boundary, missing by 7px, and the only thing that ever fired was
         the 8s no-blank guard. At -8% the same scroll clears it by ~79px. */
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(routes);

    /* HOVER REPLAY, driven by the Web Animations API rather than a CSS class.
       See the note in home-twoways.css: a class could not restart these
       reliably without also firing a stray second gesture when it came off.
       A WAAPI animation is independent of the CSS one, restarts every time,
       and on finishing hands the element back to its resting pose.

       Bound to the artwork only, so pointing at the copy while reading does
       not set the drawings off, and skipped while one is already mid-replay so
       a jittery pointer cannot stutter the gesture. */
    const EASE_OUT = "cubic-bezier(0.3, 0.72, 0.28, 1)";
    const EASE_IN = "cubic-bezier(0.55, 0, 0.9, 0.3)";
    const EASE_PRESS = "cubic-bezier(0.34, 1.4, 0.5, 1)";
    const running = new Set<HTMLElement>();

    const gesture = (
      root: HTMLElement,
      selector: string,
      frames: Keyframe[],
      options: KeyframeAnimationOptions,
    ) => {
      const node = root.querySelector(selector);
      if (node) node.animate(frames, options);
    };

    const replay = (event: Event) => {
      const art = event.currentTarget as HTMLElement;
      if (running.has(art)) return;
      running.add(art);
      window.setTimeout(() => running.delete(art), 950);

      /* Envelope: the flap folds shut, then the padlock presses. */
      gesture(art, ".tw-env-flap", [{ transform: "scaleY(-0.92)" }, { transform: "scaleY(1)" }], {
        duration: 460,
        easing: EASE_OUT,
      });
      gesture(
        art,
        ".tw-env-lock",
        [
          { transform: "scale(0.86)", offset: 0 },
          { transform: "scale(1.05)", offset: 0.55 },
          { transform: "scale(1)", offset: 1 },
        ],
        { duration: 420, delay: 300, easing: EASE_PRESS },
      );

      /* Gavel: one strike, then the impact ticks flash and settle. */
      gesture(art, ".tw-gavel", [{ transform: "rotate(-30deg)" }, { transform: "rotate(0deg)" }], {
        duration: 340,
        easing: EASE_IN,
      });
      gesture(
        art,
        ".tw-strikes",
        [
          { opacity: 0, transform: "scale(0.7)", offset: 0 },
          { opacity: 1, transform: "scale(1.06)", offset: 0.3 },
          { opacity: 0.55, transform: "scale(1)", offset: 1 },
        ],
        { duration: 620, delay: 280, easing: "ease-out" },
      );
    };
    const artBlocks = Array.from(el.querySelectorAll<HTMLElement>(".tw-route-art"));
    /* Real pointers only. `pointerenter` fires on tap, which would make the
       drawings feel like buttons on a phone. */
    if (window.matchMedia("(hover: hover)").matches) {
      artBlocks.forEach((art) => art.addEventListener("pointerenter", replay));
    }

    return () => {
      observer.disconnect();
      window.clearTimeout(guard);
      artBlocks.forEach((art) => art.removeEventListener("pointerenter", replay));
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
