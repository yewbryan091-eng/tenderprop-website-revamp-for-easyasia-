import { Link } from "@tanstack/react-router";
import { LOGO } from "@/lib/images";

/* Site nav under the two-product decision (Bryan, 30 Jul 2026): buy/rent are
   retired — E-Tender and Owner Auction are the only ways to buy. Sell stays:
   owners are the paying side. Active state comes from the router, not a
   hardcoded li, so every page gets the right highlight for free.

   ABOUT REMOVED from the top nav (Bryan, 6 Aug). It keeps its FOOTER link, which
   matters: About is where the Act 242 licensed-agency disclosure lives, so the page
   had to keep a route in, just not a top-level one.

   E-TENDER, not "Tender" (Bryan, 6 Aug): the brief bare-"Tender" exception is
   REVOKED and DESIGN-SYSTEM §3c is unconditional again — every front-facing
   reference reads E-Tender. The ROUTE is still /tender; only the label changed.

   ── OWNER AUCTION IS ONE TAB, NOT TWO ─────────────────────────────────────────
   "Valuation Report Included" is part of the Owner Auction package, so it lives
   INSIDE the same <Link>: one anchor, one tab stop, one focus target, one active
   state, and the whole unit is clickable because a click on any descendant of an
   anchor activates it — absolute positioning changes layout, never event flow.

   The subtitle is absolutely positioned (see .nav-oa-benefit). That is what stops
   it becoming a fifth tab: out of flow, it contributes NOTHING to the anchor's
   width or height, so the gap between Owner Auction and Sell is identical to every
   other gap, all four primary labels keep one shared baseline, and the header does
   not grow. It hangs into the header's existing bottom padding. */
export function SiteHeader() {
  return (
    <header className="site">
      <div className="wrap nav">
        <Link className="logo" to="/" aria-label="TenderProp home">
          <img src={LOGO} alt="TenderProp" />
        </Link>
        <ul>
          <li>
            <Link to="/tender" activeProps={{ className: "active" }}>
              E-Tender
            </Link>
          </li>
          <li>
            {/* No aria-label: the two spans already form the accessible name
                "Owner Auction Valuation Report Included", which reads sensibly and
                keeps voice-control matching on the visible words. */}
            <Link className="nav-oa" to="/owner-auction" activeProps={{ className: "active" }}>
              <span className="nav-oa-title">Owner Auction</span>
              {/* Separator for the accessible name only. A literal space would sit in
                  FLOW after the title and widen the anchor ~4px, which shifts the
                  Owner Auction ↔ Sell gap — the one thing this tab must not do.
                  `.sr-only` is absolutely positioned, so it costs zero width. */}
              <span className="sr-only"> — </span>
              <span className="nav-oa-benefit">Valuation Report Included</span>
            </Link>
          </li>
          <li>
            <Link to="/sell" activeProps={{ className: "active" }}>
              Sell
            </Link>
          </li>
          <li>
            <Link to="/services" activeProps={{ className: "active" }}>
              Services
            </Link>
          </li>
        </ul>
        <div className="auth">
          <Link className="btn ghost" to="/member">
            Sign in
          </Link>
          <Link className="btn red" to="/member">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
