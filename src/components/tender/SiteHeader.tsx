import { Link } from "@tanstack/react-router";
import { LOGO } from "@/lib/images";

/* Site nav under the two-product decision (Bryan, 30 Jul 2026): buy/rent are
   retired — E-Tender and Owner Auction are the only ways to buy. Sell stays:
   owners are the paying side. Active state comes from the router, not a
   hardcoded li, so every page gets the right highlight for free.

   ABOUT REMOVED from the top nav (Bryan, 6 Aug) — four items, and the nav is now
   TRUE-centred rather than pushed right. About is still reachable from the footer,
   which matters: it is where the Act 242 licensed-agency disclosure lives, so the
   page had to keep a route in, just not a top-level one.

   ⚠️ "E-Tender" → "Tender" in this ONE label (Bryan, 6 Aug). A deliberate,
   founder-made exception to DESIGN-SYSTEM §3c ("all the word tender, must be
   e-tender", 30 Jul), and the only bare "tender" in rendered copy anywhere.
   Do NOT propagate it — every other surface still reads E-Tender. If the rule is
   meant to change site-wide it changes in §3c first, it does not leak out from here. */
export function SiteHeader() {
  return (
    <header className="site">
      <div className="wrap nav">
        <Link className="logo" to="/" aria-label="TenderProp home">
          <img src={LOGO} alt="TenderProp" />
        </Link>
        <ul>
          <li><Link to="/tender" activeProps={{ className: "active" }}>Tender</Link></li>
          <li><Link to="/owner-auction" activeProps={{ className: "active" }}>Owner Auction</Link></li>
          <li><Link to="/sell" activeProps={{ className: "active" }}>Sell</Link></li>
          <li><Link to="/services" activeProps={{ className: "active" }}>Services</Link></li>
        </ul>
        <div className="auth">
          <Link className="btn ghost" to="/member">Sign in</Link>
          <Link className="btn red" to="/member">Register</Link>
        </div>
      </div>
    </header>
  );
}
