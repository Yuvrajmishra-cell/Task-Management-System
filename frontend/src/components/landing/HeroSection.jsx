import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowRight, Sparkles, LayoutDashboard, ShieldCheck, Clock, Users } from "lucide-react";
import { Button } from "../ui";
import HeroIllustration from "./HeroIllustration";

function HeroSection() {
  const { token } = useAuth();

  return (
    <section className="landing-hero" aria-labelledby="hero-heading">
      {/* Wave Background - Bottom Right */}
      <div className="hero-wave-bg" aria-hidden="true">
        <svg
          viewBox="0 0 1000 900"
          preserveAspectRatio="xMaxYMax slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="55%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>
          <path
            className="hero-wave-back"
            d="M0,900 C105,890 150,790 270,745 C430,685 500,555 615,450 C680,350 680,205 760,165 C835,130 945,185 1000,250 L1000,900 Z"
            fill="#FEF08A"
          />
          <path
            className="hero-wave-front"
            d="M0,900 C100,900 145,825 255,780 C415,715 480,610 560,495 C625,380 640,260 730,205 C820,160 930,190 1000,250 L1000,900 Z"
            fill="url(#wave-gradient)"
          />
        </svg>
      </div>

      <div className="landing-container">
        <div className="hero-grid">
          {/* Left Column: Text */}
          <div className="hero-content">
            {/* Pill Badge */}
            <div className="hero-pill-badge">
              <span className="hero-pill-dot" />
              <Sparkles size={14} />
              <span>Role-Based Task Management</span>
            </div>

            {/* Headline */}
            <h1 id="hero-heading" className="hero-headline">
              Effortless task management,<br />
              <span className="highlight-amber">for every team</span>
            </h1>

            {/* Subtext */}
            <p className="hero-subtext">
              Managers assign tasks, employees update status, and everyone stays on track with clear accountability and zero guesswork.
            </p>

            {/* Call to Actions */}
            <div className="hero-cta-group">
              {token ? (
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    variant="primary"
                    className="hero-btn-primary"
                    leftIcon={<LayoutDashboard size={18} />}
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button
                      size="lg"
                      variant="primary"
                      className="hero-btn-primary"
                      rightIcon={<ArrowRight size={18} />}
                    >
                      Get Started Free
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="hero-btn-secondary">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Trust row */}
            <ul className="hero-trust-row">
              <li className="trust-item">
                <Users size={16} /> <span>Role-based access</span>
              </li>
              <li className="trust-item">
                <ShieldCheck size={16} /> <span>Secure recovery</span>
              </li>
              <li className="trust-item">
                <Clock size={16} /> <span>Status tracking</span>
              </li>
            </ul>
          </div>

          {/* Right Column: Illustration (Fallback UI) */}
          <div className="hero-illustration-col">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
