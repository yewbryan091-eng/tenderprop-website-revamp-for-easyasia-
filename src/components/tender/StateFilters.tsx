import { useId, useMemo, useState } from "react";

import { AREAS, STATES } from "@/data/tender-taxonomy";
import { TENDERS, type Tender } from "@/data/tenders";
import { ChevronIcon } from "./icons";

/* Small burgundy location pin used on every navigator row (decorative). */
const RowPin = () => (
  <svg className="marker" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

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

/* "Tender by State" — a standalone state navigator. The row itself applies the
   state filter; the chevron is a separate control so cities can be inspected
   without changing the selection. Only one state's city group is open at once. */
export function StateFilters({
  pool, activeState, activeArea, onSelect,
}: {
  pool: Tender[];               // everything passing the OTHER filter groups
  activeState: string;
  activeArea: string;
  onSelect: (stateKey: string, area: string, areaLabel: string) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();
  const inventory = useMemo(() => tallyOf(TENDERS), []);
  const counts = useMemo(() => tallyOf(pool), [pool]);

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
      <div className="accordion-item all-state-item">
        <div className="accordion-row">
          <button
            type="button"
            className={"accordion-trigger all-state-trigger" + (activeState === "all" ? " active" : "")}
            aria-pressed={activeState === "all"}
            onClick={() => { setOpen(null); onSelect("all", "", ""); }}
          >
            <RowPin />
            <span className="label">All Malaysia</span>
            {activeState === "all" && <span className="sel-tick" aria-hidden="true">✓</span>}
            <span className="count" aria-label={`${pool.length} properties`}>{pool.length}</span>
          </button>
        </div>
      </div>

      {ordered.map((s) => {
        const stock = inventory[s.key] || { total: 0, areas: {} };
        const live = counts[s.key] || { total: 0, areas: {} };
        const names: Record<string, true> = {};
        (AREAS[s.key] || []).forEach((a) => { names[a] = true; });
        Object.keys(stock.areas).forEach((a) => { names[a] = true; });
        const areas = Object.keys(names).sort((a, b) =>
          a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
        );
        const hasChildren = areas.length > 0;
        const isOpen = open === s.key;
        const stateActive = activeState === s.key;
        const bodyId = `${uid}-cities-${s.key}`;
        const disabled = stock.total === 0 || (live.total === 0 && !stateActive);

        return (
          <div className="accordion-item" key={s.key}>
            <div className="accordion-row">
              <button
                type="button"
                className={"accordion-trigger" + (stateActive ? " active" : "")}
                aria-pressed={stateActive}
                disabled={disabled}
                onClick={() => { setOpen(hasChildren ? s.key : null); onSelect(s.key, "", ""); }}
              >
                <RowPin />
                <span className="label">{s.name}</span>
                {stateActive && <span className="sel-tick" aria-hidden="true">✓</span>}
                <span className="count" aria-label={`${live.total} properties`}>{live.total}</span>
              </button>
              {hasChildren ? (
                <button
                  type="button"
                  className={"accordion-chev" + (isOpen ? " open" : "")}
                  aria-expanded={isOpen}
                  aria-controls={bodyId}
                  aria-label={`${isOpen ? "Collapse" : "Expand"} cities in ${s.name}`}
                  onClick={() => setOpen(isOpen ? null : s.key)}
                >
                  <ChevronIcon />
                </button>
              ) : (
                <span className="accordion-chev is-empty" aria-hidden="true" />
              )}
            </div>
            <div className={"accordion-body" + (isOpen ? " open" : "")} id={bodyId} hidden={!isOpen}>
              <ul className="sub-list">
                <li>
                  <button
                    type="button"
                    className={"area-link all-area" + (stateActive && !activeArea ? " active" : "")}
                    onClick={() => onSelect(s.key, "", "")}
                  >
                    <span className="label">All</span>
                    <span className="count" aria-label={`${live.total} properties`}>{live.total}</span>
                  </button>
                </li>
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
                        <span className="count" aria-label={`${n} properties`}>{n}</span>
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
