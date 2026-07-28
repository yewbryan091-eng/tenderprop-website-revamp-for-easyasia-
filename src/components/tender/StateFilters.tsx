import { useMemo, useState } from "react";

import { AREAS, STATES } from "@/data/tender-taxonomy";
import { TENDERS, type Tender } from "@/data/tenders";
import { ChevronIcon } from "./icons";

type Tally = Record<string, { total: number; areas: Record<string, number> }>;

function tallyOf(list: Tender[]): Tally {
  const t: Tally = {};
  list.forEach((x) => {
    if (!t[x.stateKey]) t[x.stateKey] = { total: 0, areas: {} };
    t[x.stateKey].total++;
    t[x.stateKey].areas[x.area] = (t[x.stateKey].areas[x.area] || 0) + 1;
  });
  return t;
}

/* "Tender By State" — single-open accordion. Selecting a state header means
   "view all of it"; areas with no stock still render, disabled, so the list
   reads as national coverage. */
export function StateFilters({
  pool, activeState, activeArea, onSelect, query = "",
}: {
  pool: Tender[];               // everything passing the OTHER filter groups
  activeState: string;
  activeArea: string;
  onSelect: (stateKey: string, area: string, areaLabel: string) => void;
  query?: string;               // purely a display filter over the rendered rows
}) {
  const [open, setOpen] = useState<string | null>(null);
  const inventory = useMemo(() => tallyOf(TENDERS), []);
  const counts = useMemo(() => tallyOf(pool), [pool]);
  const q = query.trim().toLowerCase();

  const ordered = useMemo(() => {
    const sorted = STATES.slice().sort((a, b) => {
      const at = inventory[a.key]?.total || 0;
      const bt = inventory[b.key]?.total || 0;
      return bt - at || a.name.localeCompare(b.name);
    });
    return sorted
      .filter((s) => (inventory[s.key]?.total || 0) > 0)
      .concat(sorted.filter((s) => (inventory[s.key]?.total || 0) === 0));
  }, [inventory]);

  return (
    <div id="state-filters">
      {!q && (
      <div className="accordion-item all-state-item">
        <button
          type="button"
          className={"accordion-trigger all-state-trigger" + (activeState === "all" ? " active" : "")}
          aria-pressed={activeState === "all"}
          onClick={() => { setOpen(null); onSelect("all", "", ""); }}
        >
          <span className="label">All Malaysia</span>
          <span className="count">{pool.length}</span>
        </button>
      </div>
      )}

      {ordered.map((s) => {
        const stock = inventory[s.key] || { total: 0, areas: {} };
        const live = counts[s.key] || { total: 0, areas: {} };
        const names: Record<string, true> = {};
        (AREAS[s.key] || []).forEach((a) => { names[a] = true; });
        Object.keys(stock.areas).forEach((a) => { names[a] = true; });
        let areas = Object.keys(names).sort((a, b) =>
          a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
        );
        const stateHit = s.name.toLowerCase().includes(q);
        if (q && !stateHit) areas = areas.filter((a) => a.toLowerCase().includes(q));
        if (q && !stateHit && areas.length === 0) return null;
        const hasChildren = areas.length > 0;
        const isOpen = q ? hasChildren : open === s.key;
        const stateActive = activeState === s.key;

        return (
          <div className="accordion-item" key={s.key}>
            <button
              type="button"
              className={"accordion-trigger" + (stateActive ? " active" : "")}
              aria-expanded={hasChildren ? isOpen : undefined}
              aria-pressed={stateActive}
              disabled={stock.total === 0 || (live.total === 0 && !stateActive)}
              onClick={() => {
                if (isOpen) { setOpen(null); onSelect("all", "", ""); return; }
                setOpen(s.key);
                onSelect(s.key, "", "");
              }}
            >
              <span className="label">{s.name}</span>
              <span className="count">{live.total}</span>
              {hasChildren ? <ChevronIcon /> : null}
            </button>
            <div className={"accordion-body" + (isOpen ? " open" : "")}>
              <ul className="sub-list">
                {!q && (
                <li>
                  <button
                    type="button"
                    className={"area-link all-area" + (stateActive && !activeArea ? " active" : "")}
                    onClick={() => onSelect(s.key, "", "")}
                  >
                    <span className="label">All</span>
                    <span className="count">{live.total}</span>
                  </button>
                </li>
                )}
                {areas.map((a) => {
                  const n = live.areas[a] || 0;
                  const on = stateActive && activeArea === a.toLowerCase();
                  return (
                    <li key={a}>
                      <button
                        type="button"
                        className={"area-link" + (on ? " active" : "")}
                        aria-pressed={on}
                        disabled={(stock.areas[a] || 0) === 0 || (n === 0 && !on)}
                        onClick={() => onSelect(s.key, a.toLowerCase(), a)}
                      >
                        <span className="label">{a}</span>
                        <span className="count">{n}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
