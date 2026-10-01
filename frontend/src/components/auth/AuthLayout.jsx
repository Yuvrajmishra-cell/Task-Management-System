import React from "react";
import { Link } from "react-router-dom";
import { CheckSquare } from "lucide-react";
import AuthIllustration from "./AuthIllustration";

/**
 * Shared AuthLayout: Centered white card on cream background
 * Left: Inset brand yellow panel with illustration
 * Right: Vertically centered form
 * Below 900px: Left panel hidden, compact logo displayed above form
 */
export default function AuthLayout({
  children,
  tagline = "Assign. Track. Complete.",
}) {
  return (
    <div className="auth-page-shell">
      <main className="auth-floating-card">
        {/* Left: Inset Yellow Illustration Panel */}
        <aside className="auth-card-illustration-pane" aria-label="TaskFlow visual preview">
          <AuthIllustration tagline={tagline} />
        </aside>

        {/* Right: Form Pane */}
        <section className="auth-card-form-pane">
          {/* Below 900px: compact logo above form */}
          <div className="auth-mobile-header">
            <Link to="/" className="auth-mobile-brand-link" aria-label="Go to homepage">
              <div className="auth-mobile-logo-icon">
                <CheckSquare size={20} strokeWidth={2.5} />
              </div>
              <span className="auth-mobile-brand-title">TaskFlow</span>
            </Link>
          </div>

          <div className="auth-form-scroll-content">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
