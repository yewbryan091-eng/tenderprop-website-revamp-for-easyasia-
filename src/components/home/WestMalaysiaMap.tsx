import { useCallback, useEffect, useId, useRef } from "react";
import type { CSSProperties } from "react";

import { PROJECT_IMG } from "@/lib/images";
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

/* Twenty-one copies of the exact Natural Earth path form one shallow sidewall.
   This stays SVG rather than raster so every coastline detail remains sharp at
   any responsive size. Future Klang Valley artwork should be layered above
   `.wm-map-top`, never cut into or replace this source geometry. */
const DEPTH_LAYERS = Array.from({ length: 21 }, (_, index) => 21 - index);

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

/* The cards live in a FLAT layer, so nothing in CSS knows where a peg ended up
   once the camera's rotateX/rotateZ has had its way. This measures each peg's
   rendered centre and writes it onto the matching card anchor.

   The connector is then drawn in that same flat layer, from the anchor up to
   the card — so the line and the card share one coordinate space and CANNOT
   drift apart. Anchoring the card to the 3D stem's tip instead looked joined
   at one viewport and detached at the next.

   Measured rather than hard-coded: the camera transform is constant, so the
   percentages ARE stable for a given layout — but they shift the moment the
   map gains padding or the breakpoint changes the stem scale, and a stale
   number would silently detach every card from its stem. */
function useStemTips(
  mapRef: React.RefObject<HTMLDivElement | null>,
  cardsRef: React.RefObject<HTMLDivElement | null>,
) {
  const sync = useCallback(() => {
    const map = mapRef.current;
    const cards = cardsRef.current;
    if (!map || !cards) return;
    const box = map.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const pegs = map.querySelectorAll<SVGGElement>(".wm-map-pegs g");
    cards.querySelectorAll<HTMLElement>(".wm-card-anchor").forEach((anchor, index) => {
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
  }, [mapRef, cardsRef]);

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

/* Card glyphs. The seal and gavel mirror the two the left column already uses,
   so the badge on the map and the method cards beside it read as one family. */
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

function ClockGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="12" height="12">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7v5.4l3.4 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="12" height="12">
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="15"
        rx="1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M3.5 10.5h17M8 3.5v4M16 3.5v4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── STAGED CARDS, NOT LIVE LISTINGS ─────────────────────────────────────────
   The 13 Aug ledger is explicit: Section 2 "must not render live listings,
   must not be interactive, and must not be clickable — a staged illustration
   of the two buying routes". So this content is written here rather than read
   from TENDERS, every element is a <span>, and `.wm-stems` already carries
   `pointer-events: none`. The section's existing "Illustration only" footnote
   is what covers it for the reader.

   Each card's place matches the region its stem actually stands in, so the
   composition does not claim a Selangor address over a Kedah anchor.
   Photography is from the real asset pack. */
const STEM_CARDS: Record<
  string,
  {
    method: "E-Tender" | "Owner Auction";
    photo: string;
    name: string;
    place: string;
    priceLabel: string;
    price: string;
    footLead: string;
    footSub?: string;
    /* Controlled horizontal offset, px. Every final value is zero so each
       straight stem meets its card at bottom centre; the hook stays available
       for a future small editorial nudge without moving the geographic peg. */
    dx: number;
  }
> = {
  north: {
    dx: 0,
    method: "E-Tender",
    photo: "greenlane-bukit-jelutong-1.jpg",
    name: "Taman Sejati Indah",
    place: "Sungai Petani, Kedah",
    priceLabel: "Reserve price",
    price: "RM 385,000",
    footLead: "18 days left",
    footSub: "Closes 12 Dec 2026",
  },
  central: {
    dx: 0,
    method: "Owner Auction",
    photo: "country-heights.jpg",
    name: "Jalan Sungai Jelai",
    place: "Kuala Lipis, Pahang",
    priceLabel: "Starting bid",
    price: "RM 465,000",
    footLead: "12 Dec 2026 · 9:00 AM",
  },
  south: {
    dx: 0,
    method: "E-Tender",
    photo: "meranti-terrace.jpg",
    name: "Taman Sri Kluang",
    place: "Kluang, Johor",
    priceLabel: "Reserve price",
    price: "RM 520,000",
    footLead: "14 days left",
    footSub: "Closes 08 Dec 2026",
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
  const blurId = `wm-blur-${instance}`;
  const poolBlurId = `wm-pool-blur-${instance}`;
  const clipId = `wm-clip-${instance}`;
  const mapRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  useStemTips(mapRef, cardsRef);

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

          <g className="wm-map-depth" fill={`url(#${sideId})`}>
            {DEPTH_LAYERS.map((layer) => (
              <use
                key={layer}
                href={`#${shapeId}`}
                transform={`translate(${layer * 0.72} ${layer * 3.25})`}
              />
            ))}
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
          card inherits the camera's rotateX(60deg) and lies down on the stone
          — cancelling that per-card only works for the hairline stem, whose
          1.3px width hides the residual perspective skew. A card is a large
          surface and showed it immediately. Out here it simply faces the
          viewer, pinned to the stem's measured screen position. */}
      <div className="wm-cards" ref={cardsRef}>
        {WEST_MALAYSIA_LOCATIONS.map((location, index) => {
          const card = STEM_CARDS[location.key];
          if (!card) return null;
          const auction = card.method === "Owner Auction";
          return (
            <span
              key={location.key}
              className="wm-card-anchor"
              style={
                {
                  zIndex: index + 1,
                  "--wm-stem-h": `${location.stemHeight}px`,
                  "--wm-card-dx": `${card.dx}px`,
                  "--wm-stem-color": location.color,
                } as CSSProperties
              }
            >
              <span className="wm-card-stem" />
              <span className={`wm-card${auction ? " wm-card--auction" : ""}`}>
                <span className="wm-card-photo">
                  <img src={PROJECT_IMG(card.photo)} alt="" loading="lazy" decoding="async" />
                  <span className="wm-card-badge">
                    {auction ? <GavelGlyph /> : <MailGlyph />}
                    {card.method}
                  </span>
                </span>
                <span className="wm-card-body">
                  <span className="wm-card-name">{card.name}</span>
                  <span className="wm-card-place">{card.place}</span>
                  <span className="wm-card-rule" />
                  <span className="wm-card-label">{card.priceLabel}</span>
                  <span className="wm-card-price">{card.price}</span>
                  <span className="wm-card-rule" />
                  <span className="wm-card-foot">
                    {auction ? <CalendarGlyph /> : <ClockGlyph />}
                    <b>{card.footLead}</b>
                  </span>
                  {card.footSub ? <span className="wm-card-foot-sub">{card.footSub}</span> : null}
                </span>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
