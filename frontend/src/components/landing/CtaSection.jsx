import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "../ui";
import { useReveal } from "../../hooks/useReveal";

function CtaSection() {
  const { token } = useAuth();
  const { setNode: ctaRef } = useReveal();

  return (
    <section className="landing-container" aria-labelledby="cta-heading">
      <div className="cta-band reveal" ref={ctaRef}>
        <h2 id="cta-heading" className="cta-band-title">
          {"Ready to get your team on track?".split(" ").map((word, index) => <span className="cta-word" key={`${word}-${index}`}>{word}</span>)}
        </h2>
        <p className="cta-band-subtext">
          Experience role-based project coordination that eliminates communication gaps, keeps deadlines visible, and drives daily progress.
        </p>

        <div className="cta-actions">
          {token ? (
            <Link to="/dashboard">
              <Button
                variant="secondary"
                size="lg"
                className="cta-primary"
                leftIcon={<LayoutDashboard size={18} />}
                aria-label="Open Dashboard"
              >
                Open Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button
                  variant="secondary"
                  size="lg"
                  className="cta-primary"
                  rightIcon={<ArrowRight size={18} />}
                  aria-label="Create Free Account"
                >
                  <span className="landing-button-roll" aria-hidden="true"><span>Create Free Account</span><span>Create Free Account</span></span>
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="lg"
                  className="cta-secondary"
                  aria-label="Sign In"
                >
                  <span className="landing-button-roll" aria-hidden="true"><span>Sign In</span><span>Sign In</span></span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
