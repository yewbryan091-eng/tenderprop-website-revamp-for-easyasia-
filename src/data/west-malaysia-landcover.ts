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

/* ⚠️ NO BLOB FORESTS. The two big forest polygons (Taman Negara interior,
   Endau-Rompin) were removed by Bryan's call, 15 Aug: even feathered, a convex
   traced blob reads as a giant green dot on the plate. The terrain finish's
   own base ladder already carries the lowland green; if forest ever returns it
   must FOLLOW THE RANGES (tint the TERRAIN_BANDS envelopes), because that is
   where Malaysia's primary forest actually survives — elongated, irregular,
   broken at the passes. Never reintroduce it as a freestanding blob. */
export const LANDCOVER: LandcoverRegion[] = [
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

/* ── RIVERS — TAPERED RIBBONS, NOT STROKES ───────────────────────────────────
   A stroke has ONE width for its whole length, which is the single thing that
   made the first attempt read as a drawn line rather than water: real rivers
   start as a thread at the watershed and open to an estuary at the sea. So each
   river is built as a POLYGON — the centreline offset left and right by a
   half-width that grows downstream — and filled, not stroked.

   Three further things separate water from a groove:
   · MEANDER. The traced course is smooth; real channels wander. A small
     perpendicular sine is added along the run, at an amplitude well under the
     accuracy of the trace, so the course still passes through the same towns.
   · TAPER CURVE. Width grows as t^0.65, not linearly — rivers gain most of
     their width in the lower third, where the tributaries have joined.
   · TRIBUTARIES. A trunk with no branches looks drawn. The real feeders are
     here: Tembeling and Jelai into the Pahang, Kinta into the Perak, Galas and
     Lebir into the Kelantan.

   Colour is handled in CSS, but the intent belongs here: these rivers are
   SILTY, not blue. The Klang, the Pahang and the Perak all run brown — a
   cobalt river on a Malaysian map is the unrealistic choice. What makes them
   read as liquid is the specular glint, not the hue. */

type RiverSpec = {
  key: string;
  note: string;
  points: readonly LngLat[];
  /* Half-width at source and at mouth, in projected units. */
  w0: number;
  w1: number;
  meander?: number;
};

/* Sample a quadratic-smoothed polyline into evenly-spaced points, so the
   offsets below get clean normals instead of corners. */
function densify(points: readonly LngLat[], per = 14) {
  const p = points.map(project);
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i];
    const b = p[i + 1];
    const prev = p[i - 1] ?? a;
    const next = p[i + 2] ?? b;
    for (let s = 0; s < per; s++) {
      const u = s / per;
      /* Catmull-Rom through the traced points — passes THROUGH each waypoint,
         so the towns the course is traced by are not smoothed away. */
      const u2 = u * u;
      const u3 = u2 * u;
      out.push({
        x:
          0.5 *
          (2 * a.x +
            (-prev.x + b.x) * u +
            (2 * prev.x - 5 * a.x + 4 * b.x - next.x) * u2 +
            (-prev.x + 3 * a.x - 3 * b.x + next.x) * u3),
        y:
          0.5 *
          (2 * a.y +
            (-prev.y + b.y) * u +
            (2 * prev.y - 5 * a.y + 4 * b.y - next.y) * u2 +
            (-prev.y + 3 * a.y - 3 * b.y + next.y) * u3),
      });
    }
  }
  out.push(p[p.length - 1]);
  return out;
}

/* Build the filled ribbon: walk the left bank downstream, the right bank back. */
function ribbon(spec: RiverSpec, widthScale = 1) {
  const pts = densify(spec.points);
  const n = pts.length;
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const half = (spec.w0 + (spec.w1 - spec.w0) * Math.pow(t, 0.65)) * widthScale;
    const wob = (spec.meander ?? 0) * Math.sin(t * 11) * (1 - Math.abs(0.5 - t));
    const cx = pts[i].x + nx * wob;
    const cy = pts[i].y + ny * wob;
    left.push(`${(cx + nx * half).toFixed(1)} ${(cy + ny * half).toFixed(1)}`);
    right.push(`${(cx - nx * half).toFixed(1)} ${(cy - ny * half).toFixed(1)}`);
  }
  return `M${left.join(" L")} L${right.reverse().join(" L")} Z`;
}

const RIVER_SPECS: RiverSpec[] = [
  {
    key: "pahang",
    note: "Sungai Pahang, 459km — Kuala Tembeling, Jerantut, Temerloh, Chenor, out at Pekan. The widest mouth on the peninsula.",
    w0: 1.4,
    w1: 11.5,
    meander: 3.2,
    points: [
      [102.4, 4.05],
      [102.36, 3.86],
      [102.4, 3.66],
      [102.42, 3.45],
      [102.6, 3.34],
      [102.85, 3.38],
      [103.1, 3.44],
      [103.39, 3.49],
    ],
  },
  {
    key: "perak",
    note: "Sungai Perak, 400km — Grik, Kuala Kangsar, Teluk Intan, out at Bagan Datoh, including its real south-then-west dogleg.",
    w0: 1.3,
    w1: 10,
    meander: 3,
    points: [
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
    ],
  },
  {
    key: "kelantan",
    note: "Sungai Kelantan — Kuala Krai, where the Galas and Lebir meet, north through Pasir Mas to the Kota Bharu delta.",
    w0: 1.6,
    w1: 8,
    meander: 2.4,
    points: [
      [102.2, 5.53],
      [102.18, 5.75],
      [102.14, 5.95],
      [102.14, 6.05],
      [102.2, 6.13],
      [102.28, 6.22],
    ],
  },
  {
    key: "muar",
    note: "Sungai Muar — Negeri Sembilan highlands, south-west through Segamat district to Muar on the Straits.",
    w0: 1.1,
    w1: 6.4,
    meander: 2.6,
    points: [
      [102.3, 2.9],
      [102.45, 2.7],
      [102.55, 2.5],
      [102.6, 2.3],
      [102.58, 2.15],
      [102.55, 2.04],
      [102.47, 2.02],
    ],
  },
  {
    key: "klang",
    note: "Sungai Klang — short, but it runs through the Klang Valley where most of the market is, and Kuala Lumpur is named for its confluence.",
    w0: 1,
    w1: 5,
    meander: 1.8,
    points: [
      [101.72, 3.17],
      [101.6, 3.11],
      [101.45, 3.05],
      [101.32, 3.0],
      [101.24, 3.0],
    ],
  },
  {
    key: "terengganu",
    note: "Sungai Terengganu — out of the Kenyir highlands to the sea at Kuala Terengganu.",
    w0: 1.2,
    w1: 6,
    meander: 2,
    points: [
      [102.68, 4.98],
      [102.82, 5.08],
      [102.96, 5.18],
      [103.08, 5.26],
      [103.13, 5.32],
    ],
  },
  {
    key: "johor",
    note: "Sungai Johor — south off Gunung Belumut, out to the Johor Strait east of JB.",
    w0: 1.2,
    w1: 6.5,
    meander: 2.4,
    points: [
      [103.45, 2.12],
      [103.5, 1.92],
      [103.55, 1.72],
      [103.6, 1.55],
      [103.63, 1.45],
    ],
  },
  {
    key: "selangor",
    note: "Sungai Selangor — from the Kuala Kubu Bharu hills west to the sea at Kuala Selangor.",
    w0: 1,
    w1: 5,
    meander: 2,
    points: [
      [101.66, 3.6],
      [101.52, 3.5],
      [101.38, 3.43],
      [101.27, 3.36],
    ],
  },
  /* ── Tributaries. A trunk with no branches looks drawn. ─────────────────── */
  {
    key: "tembeling",
    note: "Sungai Tembeling — down from Taman Negara to meet the Jelai at Kuala Tembeling, where the Pahang begins.",
    w0: 0.8,
    w1: 2.4,
    meander: 2,
    points: [
      [102.62, 4.55],
      [102.55, 4.35],
      [102.47, 4.18],
      [102.4, 4.05],
    ],
  },
  {
    key: "jelai",
    note: "Sungai Jelai — the western headwater of the Pahang, out of the Titiwangsa foothills.",
    w0: 0.8,
    w1: 2.3,
    meander: 2,
    points: [
      [101.95, 4.35],
      [102.1, 4.24],
      [102.26, 4.12],
      [102.4, 4.05],
    ],
  },
  {
    key: "kinta",
    note: "Sungai Kinta — through Ipoh and the tin valley, into the Perak near Teluk Intan.",
    w0: 0.7,
    w1: 2.2,
    meander: 1.6,
    points: [
      [101.15, 4.62],
      [101.08, 4.42],
      [101.02, 4.2],
      [100.99, 4.06],
    ],
  },
  {
    key: "galas",
    note: "Sungai Galas — the western headwater, meeting the Lebir at Kuala Krai to form the Kelantan.",
    w0: 0.7,
    w1: 2.2,
    meander: 1.8,
    points: [
      [101.82, 4.88],
      [101.95, 5.1],
      [102.06, 5.32],
      [102.2, 5.53],
    ],
  },
  {
    key: "semantan",
    note: "Sungai Semantan — from the west into the Pahang at Temerloh.",
    w0: 0.7,
    w1: 2.4,
    meander: 1.8,
    points: [
      [101.96, 3.3],
      [102.14, 3.37],
      [102.28, 3.41],
      [102.42, 3.45],
    ],
  },
  {
    key: "bera",
    note: "Sungai Bera — draining the Tasik Bera wetland north into the Pahang. The lake the plate used to show as a dot, returned as its river.",
    w0: 0.6,
    w1: 1.8,
    meander: 1.5,
    points: [
      [102.62, 3.02],
      [102.58, 3.18],
      [102.6, 3.34],
    ],
  },
  {
    key: "gombak",
    note: "Sungai Gombak — meeting the Klang at the muddy confluence Kuala Lumpur is named for.",
    w0: 0.5,
    w1: 1.6,
    meander: 1.2,
    points: [
      [101.78, 3.28],
      [101.74, 3.21],
      [101.71, 3.16],
    ],
  },
  {
    key: "segamat",
    note: "Sungai Segamat — through Segamat town into the Muar.",
    w0: 0.6,
    w1: 1.8,
    meander: 1.4,
    points: [
      [102.75, 2.6],
      [102.63, 2.55],
      [102.55, 2.5],
    ],
  },
  {
    key: "plus",
    note: "Sungai Plus — out of the Titiwangsa into the upper Perak above Kuala Kangsar.",
    w0: 0.6,
    w1: 1.8,
    meander: 1.4,
    points: [
      [101.32, 5.22],
      [101.17, 5.18],
      [101.05, 5.15],
    ],
  },
  {
    key: "lebir",
    note: "Sungai Lebir — the eastern headwater joining the Galas at Kuala Krai to form the Kelantan.",
    w0: 0.7,
    w1: 2,
    meander: 1.6,
    points: [
      [102.42, 5.05],
      [102.34, 5.24],
      [102.26, 5.4],
      [102.2, 5.53],
    ],
  },
];

/* The centreline as an open path, WITH the same meander the ribbon carries, so
   a stroke drawn along it stays inside the channel. This is what the flow
   animation rides — a dashed light stroke sliding seaward along this path is
   what makes the water MOVE instead of merely sitting in its bed. */
function centreline(spec: RiverSpec) {
  const pts = densify(spec.points);
  const n = pts.length;
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const wob = (spec.meander ?? 0) * Math.sin(t * 11) * (1 - Math.abs(0.5 - t));
    out.push(
      `${(pts[i].x + (-dy / len) * wob).toFixed(1)} ${(pts[i].y + (dx / len) * wob).toFixed(1)}`,
    );
  }
  return `M${out.join(" L")}`;
}

export const RIVERS = RIVER_SPECS.map((spec, index) => ({
  key: spec.key,
  note: spec.note,
  d: ribbon(spec),
  /* The glint runs at a third of the channel's width — a specular sliver, not a
     second river. This is the mark that reads as LIQUID; without it a filled
     ribbon is just a coloured groove. */
  glint: ribbon(spec, 0.34),
  flow: centreline(spec),
  /* ── PER-RIVER FLOW PHYSICS ────────────────────────────────────────────────
     One uniform stroke on every river was the artificial tell: on a tributary
     a 1.7-unit flow line was nearly as wide as the channel itself and the
     light read as a blob crawling up a thread.
     - width follows the mouth width, floored so trunks lead and feeders whisper
     - big rivers run SLOWER (mass moves with majesty; threads hurry)
     - a negative, index-staggered delay so no two rivers pulse in sync —
       synchrony is the one thing real water never does. */
  flowWidth: +Math.min(1.7, Math.max(0.8, spec.w1 * 0.19)).toFixed(2),
  /* ── VISUAL HIERARCHY (Bryan, 15 Aug: too many waterways carried equal
     weight). Rank by mouth width, and let the rank drive OPACITY as well as
     size — on a real map the eye finds two or three great rivers first and
     discovers the rest afterwards. Trunks stay full; the feeders drop to
     just over a third, which is what makes the network read as a hierarchy
     rather than a web. */
  rank: spec.w1 >= 8 ? "major" : spec.w1 >= 4 ? "minor" : "feeder",
  flowDuration: +(9 + spec.w1 * 0.5).toFixed(1),
  flowDelay: +(index * -1.9).toFixed(1),
}));

/* ── ESTUARIES — where the rivers actually end ────────────────────────────────
   Every river used to just STOP at the coast, which is the least alive moment
   a water system can have. Each trunk river (mouth width >= 4) now opens into
   a fan at its real mouth — the Pahang at Pekan, the Perak at Bagan Datoh, the
   Kelantan at the Kota Bharu delta, the Muar at Muar town, the Klang past Port
   Klang. The fan deliberately OVERSHOOTS the coast; the coastline clip cuts it
   at the exact shore, so the river reads as opening into the sea rather than
   tapering to a point on land. The silt ellipse is the tidal stain inland of
   the mouth — mud the river leaves behind. */
const TRUNKS = RIVER_SPECS.filter((spec) => spec.w1 >= 4);

export const ESTUARIES = TRUNKS.map((spec) => {
  const pts = densify(spec.points);
  const m = pts[pts.length - 1];
  const prev = pts[Math.max(0, pts.length - 6)];
  let dx = m.x - prev.x;
  let dy = m.y - prev.y;
  const len = Math.hypot(dx, dy) || 1;
  dx /= len;
  dy /= len;
  const nx = -dy;
  const ny = dx;
  const reach = 22;
  const overshoot = 12;
  const s = { x: m.x - dx * reach, y: m.y - dy * reach };
  const e = { x: m.x + dx * overshoot, y: m.y + dy * overshoot };
  const wNarrow = spec.w1 * 0.95;
  const wWide = spec.w1 * 2.5;
  const fan =
    `M${(s.x + nx * wNarrow).toFixed(1)} ${(s.y + ny * wNarrow).toFixed(1)}` +
    ` L${(e.x + nx * wWide).toFixed(1)} ${(e.y + ny * wWide).toFixed(1)}` +
    ` L${(e.x - nx * wWide).toFixed(1)} ${(e.y - ny * wWide).toFixed(1)}` +
    ` L${(s.x - nx * wNarrow).toFixed(1)} ${(s.y - ny * wNarrow).toFixed(1)} Z`;
  return {
    key: spec.key,
    fan,
    silt: {
      cx: +m.x.toFixed(1),
      cy: +m.y.toFixed(1),
      rx: +(spec.w1 * 2.6).toFixed(1),
      ry: +(spec.w1 * 1.5).toFixed(1),
      angle: +((Math.atan2(dy, dx) * 180) / Math.PI).toFixed(1),
    },
  };
});

/* ── REGIONAL TONE — 3-6%, not colour zones ──────────────────────────────────
   Bryan, 15 Aug: within the existing olive/beige family, the west mountains a
   touch darker and more desaturated, the east lowlands fractionally lighter,
   the south warmer beige. The central plains are the BASE and get no overlay
   at all — a region reads as "normal" only if something else shifts around it.

   Deliberately huge, deliberately blurred to nothing: these are atmospheric
   washes, and if any edge of one is ever visible the effect has failed. */
export const TONE_ZONES: { key: string; fill: string; opacity: number; d: string }[] = [
  {
    key: "west-mountains",
    fill: "#6e7350",
    opacity: 0.16,
    d: smooth([
      [100.5, 6.2],
      [101.5, 5.6],
      [101.9, 4.4],
      [101.8, 3.2],
      [101.2, 2.6],
      [100.5, 3.4],
      [100.2, 4.8],
    ]),
  },
  {
    key: "east-lowlands",
    fill: "#e6dcb8",
    opacity: 0.17,
    d: smooth([
      [102.4, 6.2],
      [103.4, 5.6],
      [103.6, 4.2],
      [103.4, 3.0],
      [102.6, 3.1],
      [102.3, 4.6],
    ]),
  },
  {
    key: "south-warm",
    fill: "#d9c69a",
    opacity: 0.18,
    d: smooth([
      [102.2, 2.6],
      [103.4, 2.5],
      [103.9, 1.6],
      [103.2, 1.2],
      [102.4, 1.7],
    ]),
  },
];
