import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "../components/auth/AuthLayout";
import Alert from "../components/ui/Alert";
import Spinner from "../components/ui/Spinner";
import { usePageTitle } from "../hooks/usePageTitle";
import {
  Mail,
  ShieldQuestion,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Home,
  Check,
  AlertCircle,
} from "lucide-react";

/* ─── Step Constants ─────────────────────────────────────────── */
const STEP = {
  EMAIL: 0,
  ANSWER: 1,
  RESET: 2,
  SUCCESS: 3,
};

const STEP_META = [
  { label: "Account", short: "Account" },
  { label: "Security", short: "Security" },
  { label: "New Password", short: "Password" },
];

/* ─── Password Strength Helper ──────────────────────────────────── */
function getStrength(pw) {
  if (!pw) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "Weak", color: "#ef4444" };
  if (score === 2) return { level: 2, label: "Fair", color: "#f59e0b" };
  if (score === 3) return { level: 3, label: "Good", color: "#3b82f6" };
  return { level: 4, label: "Strong", color: "#22c55e" };
}

/* ─── Visual Stepper ─────────────────────────────────────────── */
function Stepper({ current }) {
  return (
    <div className="fp-stepper" aria-label="Progress">
      {STEP_META.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const pending = i > current;
        return (
          <div key={i} className="fp-step-item">
            {i > 0 && (
              <div
                className={`fp-step-line${done || active ? " fp-step-line--done" : ""}`}
              />
            )}
            <div
              className={`fp-step-circle${
                active ? " fp-step-circle--active" : ""
              }${done ? " fp-step-circle--done" : ""}${
                pending ? " fp-step-circle--pending" : ""
              }`}
              aria-current={active ? "step" : undefined}
            >
              {done ? <Check size={13} strokeWidth={3} /> : i + 1}
            </div>
            <span
              className={`fp-step-label${
                active ? " fp-step-label--active" : ""
              }${done ? " fp-step-label--done" : ""}`}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ForgotPassword() {
  usePageTitle("Reset Password");
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
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfPw, setShowConfPw] = useState(false);
  const [pwMatchErr, setPwMatchErr] = useState("");

  // Shared UI state
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const strength = useMemo(() => getStrength(newPassword), [newPassword]);

  /* ─── Helpers ───────────────────────────────────────────────── */
  const is429 = (err) => err?.response?.status === 429;

  const apiError = (err, fallback) => {
    if (is429(err)) {
      return "Too many attempts. Please try again later.";
    }
    return err?.response?.data?.message || fallback;
  };

  /* ─── Step 1: Lookup Email ───────────────────────────────────── */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });
      if (res.data.securityQuestion) {
        setSecurityQuestion(res.data.securityQuestion);
        setStep(STEP.ANSWER);
      } else {
        setError(
          res.data.message ||
            "Security question is not configured for this account."
        );
      }
    } catch (err) {
      const msg = err?.response?.data?.message;
      if (msg === "Security question is not configured for this account") {
        setError(
          "This account does not have a security question configured. Please contact your administrator."
        );
      } else {
        setError(apiError(err, "Something went wrong. Please try again."));
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── Step 2: Verify Answer ──────────────────────────────────── */
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!answer.trim()) {
      setError("Please provide your answer.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/verify-security-answer", {
        email: email.trim().toLowerCase(),
        answer: answer.trim(),
      });
      setResetToken(res.data.resetToken);
      setStep(STEP.RESET);
    } catch (err) {
      setError(apiError(err, "Incorrect answer. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── Step 3: Reset Password ─────────────────────────────────── */
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPwMatchErr("");

    if (newPassword !== confirmPassword) {
      setPwMatchErr("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPwMatchErr("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", { resetToken, newPassword });
      setStep(STEP.SUCCESS);
    } catch (err) {
      const msg = err?.response?.data?.message;
      if (msg?.includes("expired")) {
        setError("Your reset session has expired (15 minutes). Please start over.");
      } else {
        setError(apiError(err, "Failed to reset password. Please try again."));
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── Back Helpers ───────────────────────────────────────────── */
  const goBackToEmail = () => {
    setStep(STEP.EMAIL);
    setError("");
    setAnswer("");
  };

  return (
    <AuthLayout panelTitle="Let’s get you back in." panelCopy="Verify your account and get back on track.">
      {/* ══ SUCCESS SCREEN ══ */}
      {step === STEP.SUCCESS && (
        <div className="fp-success-card" role="region" aria-label="Password Reset Success">
          <div className="fp-success-icon">
            <CheckCircle2 size={36} strokeWidth={2} />
          </div>
          <h1 className="auth-form-title" style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            Password Reset!
          </h1>
          <p className="fp-success-desc" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            Your password has been updated successfully. You can now sign in with your new credentials.
          </p>
          <Link
            to="/login"
            className="auth-submit-btn"
            style={{ textDecoration: "none", display: "flex", justifyContent: "center" }}
          >
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>
          <div className="auth-bottom-nav">
            <Link to="/" className="auth-home-link">
              <Home size={13} />
              <span>Back to home</span>
            </Link>
          </div>
        </div>
      )}

      {/* ══ STEPS 1–3 ══ */}
      {step !== STEP.SUCCESS && (
        <>
          {/* Progress Stepper */}
          <Stepper current={step} />

          {/* Step Header */}
          <div className="auth-form-header">
            {step === STEP.EMAIL && (
              <>
                <h1 className="auth-form-title">Forgot Password</h1>
                <p className="auth-form-subtitle">
                  Enter your email address and we&apos;ll retrieve your security question.
                </p>
              </>
            )}
            {step === STEP.ANSWER && (
              <>
                <h1 className="auth-form-title">Security Question</h1>
                <p className="auth-form-subtitle">
                  Answer your registered security question to verify ownership.
                </p>
              </>
            )}
            {step === STEP.RESET && (
              <>
                <h1 className="auth-form-title">New Password</h1>
                <p className="auth-form-subtitle">
                  Set a strong new password for your TaskFlow account.
                </p>
              </>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              variant={
                is429({
                  response: {
                    status: error.startsWith("Too many") ? 429 : 400,
                  },
                })
                  ? "warning"
                  : "error"
              }
              onClose={() => setError("")}
              className="auth-alert mb-4"
            >
              {error}
            </Alert>
          )}

          {/* ── Step 1: Email Form ── */}
          {step === STEP.EMAIL && (
            <form className="auth-form-fields" onSubmit={handleEmailSubmit} noValidate>
              <div className="auth-field-group">
                <label className="auth-field-label" htmlFor="fp-email">
                  <span className="auth-field-label-icon">
                    <Mail size={14} />
                  </span>
                  <span>Email Address</span>
                </label>
                <input
                  id="fp-email"
                  type="email"
                  className="auth-field-input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                id="fp-email-submit"
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" />
                    <span>Looking up account...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="auth-bottom-nav">
                <Link to="/login" className="auth-switch-link" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", justifyContent: "center" }}>
                  <ArrowLeft size={14} />
                  <span>Back to Login</span>
                </Link>
                <Link to="/" className="auth-home-link">
                  <Home size={13} />
                  <span>Back to home</span>
                </Link>
              </div>
            </form>
          )}

          {/* ── Step 2: Security Question & Answer ── */}
          {step === STEP.ANSWER && (
            <form className="auth-form-fields" onSubmit={handleAnswerSubmit} noValidate>
              <div className="auth-field-group">
                <label className="auth-field-label">
                  <span className="auth-field-label-icon">
                    <ShieldQuestion size={14} />
                  </span>
                  <span>Your Security Question</span>
                </label>
                <div className="fp-question-box" role="note">
                  <ShieldQuestion size={16} className="fp-question-icon" />
                  <span>{securityQuestion}</span>
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-field-label" htmlFor="fp-answer">
                  <span className="auth-field-label-icon">
                    <KeyRound size={14} />
                  </span>
                  <span>Your Answer</span>
                </label>
                <input
                  id="fp-answer"
                  type="text"
                  className="auth-field-input"
                  placeholder="Enter your security answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                  autoComplete="off"
                  aria-describedby="fp-answer-hint"
                />
                <span id="fp-answer-hint" className="auth-field-hint">Answers are case-insensitive.</span>
              </div>

              <button
                type="submit"
                id="fp-answer-submit"
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Answer</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="auth-bottom-nav">
                <button
                  type="button"
                  onClick={goBackToEmail}
                  className="auth-switch-link"
                  style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem", justifyContent: "center" }}
                >
                  <ArrowLeft size={14} />
                  <span>Try a different email</span>
                </button>
              </div>
            </form>
          )}

          {/* ── Step 3: New Password & Confirm Password ── */}
          {step === STEP.RESET && (
            <form className="auth-form-fields" onSubmit={handleResetSubmit} noValidate>
              {/* New Password */}
              <div className="auth-field-group">
                <label className="auth-field-label" htmlFor="fp-new-pw">
                  <span className="auth-field-label-icon">
                    <Lock size={14} />
                  </span>
                  <span>New Password</span>
                  <span className="form-label-hint">(min. 8 characters)</span>
                </label>
                <div className="auth-input-pw-wrapper">
                  <input
                    id="fp-new-pw"
                    type={showNewPw ? "text" : "password"}
                    className="auth-field-input"
                    placeholder="••••••••"
                    value={newPassword}
                    minLength={8}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (pwMatchErr) setPwMatchErr("");
                    }}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-input-pw-btn"
                    onClick={() => setShowNewPw((v) => !v)}
                    aria-label={showNewPw ? "Hide password" : "Show password"}
                  >
                    {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Strength Meter */}
                {newPassword && (
                  <div className="pw-strength-wrapper" aria-live="polite">
                    <div className="pw-strength-bar">
                      {[1, 2, 3, 4].map((seg) => (
                        <div
                          key={seg}
                          className="pw-strength-seg"
                          style={{
                            backgroundColor:
                              seg <= strength.level ? strength.color : "var(--border-subtle)",
                          }}
                        />
                      ))}
                    </div>
                    <span className="pw-strength-label" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className={`auth-field-group ${pwMatchErr ? "has-error" : ""}`}>
                <label className="auth-field-label" htmlFor="fp-confirm-pw">
                  <span className="auth-field-label-icon">
                    <Lock size={14} />
                  </span>
                  <span>Confirm New Password</span>
                </label>
                <div className="auth-input-pw-wrapper">
                  <input
                    id="fp-confirm-pw"
                    type={showConfPw ? "text" : "password"}
                    className="auth-field-input"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (pwMatchErr) setPwMatchErr("");
                    }}
                    required
                    autoComplete="new-password"
                    aria-invalid={Boolean(pwMatchErr)}
                    aria-describedby={pwMatchErr ? "fp-pw-match-err" : undefined}
                  />
                  <button
                    type="button"
                    className="auth-input-pw-btn"
                    onClick={() => setShowConfPw((v) => !v)}
                    aria-label={showConfPw ? "Hide password" : "Show password"}
                  >
                    {showConfPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {pwMatchErr && (
                  <span id="fp-pw-match-err" className="auth-field-err" role="alert">
                    <AlertCircle size={13} />
                    {pwMatchErr}
                  </span>
                )}
              </div>

              <p className="auth-field-hint" style={{ color: "#d97706", fontWeight: 500 }}>
                This recovery session expires in 15 minutes.
              </p>

              <button
                type="submit"
                id="fp-reset-submit"
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" />
                    <span>Resetting...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="auth-bottom-nav">
                <Link to="/login" className="auth-switch-link" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", justifyContent: "center" }}>
                  <ArrowLeft size={14} />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </>
      )}
    </AuthLayout>
  );
}

export default ForgotPassword;
