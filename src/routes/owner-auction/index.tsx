import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AuctionPropertyCard } from "@/components/tender/AuctionPropertyCard";
import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";
import { StateFilters } from "@/components/tender/StateFilters";
import { GavelIcon, TaHome, TaPin } from "@/components/tender/icons";
import {
  AUCTION_HERO_DATE as HERO_DATE,
  AUCTION_START_MS,
  OWNER_AUCTION,
  REGISTRATION_DATE,
} from "@/data/owner-auction";
import { STATES, TYPE_TAXONOMY } from "@/data/tender-taxonomy";
import { TENDERS, type Tender } from "@/data/tenders";
import {
  MS_DAY,
  TYPE_BY_VALUE,
  daysUntil,
  fmtDate,
  fmtRM,
  isFinalDayUntil,
  matchesTaxonomy,
  remainingMsUntil,
  tenderId,
} from "@/lib/tender-utils";
import "@/styles/tender-listings.css";

/* ── OWNER AUCTION — step 1: the /tender hero, duplicated verbatim ─────────────
   Bryan, 6 Aug: strip the page back to nothing and copy the E-Tender hero across
   as-is; refine afterwards. So this is deliberately a straight lift — the same
   `.hero-tender` markup, the same CSS (that file's hero rules are unscoped, so
   they apply here untouched and NOTHING in tender-listings.css needed editing),
   and the same countdown maths.

   ⚠️ EVERYTHING BELOW IS STILL E-TENDER'S, ON PURPOSE, PENDING REFINEMENT:
     · the copy — the right panel's "New to E-Tender?", its three steps, the CTA
       to /how-e-tender-works, and the left panel's foot line, which still reads
       "Offers close at the end of the closing date". That last one now CONTRADICTS
       the two labels above it and is factually wrong for an auction: an auction
       starts at a set time, it does not run to end of day. Flagged to Bryan.
       (The countdown label and eyebrow ARE done — "Auction starts in" / "Next
       Owner Auction", 6 Aug.)
     · the date — the earliest E-Tender closing date, because there is no Owner
       Auction data in the repo at all (zero records, no auctionTime, no
       auctioneer). See the plan in TEAM-LOG.
     · the countdown — `remainingMs` resolves to 23:59:59 MYT, which is right for
       a tender that runs to end of day and WRONG for an auction that starts at a
       set time. It must not survive refinement unchanged.
   The old PageShell scaffold (five dashed frames) is gone with this. */

export const Route = createFileRoute("/owner-auction/")({ component: OwnerAuction });

/* ── THE AUCTION EVENT lives in `data/owner-auction.ts` ───────────────────────
   It used to be declared here. It moved on 7 Aug when the auction CARD started needing
   the same date, time and registration deadline this hero prints — the card is rendered
   36 times on this page, and a second copy of the event is how a page ends up
   disagreeing with itself one date at a time. The comments explaining the placeholder
   status, the UTC arithmetic and the founder's registration rule moved with it. */

/* Null until mount so SSR and first paint never show a flash of zeros. */
type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finalDay: boolean;
};

function useCountdown(atMs: number): Remaining | null {
  const [left, setLeft] = useState<Remaining | null>(null);
  useEffect(() => {
    const compute = (): Remaining => {
      const ms = remainingMsUntil(atMs);
      return {
        days: daysUntil(atMs),
        hours: Math.floor((ms % MS_DAY) / 3600000),
        minutes: Math.floor((ms % 3600000) / 60000),
        seconds: Math.floor((ms % 60000) / 1000),
        finalDay: isFinalDayUntil(atMs),
      };
    };
    setLeft(compute());
    const id = window.setInterval(() => setLeft(compute()), 1000);
    return () => window.clearInterval(id);
  }, [atMs]);
  return left;
}

/* ── SEARCH BAND — also lifted from /tender verbatim (Bryan, 6 Aug) ────────────
   The markup is that section as-is; only what depends on machinery this page does
   not have was adapted — pagination calls dropped, and the two result counts read
   from `matched` rather than the sorted+paged list. Everything a visitor can touch
   still works: typeahead, type dropdown, the filter drawer and its live counts,
   the category tabs.

   WARNING 1 — it searches the E-TENDER dataset, because the repo holds no Owner
   Auction data at all. The wording is E-Tender's too ("open for e-tender",
   "Refine e-tender properties", "E-Tender closing cycle"). Both go in refinement.
   WARNING 2 — ~310 lines DUPLICATED from /tender. Deliberate, per "just copy paste
   it", but it is exactly the duplication the reuse plan flagged: the two copies
   drift the first time either page's filters change. Consolidation is the
   follow-up, and it gets cheaper the sooner it happens. */
const PRICE_MIN_OPTIONS = [
  100000, 200000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 3000000, 5000000,
  10000000, 20000000, 50000000,
];
const PRICE_MAX_OPTIONS = [
  300000, 500000, 750000, 1000000, 1500000, 2000000, 3000000, 5000000, 10000000, 20000000, 50000000,
  70000000,
];
type SizeRange = { value: string; label: string; min?: number; max?: number };
const BUILT_UP_RANGES: SizeRange[] = [
  { value: "up-to-1000", label: "Up to 1,000 sqft", max: 1000 },
  { value: "1001-1500", label: "1,001\u20131,500 sqft", min: 1001, max: 1500 },
  { value: "1501-2500", label: "1,501\u20132,500 sqft", min: 1501, max: 2500 },
  { value: "2501-5000", label: "2,501\u20135,000 sqft", min: 2501, max: 5000 },
  { value: "5001-10000", label: "5,001\u201310,000 sqft", min: 5001, max: 10000 },
  { value: "10001-plus", label: "10,001+ sqft", min: 10001 },
];
const LAND_AREA_RANGES: SizeRange[] = [
  { value: "up-to-2000", label: "Up to 2,000 sqft", max: 2000 },
  { value: "2001-5000", label: "2,001\u20135,000 sqft", min: 2001, max: 5000 },
  { value: "5001-10000", label: "5,001\u201310,000 sqft", min: 5001, max: 10000 },
  { value: "10001-43559", label: "10,001 sqft\u2013under 1 acre", min: 10001, max: 43559 },
  { value: "1-acre-plus", label: "1 acre and above", min: 43560 },
];
const BATCHES = (() => {
  const counts = new Map<string, number>();
  TENDERS.forEach((t) => counts.set(t.closingDate, (counts.get(t.closingDate) || 0) + 1));
  return Array.from(counts.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
})();

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
  return (
    (range.min === undefined || sqft >= range.min) && (range.max === undefined || sqft <= range.max)
  );
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/* ── LISTINGS (Bryan, 7 Aug: put the E-Tender listings on this page too) ───────
   Same 12-per-page, same shortlist key as /tender — one shortlist across the site, so
   a property saved on either page is saved on both. `INDEXED` carries each record's
   original position so "Latest listed" has something to sort by. */
const PER_PAGE = 12;
const SAVE_KEY = "tp_shortlist";
const CAT_CHIP: Record<string, string> = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
  land: "Land",
};
const INDEXED = TENDERS.map((x, i) => ({ ...x, _i: i })) as (Tender & { _i: number })[];

function OwnerAuction() {
  const left = useCountdown(AUCTION_START_MS);
  const timerUnits = [
    { label: "d", value: left ? String(left.days) : "" },
    { label: "h", value: left ? pad2(left.hours) : "" },
    { label: "m", value: left ? pad2(left.minutes) : "" },
    { label: "s", value: left ? pad2(left.seconds) : "" },
  ];
  const FINAL_DAY = Boolean(left) && left!.finalDay;
  const countdownValue = !left
    ? " "
    : FINAL_DAY
      ? `${left.hours}h ${pad2(left.minutes)}m`
      : left.days.toLocaleString("en-MY");
  const countdownUnit = !left
    ? ""
    : FINAL_DAY
      ? "left today"
      : left.days === 1
        ? "day left"
        : "days left";
  /* The spoken form of the visible label — it moves with it, or a screen reader is
     told the auction "closes" while the page says it starts. */
  const countdownLabel = !left
    ? "Next Owner Auction soon"
    : FINAL_DAY
      ? `Next Owner Auction in ${left.hours} hours and ${left.minutes} minutes`
      : `Next Owner Auction in ${left.days} ${left.days === 1 ? "day" : "days"}`;

  /* ---- Search-band state, lifted from /tender ---- */
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
  const [taOpen, setTaOpen] = useState(false);
  const [taActive, setTaActive] = useState(-1);
  /* ---- Listings state (7 Aug) ---- */
  const [state, setState] = useState("all");
  const [area, setArea] = useState("");
  const [areaLabel, setAreaLabel] = useState("");
  const [sortMode, setSortMode] = useState("closing");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const resultsTop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setSaved(new Set(JSON.parse(localStorage.getItem(SAVE_KEY) || "[]")));
    } catch {
      /* shortlist is best-effort */
    }
  }, []);

  /* Escape closes the state drawer without losing the selection. */
  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  function toggleSave(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  /* Escape closes the drawer without losing selections. */
  useEffect(() => {
    if (!propertyFiltersOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPropertyFiltersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [propertyFiltersOpen]);

  /* Grouped so each facet's counts can exclude its own group. */
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
      /* Added 7 Aug with the state rail. It was absent while this page had no rail to
         drive it — the comment above used to say so. */
      location: (x: Tender) =>
        (state === "all" || x.stateKey === state) && (area === "" || x.area.toLowerCase() === area),
    };
  }, [
    query,
    category,
    typeValue,
    priceMin,
    priceMax,
    closingCycle,
    builtUpRange,
    landAreaRange,
    tenure,
    state,
    area,
  ]);

  const passesExcept = useCallback(
    (x: Tender, skip: string | null) =>
      (Object.keys(groups) as (keyof typeof groups)[]).every((g) => g === skip || groups[g](x)),
    [groups],
  );

  const matched = useMemo(() => INDEXED.filter((x) => passesExcept(x, null)), [passesExcept]);

  const sorted = useMemo(() => {
    const list = matched.slice();
    if (sortMode === "closing")
      list.sort((a, b) => +new Date(a.closingDate) - +new Date(b.closingDate));
    else if (sortMode === "latest") list.sort((a, b) => b._i - a._i);
    else if (sortMode === "price-asc")
      list.sort((a, b) => (a.reservePrice || Infinity) - (b.reservePrice || Infinity));
    else if (sortMode === "price-desc")
      list.sort((a, b) => (b.reservePrice || 0) - (a.reservePrice || 0));
    return list;
  }, [matched, sortMode]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const slice = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const from = sorted.length ? (currentPage - 1) * PER_PAGE + 1 : 0;
  const to = Math.min(currentPage * PER_PAGE, sorted.length);

  const pageWindow: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) pageWindow.push(i);
  }
  function goPage(n: number) {
    setPage(n);
    const el = document.getElementById("listings");
    if (el)
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.pageYOffset - 70,
        behavior: "smooth",
      });
  }

  /* The rail's own counts must ignore the rail's own selection, or picking a state
     collapses every other state to zero and the rail becomes a dead end. */
  const locationPool = useMemo(
    () => INDEXED.filter((x) => passesExcept(x, "location")),
    [passesExcept],
  );

  /* ANY filter change returns to page 1. /tender does this with a setPage(1) beside
     every single onChange — a dozen call sites, and a silent bug the first time one is
     missed (filter down to 4 results while on page 3 and the grid renders empty). One
     effect on the filter values cannot be forgotten. */
  useEffect(() => {
    setPage(1);
  }, [
    query,
    typeValue,
    category,
    priceMin,
    priceMax,
    closingCycle,
    builtUpRange,
    landAreaRange,
    tenure,
    state,
    area,
  ]);

  const catCount = (c: string) =>
    INDEXED.filter((x) => passesExcept(x, "category") && (c === "all" || x.propertyCategory === c))
      .length;
  const closingCount = (date: string) =>
    INDEXED.filter((x) => passesExcept(x, "closing") && x.closingDate === date).length;
  const tenureCount = (value: string) =>
    INDEXED.filter((x) => passesExcept(x, "tenure") && x.tenure.toLowerCase() === value).length;

  const typeOptions = useMemo(() => {
    const pool = INDEXED.filter((x) => category === "all" || x.propertyCategory === category);
    return TYPE_TAXONOMY.map((t) => ({
      ...t,
      n: t.value === "all" ? pool.length : pool.filter((x) => matchesTaxonomy(x, t.value)).length,
    }));
  }, [category]);

  function clearPropertyFilters() {
    setPriceMin("");
    setPriceMax("");
    setClosingCycle("all");
    setBuiltUpRange("all");
    setLandAreaRange("all");
    setTenure("all");
  }

  const activePropertyFilterCount = [
    priceMin || priceMax,
    closingCycle !== "all",
    builtUpRange !== "all",
    landAreaRange !== "all",
    tenure !== "all",
  ].filter(Boolean).length;

  function reset() {
    setQuery("");
    setTypeValue("all");
    setCategory("all");
    setPriceMin("");
    setPriceMax("");
    setClosingCycle("all");
    setBuiltUpRange("all");
    setLandAreaRange("all");
    setTenure("all");
    setState("all");
    setArea("");
    setAreaLabel("");
    setPropertyFiltersOpen(false);
  }

  /* ---- Active filter chips ---- */
  const chips: { label: string; clear: () => void }[] = [];
  if (state !== "all") {
    const st = STATES.find((sx) => sx.key === state);
    chips.push({
      label: st ? st.name : state,
      clear: () => {
        setState("all");
        setArea("");
      },
    });
    if (area)
      chips.push({
        label: areaLabel || area,
        clear: () => {
          setArea("");
          setAreaLabel("");
        },
      });
  }
  if (category !== "all")
    chips.push({ label: CAT_CHIP[category] || category, clear: () => setCategory("all") });
  if (typeValue !== "all") {
    const t = TYPE_BY_VALUE[typeValue];
    chips.push({
      label: t ? t.label.replace(/^-+|-+$/g, "") : typeValue,
      clear: () => setTypeValue("all"),
    });
  }
  if (priceMin || priceMax) {
    const mn = priceMin ? parseInt(priceMin) : null;
    const mx = priceMax ? parseInt(priceMax) : null;
    const label =
      mn !== null && mx !== null
        ? `${fmtRM(mn)} – ${fmtRM(mx)}`
        : mn !== null
          ? `From ${fmtRM(mn)}`
          : mx !== null
            ? `Up to ${fmtRM(mx)}`
            : "Custom";
    chips.push({
      label,
      clear: () => {
        setPriceMin("");
        setPriceMax("");
      },
    });
  }
  if (closingCycle !== "all")
    chips.push({ label: `Closes ${fmtDate(closingCycle)}`, clear: () => setClosingCycle("all") });
  if (builtUpRange !== "all") {
    const selected = BUILT_UP_RANGES.find((option) => option.value === builtUpRange);
    chips.push({
      label: `Built-up: ${selected?.label || builtUpRange}`,
      clear: () => setBuiltUpRange("all"),
    });
  }
  if (landAreaRange !== "all") {
    const selected = LAND_AREA_RANGES.find((option) => option.value === landAreaRange);
    chips.push({
      label: `Land area: ${selected?.label || landAreaRange}`,
      clear: () => setLandAreaRange("all"),
    });
  }
  if (tenure !== "all")
    chips.push({
      label: tenure === "freehold" ? "Freehold" : "Leasehold",
      clear: () => setTenure("all"),
    });
  if (query.trim()) chips.push({ label: `“${query.trim()}”`, clear: () => setQuery("") });

  /* ---- Location typeahead ---- */
  const taPool = useMemo(() => {
    const pool: { label: string; term?: string; kind: string; type: string }[] = [];
    const seen: Record<string, boolean> = {};
    STATES.forEach((s) => {
      if (TENDERS.some((t) => t.stateKey === s.key))
        pool.push({ label: s.name, kind: "State", type: "state" });
    });
    TENDERS.forEach((t) => {
      const k = `${t.stateKey}|${t.area}`.toLowerCase();
      if (!seen[k]) {
        seen[k] = true;
        pool.push({ label: `${t.area}, ${t.stateName}`, term: t.area, kind: "Area", type: "area" });
      }
    });
    TENDERS.forEach((t) => {
      const k = "n" + t.name.toLowerCase();
      if (!seen[k]) {
        seen[k] = true;
        pool.push({ label: t.name, kind: "Property", type: "name" });
      }
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
    setTaOpen(false);
    setTaActive(-1);
  }

  return (
    <div className="tp-listings oa-page">
      <SiteHeader />

      <main>
        {/* HERO — full-bleed diagonal split, lifted from /tender unchanged. */}
        <section className="hero-tender" aria-label="Owner Auction overview">
          <div className="hero-panel hero-panel-left is-dark">
            <div className="hero-panel-inner">
              <div className="hero-timer" aria-live="off" aria-label={countdownLabel}>
                <span className="hero-timer-heading" aria-hidden="true">
                  <span className="hero-timer-label">Next Owner Auction in</span>
                </span>
                <span className="hero-timer-days" aria-hidden="true">
                  <span className="hero-timer-value">{countdownValue}</span>
                  {left && !FINAL_DAY && (
                    <span className="hero-tick">
                      {timerUnits.slice(1).map((u) => (
                        <span className="hero-tick-cell" key={u.label}>
                          <span className="hero-tick-value">{u.value}</span>
                          <span className="hero-tick-unit">{u.label}</span>
                        </span>
                      ))}
                    </span>
                  )}
                  <span className="hero-timer-unit">{countdownUnit}</span>
                </span>
              </div>
              {/* The eyebrow that used to sit here ("Next Owner Auction") is gone: the
                  countdown's own label already names the event, so a second heading
                  above the date was the same fact twice. The date stands alone. */}
              <p className="hero-date">
                <time dateTime={`${OWNER_AUCTION.date}T${OWNER_AUCTION.time24}+08:00`}>
                  {HERO_DATE.day}
                  <sup>{HERO_DATE.suffix}</sup> {HERO_DATE.month} {HERO_DATE.year}
                </time>
              </p>
              {/* An auction has a START TIME — the single fact that most separates this
                  product from a tender, so it is real information in brass, not
                  microcopy. Inside the same <time> semantics via the date above. */}
              <p className="oa-time">
                {OWNER_AUCTION.timeLabel}
                {/* Deliberately NOT inside the brass serif run: the time is the fact, the
                    zone is the qualifier on it, and the type change is what says so. */}
                <span className="oa-tz">{OWNER_AUCTION.timezone}</span>
              </p>
              {/* The brass calendar glyph that sat here was removed 7 Aug (Bryan): the
                  button below now occupies that space, and a decorative icon competing
                  with a real control weakens both. */}
              {/* ✅ RESOLVED 7 Aug. This line used to print the AUCTION date — the same
                  string as the 46px date ~60px above, meaning something else — because
                  no registration deadline existed anywhere in the model. Bryan's father
                  has now set the rule: registration closes ONE DAY BEFORE the auction.
                  So it reads 11th December against a 12th December auction: two dates
                  that now differ, which is exactly what makes the line worth printing.
                  The value is derived in OWNER_AUCTION.registrationClosesDate.
                  WORDING IS BRYAN'S ("Registration Closing Date") and is left as he
                  instructed — do not quietly reword it. */}
              <p className="hero-foot">
                <time dateTime={OWNER_AUCTION.registrationClosesDate}>
                  Registration Closing Date: {REGISTRATION_DATE.day}
                  {REGISTRATION_DATE.suffix} {REGISTRATION_DATE.month} {REGISTRATION_DATE.year}
                </time>
              </p>
              {/* Bryan, 7 Aug — the hero's one control, to his reference: an outlined
                  brass button, no fill. It is a same-page jump to the search band
                  directly below, so it is an <a href="#…"> and not a <button>:
                  middle-click and "copy link" behave, and it still works if the JS never
                  boots.

                  The trailing glyph started as a "↓" text character and became a
                  GavelIcon later the same day — an icon swap and nothing else: href,
                  label, jump behaviour and the button's own box are all untouched. The
                  icon is decorative (the label already says where it goes) and carries
                  its own aria-hidden, so this link's accessible name stays exactly
                  "View Listings". Its rest/strike animation lives in `.oa-jump-gavel`. */}
              <a className="oa-jump" href="#property-search-title">
                View Listings
                <span className="oa-jump-gavel">
                  <GavelIcon />
                </span>
              </a>
            </div>
          </div>

          <div className="hero-panel hero-panel-right">
            <div className="hero-panel-inner">
              <p className="hero-eyebrow">New to Owner Auction?</p>
              <h2 className="hero-steps-head">
                {/* "Bid on a property online in" (Bryan, 7 Aug) — was "Bid in". The two
                    lines now read as one sentence: "…online in / 3 simple steps."
                    ⚠️ Line two is indented to start at the word "online" in THIS string,
                    a measured value — see `.oa-page .hero-steps-head span + span` before
                    editing this wording. Text before "online" is what sets the indent. */}
                <span>Bid on a property online in</span>
                <span>
                  <em>3 simple steps.</em>
                </span>
              </h2>
              <ol className="hero-steps" aria-label="How Owner Auction works, in three steps">
                <li>
                  <p className="hero-step-head">Find</p>
                  <p className="hero-step-body">
                    Browse properties up for Owner Auction and choose one you&rsquo;re interested
                    in.
                  </p>
                </li>
                <li>
                  <p className="hero-step-head">Register</p>
                  <p className="hero-step-body">
                    Register and log in as a member to participate and complete the required auction
                    process.
                  </p>
                </li>
                <li>
                  <p className="hero-step-head">Bid</p>
                  <p className="hero-step-body">
                    Join the auction on auction day and place your bid.
                  </p>
                </li>
              </ol>
              {/* ⚠️ DESTINATION IS STILL THE E-TENDER EXPLAINER. There is no Owner
                  Auction how-it-works route yet, and a CTA that 404s is worse than one
                  pointing at the wrong product — so this keeps a working link until
                  Bryan decides where it goes. Flagged, not forgotten. */}
              {/* The attention dot is a SIBLING wrapper, not a child of the link, and it
                  is absolutely positioned — so it costs the CTA no width, no padding and
                  no shift. `.hero-steps-cta` is a full-width bar here: its left edge IS
                  the panel's inner edge, so "beside the button" can only mean outside
                  that edge, which absolute positioning is the only way to get without
                  resizing the button. Decorative, aria-hidden, pointer-events: none. */}
              <div className="hero-cta-attention">
                <span className="hero-cta-attention-dot" aria-hidden="true" />
                <a className="hero-steps-cta" href="/how-e-tender-works">
                  <span className="hero-steps-cta-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                  </span>
                  <span className="hero-steps-cta-label">See how Owner Auction works</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="hero-search-band" aria-labelledby="property-search-title">
          <div className="wrap">
            {/* The "New to e-tender? See how it works" line lived here from 31 Jul. Removed
                  4 Aug (Bryan): the hero's right panel now carries that job as its whole purpose,
                  and the two sat about 600px apart pointing at the same page. Two links to one
                  destination inside one screen is not emphasis, it is a split signal — the panel
                  is the one that gets to be loud. */}
            <div className="search-intro">
              <h2 id="property-search-title">
                Find a property <span className="hl">up for Owner Auction</span>
              </h2>
            </div>
            <form
              className="search-form"
              onSubmit={(e) => {
                e.preventDefault();

                setTaOpen(false);
                setPropertyFiltersOpen(false);
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
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setTaOpen(true);
                      setTaActive(-1);
                    }}
                    /* The list only ever opened on keystroke, so clicking the field did
                         nothing — the whole point of the empty state. */
                    onFocus={() => {
                      setTaOpen(true);
                      setTaActive(-1);
                    }}
                    onBlur={() => window.setTimeout(() => setTaOpen(false), 120)}
                    onKeyDown={(e) => {
                      if (!taOpen || !taMatches.length) return;
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setTaActive((i) => Math.min(i + 1, taMatches.length - 1));
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setTaActive((i) => Math.max(i - 1, 0));
                      } else if (e.key === "Enter" && taActive >= 0) {
                        e.preventDefault();
                        pick(taMatches[taActive]);
                      } else if (e.key === "Escape") setTaOpen(false);
                    }}
                  />
                  <div
                    className={
                      "ta-list" + (taOpen && (taMatches.length || query.trim()) ? " show" : "")
                    }
                    id="ta-list"
                    role="listbox"
                  >
                    {taMatches.map((m, i) => (
                      <div
                        key={m.type + m.label}
                        className={"ta-item" + (i === taActive ? " active" : "")}
                        role="option"
                        aria-selected={i === taActive}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          pick(m);
                        }}
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
                        No e-tenders match &ldquo;{query.trim()}&rdquo;.{" "}
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setQuery("");
                          }}
                        >
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
                    onChange={(e) => {
                      setTypeValue(e.target.value);
                    }}
                  >
                    {typeOptions.map((t) => (
                      <option
                        key={t.value}
                        value={t.value}
                        disabled={t.value !== "all" && t.n === 0}
                      >
                        {t.label}
                        {t.value !== "all" && t.n ? ` (${t.n})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="search-actions">
                  {/* One row, not a stack: a stacked Search+Filters is ~90px against a
                        66px label+input, which is what pushed Search above the label line. */}
                  <button type="submit" className="btn red btn-search">
                    Search
                  </button>
                  <button
                    type="button"
                    className={
                      "btn-property-filters" + (activePropertyFilterCount ? " is-active" : "")
                    }
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
                aria-label="Filter e-tender properties"
                hidden={!propertyFiltersOpen}
              >
                <div className="property-filter-head">
                  <div>
                    <p className="property-filter-kicker">Refine e-tender properties</p>
                    <p className="property-filter-help">
                      Filter by the closing cycle, reserve price and property size.
                    </p>
                  </div>
                  <div className="property-filter-status">
                    <span aria-live="polite">
                      <strong>{matched.length}</strong> {matched.length === 1 ? "match" : "matches"}
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
                      <span>E-Tender closing cycle</span>
                      <select
                        value={closingCycle}
                        onChange={(e) => {
                          setClosingCycle(e.target.value);
                        }}
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
                              {fmtDate(batch.date)} · {count}{" "}
                              {count === 1 ? "property" : "properties"}
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
                            onChange={(e) => {
                              setPriceMin(e.target.value);
                            }}
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
                            onChange={(e) => {
                              setPriceMax(e.target.value);
                            }}
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
                        onChange={(e) => {
                          setTenure(e.target.value);
                        }}
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
                        onChange={(e) => {
                          setBuiltUpRange(e.target.value);
                        }}
                      >
                        <option value="all">Any built-up size</option>
                        {BUILT_UP_RANGES.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="property-filter-field is-land-area">
                      <span>Land area</span>
                      <select
                        value={landAreaRange}
                        onChange={(e) => {
                          setLandAreaRange(e.target.value);
                        }}
                      >
                        <option value="all">Any land size</option>
                        {LAND_AREA_RANGES.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
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
                    Show {matched.length} {matched.length === 1 ? "property" : "properties"}
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
                    className={
                      "cat-tab" + (active ? " active" : "") + (n === 0 && !active ? " dim" : "")
                    }
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setCategory(c.key);
                      setTypeValue("all");
                    }}
                  >
                    {c.label} <span className="c">{n}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── MAIN LISTINGS AREA (Bryan, 7 Aug: "move all the listings from e-tender to
            owner auction, including the tender by state") ──────────────────────────
            Read as COPY, not cut: /tender keeps its grid. Emptying the E-Tender page
            would have deleted the site's main product, and his earlier wording for this
            same job was "duplicate e-tender listings onto owner auction".

            ⚠️ The records are E-Tender's. All 36 are still `tenderMethod: "E-Tender"`;
            there is no auction data in the repo. The cards are relabelled through
            PropertyCard's `product` prop, so a buyer reads "Owner Auction" — but the
            two dates in each card's period block are that listing's TENDER start and
            closing date, and the reserve price is a tender reserve. Dressed E-Tender
            data. Fine for the EasyAsia demo, not a source of auction business rules.

            ⚠️ ~140 lines duplicated from /tender, on top of the ~310 already duplicated
            for the search band. The two pages now diverge the moment either one's
            results toolbar changes. Consolidation was already the flagged follow-up;
            this doubles the reason. */}
        <section className="listings-section" id="listings">
          <div className="wrap main-layout">
            <div className="results-column">
              <div className="results-header" ref={resultsTop}>
                <span className="results-count">
                  {sorted.length
                    ? `${sorted.length} ${sorted.length === 1 ? "property" : "properties"} up for Owner Auction · showing ${from}–${to}`
                    : "No properties match your filters"}
                </span>
                <div className="results-tools">
                  <button
                    type="button"
                    className="filters-open-btn"
                    aria-expanded={sheetOpen}
                    onClick={() => setSheetOpen(true)}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    <span>Owner Auction by State</span>
                    {state !== "all" && <span className="tool-badge">{area ? 2 : 1}</span>}
                  </button>
                  <div className="sort-field">
                    <label htmlFor="sort-by">Sort</label>
                    <select
                      id="sort-by"
                      value={sortMode}
                      onChange={(e) => {
                        setSortMode(e.target.value);
                        setPage(1);
                      }}
                    >
                      <option value="closing">Closing soonest</option>
                      <option value="latest">Latest listed</option>
                      <option value="price-asc">Reserve price: low to high</option>
                      <option value="price-desc">Reserve price: high to low</option>
                    </select>
                  </div>
                  <div className="view-toggle" role="group" aria-label="Result layout">
                    <button
                      type="button"
                      className={"toggle-btn" + (view === "grid" ? " active" : "")}
                      title="Grid View"
                      aria-pressed={view === "grid"}
                      onClick={() => setView("grid")}
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                      <span>Grid</span>
                    </button>
                    <button
                      type="button"
                      className={"toggle-btn" + (view === "list" ? " active" : "")}
                      title="List View"
                      aria-pressed={view === "list"}
                      onClick={() => setView("list")}
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
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
                    <span>{c.label}</span>
                    <span className="x" aria-hidden="true">
                      ×
                    </span>
                  </button>
                ))}
                {chips.length > 0 && (
                  <button type="button" className="chip clear" onClick={reset}>
                    Clear all
                  </button>
                )}
              </div>

              <div className={"props-grid " + (view === "grid" ? "grid-mode" : "list-mode")}>
                {slice.length ? (
                  slice.map((x) => (
                    <AuctionPropertyCard
                      key={tenderId(x) + x._i}
                      x={x}
                      saved={saved.has(tenderId(x))}
                      onToggleSave={toggleSave}
                    />
                  ))
                ) : (
                  <div className="no-results">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M21 21l-4.3-4.3" />
                    </svg>
                    <b>No auction properties match your filters</b>
                    <span>
                      Try widening your search &mdash; remove a filter or pick another state.
                    </span>
                    <button type="button" className="btn red" onClick={reset}>
                      Clear all filters
                    </button>
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
                  <button
                    type="button"
                    aria-label="Next page"
                    disabled={currentPage >= totalPages}
                    onClick={() => goPage(currentPage + 1)}
                  >
                    &raquo;
                  </button>
                  <button
                    type="button"
                    aria-label="Last page"
                    disabled={currentPage >= totalPages}
                    onClick={() => goPage(totalPages)}
                  >
                    Last
                  </button>
                </nav>
              )}
            </div>

            {/* The state rail — a sidebar on desktop, a drawer on mobile. */}
            <div
              className={"filters-backdrop" + (sheetOpen ? " show" : "")}
              onClick={() => setSheetOpen(false)}
            />
            <aside
              className={"sidebar-filters" + (sheetOpen ? " open" : "")}
              aria-label="Owner Auction by state"
            >
              <div className="rail-head">
                <h2 className="rail-title">
                  Owner Auction <span>by State</span>
                </h2>
                <button
                  type="button"
                  className="sheet-close"
                  aria-label="Close Owner Auction by state"
                  onClick={() => setSheetOpen(false)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
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
                    onSelect={(k, a, label) => {
                      setState(k);
                      setArea(a);
                      setAreaLabel(label);
                    }}
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
