import { CheckSquare, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="landing-footer">
      <div className="landing-container">
        <div className="footer-inner">
          {/* Logo & Tagline */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div className="landing-brand-icon" style={{ width: "30px", height: "30px" }}>
                <CheckSquare size={16} strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>TaskFlow</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "300px" }}>
              A clean, modern task management platform for agile teams.
            </p>
          </div>

          {/* Quick Nav Links */}
          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="#features" className="footer-link">
              Features
            </a>
            <a href="#how-it-works" className="footer-link">
              How it works
            </a>
            <a href="#roles" className="footer-link">
              Roles
            </a>
            <a href="#security" className="footer-link">
              Security
            </a>
            <a href="#faq" className="footer-link">
              FAQ
            </a>
            <Link to="/login" className="footer-link">
              Sign In
            </Link>
            <Link to="/register" className="footer-link">
              Register
            </Link>
          </nav>
        </div>

        {/* Bottom Credits */}
        <div className="footer-bottom">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span>&copy; {currentYear} TaskFlow. All rights reserved.</span>
            <div className="footer-badge">
              <GraduationCap size={14} />
              <span>Built as a college project</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Full-Stack MERN Architecture
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
