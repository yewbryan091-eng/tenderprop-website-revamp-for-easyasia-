import { createFileRoute } from "@tanstack/react-router";

import { WestMalaysiaMap, type WestMalaysiaMapFinish } from "@/components/home/WestMalaysiaMap";
import "@/styles/sandbox-dua-cara.css";

export const Route = createFileRoute("/sandbox")({
  head: () => ({
    meta: [
      { title: "West Malaysia map study — TenderProp" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Sandbox,
});

const STUDIES: {
  finish: WestMalaysiaMapFinish;
  title: string;
  note: string;
}[] = [
  {
    finish: "limestone",
    title: "A — Warm limestone",
    note: "Balanced cream surface, taupe stone edge and one restrained brass rim. Runner-up — kept for comparison.",
  },
  {
    finish: "porcelain",
    title: "B — Pale porcelain",
    note: "Brighter and airier, with the softest sidewall. Cleaner, but at risk of reading like cut paper.",
  },
  {
    finish: "monument",
    title: "C — Burgundy monument",
    note: "Deeper wine-toned extrusion and stronger mass. Most branded, but visually heavier beside the editorial copy.",
  },
  {
    finish: "terrain",
    title: "D — Naturalistic terrain",
    note: "CHOSEN 15 Aug — the live homepage finish; all iteration happens here. Real land cover through the hue-only blend, now with feathered margins, blue flowing rivers, lakes and dirt ranges.",
  },
];

function Sandbox() {
  /* `?finish=terrain` renders one study alone — the verification loop needs a
     reliable, scroll-free screenshot of a single plate. Client-only read;
     during SSR every study renders, which is also the correct fallback. */
  const only =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("finish")
      : null;
  const studies = only ? STUDIES.filter((study) => study.finish === only) : STUDIES;
  return (
    <main className="sb-map-study">
      <header className="sb-map-head">
        <p>Section 2 · right side · map only</p>
        <h1>Peninsular Malaysia material study</h1>
        <span>
          One Natural Earth coastline, three material treatments. No cards, pins, labels or East
          Malaysia.
        </span>
      </header>

      <div className="sb-map-grid">
        {studies.map((study) => (
          <section key={study.finish} className="sb-map-panel">
            <header>
              <h2>{study.title}</h2>
              <p>{study.note}</p>
            </header>
            <WestMalaysiaMap finish={study.finish} markers />
          </section>
        ))}
      </div>
    </main>
  );
}
