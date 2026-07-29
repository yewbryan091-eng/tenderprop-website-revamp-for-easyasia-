import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import { PropertyCard } from "@/components/tender/PropertyCard";
import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";
import { StateFilters } from "@/components/tender/StateFilters";
import {
  CalendarCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  LockIcon,
  ReturnIcon,
  TaHome,
  TaPin,
} from "@/components/tender/icons";
import { STATES, TYPE_TAXONOMY } from "@/data/tender-taxonomy";
import { TENDERS, type Tender } from "@/data/tenders";
import {
  TYPE_BY_VALUE, fmtDate, fmtRM, inPriceRange, matchesTaxonomy, tenderId,
} from "@/lib/tender-utils";
import "@/styles/tender-listings.css";

export const Route = createFileRoute("/tender/")({
  head: () => ({
    meta: [
      { title: "Properties Open for Tender in Malaysia | TenderProp" },
      {
        name: "description",
        content:
          "Browse Malaysian subsale properties open for sealed e-tender. Reserve prices, refundable deposits and closing dates, handled by licensed REA/REN agents.",
      },
      { property: "og:title", content: "Properties Open for Tender in Malaysia | TenderProp" },
      {
        property: "og:description",
        content:
          "Sealed-bid property tenders across Malaysia — register, submit your best offer before the closing date.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TenderListings,
});

const PER_PAGE = 12;
const SAVE_KEY = "tp_shortlist";

/* Batches are derived from the listing data — no single national deadline. */
const BATCHES = (() => {
  const counts = new Map<string, number>();
  TENDERS.forEach((t) => counts.set(t.closingDate, (counts.get(t.closingDate) || 0) + 1));
  return Array.from(counts.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
})();
const NEXT_BATCH = BATCHES[0];

const PRICE_ROWS = [
  { value: "500k-below", label: "Under RM500k" },
  { value: "501k-1mil", label: "RM500k – RM1m" },
  { value: "1mil-2mil", label: "RM1m – RM2m" },
  { value: "2mil-above", label: "RM2m+" },
];
const MIN_OPTIONS = [100000, 200000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 3000000];
const MAX_OPTIONS = [300000, 500000, 750000, 1000000, 1500000, 2000000, 3000000, 5000000];
const CAT_CHIP: Record<string, string> = {
  residential: "Residential", commercial: "Commercial", industrial: "Industrial", land: "Land",
};

const INDEXED = TENDERS.map((x, i) => ({ ...x, _i: i })) as (Tender & { _i: number })[];

/* Null until mount so SSR and first paint never show a flash of zeros.
   Tenders close at 5:00 PM Malaysian time on the closing date. */
type Remaining = { days: number; hours: number; minutes: number; seconds: number };
function useCountdown(iso: string): Remaining | null {
  const [left, setLeft] = useState<Remaining | null>(null);
  useEffect(() => {
    const target = new Date(iso + "T17:00:00+08:00").getTime();
    const compute = (): Remaining => {
      const diff = Math.max(0, target - Date.now());
      const seconds = Math.floor(diff / 1000);
      return {
        days: Math.floor(seconds / 86400),
        hours: Math.floor((seconds % 86400) / 3600),
        minutes: Math.floor((seconds % 3600) / 60),
        seconds: seconds % 60,
      };
    };
    setLeft(compute());
    const id = window.setInterval(() => setLeft(compute()), 1000);
    return () => window.clearInterval(id);
  }, [iso]);
  return left;
}
const pad2 = (n: number) => String(n).padStart(2, "0");

function TenderListings() {
  const left = useCountdown(NEXT_BATCH.date);
  const countdownUnits = [
    { label: "d", value: left ? String(left.days) : "" },
    { label: "h", value: left ? pad2(left.hours) : "" },
    { label: "m", value: left ? pad2(left.minutes) : "" },
    { label: "s", value: left ? pad2(left.seconds) : "" },
  ];
  const countdownLabel = left
    ? `Offers close in ${left.days} days, ${left.hours} hours, ${left.minutes} minutes and ${left.seconds} seconds`
    : "Offers close in";

  const [query, setQuery] = useState("");
  const [typeValue, setTypeValue] = useState("all");
  const [category, setCategory] = useState("all");
  const [ranges, setRanges] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [state, setState] = useState("all");
  const [area, setArea] = useState("");
  const [areaLabel, setAreaLabel] = useState("");
  const [sortMode, setSortMode] = useState("closing");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [priceOpen, setPriceOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [taOpen, setTaOpen] = useState(false);
  const [taActive, setTaActive] = useState(-1);
  const resultsTop = useRef<HTMLDivElement>(null);
  /* Price popover keeps a draft copy so nothing filters until Apply. */
  const priceWrapRef = useRef<HTMLDivElement>(null);
  const priceBtnRef = useRef<HTMLButtonElement>(null);
  const [draftMin, setDraftMin] = useState("");
  const [draftMax, setDraftMax] = useState("");
  const [draftRanges, setDraftRanges] = useState<string[]>([]);

  useEffect(() => {
    try {
      setSaved(new Set(JSON.parse(localStorage.getItem(SAVE_KEY) || "[]")));
    } catch { /* shortlist is best-effort */ }
  }, []);

  /* Escape closes the filter drawer without losing the selected filters. */
  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSheetOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  /* Price popover: outside click and Escape close it, focus returns to the button. */
  useEffect(() => {
    if (!priceOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!priceWrapRef.current?.contains(e.target as Node)) setPriceOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setPriceOpen(false); priceBtnRef.current?.focus(); }
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [priceOpen]);

  function toggleSave(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(Array.from(next))); } catch { /* ignore */ }
      return next;
    });
  }

  /* ---- Filtering, grouped so faceted counts can exclude their own group ---- */
  const groups = useMemo(() => {
    const q = query.toLowerCase().trim();
    const mn = priceMin ? parseInt(priceMin) : null;
    const mx = priceMax ? parseInt(priceMax) : null;
    const priceActive = ranges.length > 0 || mn !== null || mx !== null;
    return {
      text: (x: Tender) =>
        !q ||
        x.name.toLowerCase().includes(q) ||
        `${x.area}, ${x.stateName}`.toLowerCase().includes(q),
      category: (x: Tender) => category === "all" || x.propertyCategory === category,
      type: (x: Tender) => matchesTaxonomy(x, typeValue),
      price: (x: Tender) => {
        if (!priceActive) return true;
        const p = x.reservePrice;
        if (ranges.some((r) => inPriceRange(p, r))) return true;
        return (mn !== null || mx !== null) && p > 0 && (mn === null || p >= mn) && (mx === null || p <= mx);
      },
      location: (x: Tender) =>
        (state === "all" || x.stateKey === state) && (area === "" || x.area.toLowerCase() === area),
    };
  }, [query, category, typeValue, ranges, priceMin, priceMax, state, area]);

  const passesExcept = (x: Tender, skip: string | null) =>
    (Object.keys(groups) as (keyof typeof groups)[]).every((g) => g === skip || groups[g](x));

  const matched = useMemo(
    () => INDEXED.filter((x) => passesExcept(x, null)),
    [groups],
  );

  const sorted = useMemo(() => {
    const list = matched.slice();
    if (sortMode === "closing") list.sort((a, b) => +new Date(a.closingDate) - +new Date(b.closingDate));
    else if (sortMode === "latest") list.sort((a, b) => b._i - a._i);
    else if (sortMode === "price-asc") list.sort((a, b) => (a.reservePrice || Infinity) - (b.reservePrice || Infinity));
    else if (sortMode === "price-desc") list.sort((a, b) => (b.reservePrice || 0) - (a.reservePrice || 0));
    return list;
  }, [matched, sortMode]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const slice = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const locationPool = useMemo(() => INDEXED.filter((x) => passesExcept(x, "location")), [groups]);
  const catCount = (c: string) =>
    INDEXED.filter((x) => passesExcept(x, "category") && (c === "all" || x.propertyCategory === c)).length;
  const priceCount = (r: string) =>
    INDEXED.filter((x) => passesExcept(x, "price") && inPriceRange(x.reservePrice, r)).length;

  /* Type dropdown: full live taxonomy always renders; counts scope to the active
     category tab and empty options are disabled so they can't dead-end. */
  const typeOptions = useMemo(() => {
    const pool = INDEXED.filter((x) => category === "all" || x.propertyCategory === category);
    return TYPE_TAXONOMY.map((t) => ({
      ...t,
      n: t.value === "all" ? pool.length : pool.filter((x) => matchesTaxonomy(x, t.value)).length,
    }));
  }, [category]);

  function reset() {
    setQuery(""); setTypeValue("all"); setCategory("all"); setRanges([]);
    setPriceMin(""); setPriceMax(""); setState("all"); setArea(""); setAreaLabel("");
    setPriceOpen(false); setPage(1);
  }

  const activePriceCount = ranges.length + (priceMin ? 1 : 0) + (priceMax ? 1 : 0);

  /* Compact, human-readable summary of the applied price filter. */
  const priceSummary = (() => {
    const mn = priceMin ? parseInt(priceMin) : null;
    const mx = priceMax ? parseInt(priceMax) : null;
    if (mn !== null && mx !== null) return `${fmtRM(mn)}–${fmtRM(mx)}`;
    if (mn !== null) return `${fmtRM(mn)}+`;
    if (mx !== null) return `Up to ${fmtRM(mx)}`;
    if (ranges.length === 1) return PRICE_ROWS.find((p) => p.value === ranges[0])?.label ?? null;
    if (ranges.length > 1) return `${ranges.length} price bands`;
    return null;
  })();

  function openPrice() {
    setDraftMin(priceMin); setDraftMax(priceMax); setDraftRanges(ranges);
    setPriceOpen(true);
  }
  function applyPrice() {
    setPriceMin(draftMin); setPriceMax(draftMax); setRanges(draftRanges);
    setPage(1); setPriceOpen(false); priceBtnRef.current?.focus();
  }
  function clearPrice() {
    setDraftMin(""); setDraftMax(""); setDraftRanges([]);
    setPriceMin(""); setPriceMax(""); setRanges([]); setPage(1);
  }

  /* ---- Active filter chips ---- */
  const chips: { label: string; clear: () => void }[] = [];
  if (state !== "all") {
    const st = STATES.find((s) => s.key === state);
    chips.push({ label: st ? st.name : state, clear: () => { setState("all"); setArea(""); setPage(1); } });
    if (area) chips.push({ label: areaLabel || area, clear: () => { setArea(""); setAreaLabel(""); setPage(1); } });
  }
  if (category !== "all") chips.push({ label: CAT_CHIP[category] || category, clear: () => { setCategory("all"); setPage(1); } });
  if (typeValue !== "all") {
    const t = TYPE_BY_VALUE[typeValue];
    chips.push({
      label: t ? t.label.replace(/^-+|-+$/g, "") : typeValue,
      clear: () => { setTypeValue("all"); setPage(1); },
    });
  }
  ranges.forEach((r) => {
    const row = PRICE_ROWS.find((p) => p.value === r);
    chips.push({ label: row?.label || r, clear: () => { setRanges((v) => v.filter((y) => y !== r)); setPage(1); } });
  });
  if (priceMin || priceMax) {
    const mn = priceMin ? parseInt(priceMin) : null;
    const mx = priceMax ? parseInt(priceMax) : null;
    const label =
      mn !== null && mx !== null ? `${fmtRM(mn)} – ${fmtRM(mx)}`
        : mn !== null ? `From ${fmtRM(mn)}`
        : mx !== null ? `Up to ${fmtRM(mx)}` : "Custom";
    chips.push({ label, clear: () => { setPriceMin(""); setPriceMax(""); setPage(1); } });
  }
  if (query.trim()) chips.push({ label: `“${query.trim()}”`, clear: () => { setQuery(""); setPage(1); } });

  /* ---- Location typeahead ---- */
  const taPool = useMemo(() => {
    const pool: { label: string; term?: string; kind: string; type: string }[] = [];
    const seen: Record<string, boolean> = {};
    STATES.forEach((s) => {
      if (TENDERS.some((t) => t.stateKey === s.key)) pool.push({ label: s.name, kind: "State", type: "state" });
    });
    TENDERS.forEach((t) => {
      const k = `${t.stateKey}|${t.area}`.toLowerCase();
      if (!seen[k]) { seen[k] = true; pool.push({ label: `${t.area}, ${t.stateName}`, term: t.area, kind: "Area", type: "area" }); }
    });
    TENDERS.forEach((t) => {
      const k = "n" + t.name.toLowerCase();
      if (!seen[k]) { seen[k] = true; pool.push({ label: t.name, kind: "Property", type: "name" }); }
    });
    return pool;
  }, []);
  const taMatches = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return taPool.filter((m) => m.label.toLowerCase().includes(q)).slice(0, 8);
  }, [query, taPool]);

  function pick(m: { label: string; term?: string }) {
    setQuery(m.term || m.label.split(",")[0]);
    setTaOpen(false); setTaActive(-1); setPage(1);
  }

  const pageWindow: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) pageWindow.push(i);
  }
  function goPage(n: number) {
    setPage(n);
    const el = document.getElementById("listings");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 70, behavior: "smooth" });
  }

  const from = sorted.length ? (currentPage - 1) * PER_PAGE + 1 : 0;
  const to = Math.min(currentPage * PER_PAGE, sorted.length);

  return (
    <div className="tp-listings">
      <a className="skip-link" href="#listings">Skip to listings</a>
      <SiteHeader />

      <main>
        {/* HERO — full-bleed diagonal split.
            Left panel: tender-cycle announcement. Right panel: buyer assurances. */}
        <section className="hero-tender" aria-label="Tender overview">
          <div className="hero-panel hero-panel-left is-dark">
            <div className="hero-panel-inner">
              <div className="hero-timer" aria-live="off" aria-label={countdownLabel}>
                <span className="hero-timer-heading" aria-hidden="true">
                  <span className="hero-timer-clock"><ClockIcon /></span>
                  <span className="hero-timer-label">Offers close in</span>
                </span>
                <span className="hero-timer-cells" aria-hidden="true">
                  {countdownUnits.map((unit) => (
                    <span className="hero-timer-cell" key={unit.label}>
                      <span className="hero-timer-value">{unit.value || "\u00a0"}</span>
                      <span className="hero-timer-unit">{unit.label}</span>
                    </span>
                  ))}
                </span>
              </div>
              <p className="hero-eyebrow">Next tender cycle</p>
              <p className="hero-date">{fmtDate(NEXT_BATCH.date)}</p>
              <p className="hero-cycle-count">
                <strong>{NEXT_BATCH.count}</strong> {NEXT_BATCH.count === 1 ? "property" : "properties"} in this cycle
              </p>
              <a className="btn red hero-cta" href="#listings">
                View Tender Properties
              </a>
              <p className="hero-foot">Offer submissions close at 5:00 PM (MYT)</p>
            </div>
          </div>
          <div className="hero-panel hero-panel-right">
            <div className="hero-panel-inner">
              <p className="hero-eyebrow">Sealed e-tender</p>
              <ul className="hero-flow hero-assurances" aria-label="Sealed e-tender assurances">
                <li className="hero-assurance hero-assurance-primary">
                  <span className="hero-assurance-icon" aria-hidden="true"><LockIcon /></span>
                  <div>
                    <h2 className="hero-seal-title">Your offer stays private</h2>
                    <p>No one — not other buyers, not the public — ever sees what you offered.</p>
                  </div>
                </li>
                <li className="hero-assurance">
                  <span className="hero-assurance-icon" aria-hidden="true"><CalendarCheckIcon /></span>
                  <div>
                    <strong>Reviewed after closing</strong>
                    <p>All valid offers are presented after the tender deadline.</p>
                  </div>
                </li>
                <li className="hero-assurance hero-assurance-outcome">
                  <span className="hero-assurance-icon hero-assurance-icon-pair" aria-hidden="true">
                    <span className="hero-outcome-accepted"><CheckCircleIcon /></span>
                    <span><ReturnIcon /></span>
                  </span>
                  <div>
                    <strong>Accepted, or refunded</strong>
                    <p>Successful buyers proceed through the appointed agent. Otherwise, the refundable deposit is returned in full.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>


        {/* SEARCH BAND — sits directly below the hero date */}
        <section className="hero-search-band" aria-labelledby="property-search-title">
          <div className="wrap">
            <div className="search-intro">
              <h2 id="property-search-title">Find a property <span className="hl">open for tender</span></h2>
            </div>
            <form
              className="search-form"
              onSubmit={(e) => {
                e.preventDefault();
                setPage(1);
                setTaOpen(false);
                resultsTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <div className="search-bar">
                <div className="field typeahead sb-loc">
                  <label htmlFor="search-location">Location</label>
                  <input
                    type="text"
                    id="search-location"
                    placeholder="Search project, township, city or state"
                    autoComplete="off"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={taOpen && taMatches.length > 0}
                    aria-controls="ta-list"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setPage(1); setTaOpen(true); setTaActive(-1); }}
                    onBlur={() => window.setTimeout(() => setTaOpen(false), 120)}
                    onKeyDown={(e) => {
                      if (!taOpen || !taMatches.length) return;
                      if (e.key === "ArrowDown") { e.preventDefault(); setTaActive((i) => Math.min(i + 1, taMatches.length - 1)); }
                      else if (e.key === "ArrowUp") { e.preventDefault(); setTaActive((i) => Math.max(i - 1, 0)); }
                      else if (e.key === "Enter" && taActive >= 0) { e.preventDefault(); pick(taMatches[taActive]); }
                      else if (e.key === "Escape") setTaOpen(false);
                    }}
                  />
                  <div className={"ta-list" + (taOpen && taMatches.length ? " show" : "")} id="ta-list" role="listbox">
                    {taMatches.map((m, i) => (
                      <div
                        key={m.type + m.label}
                        className={"ta-item" + (i === taActive ? " active" : "")}
                        role="option"
                        aria-selected={i === taActive}
                        onMouseDown={(e) => { e.preventDefault(); pick(m); }}
                      >
                        <span>{m.type === "name" ? <TaHome /> : <TaPin />}</span>
                        <span>{m.label}</span>
                        <span className="ta-kind">{m.kind}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="field sb-type">
                  <label htmlFor="search-type">Property type</label>
                  <select
                    id="search-type"
                    value={typeValue}
                    onChange={(e) => { setTypeValue(e.target.value); setPage(1); }}
                  >
                    {typeOptions.map((t) => (
                      <option key={t.value} value={t.value} disabled={t.value !== "all" && t.n === 0}>
                        {t.label}{t.value !== "all" && t.n ? ` (${t.n})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn red btn-search">Search</button>
              </div>
            </form>

            {/* Category segmented nav: single-select, drives the type dropdown + all counts */}
            <div className="cat-nav" role="tablist" aria-label="Property category" id="cat-nav">
              {[
                { key: "all", label: "All" },
                { key: "residential", label: "Residential" },
                { key: "commercial", label: "Commercial" },
                { key: "industrial", label: "Industrial" },
                { key: "land", label: "Land" },
              ].map((c) => {
                const n = catCount(c.key);
                const active = category === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    className={"cat-tab" + (active ? " active" : "") + (n === 0 && !active ? " dim" : "")}
                    role="tab"
                    aria-selected={active}
                    onClick={() => { setCategory(c.key); setTypeValue("all"); setPage(1); }}
                  >
                    {c.label} <span className="c">{n}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* MAIN LISTINGS AREA */}
        <section className="listings-section" id="listings">
          <div className="wrap main-layout">
            <div className="results-column">
              <div className="results-header" ref={resultsTop}>
                <span className="results-count">
                  {sorted.length
                    ? `${sorted.length} ${sorted.length === 1 ? "property" : "properties"} open for tender · showing ${from}–${to}`
                    : "No properties match your filters"}
                </span>
                <div className="results-tools">
                  <button
                    type="button"
                    className="filters-open-btn"
                    aria-expanded={sheetOpen}
                    onClick={() => setSheetOpen(true)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />
                    </svg>
                    <span>Tender by State</span>
                    {state !== "all" && (
                      <span className="tool-badge">{area ? 2 : 1}</span>
                    )}
                  </button>
                  <div className="sort-field">
                    <label htmlFor="sort-by">Sort</label>
                    <select id="sort-by" value={sortMode} onChange={(e) => { setSortMode(e.target.value); setPage(1); }}>
                      <option value="closing">Closing soonest</option>
                      <option value="latest">Latest listed</option>
                      <option value="price-asc">Reserve price: low to high</option>
                      <option value="price-desc">Reserve price: high to low</option>
                    </select>
                  </div>
                  {/* Price range — the single price control on the page */}
                  <div className="price-tool" ref={priceWrapRef}>
                    <button
                      type="button"
                      ref={priceBtnRef}
                      className={"price-tool-btn" + (priceSummary ? " is-active" : "")}
                      aria-expanded={priceOpen}
                      aria-controls="price-popover"
                      aria-haspopup="dialog"
                      aria-label={priceSummary ? `Price range: ${priceSummary}` : "Price range"}
                      onClick={() => (priceOpen ? setPriceOpen(false) : openPrice())}
                    >
                      <span className="ptb-short" aria-hidden="true">{priceSummary || "Price"}</span>
                      <span className="ptb-full">{priceSummary || "Price range"}</span>
                      <svg className="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    {priceOpen && (
                      <div className="price-popover" id="price-popover" role="dialog" aria-label="Price range">
                        <div className="price-minmax">
                          <label className="pp-field">
                            <span>Minimum (RM)</span>
                            <select value={draftMin} onChange={(e) => setDraftMin(e.target.value)}>
                              <option value="">No min</option>
                              {MIN_OPTIONS.map((v) => <option key={v} value={v}>{fmtRM(v)}</option>)}
                            </select>
                          </label>
                          <span className="mm-sep" aria-hidden="true">to</span>
                          <label className="pp-field">
                            <span>Maximum (RM)</span>
                            <select value={draftMax} onChange={(e) => setDraftMax(e.target.value)}>
                              <option value="">No max</option>
                              {MAX_OPTIONS.map((v) => <option key={v} value={v}>{fmtRM(v)}</option>)}
                            </select>
                          </label>
                        </div>
                        <p className="pp-legend">Or pick a band</p>
                        <div className="price-pop">
                          {PRICE_ROWS.map((r) => (
                            <label className="pop-row" key={r.value}>
                              <input
                                type="checkbox"
                                value={r.value}
                                checked={draftRanges.includes(r.value)}
                                onChange={(e) =>
                                  setDraftRanges((v) => (e.target.checked ? [...v, r.value] : v.filter((y) => y !== r.value)))
                                }
                              />
                              <span className="box" aria-hidden="true" />
                              <span className="label">{r.label}</span>
                              <span className="count">{priceCount(r.value)}</span>
                            </label>
                          ))}
                        </div>
                        <div className="pp-actions">
                          <button type="button" className="pp-clear" onClick={clearPrice} disabled={activePriceCount === 0 && !draftMin && !draftMax && draftRanges.length === 0}>Clear</button>
                          <button type="button" className="btn red pp-apply" onClick={applyPrice}>Apply</button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="view-toggle" role="group" aria-label="Result layout">
                    <button type="button" className={"toggle-btn" + (view === "grid" ? " active" : "")} title="Grid View" aria-pressed={view === "grid"} onClick={() => setView("grid")}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                      </svg>
                      <span>Grid</span>
                    </button>
                    <button type="button" className={"toggle-btn" + (view === "list" ? " active" : "")} title="List View" aria-pressed={view === "list"} onClick={() => setView("list")}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                      <span>List</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="chips">
                {chips.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    className="chip"
                    aria-label={`Remove filter: ${c.label}`}
                    onClick={c.clear}
                  >
                    <span>{c.label}</span><span className="x" aria-hidden="true">×</span>
                  </button>
                ))}
                {chips.length > 0 && (
                  <button type="button" className="chip clear" onClick={reset}>Clear all</button>
                )}
              </div>

              <div className={"props-grid " + (view === "grid" ? "grid-mode" : "list-mode")}>
                {slice.length ? (
                  slice.map((x) => (
                    <PropertyCard key={tenderId(x) + x._i} x={x} saved={saved.has(tenderId(x))} onToggleSave={toggleSave} />
                  ))
                ) : (
                  <div className="no-results">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                    <b>No tenders match your filters</b>
                    <span>Try widening your search &mdash; remove a filter or pick another state.</span>
                    <button type="button" className="btn red" onClick={reset}>Clear all filters</button>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <nav className="pagination" aria-label="Listing pages">
                  {pageWindow.map((i, idx) => (
                    <span key={i}>
                      {idx > 0 && i - pageWindow[idx - 1] > 1 && <span className="gap">…</span>}
                      <button
                        type="button"
                        className={"page-btn" + (i === currentPage ? " on" : "")}
                        aria-current={i === currentPage ? "page" : undefined}
                        onClick={() => goPage(i)}
                      >
                        {i}
                      </button>
                    </span>
                  ))}
                  <button type="button" aria-label="Next page" disabled={currentPage >= totalPages} onClick={() => goPage(currentPage + 1)}>&raquo;</button>
                  <button type="button" aria-label="Last page" disabled={currentPage >= totalPages} onClick={() => goPage(totalPages)}>Last</button>
                </nav>
              )}
            </div>

            {/* Sidebar filters (drawer on mobile) */}
            <div className={"filters-backdrop" + (sheetOpen ? " show" : "")} onClick={() => setSheetOpen(false)} />
            <aside
              className={"sidebar-filters" + (sheetOpen ? " open" : "")}
              aria-label="Tender by state"
            >
              <div className="rail-head">
                <h2 className="rail-title">Tender by State</h2>
                <button
                  type="button"
                  className="sheet-close"
                  aria-label="Close tender by state"
                  onClick={() => setSheetOpen(false)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <div className="filters-scroll">
                <div className="state-panel">
                  <StateFilters
                    pool={locationPool}
                    activeState={state}
                    activeArea={area}
                    onSelect={(k, a, label) => { setState(k); setArea(a); setAreaLabel(label); setPage(1); }}
                  />
                </div>
              </div>

              <div className="sheet-actions">
                <button type="button" className="btn red" onClick={() => setSheetOpen(false)}>
                  Show <span>{sorted.length}</span> properties
                </button>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
