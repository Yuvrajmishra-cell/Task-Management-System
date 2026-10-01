import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { CheckSquare, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <main className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <CheckSquare size={26} strokeWidth={2.5} />
          </div>
          <h1 className="auth-title">Welcome to TaskFlow</h1>
          <p className="auth-subtitle">
            Sign in to access your task management dashboard
          </p>
        </div>

        {error && (
          <div className="alert-banner error" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              <Mail size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" htmlFor="password">
                <Lock size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                Password
              </label>
              <Link to="/forgot-password" className="auth-forgot-link">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary auth-btn-submit"
            disabled={isLoading}
          >
            <span>{isLoading ? "Signing in..." : "Sign In"}</span>
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-switch-btn">
            Create an account
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Login;
