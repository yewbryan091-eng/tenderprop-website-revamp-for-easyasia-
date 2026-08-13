/* ── MALAYSIA, DRAWN AS A FIELD OF DOTS ────────────────────────────────────────
   Scenery for the homepage's second section, and nothing more. This is an
   ILLUSTRATION of the country, not a survey: the outlines below are coarse
   hand-traced approximations, deliberately rendered as a dot matrix so they
   read as a graphic rather than pretending to cartographic accuracy. Nothing
   here is a geocode; never use it to place a real listing, measure a distance,
   or answer "what is near me".

   Rasterised at load with an even-odd point-in-polygon test — pure geometry, no
   clock and no randomness, so every render is identical. */

export type LngLat = readonly [number, number];

/* Clockwise from the Thai border, down the Straits coast to Johor, back up the
   South China Sea coast. */
const PENINSULAR: LngLat[] = [
  [100.12, 6.55],
  [100.1, 6.05],
  [100.3, 5.75],
  [100.32, 5.45],
  [100.55, 5.15],
  [100.62, 4.75],
  [100.78, 4.3],
  [100.98, 3.95],
  [101.08, 3.55],
  [101.28, 3.2],
  [101.36, 2.9],
  [101.55, 2.65],
  [101.9, 2.4],
  [102.25, 2.15],
  [102.65, 1.9],
  [103.15, 1.6],
  [103.55, 1.42],
  [103.85, 1.38],
  [104.15, 1.55],
  [104.28, 1.95],
  [104.1, 2.45],
  [103.85, 2.9],
  [103.62, 3.35],
  [103.46, 3.85],
  [103.4, 4.25],
  [103.28, 4.65],
  [103.1, 5.05],
  [102.85, 5.45],
  [102.5, 5.85],
  [102.1, 6.2],
  [101.8, 6.45],
  [101.4, 6.55],
  [101.0, 6.5],
  [100.6, 6.58],
];

/* Pulau Pinang — small enough to lose at this resolution, and the one omission
   a Malaysian reader would notice immediately. */
const PENANG: LngLat[] = [
  [100.17, 5.28],
  [100.33, 5.26],
  [100.36, 5.44],
  [100.26, 5.49],
  [100.16, 5.4],
];

/* Sarawak: northwest up the South China Sea coast (Kuching → Bintulu → Miri →
   Lawas), then back southwest along the Kalimantan border, which lies well
   INLAND to the southeast. An earlier pass ran the two lines almost on top of
   each other and collapsed the whole state into a diagonal sliver — caught by
   rasterising the outline to ASCII rather than by looking at the page. */
const SARAWAK: LngLat[] = [
  [109.62, 1.6],
  [110.1, 1.75],
  [110.6, 1.5],
  [111.2, 1.95],
  [111.8, 2.45],
  [112.4, 2.85],
  [113.05, 3.2],
  [113.6, 3.55],
  [114.05, 4.4],
  [114.55, 4.6],
  [115.3, 4.85],
  [115.4, 4.9],
  [115.0, 4.2],
  [114.6, 3.6],
  [114.0, 2.3],
  [113.2, 1.65],
  [112.2, 1.45],
  [111.2, 1.05],
  [110.3, 0.9],
  [109.7, 1.05],
];

const SABAH: LngLat[] = [
  [115.35, 4.7],
  [115.55, 5.1],
  [115.9, 5.6],
  [116.25, 6.15],
  [116.6, 6.6],
  [116.85, 7.05],
  [117.15, 7.35],
  [117.55, 7.15],
  [117.85, 6.75],
  [118.2, 6.35],
  [118.55, 5.95],
  [119.05, 5.55],
  [118.75, 5.15],
  [118.35, 4.75],
  [117.9, 4.45],
  [117.4, 4.25],
  [116.9, 4.15],
  [116.4, 4.35],
  [115.9, 4.55],
];

const LANDMASSES = [PENINSULAR, PENANG, SARAWAK, SABAH];

/* The frame carries about half a degree of open sea around the country on every
   side: margin for the annotation cards to float in without covering land, and
   the reason the plane can hold an undistorted projection. Its proportions ARE
   the aspect ratio set on `.tw-plane` (20.8 : 8.2) — change one and the country
   stretches, so change both. */
export const MAP_BOUNDS = { west: 99.2, east: 120.0, south: 0.15, north: 8.35 };

export function projectMap([lng, lat]: LngLat) {
  const { west, east, south, north } = MAP_BOUNDS;
  return {
    x: ((lng - west) / (east - west)) * 100,
    y: ((north - lat) / (north - south)) * 100,
  };
}

function inside([lng, lat]: LngLat, poly: LngLat[]) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/* Cell spacing in degrees. ~0.155° is the coarsest grid that still keeps the
   peninsula's waist and Penang legible. */
const STEP = 0.155;

export function malaysiaDots() {
  const { west, east, south, north } = MAP_BOUNDS;
  const dots: { x: number; y: number }[] = [];
  for (let lat = south; lat <= north; lat += STEP) {
    for (let lng = west; lng <= east; lng += STEP) {
      const p: LngLat = [lng, lat];
      if (LANDMASSES.some((poly) => inside(p, poly))) dots.push(projectMap(p));
    }
  }
  return dots;
}

/* Places named on the illustration. Approximate city positions, chosen to show
   the spread of the country rather than where stock happens to sit today. */
export const CITIES: Record<string, LngLat> = {
  "Kuala Lumpur": [101.69, 3.14],
  "Shah Alam": [101.53, 3.07],
  "George Town": [100.33, 5.41],
  Ipoh: [101.09, 4.6],
  "Johor Bahru": [103.76, 1.49],
  Melaka: [102.25, 2.19],
  Kuantan: [103.33, 3.81],
  Kuching: [110.35, 1.55],
  "Kota Kinabalu": [116.07, 5.98],
};
