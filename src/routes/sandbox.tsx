import { createFileRoute } from "@tanstack/react-router";

import "@/styles/sandbox-dua-cara.css";

/* ── /sandbox — SECTION 2 RIGHT-SIDE EXPERIMENTS ──────────────────────────────
   Bryan, 13 Aug: "full on right side architecturing... sand box the right side
   section." Three candidate scenes for the Dua cara band's right column, each
   at real size, judged by eye against each other. Nothing here ships; the
   winner gets grafted into TwoWays.tsx and this route dies.

   HOUSE RULES STILL APPLY IN THE SANDBOX — every variant is a cinematic
   illustration: no live listings, no real prices, nothing interactive, scenes
   aria-hidden. Cards carry a property TYPE and an AREA only.

   Dev-only route: not in the nav, not in the sitemap, robots noindex. */

export const Route = createFileRoute("/sandbox")({
  head: () => ({
    meta: [{ title: "Section 2 sandbox — TenderProp" }, { name: "robots", content: "noindex" }],
  }),
  component: Sandbox,
});

/* ── The Klang Valley, drawn as a stylised dot terrain ────────────────────────
   An ILLUSTRATION of the valley, not a survey: a hand-traced blob of the
   KL–PJ–Shah Alam–Klang–Kajang basin, rasterised to dots, with two hairline
   expressway curves and area names. Recognition comes from the labels and the
   roads — the valley has no iconic coastline the way the peninsula does. */
const VALLEY: [number, number][] = [
  [5, 38],
  [8, 28],
  [14, 22],
  [24, 16],
  [34, 12],
  [46, 9],
  [58, 10],
  [68, 14],
  [76, 20],
  [84, 30],
  [88, 40],
  [84, 50],
  [74, 57],
  [62, 61],
  [50, 62],
  [38, 58],
  [26, 54],
  [14, 48],
];

function insideValley(x: number, y: number) {
  let hit = false;
  for (let i = 0, j = VALLEY.length - 1; i < VALLEY.length; j = i++) {
    const [xi, yi] = VALLEY[i];
    const [xj, yj] = VALLEY[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

const VALLEY_DOTS: { x: number; y: number }[] = [];
for (let y = 8; y <= 64; y += 2.1) {
  for (let x = 3; x <= 91; x += 2.1) {
    if (insideValley(x, y)) VALLEY_DOTS.push({ x, y });
  }
}

const AREAS: { name: string; x: number; y: number }[] = [
  { name: "Kuala Lumpur", x: 58, y: 24 },
  { name: "Ampang", x: 74, y: 32 },
  { name: "Petaling Jaya", x: 42, y: 38 },
  { name: "Shah Alam", x: 24, y: 42 },
  { name: "Klang", x: 10, y: 38 },
  { name: "Kajang", x: 66, y: 52 },
];

/* The three risers — 2 E-Tender, 1 Owner Auction (Bryan's spec). Positions are
   percentages of the plane; `rise` is how far each card stands off it. Staggered
   heights are what make the scene read as depth instead of a row of tiles. */
type Riser = {
  kind: "tender" | "auction";
  what: string;
  where: string;
  x: number;
  y: number;
  rise: number;
  photo?: string;
};

const RISERS: Riser[] = [
  { kind: "tender", what: "Terrace house", where: "Shah Alam", x: 24, y: 60, rise: 58 },
  { kind: "auction", what: "Bungalow", where: "Ampang", x: 72, y: 38, rise: 84 },
  { kind: "tender", what: "Condominium", where: "Kajang", x: 60, y: 76, rise: 44 },
];

const PHOTOS = [
  "/assets/layout/home-residential-dusk.jpg",
  "/assets/layout/owner-auction-hero.jpg",
  "/assets/layout/tender-information-kl.jpg",
];

function SealIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="13" height="13">
      <rect x="3" y="5" width="18" height="14" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m3 5 9 7.2L21 5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="14.4" r="2" fill="currentColor" />
    </svg>
  );
}

function GavelIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="13" height="13">
      <path
        d="m14 13-7.5 7.5a2.12 2.12 0 0 1-3-3L11 10M16 16l6-6M8 8l6-6M9 7l8 8M21 11l-8-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function ValleyPlane({ withRoads = true }: { withRoads?: boolean }) {
  return (
    <svg className="sb-valley" viewBox="0 0 94 70" preserveAspectRatio="none">
      <g className="sb-valley-dots">
        {VALLEY_DOTS.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="0.5" />
        ))}
      </g>
      {withRoads && (
        <g className="sb-valley-roads">
          {/* Federal Highway west–east, then the north–south NKVE-ish arc. */}
          <path d="M7 40 C 26 46, 44 40, 70 30" />
          <path d="M30 15 C 35 28, 32 44, 24 58" />
        </g>
      )}
      <g className="sb-valley-labels">
        {AREAS.map((a) => (
          <text key={a.name} x={a.x} y={a.y}>
            {a.name.toUpperCase()}
          </text>
        ))}
      </g>
    </svg>
  );
}

function RiserCard({ riser, photo }: { riser: Riser; photo?: string }) {
  const auction = riser.kind === "auction";
  return (
    <div
      className={`sb-riser ${auction ? "sb-riser-auction" : "sb-riser-tender"}`}
      style={{ left: `${riser.x}%`, top: `${riser.y}%`, "--rise": `${riser.rise}px` } as never}
    >
      <span className="sb-riser-shadow" />
      <span className="sb-riser-post" />
      <span className="sb-riser-pin" />
      <figure className="sb-card">
        {photo && <img src={photo} alt="" loading="lazy" />}
        <figcaption>
          {auction ? <GavelIcon /> : <SealIcon />}
          {auction ? "Owner Auction" : "Open for E-Tender"}
        </figcaption>
        <p className="sb-card-what">{riser.what}</p>
        <p className="sb-card-where">{riser.where}</p>
      </figure>
    </div>
  );
}

function Variant({
  id,
  title,
  concept,
  children,
}: {
  id: string;
  title: string;
  concept: string;
  children: React.ReactNode;
}) {
  return (
    <section className="sb-variant" id={id}>
      <header>
        <h2>{title}</h2>
        <p>{concept}</p>
      </header>
      <div className="sb-stage" aria-hidden="true">
        {children}
      </div>
      <p className="sb-foot">
        Illustration only &mdash; example properties, not current listings. Nothing here is
        clickable by design.
      </p>
    </section>
  );
}

function Sandbox() {
  return (
    <div className="sb">
      <header className="sb-head">
        <h1>Section 2 &mdash; right-side sandbox</h1>
        <p>
          Three candidate scenes for the Dua cara band, full size. Left column is fixed and not
          shown. Judge, pick, graft.
        </p>
      </header>

      <Variant
        id="valley"
        title="A — The Valley"
        concept="Bryan's seed: the Klang Valley as a dot terrain lying away from the reader, three cards rising from real areas on posts — 2 E-Tender (burgundy), 1 Owner Auction (brass). Place-first: the market is HERE, near you."
      >
        <div className="sb-scene sb-scene-valley">
          <div className="sb-plane">
            <ValleyPlane />
            {RISERS.map((r) => (
              <RiserCard key={r.where} riser={r} />
            ))}
          </div>
        </div>
      </Variant>

      <Variant
        id="house"
        title="B — One House, Two Doors"
        concept="The dusk house with BOTH route cards pinned to the same building — the thesis drawn literally: same house, your choice of door. Property-first: buyers feel houses, not geography."
      >
        <div className="sb-scene sb-scene-house">
          <div className="sb-frame">
            <img src="/assets/layout/owner-auction-hero.jpg" alt="" />
            <svg className="sb-leads" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M30 22 L 44 40" />
              <path d="M72 78 L 58 55" />
            </svg>
            <span className="sb-pin" style={{ left: "44%", top: "40%" }} />
            <span className="sb-pin sb-pin-2" style={{ left: "58%", top: "55%" }} />
            <figure className="sb-card sb-card-flat sb-card-t" style={{ left: "6%", top: "8%" }}>
              <figcaption>
                <SealIcon />
                Open for E-Tender
              </figcaption>
              <p className="sb-card-what">Sealed offers &mdash; you name the price</p>
            </figure>
            <figure
              className="sb-card sb-card-flat sb-card-a"
              style={{ right: "5%", bottom: "7%" }}
            >
              <figcaption>
                <GavelIcon />
                Owner Auction
              </figcaption>
              <p className="sb-card-what">Live bidding, straight from the owner</p>
            </figure>
          </div>
        </div>
      </Variant>

      <Variant
        id="hybrid"
        title="C — The Valley, Furnished"
        concept="A's stage with B's substance: the same valley plane, but the rising cards carry photographs — the place AND the property in one scene. The heaviest, and possibly the winner."
      >
        <div className="sb-scene sb-scene-valley">
          <div className="sb-plane">
            <ValleyPlane withRoads={false} />
            {RISERS.map((r, i) => (
              <RiserCard key={r.where} riser={r} photo={PHOTOS[i]} />
            ))}
          </div>
        </div>
      </Variant>
    </div>
  );
}
