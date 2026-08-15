/* ── WEST MALAYSIA — LAND COVER ───────────────────────────────────────────────
   Where the greens go, and why each one is there. Every region below is a real
   feature of the peninsula, not a decorative blob: this is the difference
   between a map with a soul and procedural noise, because a Malaysian reader
   recognises these places even when they could not name the coordinates.

   The projection is the SAME one the plate's geometry uses, recovered from the
   three anchors in `west-malaysia-geometry.ts`:
     X = (lon − 99.64525) × 215.08     Y = (6.708 − lat) × 215.60
   so a region defined in degrees lands exactly on the coastline it belongs to.

   ⚠️ EVERY REGION IS DELIBERATELY DRAWN OVERSIZE, past the coast and into the
   sea. The renderer clips them to the published coastline, so the clip — not
   these hand-traced outlines — is what makes an edge exact. Never tighten one
   of these to "fit" the coast; that only introduces gaps the clip was already
   handling. */

export type LngLat = readonly [number, number];

const project = ([lon, lat]: LngLat) => ({
  x: (lon - 99.64525) * 215.08,
  y: (6.708 - lat) * 215.6,
});

/* Closed quadratic-midpoint smoothing — a raw polygon reads as a cut-out
   crystal, and land does not have corners at this scale. */
function smooth(points: readonly LngLat[]) {
  const p = points.map(project);
  const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });
  const start = mid(p[p.length - 1], p[0]);
  let d = `M${start.x.toFixed(1)} ${start.y.toFixed(1)}`;
  for (let i = 0; i < p.length; i++) {
    const v = p[i];
    const m = mid(v, p[(i + 1) % p.length]);
    d += ` Q${v.x.toFixed(1)} ${v.y.toFixed(1)} ${m.x.toFixed(1)} ${m.y.toFixed(1)}`;
  }
  return `${d} Z`;
}

export type LandcoverRegion = {
  key: string;
  /* `zone` selects the fill token in west-malaysia-map.css. */
  zone: "forest" | "paddy" | "mangrove" | "urban";
  d: string;
  /* One line on what it is, so nobody later mistakes a real region for filler. */
  note: string;
};

export const LANDCOVER: LandcoverRegion[] = [
  {
    key: "forest-interior",
    zone: "forest",
    note: "Taman Negara and the Pahang–Kelantan–Terengganu interior: the peninsula's primary rainforest, and the darkest thing on it.",
    d: smooth([
      [101.9, 5.2],
      [102.5, 5.32],
      [103.0, 4.9],
      [103.05, 4.3],
      [102.8, 3.8],
      [102.3, 3.58],
      [101.9, 3.9],
      [101.72, 4.5],
    ]),
  },
  {
    key: "forest-south",
    zone: "forest",
    note: "Endau-Rompin and the Johor–Pahang forest belt — the southern reserve, smaller and lower than the interior.",
    d: smooth([
      [102.9, 2.75],
      [103.35, 2.6],
      [103.4, 2.15],
      [103.0, 1.95],
      [102.6, 2.15],
      [102.6, 2.55],
    ]),
  },
  {
    key: "paddy-kedah-perlis",
    zone: "paddy",
    note: "The Kedah–Perlis rice bowl. The north-west's real signature and the one land cover a Malaysian will name on sight.",
    d: smooth([
      [100.12, 6.6],
      [100.6, 6.62],
      [100.9, 6.25],
      [100.82, 5.85],
      [100.45, 5.62],
      [100.1, 5.9],
    ]),
  },
  {
    key: "paddy-kelantan",
    zone: "paddy",
    note: "The Kelantan delta paddy plain around Kota Bharu — the east coast's rice ground.",
    d: smooth([
      [101.95, 6.25],
      [102.45, 6.3],
      [102.6, 5.95],
      [102.3, 5.75],
      [101.95, 5.9],
    ]),
  },
  {
    key: "mangrove-west",
    zone: "mangrove",
    note: "The Straits tidal fringe — Matang and the Perak–Selangor mudflats. Drawn well into the sea; the coastline clip cuts it.",
    d: smooth([
      [100.2, 5.15],
      [100.55, 4.75],
      [100.85, 4.2],
      [101.15, 3.5],
      [101.25, 2.85],
      [101.45, 2.45],
      [101.72, 2.5],
      [101.5, 3.05],
      [101.42, 3.6],
      [101.1, 4.3],
      [100.82, 4.85],
      [100.5, 5.25],
    ]),
  },
];

/* The four places the market actually concentrates. Small on purpose — these
   are smudges of settlement, not labelled cities, and they exist so the plate
   reads as inhabited rather than as wilderness. */
export const URBAN: { key: string; cx: number; cy: number; r: number }[] = [
  { key: "klang-valley", ...project([101.66, 3.11]), r: 30 },
  { key: "penang", ...project([100.36, 5.38]), r: 17 },
  { key: "ipoh", ...project([101.09, 4.6]), r: 14 },
  { key: "johor-bahru", ...project([103.72, 1.52]), r: 18 },
].map((u) => ({ key: u.key, cx: u.x, cy: u.y, r: u.r }));

/* ── RIVERS ───────────────────────────────────────────────────────────────────
   Open paths, stroked not filled. Rivers are what stop the lowlands reading as
   one flat field of green, and they are the cheapest mark that makes a landform
   look inhabited rather than drawn. Four real ones, sources to mouths. */
function line(points: readonly LngLat[]) {
  const p = points.map(project);
  let d = `M${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
  for (let i = 1; i < p.length - 1; i++) {
    const m = { x: (p[i].x + p[i + 1].x) / 2, y: (p[i].y + p[i + 1].y) / 2 };
    d += ` Q${p[i].x.toFixed(1)} ${p[i].y.toFixed(1)} ${m.x.toFixed(1)} ${m.y.toFixed(1)}`;
  }
  const last = p[p.length - 1];
  return `${d} L${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
}

export const RIVERS: { key: string; d: string; note: string }[] = [
  {
    key: "pahang",
    note: "Sungai Pahang, 459km — the peninsula's longest. Traced through the places it actually passes: Kuala Tembeling, Jerantut, Temerloh, Chenor, Lubuk Paku, out at Pekan.",
    d: line([
      [102.4, 4.05],
      [102.36, 3.86],
      [102.4, 3.66],
      [102.42, 3.45],
      [102.6, 3.34],
      [102.85, 3.38],
      [103.1, 3.44],
      [103.39, 3.49],
    ]),
  },
  {
    key: "perak",
    note: "Sungai Perak, 400km — Thai border to the Straits: Grik, Kuala Kangsar, Teluk Intan, out at Bagan Datoh. The south-then-west dogleg is real, not a smoothing artefact.",
    d: line([
      [101.4, 5.75],
      [101.28, 5.56],
      [101.13, 5.43],
      [101.05, 5.15],
      [100.97, 4.95],
      [100.94, 4.77],
      [100.9, 4.5],
      [100.95, 4.25],
      [101.02, 4.02],
      [100.89, 3.96],
      [100.78, 3.99],
    ]),
  },
  {
    key: "kelantan",
    note: "Sungai Kelantan — from Kuala Krai where the Galas and Lebir meet, north through Pasir Mas and Kota Bharu to the South China Sea.",
    d: line([
      [102.2, 5.53],
      [102.18, 5.75],
      [102.14, 5.95],
      [102.14, 6.05],
      [102.2, 6.13],
      [102.28, 6.22],
    ]),
  },
  {
    key: "muar",
    note: "Sungai Muar — Negeri Sembilan highlands south-west through Segamat district to Muar town on the Straits.",
    d: line([
      [102.3, 2.9],
      [102.45, 2.7],
      [102.55, 2.5],
      [102.6, 2.3],
      [102.58, 2.15],
      [102.55, 2.04],
      [102.47, 2.02],
    ]),
  },
  {
    key: "klang",
    note: "Sungai Klang — short, but it runs through the Klang Valley, which is where most of the market is. Kuala Lumpur means the muddy confluence, and this is one of the two rivers in it.",
    d: line([
      [101.72, 3.17],
      [101.6, 3.11],
      [101.45, 3.05],
      [101.32, 3.0],
      [101.24, 3.0],
    ]),
  },
];
