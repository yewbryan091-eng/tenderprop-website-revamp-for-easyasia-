import { Link } from "@tanstack/react-router";

import { TENDERS } from "@/data/tenders";
import { fmtDate } from "@/lib/tender-utils";

/* Next cycle = earliest closing date in the data. Pure data, no clock —
   deterministic on server and client, so no hydration risk. */
const NEXT_CYCLE = TENDERS.map((t) => t.closingDate).sort()[0];

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap cols">
        <div>
          <span className="logo-word">TenderProp</span>
          <p className="disc">
            Property by sealed E-Tender and Owner Private Auction — run end to end by a
            licensed real estate agency in Malaysia.
          </p>
          <p className="disc">
            Next e-tender cycle: <b>{fmtDate(NEXT_CYCLE)}</b>
          </p>
        </div>
        <div>
          <h4>Platform</h4>
          <ul>
            <li><Link to="/tender">E-Tender</Link></li>
            <li><Link to="/owner-auction">Owner Auction</Link></li>
            <li><Link to="/sell">Sell Your Property</Link></li>
            <li><Link to="/services">Member Services</Link></li>
            <li><Link to="/member">Member Account</Link></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/about">Contact</Link></li>
            {/* Privacy + Terms stay on the live site until their content is
                reconciled with the new deposit/refund copy. */}
            <li><a href="https://tenderprop.com/privacy-policy/" target="_blank" rel="noopener">Privacy Policy</a></li>
            <li><a href="https://tenderprop.com/terms-of-use/" target="_blank" rel="noopener">Terms of Use</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact Information</h4>
          <ul>
            <li>No. 23B, Jalan USJ 10/1C, 47620 Subang Jaya, Selangor</li>
            <li><a href="tel:+60380216468">(+603) 8021 6468</a></li>
            <li><a href="mailto:info@tenderprop.com">info@tenderprop.com</a></li>
          </ul>
        </div>
      </div>
      <div className="wrap legal">
        <span>&copy; 2026 TenderProp. All Rights Reserved.</span>
        <span>SY Global Networks</span>
      </div>
    </footer>
  );
}
