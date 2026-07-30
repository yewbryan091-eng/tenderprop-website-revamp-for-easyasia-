import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { PropertyCard } from "@/components/tender/PropertyCard";
import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";
import { StateFilters } from "@/components/tender/StateFilters";
import {
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
  TYPE_BY_VALUE, fmtDate, fmtRM, matchesTaxonomy, tenderId,
} from "@/lib/tender-utils";
import "@/styles/tender-listings.css";

export const Route = createFileRoute("/tender/")({
  head: () => ({
    meta: [
      { title: "Properties Open for Tender in Malaysia | TenderProp" },
      {
        name: "description",
        content:
          "Browse Malaysian subsale properties open for sealed e-tender. Reserve prices, refundable deposits and closing dates, all in one cycle.",
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
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const HERO_DATE = (() => {
  const [year, month, day] = NEXT_BATCH.date.split("-").map(Number);
  const lastTwo = day % 100;
  const suffix = lastTwo >= 11 && lastTwo <= 13
    ? "th"
    : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[day % 10] || "th";
  return { day, suffix, month: MONTH_NAMES[month - 1], year };
})();

const PRICE_MIN_OPTIONS = [
  100000, 200000, 300000, 400000, 500000, 750000, 1000000, 1500000,
  2000000, 3000000, 5000000, 10000000, 20000000, 50000000,
];
const PRICE_MAX_OPTIONS = [
  300000, 500000, 750000, 1000000, 1500000, 2000000, 3000000, 5000000,
  10000000, 20000000, 50000000, 70000000,
];
type SizeRange = { value: string; label: string; min?: number; max?: number };
const BUILT_UP_RANGES: SizeRange[] = [
  { value: "up-to-1000", label: "Up to 1,000 sqft", max: 1000 },
  { value: "1001-1500", label: "1,001–1,500 sqft", min: 1001, max: 1500 },
  { value: "1501-2500", label: "1,501–2,500 sqft", min: 1501, max: 2500 },
  { value: "2501-5000", label: "2,501–5,000 sqft", min: 2501, max: 5000 },
  { value: "5001-10000", label: "5,001–10,000 sqft", min: 5001, max: 10000 },
  { value: "10001-plus", label: "10,001+ sqft", min: 10001 },
];
const LAND_AREA_RANGES: SizeRange[] = [
  { value: "up-to-2000", label: "Up to 2,000 sqft", max: 2000 },
  { value: "2001-5000", label: "2,001–5,000 sqft", min: 2001, max: 5000 },
  { value: "5001-10000", label: "5,001–10,000 sqft", min: 5001, max: 10000 },
  { value: "10001-43559", label: "10,001 sqft–under 1 acre", min: 10001, max: 43559 },
  { value: "1-acre-plus", label: "1 acre and above", min: 43560 },
];
const CAT_CHIP: Record<string, string> = {
  residential: "Residential", commercial: "Commercial", industrial: "Industrial", land: "Land",
};

const INDEXED = TENDERS.map((x, i) => ({ ...x, _i: i })) as (Tender & { _i: number })[];

function areaInSqft(value: string): number | null {
  const normalised = value.toLowerCase().replace(/,/g, "").trim();
  if (!normalised) return null;
  const amount = Number.parseFloat(normalised);
  if (!Number.isFinite(amount)) return null;
  return normalised.includes("acre") ? amount * 43560 : amount;
}

function inSizeRange(value: string, selected: string, options: SizeRange[]) {
  if (selected === "all") return true;
  const sqft = areaInSqft(value);
  const range = options.find((option) => option.value === selected);
  if (sqft === null || !range) return false;
  return (range.min === undefined || sqft >= range.min) &&
    (range.max === undefined || sqft <= range.max);
}

/* Null until mount so SSR and first paint never show a flash of zeros.
   FOUNDER-CONFIRMED 30 Jul: there is no intra-day cutoff. A tender runs to the end
   of its closing date and the listing simply leaves the site — 23:59:59 MYT, not 17:00. */
type Remaining = { days: number; hours: number; minutes: number; seconds: number };
function useCountdown(iso: string): Remaining | null {
  const [left, setLeft] = useState<Remaining | null>(null);
  useEffect(() => {
    const target = new Date(iso + "T23:59:59+08:00").getTime();
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
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [closingCycle, setClosingCycle] = useState("all");
  const [builtUpRange, setBuiltUpRange] = useState("all");
  const [landAreaRange, setLandAreaRange] = useState("all");
  const [tenure, setTenure] = useState("all");
  const [propertyFiltersOpen, setPropertyFiltersOpen] = useState(false);
  const [state, setState] = useState("all");
  const [area, setArea] = useState("");
  const [areaLabel, setAreaLabel] = useState("");
  const [sortMode, setSortMode] = useState("closing");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [taOpen, setTaOpen] = useState(false);
  const [taActive, setTaActive] = useState(-1);
  const resultsTop = useRef<HTMLDivElement>(null);

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

  /* Escape closes the inline property filters without changing selections. */
  useEffect(() => {
    if (!propertyFiltersOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPropertyFiltersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [propertyFiltersOpen]);

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
    const priceActive = mn !== null || mx !== null;
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
        return p > 0 && (mn === null || p >= mn) && (mx === null || p <= mx);
      },
      closing: (x: Tender) => closingCycle === "all" || x.closingDate === closingCycle,
      builtUp: (x: Tender) => inSizeRange(x.builtUp, builtUpRange, BUILT_UP_RANGES),
      landArea: (x: Tender) => inSizeRange(x.landArea, landAreaRange, LAND_AREA_RANGES),
      tenure: (x: Tender) => tenure === "all" || x.tenure.toLowerCase() === tenure,
      location: (x: Tender) =>
        (state === "all" || x.stateKey === state) && (area === "" || x.area.toLowerCase() === area),
    };
  }, [
    query, category, typeValue, priceMin, priceMax, closingCycle, builtUpRange,
    landAreaRange, tenure, state, area,
  ]);

  const passesExcept = useCallback(
    (x: Tender, skip: string | null) =>
      (Object.keys(groups) as (keyof typeof groups)[]).every((g) => g === skip || groups[g](x)),
    [groups],
  );

  const matched = useMemo(
    () => INDEXED.filter((x) => passesExcept(x, null)),
    [passesExcept],
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

  const locationPool = useMemo(
    () => INDEXED.filter((x) => passesExcept(x, "location")),
    [passesExcept],
  );
  const catCount = (c: string) =>
    INDEXED.filter((x) => passesExcept(x, "category") && (c === "all" || x.propertyCategory === c)).length;
  const closingCount = (date: string) =>
    INDEXED.filter((x) => passesExcept(x, "closing") && x.closingDate === date).length;
  const tenureCount = (value: string) =>
    INDEXED.filter((x) => passesExcept(x, "tenure") && x.tenure.toLowerCase() === value).length;

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
    setQuery(""); setTypeValue("all"); setCategory("all");
    setPriceMin(""); setPriceMax(""); setClosingCycle("all");
    setBuiltUpRange("all"); setLandAreaRange("all"); setTenure("all");
    setState("all"); setArea(""); setAreaLabel("");
    setPropertyFiltersOpen(false); setPage(1);
  }

  function clearPropertyFilters() {
    setPriceMin(""); setPriceMax(""); setClosingCycle("all");
    setBuiltUpRange("all"); setLandAreaRange("all"); setTenure("all");
    setPage(1);
  }

  const activePropertyFilterCount = [
    priceMin || priceMax,
    closingCycle !== "all",
    builtUpRange !== "all",
    landAreaRange !== "all",
    tenure !== "all",
  ].filter(Boolean).length;

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
  if (priceMin || priceMax) {
    const mn = priceMin ? parseInt(priceMin) : null;
    const mx = priceMax ? parseInt(priceMax) : null;
    const label =
      mn !== null && mx !== null ? `${fmtRM(mn)} – ${fmtRM(mx)}`
        : mn !== null ? `From ${fmtRM(mn)}`
        : mx !== null ? `Up to ${fmtRM(mx)}` : "Custom";
    chips.push({ label, clear: () => { setPriceMin(""); setPriceMax(""); setPage(1); } });
  }
  if (closingCycle !== "all") {
    chips.push({
      label: `Closes ${fmtDate(closingCycle)}`,
      clear: () => { setClosingCycle("all"); setPage(1); },
    });
  }
  if (builtUpRange !== "all") {
    const selected = BUILT_UP_RANGES.find((option) => option.value === builtUpRange);
    chips.push({
      label: `Built-up: ${selected?.label || builtUpRange}`,
      clear: () => { setBuiltUpRange("all"); setPage(1); },
    });
  }
  if (landAreaRange !== "all") {
    const selected = LAND_AREA_RANGES.find((option) => option.value === landAreaRange);
    chips.push({
      label: `Land area: ${selected?.label || landAreaRange}`,
      clear: () => { setLandAreaRange("all"); setPage(1); },
    });
  }
  if (tenure !== "all") {
    chips.push({
      label: tenure === "freehold" ? "Freehold" : "Leasehold",
      clear: () => { setTenure("all"); setPage(1); },
    });
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
  /* Empty focus shows NOTHING on purpose. An earlier version listed states with counts
     here — which duplicated the "Tender by State" rail on this same screen, item for
     item, with no extra information. The data also kills the obvious alternative: 29
     distinct areas across 36 records, 25 of them holding exactly one property, so an
     "areas" list is a column of 1s. Division of labour: the rail owns BROWSING by
     geography, this field owns SEARCHING for a named project or town. */
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
              <p className="hero-date">
                <time dateTime={NEXT_BATCH.date}>
                  {HERO_DATE.day}<sup>{HERO_DATE.suffix}</sup> {HERO_DATE.month} {HERO_DATE.year}
                </time>
              </p>
              <a className="btn red hero-cta" href="#listings">
                View Tender Properties
              </a>
              <p className="hero-foot">Offers close at the end of the closing date</p>
            </div>
          </div>
          <div className="hero-panel hero-panel-right">
            <div className="hero-panel-inner">
              <p className="hero-eyebrow">WHY BUYERS CHOOSE E-TENDER</p>
              <ul className="hero-flow hero-assurances" aria-label="Sealed e-tender assurances">
                <li className="hero-assurance hero-assurance-primary">
                  <span className="hero-assurance-icon" aria-hidden="true"><LockIcon /></span>
                  <div>
                    <h2 className="hero-seal-title">Your offer stays <em>private</em></h2>
                    <p>Nobody else ever sees your offer — not other buyers, not the public. Every offer is handled confidentially throughout the tender process.</p>
                  </div>
                </li>
                <li className="hero-assurance hero-assurance-agent">
                  <div>
                    <strong>Your offer reaches the seller directly</strong>
                    <p>Every e-tender offer is presented directly to the seller for fair and confidential consideration.</p>
                  </div>
                </li>
                <li className="hero-assurance hero-assurance-outcome">
                  <div className="hero-outcome-content">
                    <strong>A clear outcome either way</strong>
                    <div className="hero-outcome-grid">
                      <div className="hero-outcome-option is-accepted">
                        <span className="hero-outcome-label">
                          <span className="hero-outcome-status-icon" aria-hidden="true"><CheckCircleIcon /></span>
                          Accepted
                        </span>
                        <span>Proceed with the purchase, through to SPA signing.</span>
                      </div>
                      <div className="hero-outcome-option is-refunded">
                        <span className="hero-outcome-label">
                          <span className="hero-outcome-status-icon" aria-hidden="true"><ReturnIcon /></span>
                          Not accepted
                        </span>
                        <span>Your deposit is returned in full, immediately.</span>
                      </div>
                    </div>
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
                setPropertyFiltersOpen(false);
                resultsTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <div className="search-bar">
                <div className="field typeahead sb-loc">
                  <label htmlFor="search-location">Location</label>
                  <input
                    type="text"
                    id="search-location"
                    placeholder="Search a project or town — e.g. Residensi Sinaran"
                    autoComplete="off"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={taOpen && taMatches.length > 0}
                    aria-controls="ta-list"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setPage(1); setTaOpen(true); setTaActive(-1); }}
                    /* The list only ever opened on keystroke, so clicking the field did
                       nothing — the whole point of the empty state. */
                    onFocus={() => { setTaOpen(true); setTaActive(-1); }}
                    onBlur={() => window.setTimeout(() => setTaOpen(false), 120)}
                    onKeyDown={(e) => {
                      if (!taOpen || !taMatches.length) return;
                      if (e.key === "ArrowDown") { e.preventDefault(); setTaActive((i) => Math.min(i + 1, taMatches.length - 1)); }
                      else if (e.key === "ArrowUp") { e.preventDefault(); setTaActive((i) => Math.max(i - 1, 0)); }
                      else if (e.key === "Enter" && taActive >= 0) { e.preventDefault(); pick(taMatches[taActive]); }
                      else if (e.key === "Escape") setTaOpen(false);
                    }}
                  />
                  <div
                    className={"ta-list" + (taOpen && (taMatches.length || query.trim()) ? " show" : "")}
                    id="ta-list"
                    role="listbox"
                  >
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
                    {/* A dead-silent dropdown reads as a broken site. Name the miss and
                        offer the way out. */}
                    {Boolean(query.trim()) && taMatches.length === 0 && (
                      <p className="ta-empty">
                        No tenders match &ldquo;{query.trim()}&rdquo;.{" "}
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); setQuery(""); setPage(1); }}>
                          Browse all {TENDERS.length}
                        </button>
                      </p>
                    )}
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
                <div className="search-actions">
                  {/* One row, not a stack: a stacked Search+Filters is ~90px against a
                      66px label+input, which is what pushed Search above the label line. */}
                  <button type="submit" className="btn red btn-search">Search</button>
                  <button
                    type="button"
                    className={"btn-property-filters" + (activePropertyFilterCount ? " is-active" : "")}
                    aria-expanded={propertyFiltersOpen}
                    aria-controls="property-filters"
                    onClick={() => setPropertyFiltersOpen((open) => !open)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6" />
                    </svg>
                    <span>Filters</span>
                    {activePropertyFilterCount > 0 && (
                      <span className="property-filter-badge">{activePropertyFilterCount}</span>
                    )}
                    <svg className="property-filter-chevron" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>
              </div>

              {propertyFiltersOpen && (
                <div
                  className="property-filter-scrim"
                  onClick={() => setPropertyFiltersOpen(false)}
                  aria-hidden="true"
                />
              )}
              <div
                className="property-filter-panel"
                id="property-filters"
                role="dialog"
                aria-modal="true"
                aria-label="Filter tender properties"
                hidden={!propertyFiltersOpen}
              >
                <div className="property-filter-head">
                  <div>
                    <p className="property-filter-kicker">Refine tender properties</p>
                    <p className="property-filter-help">
                      Filter by the closing cycle, reserve price and property size.
                    </p>
                  </div>
                  <div className="property-filter-status">
                    <span aria-live="polite">
                      <strong>{sorted.length}</strong> {sorted.length === 1 ? "match" : "matches"}
                    </span>
                    <button
                      type="button"
                      onClick={clearPropertyFilters}
                      disabled={activePropertyFilterCount === 0}
                    >
                      Clear filters
                    </button>
                  </div>
                </div>

                <div className="property-filter-body">

                <div className="property-filter-grid">
                  <label className="property-filter-field is-closing">
                    <span>Tender closing cycle</span>
                    <select
                      value={closingCycle}
                      onChange={(e) => { setClosingCycle(e.target.value); setPage(1); }}
                    >
                      <option value="all">Any closing date</option>
                      {BATCHES.map((batch) => {
                        const count = closingCount(batch.date);
                        return (
                          <option
                            key={batch.date}
                            value={batch.date}
                            disabled={count === 0 && closingCycle !== batch.date}
                          >
                            {fmtDate(batch.date)} · {count} {count === 1 ? "property" : "properties"}
                          </option>
                        );
                      })}
                    </select>
                  </label>

                  <div className="property-filter-field is-price">
                    <span>Reserve price (RM)</span>
                    <div className="property-filter-pair">
                      <label>
                        <span className="sr-only">Minimum reserve price</span>
                        <select
                          aria-label="Minimum reserve price"
                          value={priceMin}
                          onChange={(e) => { setPriceMin(e.target.value); setPage(1); }}
                        >
                          <option value="">No minimum</option>
                          {PRICE_MIN_OPTIONS.map((value) => (
                            <option
                              key={value}
                              value={value}
                              disabled={Boolean(priceMax) && value > parseInt(priceMax)}
                            >
                              {fmtRM(value)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <span aria-hidden="true">to</span>
                      <label>
                        <span className="sr-only">Maximum reserve price</span>
                        <select
                          aria-label="Maximum reserve price"
                          value={priceMax}
                          onChange={(e) => { setPriceMax(e.target.value); setPage(1); }}
                        >
                          <option value="">No maximum</option>
                          {PRICE_MAX_OPTIONS.map((value) => (
                            <option
                              key={value}
                              value={value}
                              disabled={Boolean(priceMin) && value < parseInt(priceMin)}
                            >
                              {fmtRM(value)}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <label className="property-filter-field is-tenure">
                    <span>Tenure</span>
                    <select
                      value={tenure}
                      onChange={(e) => { setTenure(e.target.value); setPage(1); }}
                    >
                      <option value="all">Any tenure</option>
                      <option value="freehold" disabled={tenureCount("freehold") === 0}>
                        Freehold ({tenureCount("freehold")})
                      </option>
                      <option value="leasehold" disabled={tenureCount("leasehold") === 0}>
                        Leasehold ({tenureCount("leasehold")})
                      </option>
                    </select>
                  </label>

                  <label className="property-filter-field is-built-up">
                    <span>Built-up area</span>
                    <select
                      value={builtUpRange}
                      onChange={(e) => { setBuiltUpRange(e.target.value); setPage(1); }}
                    >
                      <option value="all">Any built-up size</option>
                      {BUILT_UP_RANGES.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>

                  <label className="property-filter-field is-land-area">
                    <span>Land area</span>
                    <select
                      value={landAreaRange}
                      onChange={(e) => { setLandAreaRange(e.target.value); setPage(1); }}
                    >
                      <option value="all">Any land size</option>
                      {LAND_AREA_RANGES.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
                </div>

                {/* Footer states the outcome — "Show 12 properties" beats a bare
                    "Apply", which makes you guess what you are about to get. */}
                <div className="property-filter-foot">
                  <button
                    type="button"
                    className="pf-clear"
                    onClick={clearPropertyFilters}
                    disabled={activePropertyFilterCount === 0}
                  >
                    Clear all
                  </button>
                  <button
                    type="button"
                    className="pf-apply"
                    onClick={() => setPropertyFiltersOpen(false)}
                  >
                    Show {sorted.length} {sorted.length === 1 ? "property" : "properties"}
                  </button>
                </div>
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
                <h2 className="rail-title">Tender <span>by State</span></h2>
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
