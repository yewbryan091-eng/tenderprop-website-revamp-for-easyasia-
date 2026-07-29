import { Link } from "@tanstack/react-router";
import { LOGO } from "@/lib/images";

/* Site nav under the two-product decision (Bryan, 30 Jul 2026): buy/rent are
   retired — E-Tender and Owner Auction are the only ways to buy. Sell stays:
   owners are the paying side. Active state comes from the router, not a
   hardcoded li, so every page gets the right highlight for free. */
export function SiteHeader() {
  return (
    <header className="site">
      <div className="wrap nav">
        <Link className="logo" to="/" aria-label="TenderProp home">
          <img src={LOGO} alt="TenderProp" />
        </Link>
        <ul>
          <li><Link to="/tender" activeProps={{ className: "active" }}>E-Tender</Link></li>
          <li><Link to="/owner-auction" activeProps={{ className: "active" }}>Owner Auction</Link></li>
          <li><Link to="/sell" activeProps={{ className: "active" }}>Sell</Link></li>
          <li><Link to="/services" activeProps={{ className: "active" }}>Services</Link></li>
          <li><Link to="/about" activeProps={{ className: "active" }}>About</Link></li>
        </ul>
        <div className="auth">
          <Link className="btn ghost" to="/member">Sign in</Link>
          <Link className="btn red" to="/member">Register</Link>
        </div>
      </div>
    </header>
  );
}
