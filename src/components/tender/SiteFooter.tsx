export function SiteFooter() {
  return (
    <footer>
      <div className="wrap cols">
        <div>
          <span className="logo-word">TenderProp</span>
          <p className="disc">
            TenderProp is a leading e-bidding property transaction platform for subsale
            properties in Malaysia.
          </p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
          </ul>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            <li><a href="#">Investment</a></li>
            <li><a href="#">Interior Design</a></li>
            <li><a href="#">Loan Center</a></li>
            <li><a href="#">Legal Matter</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact Information</h4>
          <ul>
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
