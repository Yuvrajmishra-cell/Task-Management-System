import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  CheckSquare,
  User,
  Mail,
  Lock,
  ShieldQuestion,
  KeyRound,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const SECURITY_QUESTIONS = [
  "What is your school name?",
  "What is your favorite book?",
  "What is your favorite teacher's name?",
  "What is your childhood nickname?",
];

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        securityQuestion,
        securityAnswer,
      });

      // Log in the user with received token and user object
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
    <div className="auth-wrapper">
      <main className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <CheckSquare size={26} strokeWidth={2.5} />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Register as an employee to start managing your assigned tasks
          </p>
        </div>

        {error && (
          <div className="alert-banner error" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              <User size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="name"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              <Lock size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
              Password (min. 8 characters)
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {/* Security Question */}
          <div className="form-group">
            <label className="form-label" htmlFor="security-question">
              <ShieldQuestion size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
              Security Question
            </label>
            <select
              id="security-question"
              value={securityQuestion}
              onChange={(event) => setSecurityQuestion(event.target.value)}
              required
            >
              <option value="">Select a security question</option>
              {SECURITY_QUESTIONS.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          {/* Security Answer */}
          <div className="form-group">
            <label className="form-label" htmlFor="security-answer">
              <KeyRound size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
              Security Answer
            </label>
            <input
              id="security-answer"
              type="text"
              placeholder="Your answer (case-insensitive)"
              value={securityAnswer}
              onChange={(event) => setSecurityAnswer(event.target.value)}
              required
              autoComplete="off"
            />
            <p className="form-hint">
              This answer will be used to verify your identity if you forget your password.
            </p>
          </div>

          <button
            type="submit"
            className="btn-primary auth-btn-submit"
            disabled={isLoading}
          >
            <span>{isLoading ? "Creating account..." : "Register"}</span>
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-switch-btn">
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Register;
