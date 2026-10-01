import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  CheckSquare,
  Mail,
  ShieldQuestion,
  KeyRound,
  Lock,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const STEP = {
  EMAIL: "email",        // Step 1: enter email
  ANSWER: "answer",      // Step 2: answer security question
  RESET: "reset",        // Step 3: set new password
  SUCCESS: "success",    // Final: success screen
};

function ForgotPassword() {
  const [step, setStep] = useState(STEP.EMAIL);

  // Step 1
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");

  // Step 2
  const [answer, setAnswer] = useState("");
  const [resetToken, setResetToken] = useState("");

  // Step 3
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI State
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ─── Step 1: Submit Email ─────────────────────────────────────────────────
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", { email });

      if (response.data.securityQuestion) {
        setSecurityQuestion(response.data.securityQuestion);
        setStep(STEP.ANSWER);
      } else {
        // This means the email was found but has no security question configured
        setError(
          response.data.message ||
          "Security question is not configured for this account."
        );
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === "Security question is not configured for this account") {
        setError("This account does not have a security question configured. Please contact your administrator.");
      } else {
        setError(msg || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Step 2: Verify Security Answer ──────────────────────────────────────
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/verify-security-answer", {
        email,
        answer,
      });

      setResetToken(response.data.resetToken);
      setStep(STEP.RESET);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Incorrect security answer. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Step 3: Reset Password ───────────────────────────────────────────────
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/reset-password", {
        resetToken,
        newPassword,
      });

      setStep(STEP.SUCCESS);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg?.includes("expired")) {
        setError("Your reset session has expired (15 minutes). Please start over.");
      } else {
        setError(msg || "Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <main className="auth-card">

        {/* ─── SUCCESS SCREEN ─────────────────────────────────────────────── */}
        {step === STEP.SUCCESS && (
          <>
            <div className="auth-header">
              <div
                className="auth-logo"
                style={{ background: "linear-gradient(135deg, #10b981 0%, #065f46 100%)" }}
              >
                <CheckCircle2 size={26} strokeWidth={2.5} />
              </div>
              <h1 className="auth-title">Password Reset!</h1>
              <p className="auth-subtitle">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
            </div>

            <Link
              to="/login"
              className="btn-primary"
              style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "0.5rem" }}
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </>
        )}

        {/* ─── STEP 1: EMAIL ───────────────────────────────────────────────── */}
        {step === STEP.EMAIL && (
          <>
            <div className="auth-header">
              <div className="auth-logo">
                <CheckSquare size={26} strokeWidth={2.5} />
              </div>
              <h1 className="auth-title">Forgot Password</h1>
              <p className="auth-subtitle">
                Enter your email address and we&apos;ll show your security question.
              </p>
            </div>

            {error && (
              <div className="alert-banner error" role="alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form className="auth-form" onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="fp-email">
                  <Mail
                    size={14}
                    style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }}
                  />
                  Email Address
                </label>
                <input
                  id="fp-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                className="btn-primary auth-btn-submit"
                disabled={isLoading}
              >
                <span>{isLoading ? "Looking up account..." : "Continue"}</span>
                {!isLoading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="auth-footer">
              <Link to="/login" className="auth-switch-btn">
                <ArrowLeft size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                Back to Login
              </Link>
            </div>
          </>
        )}

        {/* ─── STEP 2: SECURITY QUESTION ───────────────────────────────────── */}
        {step === STEP.ANSWER && (
          <>
            <div className="auth-header">
              <div className="auth-logo">
                <ShieldQuestion size={26} strokeWidth={2.5} />
              </div>
              <h1 className="auth-title">Security Question</h1>
              <p className="auth-subtitle">
                Answer your security question to continue.
              </p>
            </div>

            {error && (
              <div className="alert-banner error" role="alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form className="auth-form" onSubmit={handleAnswerSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <ShieldQuestion
                    size={14}
                    style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }}
                  />
                  Your Security Question
                </label>
                <div
                  style={{
                    padding: "0.65rem 0.85rem",
                    background: "var(--primary-light)",
                    border: "1px solid var(--primary-border)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--primary)",
                  }}
                >
                  {securityQuestion}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fp-answer">
                  <KeyRound
                    size={14}
                    style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }}
                  />
                  Your Answer
                </label>
                <input
                  id="fp-answer"
                  type="text"
                  placeholder="Enter your answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                  autoComplete="off"
                />
                <p className="form-hint">Answers are case-insensitive.</p>
              </div>

              <button
                type="submit"
                className="btn-primary auth-btn-submit"
                disabled={isLoading}
              >
                <span>{isLoading ? "Verifying..." : "Verify Answer"}</span>
                {!isLoading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="auth-footer">
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => { setStep(STEP.EMAIL); setError(""); setAnswer(""); }}
              >
                <ArrowLeft size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                Try a different email
              </button>
            </div>
          </>
        )}

        {/* ─── STEP 3: RESET PASSWORD ──────────────────────────────────────── */}
        {step === STEP.RESET && (
          <>
            <div className="auth-header">
              <div className="auth-logo">
                <Lock size={26} strokeWidth={2.5} />
              </div>
              <h1 className="auth-title">Create New Password</h1>
              <p className="auth-subtitle">
                Choose a strong new password for your account.
              </p>
            </div>

            {error && (
              <div className="alert-banner error" role="alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form className="auth-form" onSubmit={handleResetSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="fp-new-password">
                  <Lock
                    size={14}
                    style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }}
                  />
                  New Password (min. 8 characters)
                </label>
                <input
                  id="fp-new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  minLength={8}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fp-confirm-password">
                  <Lock
                    size={14}
                    style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }}
                  />
                  Confirm New Password
                </label>
                <input
                  id="fp-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="btn-primary auth-btn-submit"
                disabled={isLoading}
              >
                <span>{isLoading ? "Resetting..." : "Reset Password"}</span>
                {!isLoading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="auth-footer">
              This session expires in 15 minutes.
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default ForgotPassword;
