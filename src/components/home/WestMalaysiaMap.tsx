import { useCallback, useEffect, useId, useRef } from "react";
import type { CSSProperties } from "react";

import {
  WEST_MALAYSIA_LOCATIONS,
  WEST_MALAYSIA_PATH,
  WEST_MALAYSIA_STATE_LINES,
} from "@/data/west-malaysia-geometry";
import "@/styles/west-malaysia-map.css";

export type WestMalaysiaMapFinish = "limestone" | "porcelain" | "monument";

type WestMalaysiaMapProps = {
  className?: string;
  finish?: WestMalaysiaMapFinish;
};

/* Copies of the exact Natural Earth path, stamped down a diagonal, form one
   shallow sidewall. This stays SVG rather than raster so every coastline detail
   remains sharp at any responsive size. Future Klang Valley artwork should be
   layered above `.wm-map-top`, never cut into or replace this source geometry.

   The TOTAL DROP is what defines how thick the wall looks, and it is unchanged
   from the 21-layer version (21 × 0.72 / 21 × 3.25). Only the slicing is finer:
   each copy now carries its own colour rather than a gradient, and 21 colour
   steps across a 68-unit wall banded visibly, so the drop is cut into 42. */
const DEPTH_SLICES = 42;
const DEPTH_DROP = { x: 15.12, y: 68.25 };
const DEPTH_LAYERS = Array.from({ length: DEPTH_SLICES }, (_, index) => DEPTH_SLICES - index);

/* ── RELIEF: THE HIGHLANDS ARE CARVED ────────────────────────────────────────
   The plate was one flat cream field — half the object undifferentiated, with
   the dotted state borders dividing nothing. It is a stone RELIEF, so the
   honest way to bring it alive is to carve it rather than to decorate it.

   Two ridges, shaded the way relief maps have always been shaded: a dark copy
   pushed away from the light and a light copy pulled toward it, both heavily
   blurred, so the ridge reads as raised ground under the same raking key light
   that lights the rest of the plate.

   PLACED BY COORDINATE, NOT BY EYE. The peninsula's own projection is recovered
   from the three anchors in `west-malaysia-geometry.ts` — they carry both their
   lat/lon and their projected x/y, and both scales agree to 5 significant
   figures across all three (x = 215.08 per degree of longitude from 99.64525E;
   y = 215.60 per degree of latitude down from 6.708N). Every control point
   below is a real place run through that:

     Titiwangsa   Perlis border 6.40N 100.90E → Cameron Highlands 4.47N 101.38E
                  → Genting 3.42N 101.79E → Negeri Sembilan 2.60N 102.25E
     Banjaran Timur / Tahan   5.20N 101.90E → 4.63N 102.23E
     Kledang (Perak west flank)   4.60N 101.05E → 4.20N 101.10E
     Gunung Ledang (Johor)        2.37N 102.61E

   FOUR masses, not one. A single clean stroke down the middle read as a smear
   across the plate rather than as a range; a range has flanks and outliers, and
   the two small ones also stop Johor and the south being dead flat. Ledang is a
   single isolated peak in life, so it stays a dab — long enough to catch the
   light, too short to read as a second spine.

   Deliberately SOFT. This is tonal shading, not a drawn feature — it should
   read as "there are highlands here", never as a claim about an exact ridge
   line. If it ever hardens into something you could trace, it has gone wrong. */
const TITIWANGSA =
  "M270 66 C300 150 318 205 324 260 C345 340 360 420 373 483 C390 530 400 570 410 605 C428 650 448 680 461 709 C480 750 500 785 517 810 C534 845 550 870 560 886";
const BANJARAN_TIMUR = "M485 325 C510 350 535 380 552 420 C563 442 569 452 571 456";
const KLEDANG = "M302 454 C306 478 309 505 313 540";
const LEDANG = "M629 926 C634 931 641 939 646 947";
const RELIEF_RIDGES = [TITIWANGSA, BANJARAN_TIMUR, KLEDANG, LEDANG];

/* Three hand-authored, lobed washes share a location without sharing a centre.
   Their deliberately uneven shoulders survive the camera tilt as spilled
   pigment rather than resolving into three tidy ellipses. */
const POOL_WASH_A =
  "M8 -72 C28 -68 40 -55 55 -42 C74 -36 79 -12 69 5 C77 23 61 46 42 49 C27 68 -3 73 -24 59 C-45 64 -70 43 -66 22 C-81 6 -68 -23 -52 -34 C-50 -55 -25 -71 -7 -65 C-1 -70 2 -72 8 -72 Z M-95 31 C-87 22 -72 24 -69 34 C-68 44 -82 50 -92 43 C-100 40 -101 35 -95 31 Z M70 -49 C78 -55 89 -51 91 -43 C92 -36 83 -30 75 -34 C68 -37 66 -44 70 -49 Z";
const POOL_WASH_B =
  "M-5 -50 C14 -55 30 -42 35 -29 C53 -29 61 -7 51 7 C59 25 34 43 17 39 C3 55 -23 50 -30 35 C-49 34 -59 11 -48 -5 C-55 -25 -32 -45 -17 -40 C-14 -46 -10 -49 -5 -50 Z M-61 -34 C-54 -43 -40 -41 -37 -32 C-35 -24 -47 -18 -56 -22 C-64 -24 -66 -29 -61 -34 Z M48 31 C55 25 66 28 68 36 C69 43 60 48 53 45 C47 43 44 36 48 31 Z";
const POOL_WASH_C =
  "M3 -29 C14 -27 20 -18 18 -10 C31 -4 29 11 19 16 C15 28 -1 31 -10 22 C-23 25 -31 12 -24 2 C-31 -10 -17 -23 -8 -20 C-5 -26 -1 -29 3 -29 Z";

/* THREE related-but-different outlines, never one shape rescaled — a shape
   scaled three times reads as a concentric ring, which is exactly the radar-dot
   look this is meant to avoid. Each layer also gets its own rotation and a small
   offset per location, so no two stains repeat and none is radially symmetric. */
const POOL_LAYERS = [
  { cls: "wm-pool-a", path: POOL_WASH_A, blur: true, sx: 1.45, sy: 1.2 },
  { cls: "wm-pool-b", path: POOL_WASH_B, blur: true, sx: 1.38, sy: 1.42 },
  { cls: "wm-pool-c", path: POOL_WASH_C, blur: false, sx: 1.34, sy: 1.18 },
] as const;

/* Offsets are LARGE relative to each shape — around a third of the wash's own
   radius. Small offsets leave the three outlines sharing a centre, which is
   exactly what the eye reads as concentric rings. Pushed this far apart, and
   with the blur raised, they dissolve into one lopsided stain instead. */
const POOL_TILTS = [
  { a: { r: -12, x: -25, y: 16 }, b: { r: 58, x: 24, y: -22 }, c: { r: 24, x: -15, y: 14 } },
  { a: { r: 34, x: 26, y: -16 }, b: { r: -21, x: -24, y: 23 }, c: { r: 70, x: 15, y: 17 } },
  { a: { r: 96, x: -23, y: -23 }, b: { r: 12, x: 25, y: 21 }, c: { r: -15, x: -15, y: -16 } },
];

/* The flags live in a FLAT layer, so nothing in CSS knows where a peg ended up
   once the camera's rotateX/rotateZ has had its way. This measures each peg's
   rendered centre and writes it onto the matching flag anchor.

   The connector is then drawn in that same flat layer, from the anchor up to
   the flag — so the line and the flag share one coordinate space and CANNOT
   drift apart. Anchoring the flag to the 3D stem's tip instead looked joined
   at one viewport and detached at the next.

   Measured rather than hard-coded: the camera transform is constant, so the
   percentages ARE stable for a given layout — but they shift the moment the
   map gains padding or the breakpoint changes the stem scale, and a stale
   number would silently detach every card from its stem. */
function useStemTips(
  mapRef: React.RefObject<HTMLDivElement | null>,
  flagsRef: React.RefObject<HTMLDivElement | null>,
) {
  const sync = useCallback(() => {
    const map = mapRef.current;
    const flags = flagsRef.current;
    if (!map || !flags) return;
    const box = map.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const pegs = map.querySelectorAll<SVGGElement>(".wm-map-pegs g");
    flags.querySelectorAll<HTMLElement>(".wm-flag-anchor").forEach((anchor, index) => {
      const peg = pegs[index];
      if (!peg) return;
      const p = peg.getBoundingClientRect();
      anchor.style.setProperty(
        "--wm-peg-x",
        `${((p.left + p.width / 2 - box.left) / box.width) * 100}%`,
      );
      anchor.style.setProperty(
        "--wm-peg-y",
        `${((p.top + p.height / 2 - box.top) / box.height) * 100}%`,
      );
    });
  }, [mapRef, flagsRef]);

  useEffect(() => {
    sync();
    const map = mapRef.current;
    if (!map || typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", sync);
      return () => window.removeEventListener("resize", sync);
    }
    const observer = new ResizeObserver(sync);
    observer.observe(map);
    return () => observer.disconnect();
  }, [sync, mapRef]);
}

/* Flag glyphs. The seal and gavel mirror the two the left column already uses,
   so the marker on the map and the method terms beside it read as one family. */
function MailGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="11" height="11">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path d="m3 5 9 7.2L21 5" fill="none" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

function GavelGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="11" height="11">
      <path
        d="m14 13-7.5 7.5a2.12 2.12 0 0 1-3-3L11 10M16 16l6-6M8 8l6-6M9 7l8 8M21 11l-8-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
    </svg>
  );
}

/* ── METHOD FLAGS, NOT PROPERTY CARDS ────────────────────────────────────────
   These were full listing cards — photo, name, place, reserve price, a rule, a
   clock, days left, a closing date — and that was the wrong grammar for this
   section. A property card is the visual language of INVENTORY: it promises a
   click. Section 2 is explicitly not inventory (13 Aug ledger: "must not render
   live listings, must not be interactive, and must not be clickable"), so the
   card was writing a cheque the section could not cash, which is exactly why an
   "Illustration only" footnote had to apologise for it underneath. Three dense
   125px objects also sat on top of the calmest, largest object on the page and
   fought it — the plate is what this section is for.

   A flag says the whole sentence in three lines and nothing more: which of the
   two routes, where in the country, what it costs. No photo, no property name,
   no countdown — a name and a deadline are the two things that read as "this is
   a real listing, click it". Bryan, 14 Aug: "i love the idea of the map, i just
   dont know what to do with the cards — is cards the right idea?"

   Still staged, so the rules that governed the cards still hold: written here
   rather than read from TENDERS, every element a <span>, layer is
   `pointer-events: none`. Each flag's place matches the region its stem
   actually stands in, so the composition never claims a Selangor address over
   a Kedah anchor. */
const STEM_FLAGS: Record<
  string,
  {
    method: "E-Tender" | "Owner Auction";
    place: string;
    price: string;
    /* Controlled horizontal offset, px. Every final value is zero so each
       straight stem meets its flag at bottom centre; the hook stays available
       for a future small editorial nudge without moving the geographic peg. */
    dx: number;
  }
> = {
  north: {
    dx: 0,
    method: "E-Tender",
    place: "Sungai Petani, Kedah",
    price: "RM 385,000",
  },
  central: {
    dx: 0,
    method: "Owner Auction",
    place: "Kuala Lipis, Pahang",
    price: "RM 465,000",
  },
  south: {
    dx: 0,
    method: "E-Tender",
    place: "Kluang, Johor",
    price: "RM 520,000",
  },
};

/* Low-profile six-sided peg plate, shared silhouette for every location.
   Top/bottom overlay panels add a subtle light-over-dark bevel in the
   record's own hue without becoming a second colour or a category icon. */
const PEG_HEX_PATH = "M4.6 0 L2.3 3.98 L-2.3 3.98 L-4.6 0 L-2.3 -3.98 L2.3 -3.98 Z";
const PEG_TOP_PATH = "M-4.6 0 L-2.3 -3.98 L2.3 -3.98 L4.6 0 Z";
const PEG_BOTTOM_PATH = "M-4.6 0 L-2.3 3.98 L2.3 3.98 L4.6 0 Z";

/* The map SVG viewBox pads the geography's own 0 0 1000 1172.33 space. The
   HTML stem overlay lives outside that SVG, so screen position has to fold
   the same offsets in rather than reusing the raw projected coordinates. */
const WM_VIEWBOX = { minX: -70, minY: -48, width: 1140, height: 1334 };

function projectedToPercent(x: number, y: number) {
  return {
    left: ((x - WM_VIEWBOX.minX) / WM_VIEWBOX.width) * 100,
    top: ((y - WM_VIEWBOX.minY) / WM_VIEWBOX.height) * 100,
  };
}

export function WestMalaysiaMap({ className = "", finish = "limestone" }: WestMalaysiaMapProps) {
  const instance = useId().replaceAll(":", "");
  const shapeId = `wm-shape-${instance}`;
  const topId = `wm-top-${instance}`;
  const lightId = `wm-light-${instance}`;
  const sideId = `wm-side-${instance}`;
  const grainId = `wm-grain-${instance}`;
  const speckleId = `wm-speckle-${instance}`;
  const reliefId = `wm-relief-${instance}`;
  const blurId = `wm-blur-${instance}`;
  const poolBlurId = `wm-pool-blur-${instance}`;
  const clipId = `wm-clip-${instance}`;
  const mapRef = useRef<HTMLDivElement>(null);
  const flagsRef = useRef<HTMLDivElement>(null);
  useStemTips(mapRef, flagsRef);

  return (
    <div ref={mapRef} className={`wm-map wm-map--${finish} ${className}`.trim()} aria-hidden="true">
      <span className="wm-map-ground" />
      <div className="wm-map-camera">
        <svg
          className="wm-map-object"
          viewBox="-70 -48 1140 1334"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <path id={shapeId} d={WEST_MALAYSIA_PATH} fillRule="evenodd" />
            <clipPath id={clipId}>
              <use href={`#${shapeId}`} />
            </clipPath>

            <linearGradient id={topId} x1="0" y1="0" x2="0.88" y2="1">
              <stop offset="0" stopColor="var(--wm-top-light)" />
              <stop offset="0.46" stopColor="var(--wm-top-mid)" />
              <stop offset="1" stopColor="var(--wm-top-low)" />
            </linearGradient>

            <radialGradient id={lightId} cx="0.22" cy="0.12" r="0.92">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.72" />
              <stop offset="0.42" stopColor="#fffaf3" stopOpacity="0.18" />
              <stop offset="1" stopColor="var(--wm-burgundy-shade)" stopOpacity="0.11" />
            </radialGradient>

            <linearGradient id={sideId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--wm-side-top)" />
              <stop offset="0.55" stopColor="var(--wm-side-mid)" />
              <stop offset="1" stopColor="var(--wm-side-bottom)" />
            </linearGradient>

            <filter id={grainId} x="-8%" y="-8%" width="116%" height="116%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.012 0.085"
                numOctaves="2"
                seed="27"
                result="noise"
              />
              <feColorMatrix
                in="noise"
                type="matrix"
                values=".55 0 0 0 .28
                        0 .45 0 0 .20
                        0 0 .35 0 .15
                        0 0 0 .13 0"
                result="tonedNoise"
              />
              <feComposite in="tonedNoise" in2="SourceAlpha" operator="in" />
            </filter>

            <filter id={reliefId} x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="14" />
            </filter>

            {/* The fine tooth of the surface. Deliberately isotropic where the
                grain above is stretched 7:1 — the two must not share a
                direction or they resolve back into one streaky pattern. */}
            <filter id={speckleId} x="-8%" y="-8%" width="116%" height="116%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.055"
                numOctaves="3"
                seed="41"
                result="speckle"
              />
              <feColorMatrix
                in="speckle"
                type="matrix"
                values=".48 0 0 0 .24
                        0 .42 0 0 .19
                        0 0 .34 0 .14
                        0 0 0 .17 0"
                result="tonedSpeckle"
              />
              <feComposite in="tonedSpeckle" in2="SourceAlpha" operator="in" />
            </filter>

            <filter id={blurId} x="-30%" y="-30%" width="160%" height="180%">
              <feGaussianBlur stdDeviation="14" />
            </filter>

            <filter id={poolBlurId} x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.025 0.036"
                numOctaves="2"
                seed="19"
                result="poolNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="poolNoise"
                scale="16"
                xChannelSelector="R"
                yChannelSelector="G"
                result="poolRagged"
              />
              <feGaussianBlur in="poolRagged" stdDeviation="5.2" />
            </filter>
          </defs>

          {/* A second silhouette close to the object makes the shadow follow
              coves and islands; the broad CSS ellipse underneath handles the
              softer contact falloff beyond it. */}
          <use
            href={`#${shapeId}`}
            className="wm-map-cast"
            transform="translate(16 58)"
            filter={`url(#${blurId})`}
          />

          {/* Each slice is FLAT-FILLED, dark at the foot of the wall and light
              where it meets the stone face. The gradient it replaces was mapped
              in objectBoundingBox units, so all 21 identical bounding boxes got
              the identical ramp — it varied over the map's 1334-unit height and
              therefore barely changed at all across a 68-unit wall, which is
              why the sidewall read as one flat brown band. Interpolating BY
              SLICE puts the ramp where the depth actually is. */}
          <g className="wm-map-depth">
            {DEPTH_LAYERS.map((layer) => {
              const t = layer / DEPTH_SLICES;
              /* Same three stops the old gradient used — top, mid at 0.55,
                 bottom — so all three finishes keep their full palette. */
              const fill =
                t < 0.55
                  ? `color-mix(in srgb, var(--wm-side-mid) ${((t / 0.55) * 100).toFixed(1)}%, var(--wm-side-top))`
                  : `color-mix(in srgb, var(--wm-side-bottom) ${(((t - 0.55) / 0.45) * 100).toFixed(1)}%, var(--wm-side-mid))`;
              return (
                <use
                  key={layer}
                  href={`#${shapeId}`}
                  transform={`translate(${(t * DEPTH_DROP.x).toFixed(3)} ${(t * DEPTH_DROP.y).toFixed(3)})`}
                  style={{ fill }}
                />
              );
            })}
          </g>

          <use href={`#${shapeId}`} className="wm-map-top" fill={`url(#${topId})`} />
          <use href={`#${shapeId}`} className="wm-map-light" fill={`url(#${lightId})`} />

          {/* Surface washes are clipped to the published coastline so no
              tint can ever bleed past it, and sit below the Admin 1
              engravings and stone grain so both stay legible through them. */}
          <g className="wm-map-pools" clipPath={`url(#${clipId})`}>
            {WEST_MALAYSIA_LOCATIONS.map((location, index) => {
              const tilt = POOL_TILTS[index % POOL_TILTS.length];
              return (
                <g key={location.key} transform={`translate(${location.x} ${location.y})`}>
                  {POOL_LAYERS.map((layer) => {
                    const t =
                      tilt[layer.cls.endsWith("a") ? "a" : layer.cls.endsWith("b") ? "b" : "c"];
                    return (
                      <path
                        key={layer.cls}
                        className={layer.cls}
                        d={layer.path}
                        transform={`translate(${t.x} ${t.y}) rotate(${t.r}) scale(${layer.sx} ${layer.sy})`}
                        fill={location.color}
                        filter={layer.blur ? `url(#${poolBlurId})` : undefined}
                      />
                    );
                  })}
                </g>
              );
            })}
          </g>

          {/* Carved highlands. Below the engravings and the grain, so the state
              borders and the stone's tooth both read straight THROUGH the
              relief — a ridge that covered them would look like a decal laid on
              the plate instead of the plate's own shape. The key light sits
              up-left (see the `lightId` radial at 0.22 / 0.12), so the shade
              goes down-right and the highlight up-left of every ridge. */}
          <g className="wm-map-relief" clipPath={`url(#${clipId})`}>
            <g className="wm-relief-shade" filter={`url(#${reliefId})`}>
              {RELIEF_RIDGES.map((ridge, index) => (
                <path key={index} d={ridge} transform="translate(9 10)" />
              ))}
            </g>
            <g className="wm-relief-light" filter={`url(#${reliefId})`}>
              {RELIEF_RIDGES.map((ridge, index) => (
                <path key={index} d={ridge} transform="translate(-8 -9)" />
              ))}
            </g>
          </g>

          {/* Published Admin 1 shapes give the stone face its geographic
              detail. A tiny light offset beneath the dark hairline makes each
              boundary read as a shallow engraving rather than a flat map UI. */}
          <g clipPath={`url(#${clipId})`}>
            <g className="wm-map-states-light" transform="translate(0 1.15)">
              {WEST_MALAYSIA_STATE_LINES.map((boundary) => (
                <path key={boundary.key} d={boundary.path} />
              ))}
            </g>
            <g className="wm-map-states">
              {WEST_MALAYSIA_STATE_LINES.map((boundary) => (
                <path key={boundary.key} d={boundary.path} />
              ))}
            </g>
          </g>

          <use href={`#${shapeId}`} className="wm-map-grain" filter={`url(#${grainId})`} />
          <use href={`#${shapeId}`} className="wm-map-speckle" filter={`url(#${speckleId})`} />

          {/* Pegs sit above the grain and engravings so their small silhouette
              stays crisp; one shared low-profile hex plate per location,
              never a ring, pulse or category-specific icon. */}
          <g className="wm-map-pegs">
            {WEST_MALAYSIA_LOCATIONS.map((location) => (
              <g
                key={location.key}
                transform={`translate(${location.x} ${location.y}) scale(1.35)`}
              >
                <path className="wm-peg-base" d={PEG_HEX_PATH} fill={location.color} />
                <path className="wm-peg-top" d={PEG_TOP_PATH} />
                <path className="wm-peg-bottom" d={PEG_BOTTOM_PATH} />
              </g>
            ))}
          </g>

          <use href={`#${shapeId}`} className="wm-map-bevel" />
          <use href={`#${shapeId}`} className="wm-map-rim" />
        </svg>

        {/* Stems live outside the SVG, split into three nested layers: a
            zero-size anchor pinned to the exact projected point, a wrapper
            that carries the inverse rotateZ/rotateX cancelling the camera's
            tilt, and an inner line pinned to that upright wrapper's bottom
            edge — so it rises flush from the peg instead of lying across
            the tilted stone plane. */}
        <div className="wm-stems">
          {WEST_MALAYSIA_LOCATIONS.map((location, index) => {
            const { left, top } = projectedToPercent(location.x, location.y);
            return (
              <span
                key={location.key}
                className="wm-stem-anchor"
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <span
                  className="wm-stem-upright"
                  style={
                    {
                      "--wm-stem-h": `${location.stemHeight}px`,
                      "--wm-stem-color": location.color,
                    } as CSSProperties
                  }
                >
                  <span className="wm-stem-line" />
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* FLAT overlay, deliberately OUTSIDE `.wm-map-camera`. Inside it, the
          flag inherits the camera's rotateX(60deg) and lies down on the stone
          — cancelling that per-flag only works for the hairline stem, whose
          1.3px width hides the residual perspective skew. Any real surface
          shows it immediately. Out here it simply faces the viewer, pinned to
          the stem's measured screen position. */}
      <div className="wm-flags" ref={flagsRef}>
        {WEST_MALAYSIA_LOCATIONS.map((location, index) => {
          const flag = STEM_FLAGS[location.key];
          if (!flag) return null;
          const auction = flag.method === "Owner Auction";
          return (
            <span
              key={location.key}
              className="wm-flag-anchor"
              style={
                {
                  zIndex: index + 1,
                  "--wm-stem-h": `${location.stemHeight}px`,
                  "--wm-flag-dx": `${flag.dx}px`,
                  "--wm-stem-color": location.color,
                } as CSSProperties
              }
            >
              <span className="wm-flag-stem" />
              <span className={`wm-flag${auction ? " wm-flag--auction" : ""}`}>
                <span className="wm-flag-method">
                  {auction ? <GavelGlyph /> : <MailGlyph />}
                  {flag.method}
                </span>
                <span className="wm-flag-place">{flag.place}</span>
                <span className="wm-flag-price">{flag.price}</span>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
