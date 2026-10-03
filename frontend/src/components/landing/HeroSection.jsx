import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowRight, Sparkles, LayoutDashboard, ShieldCheck, Clock, Users } from "lucide-react";
import { Button } from "../ui";
import HeroIllustration from "./HeroIllustration";

function HeroSection() {
  const { token } = useAuth();

  return (
    <section className="landing-hero" aria-labelledby="hero-heading">
      <div className="hero-glow" aria-hidden="true" />

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
              <span className="hero-line-mask"><span className="hero-headline-line">Effortless task management,</span></span>
              <span className="hero-line-mask"><span className="hero-headline-line highlight-amber">for every team</span></span>
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
                    aria-label="Go to Dashboard"
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
                      aria-label="Get Started Free"
                    >
                      <span className="landing-button-roll" aria-hidden="true"><span>Get Started Free</span><span>Get Started Free</span></span>
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="hero-btn-secondary" aria-label="Sign In">
                      <span className="landing-button-roll" aria-hidden="true"><span>Sign In</span><span>Sign In</span></span>
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
