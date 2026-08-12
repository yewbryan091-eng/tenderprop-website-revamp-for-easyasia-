import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { SiteFooter } from "@/components/tender/SiteFooter";
import { SiteHeader } from "@/components/tender/SiteHeader";
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

function HomePage() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<BuyingMethod>("tender");
  const [query, setQuery] = useState("");
  const selected = METHODS[method];

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
                <h1 id="hp-title">Find a property. Choose how you buy and sell it.</h1>
              </header>

              <form className="hp-finder" onSubmit={handleSearch}>
                <div className="hp-method-heading">Choose a buying method</div>

                <div className="hp-methods" role="group" aria-label="Choose a buying method">
                  {(Object.keys(METHODS) as BuyingMethod[]).map((key) => {
                    const item = METHODS[key];
                    const active = method === key;
                    return (
                      <button
                        className="hp-method"
                        type="button"
                        key={key}
                        aria-pressed={active}
                        onClick={() => setMethod(key)}
                      >
                        <span>{item.label}</span>
                        <small>{item.summary}</small>
                      </button>
                    );
                  })}
                </div>

                <div className="hp-search-row">
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
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
