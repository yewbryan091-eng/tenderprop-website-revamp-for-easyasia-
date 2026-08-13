import { useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

/* ── THE SEARCH CARD — straddling the seam ────────────────────────────────────
   Bryan, 13 Aug, from the iProperty homepage: the search card sits ON the
   boundary between the first section and the second, half in the photograph and
   half on the paper below it. That overlap is doing real work — a card cut by
   the fold's edge is the clearest possible signal that the page continues, and
   it puts the one thing a high-intent buyer came for (type a place, go) at the
   exact point their eye leaves the hero.

   Tabs are E-Tender / Owner Auction in place of iProperty's Buy / Rent. Their
   All Residential / Price / Bedroom chips are deliberately NOT here yet
   (Bryan: "remove... first") — the filters live on the listing pages, and an
   empty filter row on a homepage promises refinement the buyer cannot yet use.

   Everything here is real: the tab picks the route, the query rides as `?q=`,
   and an empty submit lands on the full list rather than a dead end. */

type Route = "tender" | "owner-auction";

const ROUTES = {
  tender: { label: "E-Tender", to: "/tender" as const },
  "owner-auction": { label: "Owner Auction", to: "/owner-auction" as const },
};

const ORDER: Route[] = ["tender", "owner-auction"];

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function HomeSearch() {
  const navigate = useNavigate();
  const [route, setRoute] = useState<Route>("tender");
  const [query, setQuery] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = query.trim();
    void navigate({ to: ROUTES[route].to, search: { q: q || undefined } });
  };

  return (
    <div className="hs-wrap">
      <div className="hs-card">
        <div className="hs-tabs" role="group" aria-label="What are you searching">
          {ORDER.map((key) => (
            <button
              key={key}
              type="button"
              className="hs-tab"
              aria-pressed={route === key}
              onClick={() => setRoute(key)}
            >
              {ROUTES[key].label}
            </button>
          ))}
        </div>

        <form className="hs-row" onSubmit={submit}>
          <label className="sr-only" htmlFor="hs-input">
            Search a project, street or state
          </label>
          <span className="hs-icon">
            <SearchIcon />
          </span>
          <input
            id="hs-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a project, street or state — e.g. Setia Alam"
            autoComplete="off"
          />
          <button className="hs-go" type="submit">
            <SearchIcon />
            <span>Search</span>
          </button>
        </form>
      </div>
    </div>
  );
}
