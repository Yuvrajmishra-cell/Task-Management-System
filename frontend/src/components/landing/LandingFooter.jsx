import { CheckSquare, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

function LandingFooter() {
  const currentYear = 2026;

  return (
    <footer className="landing-footer">
      <div className="landing-container">
        <div className="footer-inner">
          {/* Logo & Tagline */}
          <div className="footer-brand-block" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div className="landing-brand-icon" style={{ width: "30px", height: "30px" }}>
                <CheckSquare size={16} strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>TaskFlow</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--footer-muted)", maxWidth: "300px" }}>
              Assign. Track. Complete.
            </p>
          </div>

          <nav className="footer-link-group" aria-label="Product">
            <strong>Product</strong>
            <a href="#features" className="footer-link">Features</a>
            <a href="#how-it-works" className="footer-link">How it works</a>
            <a href="#roles" className="footer-link">Roles</a>
            <a href="#security" className="footer-link">Security</a>
            <a href="#faq" className="footer-link">FAQ</a>
          </nav>
          <nav className="footer-link-group" aria-label="Account">
            <strong>Account</strong>
            <Link to="/login" className="footer-link">Login</Link>
            <Link to="/register" className="footer-link">Register</Link>
          </nav>
        </div>

        {/* Bottom Credits */}
        <div className="footer-bottom">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span>&copy; {currentYear} TaskFlow</span>
            <div className="footer-badge">
              <GraduationCap size={14} />
              <span>Built as a college project</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
