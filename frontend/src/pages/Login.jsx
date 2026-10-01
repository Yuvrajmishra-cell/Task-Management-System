import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/auth/AuthLayout";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Home,
  AlertCircle,
} from "lucide-react";
import Alert from "../components/ui/Alert";
import Spinner from "../components/ui/Spinner";
import { usePageTitle } from "../hooks/usePageTitle";

function Login() {
  usePageTitle("Sign In");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  /* ─── Client-side Validation ──────────────────────────────────── */
  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required.";
    if (!password) errs.password = "Password is required.";
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
      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form-header">
        <h1 className="auth-form-title">Welcome back</h1>
        <p className="auth-form-subtitle">
          Sign in to access your dashboard and manage tasks.
        </p>
      </div>

      {/* Global API Error Alert */}
      {error && (
        <Alert variant="error" onClose={() => setError("")} className="auth-alert mb-4">
          {error}
        </Alert>
      )}

      <form className="auth-form-fields" onSubmit={handleSubmit} noValidate>
        {/* Email Address */}
        <div className={`auth-field-group ${fieldErrors.email ? "has-error" : ""}`}>
          <label className="auth-field-label" htmlFor="login-email">
            <span className="auth-field-label-icon">
              <Mail size={14} />
            </span>
            <span>Email Address</span>
          </label>
          <input
            id="login-email"
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
            aria-describedby={fieldErrors.email ? "login-email-err" : undefined}
          />
          {fieldErrors.email && (
            <span id="login-email-err" className="auth-field-err" role="alert">
              <AlertCircle size={13} />
              {fieldErrors.email}
            </span>
          )}
        </div>

        {/* Password */}
        <div className={`auth-field-group ${fieldErrors.password ? "has-error" : ""}`}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label className="auth-field-label" htmlFor="login-password" style={{ marginBottom: 0 }}>
              <span className="auth-field-label-icon">
                <Lock size={14} />
              </span>
              <span>Password</span>
            </label>
            <Link to="/forgot-password" className="auth-switch-link" style={{ fontSize: "0.8rem" }}>
              Forgot password?
            </Link>
          </div>

          <div className="auth-input-pw-wrapper" style={{ marginTop: "0.35rem" }}>
            <input
              id="login-password"
              type={showPw ? "text" : "password"}
              className="auth-field-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
              }}
              autoComplete="current-password"
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? "login-pw-err" : undefined}
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
          {fieldErrors.password && (
            <span id="login-pw-err" className="auth-field-err" role="alert">
              <AlertCircle size={13} />
              {fieldErrors.password}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="login-submit"
          className="auth-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Bottom Navigation */}
      <div className="auth-bottom-nav">
        <span className="auth-switch-text">
          Don&apos;t have an account?
          <Link to="/register" className="auth-switch-link">
            Create an account
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

export default Login;
