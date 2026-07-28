import { Link } from "@tanstack/react-router";
import { LOGO } from "@/lib/images";

/* Shared chrome, matching the static handoff header markup. */
export function SiteHeader() {
  return (
    <header className="site">
      <div className="wrap nav">
        <Link className="logo" to="/tender" aria-label="TenderProp home">
          <img src={LOGO} alt="TenderProp" />
        </Link>
        <ul>
          <li className="active"><Link to="/tender">Tender</Link></li>
          <li><a href="#">Owner Private Auction</a></li>
          <li><a href="#">Sell</a></li>
          <li><a href="#">Services</a></li>
        </ul>
        <div className="auth">
          <a className="btn ghost" href="#">Sign in</a>
          <a className="btn red" href="#">Register</a>
        </div>
      </div>
    </header>
  );
}
