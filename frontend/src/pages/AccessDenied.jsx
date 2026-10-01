import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, LayoutDashboard, CheckSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button, Badge, Card } from "../components/ui";
import { usePageTitle } from "../hooks/usePageTitle";

function AccessDenied({ requiredRole, userRole }) {
  usePageTitle("Access Denied");
  const { user } = useAuth();

  const currentRole = userRole || user?.role || "user";
  const formattedRequiredRole = requiredRole
    ? requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)
    : "Authorized";

  return (
    <div className="page-wrapper access-denied-wrapper">
      <Card className="access-denied-card">
          <div className="access-denied-icon-wrap">
            <ShieldAlert size={38} className="access-denied-icon" />
          </div>

          <div className="access-denied-pill">
            <span>403 Authorization Required</span>
          </div>

          <h1 className="access-denied-title">Access Denied</h1>

          <p className="access-denied-desc">
            You do not have administrative permission to view or interact with
            this page. This section is restricted exclusively to{" "}
            <strong>{formattedRequiredRole}</strong> accounts.
          </p>

          <div className="access-denied-details">
            <span className="access-denied-detail-label">Your Current Role:</span>
            <Badge role={currentRole} withDot={false} />
          </div>

          <div className="access-denied-actions">
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <Button
                variant="primary"
                leftIcon={<LayoutDashboard size={16} />}
              >
                Go to Dashboard
              </Button>
            </Link>

            <Link to="/tasks" style={{ textDecoration: "none" }}>
              <Button
                variant="secondary"
                leftIcon={<CheckSquare size={16} />}
              >
                View All Tasks
              </Button>
            </Link>
          </div>
        </Card>
    </div>
  );
}

export default AccessDenied;
