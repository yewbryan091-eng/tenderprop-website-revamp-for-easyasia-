import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";
import { AUCTION_START_MS, AUCTION_TIME_LABEL, OWNER_AUCTION } from "@/data/owner-auction";
import { TENDERS } from "@/data/tenders";
import { batchesOf, daysLeft, daysUntil, fmtDate } from "@/lib/tender-utils";
import "@/styles/tender-listings.css";
import "@/styles/home.css";

export const Route = createFileRoute("/")({ component: HomePage });

type BuyingMethod = "tender" | "owner-auction";

const METHODS = {
  tender: {
    label: "E-Tender",
    summary: "Make a private offer",
    button: "Search E-Tenders",
    to: "/tender" as const,
  },
  "owner-auction": {
    label: "Owner Auction",
    summary: "Bid live on auction day",
    button: "Search Owner Auctions",
    to: "/owner-auction" as const,
  },
};

/* The next cycle is DERIVED from the listings via the same helper /tender uses —
   one cycle list, two pages, zero chance of the homepage promising a date the
   grid doesn't hold. Static courtesy facts, not a live countdown: the ticking
   heroes live on the product pages. */
const NEXT_BATCH = batchesOf(TENDERS)[0];

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

/* A sealed envelope — the tender instrument itself. Flap drawn, wax seal pinning it. */
function SealIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
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
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
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
  const selected = METHODS[method];

  /* Computed once per render — a courtesy figure, deliberately not ticking. */
  const tenderDays = daysLeft(NEXT_BATCH.date);
  const auctionDays = daysUntil(AUCTION_START_MS);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = query.trim();
    void navigate({ to: selected.to, search: q ? { q } : {} });
  };

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
                {/* THE FORK — the two buying routes split by the brand's diagonal seam,
                    with the panorama itself showing through the gap. The seam leans
                    toward the selected route; the search below serves that choice. */}
                <div
                  className="hp-fork"
                  data-selected={method}
                  role="group"
                  aria-label="Choose a buying method"
                >
                  <button
                    type="button"
                    className="hp-fork-panel hp-fork-tender"
                    aria-pressed={method === "tender"}
                    onClick={() => setMethod("tender")}
                  >
                    <span className="hp-fork-body">
                      <span className="hp-fork-name">
                        <SealIcon />
                        E-Tender
                      </span>
                      <span className="hp-fork-what">Make a private offer</span>
                      <span className="hp-fork-meta">
                        <strong>Closes in {plural(tenderDays, "day", "days")}</strong>
                        {/* Dot + value wrap as one unit — a line may start with a
                            separator, never end on one. */}
                        <span className="hp-fork-pair">
                          <span className="hp-fork-dot" aria-hidden="true">
                            &middot;&nbsp;
                          </span>
                          {fmtDate(NEXT_BATCH.date)}
                        </span>
                        <span className="hp-fork-pair">
                          <span className="hp-fork-dot" aria-hidden="true">
                            &middot;&nbsp;
                          </span>
                          {plural(NEXT_BATCH.count, "property", "properties")}
                        </span>
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    className="hp-fork-panel hp-fork-auction"
                    aria-pressed={method === "owner-auction"}
                    onClick={() => setMethod("owner-auction")}
                  >
                    <span className="hp-fork-body">
                      <span className="hp-fork-name">
                        Owner Auction
                        <GavelIcon />
                      </span>
                      <span className="hp-fork-what">Bid live on auction day</span>
                      <span className="hp-fork-meta">
                        <strong>Auction in {plural(auctionDays, "day", "days")}</strong>
                        <span className="hp-fork-pair">
                          <span className="hp-fork-dot" aria-hidden="true">
                            &middot;&nbsp;
                          </span>
                          {fmtDate(OWNER_AUCTION.date)}
                        </span>
                        <span className="hp-fork-pair">
                          <span className="hp-fork-dot" aria-hidden="true">
                            &middot;&nbsp;
                          </span>
                          {AUCTION_TIME_LABEL}
                        </span>
                      </span>
                    </span>
                  </button>
                </div>

                <form className="hp-search-row" onSubmit={handleSearch}>
                  <label className="sr-only" htmlFor="home-property-search">
                    Search by property, area or state
                  </label>
                  <span className="hp-search-icon">
                    <SearchIcon />
                  </span>
                  <input
                    id="home-property-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by property, area or state"
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
