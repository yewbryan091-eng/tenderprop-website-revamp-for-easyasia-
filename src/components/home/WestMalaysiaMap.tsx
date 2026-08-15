import { useCallback, useEffect, useId, useRef } from "react";
import type { CSSProperties } from "react";

import {
  WEST_MALAYSIA_LOCATIONS,
  WEST_MALAYSIA_PATH,
  WEST_MALAYSIA_STATE_LINES,
} from "@/data/west-malaysia-geometry";
import "@/styles/west-malaysia-map.css";
import { ESTUARIES, LANDCOVER, RIVERS, URBAN } from "@/data/west-malaysia-landcover";

export type WestMalaysiaMapFinish = "limestone" | "porcelain" | "monument" | "terrain";

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

/* ── TERRAIN: ELEVATION ENVELOPES OF THE REAL RANGES ─────────────────────────
   These polygons are NEVER drawn as visible shapes. They are the MASK for a
   procedural crinkle relief (feTurbulence heightfield lit by feDiffuseLighting
   from the plate's own upper-left key), the faint ivory elevation fills, and
   the engraved contour hairlines. The blurred-stroke relief of 14 Aug failed
   as smudges and is ledgered as a dead end — this is lit geometry, not paint.

   Geography, not invention. The projection is recovered from the three anchors
   in `west-malaysia-geometry.ts` (both scales agree to 5 s.f.):
     X = (lon − 99.64525) × 215.08     Y = (6.708 − lat) × 215.60
   Spines run through real places — Banjaran Titiwangsa from the Thai border
   through Korbu, Cameron Highlands, Fraser's Hill and Genting to Negeri
   Sembilan (pinched at the Kinta gap); Banjaran Timur through Gunung Tahan;
   Bintang/Kledang west of the Kinta valley. The crest level BREAKS into
   separate summit pockets (Korbu, Genting, Tahan) the way real contours do —
   one unbroken inner band read as a stripe down the map. Regenerate with
   `scratchpad terrain_gen.py` if the spines ever need to move.

   level: 0 = range envelope, 1 = mid elevation, 2 = summit pocket. The mask
   paints them progressively lighter so the crinkle strengthens toward crests. */
const TERRAIN_BANDS = [
  {
    key: "main-0",
    level: 0,
    d: "M300.2 80.1 C292.6 98.5 302.1 147.2 301.7 184.4 C301.3 221.5 296.7 259.7 297.9 303.0 C299.1 346.2 307.7 410.3 308.9 443.9 C310.2 477.4 294.7 481.2 305.3 504.3 C315.9 527.5 355.5 556.3 372.6 583.0 C389.8 609.7 401.2 641.3 408.3 664.5 C415.3 687.7 405.1 701.8 414.7 722.4 C424.4 743.0 454.3 764.0 466.1 788.2 C477.9 812.4 475.1 847.7 485.5 867.5 C496.0 887.2 517.6 902.3 528.8 906.8 C540.0 911.4 549.6 906.0 553.0 894.8 C556.3 883.5 556.4 859.7 548.9 839.2 C541.4 818.8 515.0 795.9 508.1 771.9 C501.3 747.9 511.1 719.4 507.8 695.4 C504.6 671.5 502.3 651.0 488.5 628.2 C474.7 605.5 433.1 586.8 425.2 558.8 C417.3 530.9 444.7 482.1 440.9 460.7 C437.2 439.3 410.3 458.1 402.9 430.6 C395.5 403.1 401.9 337.8 396.7 295.5 C391.4 253.2 379.7 213.8 371.4 177.0 C363.1 140.1 359.0 90.4 347.1 74.3 C335.2 58.1 307.8 61.8 300.2 80.1 Z",
  },
  {
    key: "main-1",
    level: 1,
    d: "M310.4 78.8 C307.3 96.7 316.3 145.6 318.3 182.6 C320.3 219.7 322.0 257.9 322.4 301.1 C322.8 344.4 316.2 410.7 320.7 442.2 C325.3 473.7 340.1 467.0 349.6 490.1 C359.0 513.2 364.3 553.2 377.6 580.7 C390.9 608.2 419.0 632.6 429.4 654.9 C439.8 677.3 433.3 693.1 440.1 715.0 C446.8 737.0 459.0 762.8 469.8 786.7 C480.6 810.7 494.1 839.3 504.6 859.0 C515.1 878.6 525.6 898.4 532.9 904.7 C540.3 911.0 549.3 906.3 548.8 896.8 C548.3 887.3 537.2 868.3 529.8 847.7 C522.4 827.1 512.3 797.5 504.4 773.3 C496.5 749.2 488.7 725.3 482.5 702.7 C476.4 680.2 477.7 661.4 467.3 637.8 C457.0 614.2 432.0 588.2 420.3 561.1 C408.5 534.0 401.5 496.4 396.7 474.9 C391.8 453.5 395.1 461.9 391.1 432.3 C387.0 402.7 378.3 339.6 372.2 297.4 C366.2 255.1 360.7 215.7 354.8 178.7 C348.9 141.8 344.3 92.2 336.9 75.5 C329.5 58.9 313.5 61.0 310.4 78.8 Z",
  },
  {
    key: "timur-0",
    level: 0,
    d: "M456.8 286.6 C457.3 303.1 475.8 342.5 486.1 372.2 C496.5 402.0 506.0 442.2 518.8 465.2 C531.5 488.1 550.4 504.2 562.7 509.7 C574.9 515.3 587.1 511.6 592.2 498.4 C597.3 485.3 602.5 456.1 593.1 430.9 C583.6 405.6 553.7 373.3 535.4 347.0 C517.1 320.7 496.1 283.2 483.0 273.1 C469.9 263.0 456.2 270.1 456.8 286.6 Z",
  },
  {
    key: "bintang-0",
    level: 0,
    d: "M244.1 305.1 C243.2 314.9 252.3 323.4 260.2 352.1 C268.1 380.9 282.8 457.4 291.6 477.8 C300.3 498.2 311.1 497.1 312.7 474.3 C314.3 451.5 308.9 371.4 301.0 341.2 C293.2 311.1 275.0 299.4 265.5 293.4 C256.1 287.4 245.0 295.3 244.1 305.1 Z",
  },
  {
    key: "korbu-0",
    level: 2,
    d: "M342.1 418.1 C339.0 423.5 341.6 436.0 343.1 446.2 C344.5 456.3 345.9 470.2 350.8 478.9 C355.7 487.7 366.4 496.5 372.4 498.7 C378.4 500.9 384.4 497.9 386.8 492.2 C389.2 486.5 389.1 473.8 386.8 464.5 C384.5 455.3 377.3 445.5 373.0 436.9 C368.8 428.4 366.3 416.4 361.2 413.3 C356.0 410.1 345.1 412.6 342.1 418.1 Z",
  },
  {
    key: "genting-0",
    level: 2,
    d: "M434.4 638.0 C431.6 644.8 434.7 662.3 437.3 673.9 C440.0 685.6 446.1 698.7 450.2 708.0 C454.3 717.2 457.0 726.9 461.7 729.4 C466.3 731.9 476.3 727.6 478.1 722.9 C479.9 718.1 474.1 710.6 472.4 701.2 C470.7 691.7 471.2 677.6 468.1 666.3 C465.0 654.9 459.4 637.9 453.8 633.2 C448.2 628.5 437.1 631.2 434.4 638.0 Z",
  },
  {
    key: "tahan-0",
    level: 2,
    d: "M533.0 429.7 C531.5 435.7 538.9 447.1 543.8 454.6 C548.7 462.2 557.2 472.9 562.5 475.2 C567.7 477.5 574.3 473.9 575.2 468.3 C576.1 462.6 571.8 449.6 568.1 441.4 C564.4 433.2 558.9 420.8 553.0 418.9 C547.2 416.9 534.6 423.8 533.0 429.7 Z",
  },
];

/* Mask luminance per level — the relief's intensity map. The range envelope
   must still register at homepage scale, so the foothills now begin above the
   old 56% luminance while the nested highlands retain the strongest relief. */
const TERRAIN_MASK_TONE = ["#a8a8a8", "#d8d8d8", "#ffffff"];

/* Five broad relief zones replace the soft individual lobes. The three
   Titiwangsa clusters are deliberately broken at natural passes, then overlap
   through shoulders and spurs; Bintang/Kledang and Timur/Tahan remain quieter
   secondary systems. These are illustrative, geography-led areas rather than
   claimed elevation polygons. */
const TERRAIN_CLUSTERS = [
  {
    key: "titiwangsa-north",
    level: "primary",
    d: "M295 72 C279 102 290 133 286 164 C282 194 294 219 289 247 C286 272 298 302 319 318 C337 332 354 314 361 291 C368 267 359 244 367 221 C376 194 365 166 363 140 C360 111 342 70 317 61 C307 58 300 63 295 72 Z",
  },
  {
    key: "titiwangsa-central",
    level: "primary",
    d: "M316 322 C296 356 309 389 305 424 C301 456 314 482 310 511 C307 542 323 579 348 604 C370 625 392 611 405 583 C416 558 406 532 418 508 C431 481 421 450 418 422 C414 387 391 337 356 317 C339 307 324 309 316 322 Z",
  },
  {
    key: "titiwangsa-south",
    level: "primary",
    d: "M374 599 C356 632 373 664 372 696 C371 728 389 754 388 784 C387 816 405 853 433 879 C456 900 481 891 493 865 C506 839 496 814 509 791 C523 764 511 733 507 706 C501 672 472 622 432 600 C411 588 383 584 374 599 Z",
  },
  {
    key: "bintang-kledang",
    level: "secondary",
    d: "M240 287 C225 313 237 342 233 370 C229 398 240 421 239 447 C239 474 252 501 273 515 C291 527 309 510 314 487 C319 465 310 445 316 424 C323 399 311 373 307 349 C302 321 281 286 258 278 C250 275 244 279 240 287 Z",
  },
  {
    key: "timur-tahan",
    level: "secondary",
    d: "M453 274 C439 301 455 330 456 359 C456 386 470 409 470 434 C470 461 486 491 510 509 C530 524 552 514 563 490 C574 467 563 446 574 425 C586 401 572 375 564 352 C554 326 526 288 492 273 C477 266 459 263 453 274 Z",
  },
];

/* Valley channels are cut out of the cluster alpha before it is lit. Their
   branching widths create real saddles and drainage structure without any
   pale centreline, contour ring or decorative scratch on the finished face. */
const TERRAIN_VALLEYS = [
  { key: "north-trunk", width: 18, d: "M326 78 C315 123 329 159 319 201 C313 229 322 257 313 296" },
  { key: "north-west", width: 9, d: "M320 160 C303 177 296 198 287 222" },
  { key: "north-east", width: 6, d: "M321 205 C340 219 349 240 359 260" },
  {
    key: "central-trunk",
    width: 16,
    d: "M356 335 C344 379 360 417 348 458 C340 490 352 530 342 575",
  },
  { key: "central-west", width: 9, d: "M351 408 C329 427 320 452 308 480" },
  { key: "central-east", width: 7, d: "M351 465 C376 481 390 506 409 529" },
  { key: "cameron-saddle", width: 11, d: "M350 530 C372 543 383 565 398 585" },
  {
    key: "south-trunk",
    width: 19,
    d: "M421 616 C407 658 425 698 414 740 C406 774 420 815 412 854",
  },
  { key: "south-west", width: 8, d: "M418 700 C394 719 385 746 374 773" },
  { key: "south-east", width: 11, d: "M416 759 C444 775 458 800 480 824" },
  {
    key: "bintang-trunk",
    width: 12,
    d: "M267 299 C256 340 270 378 260 420 C255 445 263 470 257 494",
  },
  {
    key: "timur-trunk",
    width: 13,
    d: "M492 287 C482 326 499 359 490 397 C483 424 495 454 489 486",
  },
  { key: "tahan-east", width: 8, d: "M491 372 C515 389 528 413 550 433" },
];

const TERRAIN_VALLEY_TIPS = [
  { key: "north-trunk-tip", d: "M304 291 L321 293 L310 319 Z" },
  { key: "north-west-tip", d: "M283 218 L292 222 L279 239 Z" },
  { key: "north-east-tip", d: "M355 256 L363 254 L369 275 Z" },
  { key: "central-trunk-tip", d: "M334 571 L351 573 L338 598 Z" },
  { key: "central-west-tip", d: "M304 476 L313 480 L301 497 Z" },
  { key: "central-east-tip", d: "M405 524 L413 531 L425 546 Z" },
  { key: "cameron-tip", d: "M394 580 L402 588 L412 602 Z" },
  { key: "south-trunk-tip", d: "M402 850 L421 852 L408 878 Z" },
  { key: "south-west-tip", d: "M370 769 L378 774 L366 791 Z" },
  { key: "south-east-tip", d: "M476 819 L485 826 L496 840 Z" },
  { key: "bintang-tip", d: "M252 490 L263 492 L254 512 Z" },
  { key: "timur-tip", d: "M483 482 L495 484 L486 507 Z" },
  { key: "tahan-tip", d: "M546 428 L554 435 L566 447 Z" },
];
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

/* ── CLOUDS — a stationary fleet, on the land, mostly shadow ─────────────────
   Bryan, 15 Aug: many, clearly visible, stationary, and WITHIN the map. Both
   the wisps and their shadows are clipped to the coastline, so a cloud
   physically cannot leave the landform. Each is a wisp paired with a shadow
   displaced down-right along the plate's key light — the displacement is the
   altitude cue that makes them float above the terrain instead of sticking to
   it. One puff, mirrored/rotated/scaled per cloud, so the fleet reads as
   weather rather than a stamp. Positions sit on the peninsula's diagonal and
   keep clear of the three pegs and the Klang Valley bloom. */
const CLOUDS = [
  { key: "a", x: 250, y: 140, s: 0.85, flip: false, rot: 0 },
  { key: "b", x: 520, y: 180, s: 0.7, flip: true, rot: 8 },
  { key: "c", x: 330, y: 430, s: 1.15, flip: false, rot: -6 },
  { key: "d", x: 640, y: 430, s: 0.75, flip: true, rot: 4 },
  { key: "e", x: 560, y: 720, s: 1.0, flip: false, rot: 10 },
  { key: "f", x: 780, y: 770, s: 0.8, flip: true, rot: -8 },
  { key: "g", x: 480, y: 960, s: 1.0, flip: false, rot: 5 },
  { key: "h", x: 800, y: 1060, s: 0.6, flip: true, rot: -4 },
];

function CloudPuff() {
  /* Four overlapping ellipses — a cumulus blob the blur turns to vapour. */
  return (
    <>
      <ellipse cx="0" cy="0" rx="56" ry="20" />
      <ellipse cx="-36" cy="8" rx="34" ry="14" />
      <ellipse cx="38" cy="6" rx="40" ry="15" />
      <ellipse cx="6" cy="-14" rx="36" ry="15" />
    </>
  );
}

export function WestMalaysiaMap({ className = "", finish = "limestone" }: WestMalaysiaMapProps) {
  const instance = useId().replaceAll(":", "");
  const shapeId = `wm-shape-${instance}`;
  const topId = `wm-top-${instance}`;
  const lightId = `wm-light-${instance}`;
  const sideId = `wm-side-${instance}`;
  const grainId = `wm-grain-${instance}`;
  const speckleId = `wm-speckle-${instance}`;
  const blurId = `wm-blur-${instance}`;
  const poolBlurId = `wm-pool-blur-${instance}`;
  const clipId = `wm-clip-${instance}`;
  const riverBlurId = `wm-river-blur-${instance}`;
  const crinkleId = `wm-crinkle-${instance}`;
  const sheetId = `wm-sheet-${instance}`;
  const etchId = `wm-etch-${instance}`;
  const ridgeReliefId = `wm-ridge-relief-${instance}`;
  const ridgeClusterMaskId = `wm-ridge-cluster-mask-${instance}`;
  const rangeMaskId = `wm-range-mask-${instance}`;
  const maskBlurId = `wm-mask-blur-${instance}`;
  const mottleId = `wm-mottle-${instance}`;
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
            <filter id={riverBlurId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.2" />
            </filter>

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
                baseFrequency="0.026 0.019"
                numOctaves="3"
                seed="27"
                result="noise"
              />
              <feColorMatrix
                in="noise"
                type="matrix"
                values=".55 0 0 0 .28
                        0 .45 0 0 .20
                        0 0 .35 0 .15
                        0 0 0 .22 0"
                result="tonedNoise"
              />
              <feComposite in="tonedNoise" in2="SourceAlpha" operator="in" />
            </filter>

            {/* Fine isotropic tooth over the broader mineral field above. The
                two scales are deliberately non-directional: a strong 7:1
                bedding ratio was one more way the surface could read as long
                scratches instead of hand-finished limestone. */}
            <filter id={speckleId} x="-8%" y="-8%" width="116%" height="116%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.23"
                numOctaves="4"
                seed="41"
                result="speckle"
              />
              <feColorMatrix
                in="speckle"
                type="matrix"
                values=".48 0 0 0 .24
                        0 .42 0 0 .19
                        0 0 .34 0 .14
                        0 0 0 .18 0"
                result="tonedSpeckle"
              />
              <feComposite in="tonedSpeckle" in2="SourceAlpha" operator="in" />
            </filter>

            <filter id={blurId} x="-30%" y="-30%" width="160%" height="180%">
              <feGaussianBlur stdDeviation="14" />
            </filter>

            {/* ── TERRAIN FILTERS ─────────────────────────────────────────────
                The relief is LIT GEOMETRY, not painted shadow: a turbulence
                heightfield rendered by feDiffuseLighting under a distant light
                from the plate's own upper-left key (azimuth 235 ≈ the lightId
                radial at cx .22 / cy .12). Faces tilted toward the light rise
                above mid-grey, faces away fall below it, and `soft-light`
                blending turns that into lighten/darken on the limestone — so
                the crinkle can NEVER read as grey paint on cream.

                The filtered relief is contrast-centred before soft-light so
                flat ground stays near-neutral and only actual slopes shift the
                limestone's tone. */}
            <filter id={crinkleId} x="-5%" y="-5%" width="110%" height="110%">
              {/* Two deterministic scales: broad shoulders carry most of the
                  volume and a restrained finer field adds erosion only inside
                  the documented range mask. The authored masses below provide
                  direction, so this field no longer has to fake a mountain
                  spine with narrow wrinkle runs. */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.0095 0.0065"
                numOctaves="3"
                seed="11"
                result="landform"
              />
              <feTurbulence
                type="turbulence"
                baseFrequency="0.034 0.022"
                numOctaves="2"
                seed="37"
                result="erosion"
              />
              <feComposite
                in="landform"
                in2="erosion"
                operator="arithmetic"
                k2="0.8"
                k3="0.2"
                result="rawHeight"
              />
              <feGaussianBlur in="rawHeight" stdDeviation="1.45" result="height" />
              <feDiffuseLighting
                in="height"
                surfaceScale="8.2"
                diffuseConstant="0.7"
                lightingColor="#fff1df"
                result="lit"
              >
                <feDistantLight azimuth="235" elevation="58" />
              </feDiffuseLighting>
              <feComponentTransfer in="lit" result="litContrast">
                <feFuncR type="linear" slope="1.34" intercept="-0.19" />
                <feFuncG type="linear" slope="1.34" intercept="-0.19" />
                <feFuncB type="linear" slope="1.34" intercept="-0.19" />
              </feComponentTransfer>
              <feColorMatrix
                in="litContrast"
                type="matrix"
                values="1.05 0 0 0 0
                        0 .97 0 0 .006
                        0 0 .88 0 .018
                        0 0 0 1 0"
                result="warmLit"
              />
              <feComposite in="warmLit" in2="SourceAlpha" operator="in" />
            </filter>

            {/* The whole sheet gets the same treatment an octave down — the
                broad, gentle undulation of handmade paper. Far weaker than the
                range crinkle and far lower frequency, so the two never moiré. */}
            <filter id={sheetId} x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.009 0.006"
                numOctaves="3"
                seed="7"
                result="height"
              />
              <feDiffuseLighting
                in="height"
                surfaceScale="2.6"
                diffuseConstant="0.61"
                lightingColor="#ffffff"
                result="lit"
              >
                <feDistantLight azimuth="235" elevation="62" />
              </feDiffuseLighting>
              <feComponentTransfer in="lit" result="sheetContrast">
                <feFuncR type="linear" slope="1.3" intercept="-0.16" />
                <feFuncG type="linear" slope="1.3" intercept="-0.16" />
                <feFuncB type="linear" slope="1.3" intercept="-0.16" />
              </feComponentTransfer>
              <feColorMatrix
                in="sheetContrast"
                type="matrix"
                values="1.04 0 0 0 0
                        0 .96 0 0 .005
                        0 0 .86 0 .02
                        0 0 0 1 0"
                result="warmLit"
              />
              <feComposite in="warmLit" in2="SourceAlpha" operator="in" />
            </filter>

            {/* Roughens the contour hairlines and elevation fills together —
                displacement, never blur: it wiggles an edge without softening
                it, which is the difference between engraved and smudged. */}
            <filter id={etchId} x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.021"
                numOctaves="2"
                seed="33"
                result="etchNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="etchNoise"
                scale="7"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            {/* One bounded heightfield turns the broad, valley-cut mask into
                raised stone. A tighter blur keeps the branching recesses
                carved while the warm upper-left light stays fully matte. */}
            <filter id={ridgeReliefId} x="-12%" y="-12%" width="124%" height="124%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="5.2" result="ridgeHeight" />
              <feDiffuseLighting
                in="ridgeHeight"
                surfaceScale="18"
                diffuseConstant="0.86"
                lightingColor="#fff0dc"
                result="ridgeLight"
              >
                <feDistantLight azimuth="235" elevation="48" />
              </feDiffuseLighting>
              <feComponentTransfer in="ridgeLight" result="ridgeContrast">
                <feFuncR type="linear" slope="1.28" intercept="-0.15" />
                <feFuncG type="linear" slope="1.28" intercept="-0.15" />
                <feFuncB type="linear" slope="1.28" intercept="-0.15" />
              </feComponentTransfer>
              <feComponentTransfer in="ridgeContrast" result="warmRidgeLight">
                <feFuncR type="linear" slope="0.5" intercept="0.5" />
                <feFuncG type="linear" slope="0.58" intercept="0.37" />
                <feFuncB type="linear" slope="0.62" intercept="0.28" />
              </feComponentTransfer>
              <feComposite in="warmRidgeLight" in2="ridgeHeight" operator="in" />
            </filter>

            <filter id={maskBlurId} x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="11" />
            </filter>

            {/* Intensity map for the crinkle: envelope grey, mid-elevation
                lighter, summit pockets white — blurred so the relief FADES
                into the plain rather than stopping at a contour. */}
            <mask
              id={rangeMaskId}
              maskUnits="userSpaceOnUse"
              x="60"
              y="-80"
              width="760"
              height="1160"
            >
              <g filter={`url(#${maskBlurId})`}>
                {TERRAIN_BANDS.map((band) => (
                  <path key={band.key} d={band.d} fill={TERRAIN_MASK_TONE[band.level]} />
                ))}
              </g>
            </mask>

            {/* The white cluster areas are the raised highlands; black
                branching channels remove height before the diffuse-light pass,
                so valleys belong to the volume rather than sitting on it as
                strokes. Secondary ranges carry less mask luminance. */}
            <mask
              id={ridgeClusterMaskId}
              maskUnits="userSpaceOnUse"
              x="205"
              y="35"
              width="400"
              height="930"
            >
              <rect x="205" y="35" width="400" height="930" fill="#000000" />
              {TERRAIN_CLUSTERS.map((cluster) => (
                <path
                  key={cluster.key}
                  d={cluster.d}
                  fill={cluster.level === "primary" ? "#ffffff" : "#a8a8a8"}
                />
              ))}
              <g fill="none" stroke="#000000" strokeLinecap="butt" strokeLinejoin="round">
                {TERRAIN_VALLEYS.map((valley) => (
                  <path key={valley.key} d={valley.d} strokeWidth={valley.width} />
                ))}
              </g>
              <g fill="#000000">
                {TERRAIN_VALLEY_TIPS.map((tip) => (
                  <path key={tip.key} d={tip.d} />
                ))}
              </g>
            </mask>

            {/* Broad warm-beige mottling underneath the fine tooth: slow tonal
                variation across the entire face, independent of elevation. */}
            <filter id={mottleId} x="-8%" y="-8%" width="116%" height="116%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.0042 0.0032"
                numOctaves="3"
                seed="15"
                result="mottleNoise"
              />
              <feColorMatrix
                in="mottleNoise"
                type="matrix"
                values=".52 0 0 0 .27
                        0 .44 0 0 .21
                        0 0 .36 0 .16
                        0 0 0 .2 0"
                result="tonedMottle"
              />
              <feComposite in="tonedMottle" in2="SourceAlpha" operator="in" />
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
          {/* Shallow-water shelf: the sea remembering the coast — one soft ring
              at sea level, behind the wall and everything on the land. */}
          <use
            href={`#${shapeId}`}
            className="wm-coast-shelf"
            transform={`translate(${DEPTH_DROP.x} ${DEPTH_DROP.y})`}
          />
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

          {/* ── TERRAIN ─────────────────────────────────────────────────────
              Everything here sits BELOW the washes, the state engravings and
              the grain — hierarchy is coastline, then states, then terrain,
              then surface. All of it is clipped to the published coastline;
              the Titiwangsa genuinely continues into Thailand, and the clip
              cutting it at the border is the honest rendering of that. */}
          <g className="wm-map-terrain" clipPath={`url(#${clipId})`}>
            {/* The sheet: whole-plate handmade-paper undulation. */}
            <use href={`#${shapeId}`} className="wm-terrain-sheet" filter={`url(#${sheetId})`} />

            {/* The ranges: broad two-scale material relief through the graded
                geography mask. It supplies shoulders and micro-erosion; the
                authored closed masses below carry the real range direction. */}
            <g mask={`url(#${rangeMaskId})`}>
              <rect
                className="wm-terrain-range"
                x="80"
                y="-60"
                width="720"
                height="1120"
                filter={`url(#${crinkleId})`}
              />
            </g>

            {/* The geography-led cluster mask is applied BEFORE this group is
                filtered, making its cut valleys part of the heightfield. */}
            <g className="wm-terrain-clusters" filter={`url(#${ridgeReliefId})`}>
              <rect x="205" y="35" width="400" height="930" mask={`url(#${ridgeClusterMaskId})`} />
            </g>

            {/* Elevation tone + engraved contours, roughened together by the
                etch displacement so no edge is machine-smooth. The contour
                pair speaks the state-boundary engraving language (light lip
                offset below a dark hairline) but solid, thinner and far
                fainter — clearly subordinate to the dotted maroon borders. */}
            <g className="wm-terrain-etch" filter={`url(#${etchId})`}>
              {TERRAIN_BANDS.map((band) => (
                <path key={`fill-${band.key}`} className="wm-terrain-fill" d={band.d} />
              ))}
              <g className="wm-terrain-contours-light" transform="translate(0 1.2)">
                {TERRAIN_BANDS.map((band) => (
                  <path key={`cl-${band.key}`} d={band.d} />
                ))}
              </g>
              <g className="wm-terrain-contours">
                {TERRAIN_BANDS.map((band) => (
                  <path key={`cd-${band.key}`} d={band.d} />
                ))}
              </g>
            </g>
          </g>

          {/* ── LAND COVER ─────────────────────────────────────────────────
              Hue, and ONLY hue. Every fill here blends with `color`, which
              takes hue and saturation from the source and LUMINOSITY from the
              backdrop — so the relief, grain and mottle underneath survive
              untouched and simply acquire a colour. That is the whole trick:
              a green lowland that is exactly as light as the stone it
              replaces keeps the value ladder, and therefore keeps every
              burgundy peg readable (worst case 3.52:1, measured).

              Value differences between zones are carried SEPARATELY by
              `.wm-cover-shade`, at low opacity, so the forest can sit a step
              darker than the paddy without either escaping the ladder.

              The group is off by default (`--wm-landcover: 0`) and only the
              `terrain` finish turns it on, so limestone/porcelain/monument
              render exactly as before. */}
          <g className="wm-landcover" clipPath={`url(#${clipId})`}>
            <g className="wm-cover-hue">
              {LANDCOVER.map((region) => (
                <path
                  key={region.key}
                  className={`wm-cover wm-cover--${region.zone}`}
                  d={region.d}
                />
              ))}
              {URBAN.map((u) => (
                <circle
                  key={u.key}
                  className="wm-cover wm-cover--urban"
                  cx={u.cx}
                  cy={u.cy}
                  r={u.r}
                />
              ))}
              {/* ── FOREST ON THE RANGES — the only way forest is allowed back
                  (see the landcover module's blob ban). Level 0/1 envelopes
                  take the green; level-2 summit pockets stay bare stone, so
                  the mountains read clothed below and exposed at the crests —
                  which is where Malaysia's primary forest actually is. */}
              <g className="wm-range-forest">
                {TERRAIN_BANDS.filter((band) => band.level < 2).map((band) => (
                  <path
                    key={`rf-${band.key}`}
                    className={`wm-rf wm-rf--${band.level}`}
                    d={band.d}
                  />
                ))}
              </g>
            </g>
            <g className="wm-cover-shade">
              {LANDCOVER.map((region) => (
                <path
                  key={region.key}
                  className={`wm-shade wm-shade--${region.zone}`}
                  d={region.d}
                />
              ))}
            </g>
          </g>

          {/* ── RIVERS ──────────────────────────────────────────────────────
              OUTSIDE the land-cover group on purpose: water belongs to every
              finish, not only the naturalistic one. Bryan chose the limestone
              plate and asked for the rivers on it, so this group carries its
              own clip and its own opacity rather than inheriting
              `--wm-landcover`.

              Cut, not drawn on. Three passes, the same engraving logic the
              state borders use: a light stroke offset a hair DOWN-RIGHT reads
              as the sunlit far bank, the dark stroke is the channel itself,
              and a narrower core carries the water's own colour. Take the
              light pass away and the rivers instantly look like pen lines
              lying on the surface. */}
          <g className="wm-rivers" clipPath={`url(#${clipId})`}>
            {/* Wet margin — the damp, darker ground a river leaves either side
                of itself. Same ribbon, blurred, so it has no edge of its own. */}
            <g className="wm-river-margin" filter={`url(#${riverBlurId})`}>
              {RIVERS.map((river) => (
                <path key={`mg-${river.key}`} d={river.d} />
              ))}
            </g>
            {/* Lit far bank, offset along the plate's own key-light direction. */}
            <g className="wm-river-bank" transform="translate(1.2 1.5)">
              {RIVERS.map((river) => (
                <path key={`bank-${river.key}`} d={river.d} />
              ))}
            </g>
            <g className="wm-estuary-silt">
              {ESTUARIES.map((est) => (
                <ellipse
                  key={`si-${est.key}`}
                  cx={est.silt.cx}
                  cy={est.silt.cy}
                  rx={est.silt.rx}
                  ry={est.silt.ry}
                  transform={`rotate(${est.silt.angle} ${est.silt.cx} ${est.silt.cy})`}
                />
              ))}
            </g>
            <g className="wm-river-water">
              {RIVERS.map((river) => (
                <path key={`wa-${river.key}`} d={river.d} />
              ))}
            </g>
            {/* Mouth fans AFTER the water so the widening covers the ribbon's
                blunt end; the coastline clip cuts the overshoot at the shore. */}
            <g className="wm-estuaries">
              {ESTUARIES.map((est) => (
                <path key={`es-${est.key}`} d={est.fan} />
              ))}
            </g>
            {/* THE GLINT — a specular sliver up-left of centre, where the key
                light strikes moving water. This is the mark that reads as
                LIQUID; without it a filled ribbon is a coloured groove. */}
            <g className="wm-river-glint" transform="translate(-0.7 -0.9)">
              {RIVERS.map((river) => (
                <path key={`gl-${river.key}`} d={river.glint} />
              ))}
            </g>
            {/* ── FLOW — the water moving seaward ────────────────────────────
                A dashed light stroke sliding along each centreline. The dash
                travel is the ONLY ambient loop on the plate besides the peg
                pulses; killed under reduced-motion, where the rivers rest as
                fully-drawn water. */}
            <g className="wm-river-flow">
              {RIVERS.map((river) => (
                <path
                  key={`fl-${river.key}`}
                  d={river.flow}
                  style={{
                    strokeWidth: river.flowWidth,
                    animationDuration: `${river.flowDuration}s`,
                    animationDelay: `${river.flowDelay}s`,
                  }}
                />
              ))}
            </g>
          </g>

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

          {/* Whole-face material remains below the administrative engraving so
              even the stronger highland treatment cannot sand away a state
              boundary. Every use still carries the exact coastline shape. */}
          <use href={`#${shapeId}`} className="wm-map-mottle" filter={`url(#${mottleId})`} />
          <use href={`#${shapeId}`} className="wm-map-grain" filter={`url(#${grainId})`} />
          <use href={`#${shapeId}`} className="wm-map-speckle" filter={`url(#${speckleId})`} />

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

          {/* Pegs sit above the grain and engravings so their small silhouette
              stays crisp; one shared low-profile hex plate per location,
              never a ring, pulse or category-specific icon. */}
          {/* Cloud shadows sweep the terrain but never the pegs — weather
              stays under everything that stands on the map. */}
          <g clipPath={`url(#${clipId})`}>
            {CLOUDS.map((cloud) => (
              <g
                key={`cs-${cloud.key}`}
                className="wm-cloud-shadow"
                transform={`translate(${cloud.x + 24} ${cloud.y + 52}) rotate(${cloud.rot}) scale(${cloud.flip ? -cloud.s : cloud.s} ${cloud.s})`}
              >
                <CloudPuff />
              </g>
            ))}
          </g>

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

          {/* The wisps themselves — over everything in the scene, still under
              the HTML stems and cards, which live outside this SVG. */}
          <g className="wm-clouds" clipPath={`url(#${clipId})`}>
            {CLOUDS.map((cloud) => (
              <g
                key={`cw-${cloud.key}`}
                className="wm-cloud-wisp"
                transform={`translate(${cloud.x} ${cloud.y}) rotate(${cloud.rot}) scale(${cloud.flip ? -cloud.s : cloud.s} ${cloud.s})`}
              >
                <CloudPuff />
              </g>
            ))}
          </g>
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
