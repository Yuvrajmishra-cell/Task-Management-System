import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CheckSquare, Menu, X, ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "../ui";

function LandingNav() {
  const { token, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className={`landing-nav-wrapper ${scrolled ? "scrolled" : ""}`}>
      <div className="landing-container">
        <nav className="landing-nav" aria-label="Main Navigation">
          {/* Brand Logo */}
          <a href="#" className="landing-brand">
            <div className="landing-brand-icon">
              <CheckSquare size={22} strokeWidth={2.5} />
            </div>
            <span>TaskFlow</span>
          </a>

          {/* Desktop Nav Links */}
          <ul className="landing-nav-links">
            <li>
              <a href="#features" className="landing-nav-link">
                Features
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="landing-nav-link">
                How it works
              </a>
            </li>
            <li>
              <a href="#roles" className="landing-nav-link">
                Roles
              </a>
            </li>
            <li>
              <a href="#security" className="landing-nav-link">
                Security
              </a>
            </li>
            <li>
              <a href="#faq" className="landing-nav-link">
                FAQ
              </a>
            </li>
          </ul>

          {/* Nav Actions / Auth status */}
          <div className="landing-nav-actions">
            {token ? (
              <Link to="/dashboard">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<LayoutDashboard size={16} />}
                >
                  Go to Dashboard ({user?.role || "Account"})
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="landing-login-link">
                  Login
                </Link>
                <Link to="/register">
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight size={15} />}
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Toggle Button */}
            <button
              type="button"
              className="landing-mobile-toggle"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <div
          className={`landing-mobile-menu ${mobileOpen ? "open" : ""}`}
          aria-hidden={!mobileOpen}
        >
          <div className="landing-mobile-links">
            <a href="#features" onClick={closeMobile}>
              Features
            </a>
            <a href="#how-it-works" onClick={closeMobile}>
              How it works
            </a>
            <a href="#roles" onClick={closeMobile}>
              Roles
            </a>
            <a href="#security" onClick={closeMobile}>
              Security
            </a>
            <a href="#faq" onClick={closeMobile}>
              FAQ
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {token ? (
              <Link to="/dashboard" onClick={closeMobile}>
                <Button variant="primary" fullWidth leftIcon={<LayoutDashboard size={16} />}>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={closeMobile}>
                  <Button variant="secondary" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={closeMobile}>
                  <Button variant="primary" fullWidth rightIcon={<ArrowRight size={16} />}>
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default LandingNav;
