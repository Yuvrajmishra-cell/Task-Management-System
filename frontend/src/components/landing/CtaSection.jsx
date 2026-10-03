import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "../ui";
import { useReveal } from "../../hooks/useReveal";

function CtaSection() {
  const { token } = useAuth();
  const ctaReveal = useReveal();

  return (
    <section className="landing-container" aria-labelledby="cta-heading">
      <div className="cta-band reveal" ref={ctaReveal.ref}>
        <h2 id="cta-heading" className="cta-band-title">
          Ready to get your team on track?
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
                >
                  Create Free Account
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="lg"
                  className="cta-secondary"
                >
                  Sign In
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
