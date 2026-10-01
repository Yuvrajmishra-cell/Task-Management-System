import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home, LayoutDashboard, ArrowLeft, CheckSquare } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import { Button, Card } from "../components/ui";
import { usePageTitle } from "../hooks/usePageTitle";

function NotFound() {
  usePageTitle("Page Not Found");
  const { token } = useAuth();

  const cardContent = (
    <div className="page-wrapper not-found-wrapper">
      <Card className="not-found-card">
        <div className="not-found-icon-wrap">
          <Compass size={42} className="not-found-icon" />
        </div>

        <div className="not-found-pill">
          <span>404 Error</span>
        </div>

        <h1 className="not-found-title">Page not found</h1>

        <p className="not-found-desc">
          We couldn&apos;t locate the page you were looking for. It might have been
          removed, renamed, or is temporarily unreachable.
        </p>

        <div className="not-found-actions">
          {token ? (
            <>
              <Link to="/dashboard" style={{ textDecoration: "none" }}>
                <Button variant="primary" leftIcon={<LayoutDashboard size={16} />}>
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/tasks" style={{ textDecoration: "none" }}>
                <Button variant="secondary" leftIcon={<CheckSquare size={16} />}>
                  View Tasks
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/" style={{ textDecoration: "none" }}>
                <Button variant="primary" leftIcon={<Home size={16} />}>
                  Back to Home
                </Button>
              </Link>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button variant="secondary" leftIcon={<ArrowLeft size={16} />}>
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </Card>
    </div>
  );

  if (token) {
    return <AppLayout>{cardContent}</AppLayout>;
  }

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand" style={{ textDecoration: "none" }}>
            <div className="brand-icon">
              <CheckSquare size={18} />
            </div>
            <span>TaskFlow</span>
          </Link>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>{cardContent}</main>
    </div>
  );
}

export default NotFound;

