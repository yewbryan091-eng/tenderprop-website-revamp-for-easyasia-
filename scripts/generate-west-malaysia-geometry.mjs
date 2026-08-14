import { writeFile } from "node:fs/promises";

const NATURAL_EARTH_COMMIT = "ca96624a56bd078437bca8184e78163e5039ad19";
const ADMIN0_FILE = "ne_10m_admin_0_countries.geojson";
const ADMIN1_FILE = "ne_10m_admin_1_states_provinces_lines.geojson";
const SOURCE_ROOT = `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/${NATURAL_EARTH_COMMIT}/geojson`;
const ADMIN0_URL = `${SOURCE_ROOT}/${ADMIN0_FILE}`;
const ADMIN1_URL = `${SOURCE_ROOT}/${ADMIN1_FILE}`;

const [admin0Response, admin1Response] = await Promise.all([fetch(ADMIN0_URL), fetch(ADMIN1_URL)]);
if (!admin0Response.ok || !admin1Response.ok) {
  throw new Error(
    `Natural Earth download failed: Admin 0 ${admin0Response.status}; Admin 1 ${admin1Response.status}`,
  );
}

const [admin0, admin1] = await Promise.all([admin0Response.json(), admin1Response.json()]);
const malaysia = admin0.features.find((feature) => feature.properties?.ISO_A3 === "MYS");

if (!malaysia || malaysia.geometry?.type !== "MultiPolygon") {
  throw new Error("Malaysia MultiPolygon was not found in the Natural Earth dataset.");
}

/* Natural Earth stores Malaysia as separate polygon components. Peninsular
   Malaysia and its western islands all finish west of 105.5E; Malaysian Borneo
   begins east of 109E. The longitude split therefore removes East Malaysia
   without clipping, redrawing or simplifying a single published coastline
   coordinate. */
const westPolygons = malaysia.geometry.coordinates.filter((polygon) => {
  const longitudes = polygon.flat().map(([longitude]) => longitude);
  return Math.max(...longitudes) < 105.5;
});

if (westPolygons.length !== 7) {
  throw new Error(`Expected 7 West Malaysia polygons; received ${westPolygons.length}.`);
}

const coordinates = westPolygons.flat(2);
const longitudes = coordinates.map(([longitude]) => longitude);
const latitudes = coordinates.map(([, latitude]) => latitude);
const bounds = {
  west: Math.min(...longitudes),
  east: Math.max(...longitudes),
  south: Math.min(...latitudes),
  north: Math.max(...latitudes),
};

/* A local equirectangular projection is suitable at this small equatorial
   extent. Longitude is corrected by cos(mid-latitude), which preserves the
   published shape's physical proportions instead of stretching it to a box. */
const midLatitude = (bounds.south + bounds.north) / 2;
const longitudeScale = Math.cos((midLatitude * Math.PI) / 180);
const projectedWidth = (bounds.east - bounds.west) * longitudeScale;
const projectedHeight = bounds.north - bounds.south;
const width = 1000;
const height = (projectedHeight / projectedWidth) * width;

const project = ([longitude, latitude]) => [
  ((longitude - bounds.west) * longitudeScale * width) / projectedWidth,
  ((bounds.north - latitude) * height) / projectedHeight,
];

const clean = (value) => Number(value.toFixed(2));
const pathFromPolygons = (polygons) =>
  polygons
    .flatMap((polygon) => polygon.map((ring) => ring.map(project)))
    .map(
      (ring) =>
        `${ring
          .map(([x, y], index) => `${index === 0 ? "M" : "L"}${clean(x)} ${clean(y)}`)
          .join(" ")} Z`,
    )
    .join(" ");

const path = pathFromPolygons(westPolygons);

const linesOf = (geometry) => {
  if (geometry.type === "LineString") return [geometry.coordinates];
  if (geometry.type === "MultiLineString") return geometry.coordinates;
  throw new Error(`Unsupported Natural Earth geometry: ${geometry.type}`);
};

const westStateLines = admin1.features
  .filter((feature) => feature.properties?.ADM0_A3 === "MYS")
  .map((feature) => ({
    key: String(feature.properties.ne_id),
    lines: linesOf(feature.geometry),
  }))
  .filter(({ lines }) => {
    const boundaryLongitudes = lines.flat().map(([longitude]) => longitude);
    return Math.max(...boundaryLongitudes) < 105.5;
  })
  .map(({ key, lines }) => ({
    key,
    path: lines
      .map((line) =>
        line
          .map(([longitude, latitude], index) => {
            const [x, y] = project([longitude, latitude]);
            return `${index === 0 ? "M" : "L"}${clean(x)} ${clean(y)}`;
          })
          .join(" "),
      )
      .join(" "),
  }));

if (westStateLines.length !== 24) {
  throw new Error(
    `Expected 24 West Malaysia boundary features; received ${westStateLines.length}.`,
  );
}

/* COMPOSITION-LED ANCHORS, WGS84. These three coordinates are not city centres:
   Bryan marked the three positions he wanted on a render (14 Aug), and each
   coordinate is the inverse of that mark through the project() function below,
   so the stems land exactly where he placed them.

   The section already declares itself "Illustration only", so naming these
   after cities they are not would be the dishonest option — they are labelled
   by region, with the nearest real settlement noted for reference:
     north   ~8km from Sungai Petani, Kedah
     central inland Perak/Pahang border, the Cameron Highlands foothills
     south   ~22km from Kluang, inland Johor
   If these ever need to BE the three major subsale markets, the coordinates
   for George Town / Kuala Lumpur / Johor Bahru sit at SVG 148,280 · 439,769 ·
   885,1130 — noticeably closer to the peninsula's extremities than these.

   Colours and stem heights are the approved Section 2 pool markers, not method
   icons — deliberately distinct per point so overlapping centres stay
   individually readable. */
const LOCATION_SOURCE = [
  {
    key: "north",
    name: "Northern Peninsular",
    /* Bryan's first mark landed on Kedah's WESTERN BOUNDARY, hard against the
       coast — the pool half sat on the state line. Moved into the state's
       interior on his follow-up. */
    lat: 5.85,
    lon: 100.75,
    color: "#B98A91",
    /* A gentle descending stagger, north to south. These used to be stretched
       (196/112/92) to keep the two northern cards from colliding; the cards'
       own horizontal fan does that job now, so the stems can sit at a natural
       height instead of being propped up. */
    stemHeight: 100,
  },
  {
    key: "central",
    name: "Central Peninsular",
    lat: 4.2831,
    lon: 101.6054,
    color: "#BE9177",
    stemHeight: 80,
  },
  {
    key: "south",
    name: "Southern Peninsular",
    lat: 2.2275,
    lon: 103.1988,
    color: "#A69A76",
    stemHeight: 62,
  },
];

const locations = LOCATION_SOURCE.map(({ key, name, lat, lon, color, stemHeight }) => {
  const [x, y] = project([lon, lat]);
  return { key, name, lat, lon, x: clean(x), y: clean(y), color, stemHeight };
});

const viewBox = `0 0 ${clean(width)} ${clean(height)}`;
const generatedNotice = `Natural Earth 1:10m Admin 0 + Admin 1; commit ${NATURAL_EARTH_COMMIT}`;
const stateLinesModule = westStateLines
  .map(
    ({ key, path: statePath }) =>
      `  {\n    key: ${JSON.stringify(key)},\n    path: ${JSON.stringify(statePath)},\n  },`,
  )
  .join("\n");

const locationsModule = locations
  .map(
    ({ key, name, lat, lon, x, y, color, stemHeight }) =>
      `  {\n    key: ${JSON.stringify(key)},\n    name: ${JSON.stringify(name)},\n    lat: ${lat},\n    lon: ${lon},\n    x: ${x},\n    y: ${y},\n    color: ${JSON.stringify(color)},\n    stemHeight: ${stemHeight},\n  },`,
  )
  .join("\n");

await writeFile(
  new URL("../src/data/west-malaysia-geometry.ts", import.meta.url),
  `/* GENERATED FILE — run npm run generate:west-malaysia.\n   Source: ${generatedNotice}\n   West-only selection: complete Malaysian polygon and boundary components west of 105.5E.\n   No geometry is hand-drawn or simplified in this file.\n   Location coordinates: GeoNames, WGS84; projected with the same project() used above. */\n\nexport const WEST_MALAYSIA_VIEWBOX = "${viewBox}";\nexport const WEST_MALAYSIA_PATH =\n  ${JSON.stringify(path)};\nexport const WEST_MALAYSIA_STATE_LINES = [\n${stateLinesModule}\n] as const;\nexport const WEST_MALAYSIA_LOCATIONS = [\n${locationsModule}\n] as const;\n`,
);

await writeFile(
  new URL("../design/west-malaysia-spline.svg", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">\n  <!-- ${generatedNotice}. Complete Malaysian components west of 105.5E; no hand drawing or simplification. -->\n  <path fill="#F1E8DE" fill-rule="evenodd" d="${path}"/>\n  <g fill="none" stroke="#A9927D" stroke-width="1.25">\n${westStateLines.map(({ key, path: statePath }) => `    <path data-boundary="${key}" d="${statePath}"/>`).join("\n")}\n  </g>\n</svg>\n`,
);

console.log(
  JSON.stringify(
    {
      sources: [ADMIN0_URL, ADMIN1_URL],
      polygonComponents: westPolygons.length,
      stateBoundaryFeatures: westStateLines.length,
      coordinateCount: coordinates.length,
      bounds,
      viewBox,
      locations,
    },
    null,
    2,
  ),
);
