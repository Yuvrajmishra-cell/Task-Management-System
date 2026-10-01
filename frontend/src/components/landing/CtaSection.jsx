import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "../ui";

function CtaSection() {
  const { token } = useAuth();

  return (
    <section className="landing-container" aria-labelledby="cta-heading">
      <div className="cta-band">
        <h2 id="cta-heading" className="cta-band-title">
          Ready to get your team on track?
        </h2>
        <p className="cta-band-subtext">
          Experience role-based project coordination that eliminates communication gaps, keeps deadlines visible, and drives daily progress.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          {token ? (
            <Link to="/dashboard">
              <Button
                variant="secondary"
                size="lg"
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
                  rightIcon={<ArrowRight size={18} />}
                >
                  Create Free Account
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="lg"
                  style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.3)" }}
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
