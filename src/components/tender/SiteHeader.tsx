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

   ── THE PACKAGE TAB IS ONE TAB, NOT TWO ───────────────────────────────────────
   "Valuation Report Included" lives INSIDE the same <Link> as its title: one
   anchor, one tab stop, one focus target, one active state, and the whole unit is
   clickable. It hangs on SELL — it is a seller-side benefit, and it sat on Owner
   Auction by mistake until 6 Aug.

   The annotation is IN FLOW and sets the tab's width (see .nav-pkg-benefit), so
   that tab is simply LONGER than its siblings and the next one begins after it.
   `align-items: flex-start` on the list keeps all four primary labels on one
   baseline though this anchor is taller, and a negative margin-bottom cancels the
   annotation's line from the row so the header height does not change. */
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
            <Link to="/owner-auction" activeProps={{ className: "active" }}>
              Owner Auction
            </Link>
          </li>
          <li>
            {/* THE PACKAGE TAB. "Valuation Report Included" is a SELLER-side benefit
                (Bryan, 6 Aug — it sat on Owner Auction by mistake), so it belongs to
                Sell. Classes are `nav-pkg*`, not `nav-oa*`: the annotation attaches to
                whichever tab carries the offer, and a name pinned to the old owner
                would mislead the next reader.
                No aria-label — the spans already form "Sell — Valuation Report
                Included", which reads sensibly and keeps voice control matching on the
                visible words. */}
            <Link className="nav-pkg" to="/sell" activeProps={{ className: "active" }}>
              <span className="nav-pkg-title">Sell</span>
              {/* Separator for the accessible name only. A literal space would sit in
                  FLOW after the title and widen the anchor ~4px, shifting the gap to
                  the next tab. `.sr-only` is absolutely positioned, so it costs zero
                  width. */}
              <span className="sr-only"> — </span>
              <span className="nav-pkg-benefit">Valuation Report Included</span>
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
