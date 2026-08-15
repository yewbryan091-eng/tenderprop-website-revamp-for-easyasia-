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
    note: "Balanced cream surface, taupe stone edge and one restrained brass rim. This is the homepage candidate.",
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
    note: "Real land cover: rainforest, the Kedah-Perlis rice bowl, the Straits mangrove fringe, four settlement smudges and four rivers. Hue only — every tint blends with `color`, so the relief keeps its own value and the pegs stay readable.",
  },
];

function Sandbox() {
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
        {STUDIES.map((study) => (
          <section key={study.finish} className="sb-map-panel">
            <header>
              <h2>{study.title}</h2>
              <p>{study.note}</p>
            </header>
            <WestMalaysiaMap finish={study.finish} />
          </section>
        ))}
      </div>
    </main>
  );
}
