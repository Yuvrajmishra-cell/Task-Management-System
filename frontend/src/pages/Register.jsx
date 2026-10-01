import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/auth/AuthLayout";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldQuestion,
  KeyRound,
  ArrowRight,
  Home,
  AlertCircle,
} from "lucide-react";
import Alert from "../components/ui/Alert";
import Spinner from "../components/ui/Spinner";
import { usePageTitle } from "../hooks/usePageTitle";

/* ─── Security Questions ─────────────────────────────────────────── */
const SECURITY_QUESTIONS = [
  "What is your school name?",
  "What is your favorite book?",
  "What is your favorite teacher's name?",
  "What is your childhood nickname?",
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

function Register() {
  usePageTitle("Create Account");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const strength = useMemo(() => getStrength(password), [password]);

  /* ─── Client-side Validation ──────────────────────────────────── */
  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Full name is required.";
    if (!email.trim()) errs.email = "Email is required.";
    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    if (!securityQuestion) {
      errs.securityQuestion = "Please select a security question.";
    }
    if (!securityAnswer.trim()) {
      errs.securityAnswer = "Security answer is required.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const clearFieldError = (key) =>
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));

  /* ─── Submit Handler ─────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      // Send EXACT payload without confirmPassword
      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        securityQuestion,
        securityAnswer: securityAnswer.trim(),
      });

      if (response.data.token && response.data.user) {
        login(response.data.token, response.data.user);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Registration failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form-header">
        <h1 className="auth-form-title">Create an account</h1>
        <p className="auth-form-subtitle">
          Join TaskFlow and start managing tasks with your team.
        </p>
      </div>

      {/* Global API Error Alert */}
      {error && (
        <Alert variant="error" onClose={() => setError("")} className="auth-alert mb-4">
          {error}
        </Alert>
      )}

      <form className="auth-form-fields" onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className={`auth-field-group ${fieldErrors.name ? "has-error" : ""}`}>
          <label className="auth-field-label" htmlFor="reg-name">
            <span className="auth-field-label-icon">
              <User size={14} />
            </span>
            <span>Full Name</span>
          </label>
          <input
            id="reg-name"
            type="text"
            className="auth-field-input"
            placeholder="e.g. Alex Morgan"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError("name");
            }}
            autoComplete="name"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "reg-name-err" : undefined}
          />
          {fieldErrors.name && (
            <span id="reg-name-err" className="auth-field-err" role="alert">
              <AlertCircle size={13} />
              {fieldErrors.name}
            </span>
          )}
        </div>

        {/* Email Address */}
        <div className={`auth-field-group ${fieldErrors.email ? "has-error" : ""}`}>
          <label className="auth-field-label" htmlFor="reg-email">
            <span className="auth-field-label-icon">
              <Mail size={14} />
            </span>
            <span>Email Address</span>
          </label>
          <input
            id="reg-email"
            type="email"
            className="auth-field-input"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            autoComplete="email"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "reg-email-err" : undefined}
          />
          {fieldErrors.email && (
            <span id="reg-email-err" className="auth-field-err" role="alert">
              <AlertCircle size={13} />
              {fieldErrors.email}
            </span>
          )}
        </div>

        {/* Password & Confirm Password (Two columns on desktop) */}
        <div className="auth-password-grid">
          {/* Password */}
          <div className={`auth-field-group ${fieldErrors.password ? "has-error" : ""}`}>
            <label className="auth-field-label" htmlFor="reg-password">
              <span className="auth-field-label-icon">
                <Lock size={14} />
              </span>
              <span>Password</span>
            </label>
            <div className="auth-input-pw-wrapper">
              <input
                id="reg-password"
                type={showPw ? "text" : "password"}
                className="auth-field-input"
                placeholder="min. 8 chars"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError("password");
                }}
                autoComplete="new-password"
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? "reg-pw-err" : "reg-pw-strength"}
              />
              <button
                type="button"
                className="auth-input-pw-btn"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Strength indicator */}
            {password && (
              <div id="reg-pw-strength" className="pw-strength-wrapper" aria-live="polite">
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
            {fieldErrors.password && (
              <span id="reg-pw-err" className="auth-field-err" role="alert">
                <AlertCircle size={13} />
                {fieldErrors.password}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className={`auth-field-group ${fieldErrors.confirmPassword ? "has-error" : ""}`}>
            <label className="auth-field-label" htmlFor="reg-confirm-password">
              <span className="auth-field-label-icon">
                <Lock size={14} />
              </span>
              <span>Confirm Password</span>
            </label>
            <div className="auth-input-pw-wrapper">
              <input
                id="reg-confirm-password"
                type={showConfirmPw ? "text" : "password"}
                className="auth-field-input"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearFieldError("confirmPassword");
                }}
                autoComplete="new-password"
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                aria-describedby={fieldErrors.confirmPassword ? "reg-conf-err" : undefined}
              />
              <button
                type="button"
                className="auth-input-pw-btn"
                onClick={() => setShowConfirmPw((v) => !v)}
                aria-label={showConfirmPw ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <span id="reg-conf-err" className="auth-field-err" role="alert">
                <AlertCircle size={13} />
                {fieldErrors.confirmPassword}
              </span>
            )}
          </div>
        </div>

        {/* Security Question */}
        <div className={`auth-field-group ${fieldErrors.securityQuestion ? "has-error" : ""}`}>
          <label className="auth-field-label" htmlFor="reg-sq">
            <span className="auth-field-label-icon">
              <ShieldQuestion size={14} />
            </span>
            <span>Security Question</span>
          </label>
          <select
            id="reg-sq"
            className="auth-field-select"
            value={securityQuestion}
            onChange={(e) => {
              setSecurityQuestion(e.target.value);
              clearFieldError("securityQuestion");
            }}
            aria-invalid={Boolean(fieldErrors.securityQuestion)}
            aria-describedby={fieldErrors.securityQuestion ? "reg-sq-err" : undefined}
          >
            <option value="">Select a security question</option>
            {SECURITY_QUESTIONS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
          {fieldErrors.securityQuestion && (
            <span id="reg-sq-err" className="auth-field-err" role="alert">
              <AlertCircle size={13} />
              {fieldErrors.securityQuestion}
            </span>
          )}
        </div>

        {/* Security Answer */}
        <div className={`auth-field-group ${fieldErrors.securityAnswer ? "has-error" : ""}`}>
          <label className="auth-field-label" htmlFor="reg-sa">
            <span className="auth-field-label-icon">
              <KeyRound size={14} />
            </span>
            <span>Security Answer</span>
          </label>
          <input
            id="reg-sa"
            type="text"
            className="auth-field-input"
            placeholder="Your answer (case-insensitive)"
            value={securityAnswer}
            onChange={(e) => {
              setSecurityAnswer(e.target.value);
              clearFieldError("securityAnswer");
            }}
            autoComplete="off"
            aria-invalid={Boolean(fieldErrors.securityAnswer)}
            aria-describedby={
              fieldErrors.securityAnswer ? "reg-sa-err" : "reg-sa-hint"
            }
          />
          <span id="reg-sa-hint" className="auth-field-hint">
            Used to recover your account if you forget your password.
          </span>
          {fieldErrors.securityAnswer && (
            <span id="reg-sa-err" className="auth-field-err" role="alert">
              <AlertCircle size={13} />
              {fieldErrors.securityAnswer}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="register-submit"
          className="auth-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Bottom Navigation */}
      <div className="auth-bottom-nav">
        <span className="auth-switch-text">
          Already have an account?
          <Link to="/login" className="auth-switch-link">
            Sign in
          </Link>
        </span>

        <Link to="/" className="auth-home-link">
          <Home size={13} />
          <span>Back to home</span>
        </Link>
      </div>
    </AuthLayout>
  );
}

export default Register;
