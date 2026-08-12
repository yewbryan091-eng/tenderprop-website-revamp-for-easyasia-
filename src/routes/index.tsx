import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";
import { AUCTION_START_MS, AUCTION_TIME_LABEL, OWNER_AUCTION } from "@/data/owner-auction";
import { TENDERS } from "@/data/tenders";
import { batchesOf, daysLeft, daysUntil, fmtDate, fmtPrice, fmtRM } from "@/lib/tender-utils";
import "@/styles/tender-listings.css";
import "@/styles/home.css";

export const Route = createFileRoute("/")({ component: HomePage });

type BuyingMethod = "tender" | "owner-auction";

const METHODS = {
  tender: {
    label: "E-Tender",
    button: "Search E-Tenders",
    to: "/tender" as const,
  },
  "owner-auction": {
    label: "Owner Auction",
    button: "Search Owner Auctions",
    to: "/owner-auction" as const,
  },
};

/* ── EVERY NUMBER ON THIS FOLD IS DERIVED FROM THE LISTINGS ────────────────────
   The next cycle comes from the same `batchesOf` /tender reads; the market card
   (count, price span, states) is computed from TENDERS. Nothing here is typed by
   hand, so the fold can never advertise a market the grid doesn't hold. */
const NEXT_BATCH = batchesOf(TENDERS)[0];
const OPEN_COUNT = TENDERS.length;

const PRICES = TENDERS.map((t) => t.reservePrice).filter((p) => p > 0);
const PRICE_SPAN = `${fmtRM(Math.min(...PRICES))} – ${fmtRM(Math.max(...PRICES))}`;

/* 1–2 states: name them. Beyond six the buyer-truth is simply "nationwide" —
   the 12 Aug data spans all 16 states and territories, and "16 states" reads
   like a spec sheet where "across Malaysia" reads like a market. */
const STATE_NAMES = Array.from(new Set(TENDERS.map((t) => t.stateName).filter(Boolean)));
const MARKET_WHERE =
  STATE_NAMES.length <= 2
    ? STATE_NAMES.join(" & ")
    : STATE_NAMES.length > 6
      ? "across Malaysia"
      : `${STATE_NAMES.length} states`;

/* The spotlight — real listings, by name, cycled one at a time on the scene.
   `filter(Boolean)` keeps the fold alive if a listing is renamed or withdrawn. */
const SHOWCASE = [
  "Tropicana Golf & Country Resort",
  "Setia Eco Park",
  "222 Residency",
  "Kemuning Utama Corner Unit",
]
  .map((name) => TENDERS.find((t) => t.name === name))
  .filter((t): t is NonNullable<typeof t> => Boolean(t));

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19">
      <path d="M5 12h13m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

/* A sealed envelope — the tender instrument itself. */
function SealIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="m3 5 9 7.2L21 5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="14.4" r="2" fill="currentColor" />
    </svg>
  );
}

/* The gavel — auction day. */
function GavelIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
      <path
        d="m14 13-7.5 7.5a2.12 2.12 0 0 1-3-3L11 10M16 16l6-6M8 8l6-6M9 7l8 8M21 11l-8-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<BuyingMethod>("tender");
  const [query, setQuery] = useState("");
  const [spot, setSpot] = useState(0);
  const [spotPaused, setSpotPaused] = useState(false);
  const selected = METHODS[method];

  /* Computed once per render — courtesy figures, deliberately not ticking. */
  const tenderDays = daysLeft(NEXT_BATCH.date);
  const auctionDays = daysUntil(AUCTION_START_MS);

  /* The spotlight walks the showcase every 6s. Honours reduced-motion, pauses
     under the reader's cursor, and does nothing if only one listing survives. */
  useEffect(() => {
    if (spotPaused || SHOWCASE.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setSpot((s) => (s + 1) % SHOWCASE.length), 6000);
    return () => window.clearInterval(id);
  }, [spotPaused]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = query.trim();
    void navigate({ to: selected.to, search: q ? { q } : {} });
  };

  const spotlight = SHOWCASE[spot];

  return (
    <div className="home">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section className="hp-hero" aria-labelledby="hp-title">
          <img
            className="hp-hero-image"
            src="/assets/layout/home-hero-panorama-v2.jpg"
            alt=""
            fetchPriority="high"
            decoding="async"
          />
          <div className="hp-hero-wash" aria-hidden="true" />

          {/* THE LIVING MARKET — quiet pulses on the skyline say "occupied, live". */}
          <div className="hp-scene" aria-hidden="true">
            <span className="hp-ping" style={{ left: "21%", top: "47%" }} />
            <span className="hp-ping hp-ping-2" style={{ left: "56%", top: "38%" }} />
            <span className="hp-ping hp-ping-3" style={{ left: "73%", top: "56%" }} />
          </div>

          {/* Two dashed field notes pinned to the scene (wide screens only):
              left — one REAL listing at a time; right — the market itself. */}
          <aside
            className="hp-note hp-note-left"
            onMouseEnter={() => setSpotPaused(true)}
            onMouseLeave={() => setSpotPaused(false)}
          >
            <span className="hp-note-pin" aria-hidden="true" />
            {spotlight && (
              <div className="hp-note-card" key={spot}>
                <strong className="hp-note-name">{spotlight.name}</strong>
                <span className="hp-note-where">
                  {spotlight.area}, {spotlight.stateName}
                </span>
                <span className="hp-note-fact">
                  <b>{fmtPrice(spotlight.reservePrice)}</b> reserve ·{" "}
                  <span className="hp-nowrap">closes {fmtDate(spotlight.closingDate)}</span>
                </span>
              </div>
            )}
          </aside>

          <aside className="hp-note hp-note-right">
            <span className="hp-note-pin" aria-hidden="true" />
            <div className="hp-note-card">
              <strong className="hp-note-name">{OPEN_COUNT} properties open</strong>
              <span className="hp-note-where">
                {PRICE_SPAN} · {MARKET_WHERE}
              </span>
              <span className="hp-note-fact">
                Refundable 3% deposit · <span className="hp-nowrap">results in 5 working days</span>
              </span>
            </div>
          </aside>

          <div className="hp-hero-inner">
            <div className="hp-content">
              <header className="hp-thesis">
                <p className="hp-kicker">Malaysia&rsquo;s E-Tender &amp; Owner Auction platform</p>
                <h1 id="hp-title">Find a property. Choose how you buy it.</h1>
                <p>
                  Search Malaysian properties available through private E-Tender or live Owner
                  Auction.
                </p>
              </header>

              <div className="hp-finder">
                {/* The heartbeat — route-aware, day-precision, never ticking. */}
                <p className="hp-cycle" role="status">
                  <span className="hp-cycle-dot" aria-hidden="true" />
                  {method === "tender" ? (
                    <>
                      Next E-Tender close&nbsp;&middot; {fmtDate(NEXT_BATCH.date)}&nbsp;&middot; in{" "}
                      {plural(tenderDays, "day", "days")}&nbsp;&middot;{" "}
                      {plural(NEXT_BATCH.count, "property", "properties")}
                    </>
                  ) : (
                    <>
                      Auction day&nbsp;&middot; {fmtDate(OWNER_AUCTION.date)}&nbsp;&middot;{" "}
                      {AUCTION_TIME_LABEL}&nbsp;&middot; in {plural(auctionDays, "day", "days")}
                    </>
                  )}
                </p>

                {/* One instrument: route, place, action. */}
                <form className="hp-bar" onSubmit={handleSearch}>
                  <div className="hp-routes" role="group" aria-label="Buying method">
                    <button
                      type="button"
                      className="hp-route"
                      aria-pressed={method === "tender"}
                      onClick={() => setMethod("tender")}
                    >
                      <SealIcon />
                      E-Tender
                    </button>
                    <button
                      type="button"
                      className="hp-route"
                      aria-pressed={method === "owner-auction"}
                      onClick={() => setMethod("owner-auction")}
                    >
                      <GavelIcon />
                      Owner Auction
                    </button>
                  </div>
                  <label className="sr-only" htmlFor="home-property-search">
                    Search by project, street or state
                  </label>
                  <span className="hp-search-icon">
                    <SearchIcon />
                  </span>
                  <input
                    id="home-property-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search a project, street or state — e.g. Setia Alam"
                    autoComplete="off"
                  />
                  <button className="hp-search-button" type="submit">
                    <span>{selected.button}</span>
                    <ArrowIcon />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
