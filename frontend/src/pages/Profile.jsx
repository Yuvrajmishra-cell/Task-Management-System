import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Badge, Avatar, PageHeader } from "../components/ui";
import {
  User,
  Mail,
  Shield,
  ShieldCheck,
  Check,
  X,
  Hash,
  ArrowRight,
  Info,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import "./Profile.css";

function Profile() {
  usePageTitle("My Profile");
  const { user } = useAuth();

  const [taskStats, setTaskStats] = useState(null);
  const [hasLoadedStats, setHasLoadedStats] = useState(false);

  const isManager = user?.role === "manager";
  const userId = user?.id || user?._id;

  useEffect(() => {
    let isMounted = true;
    api
      .get("/tasks")
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        const stats = {
          total: list.length,
          pending: list.filter((t) => t.status === "Pending").length,
          inProgress: list.filter((t) => t.status === "In Progress").length,
          completed: list.filter((t) => t.status === "Completed").length,
        };
        setTaskStats(stats);
      })
      .catch((err) => {
        console.error("Failed to load task stats for profile:", err);
      })
      .finally(() => {
        if (isMounted) setHasLoadedStats(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const managerPermissions = [
    { label: "Create new tasks for team members", allowed: true },
    { label: "Assign tasks to active employees", allowed: true },
    { label: "Set and adjust due dates", allowed: true },
    { label: "Delete any team task", allowed: true },
    { label: "View and filter all workspace tasks", allowed: true },
  ];

  const employeePermissions = [
    { label: "View assigned tasks", allowed: true },
    { label: "Update status of own tasks", allowed: true },
    { label: "Filter tasks by status and due date", allowed: true },
    { label: "Delete own completed tasks", allowed: true },
    { label: "Cannot modify others' tasks", allowed: false },
  ];

  const permissions = isManager ? managerPermissions : employeePermissions;

  return (
    <div className="profile-page-container">
      <PageHeader
        title="My Profile"
        subtitle="View your registered credentials, access rights, and security settings."
      />

      {/* 1. Header Card with Soft Yellow Banner & Overlapping Avatar (No duplicate logout) */}
      <div className="profile-header-card-v2">
        <div className="profile-yellow-banner">
          <div className="profile-banner-decor" aria-hidden="true" />
        </div>

        <div className="profile-header-body-v2">
        {/* Overlapping Avatar */}
          <div className="profile-avatar-overlap-row">
            <div className="profile-avatar-ring">
              <Avatar name={user?.name || "User"} size="xl" />
            </div>
          </div>

          {/* User info */}
          <div className="profile-user-info-block">
            <div className="profile-name-badge-row">
              <h1 className="profile-display-name">{user?.name || "User"}</h1>
              <Badge role={user?.role} withDot={false} />
            </div>

            <div className="profile-meta-tags-row">
              <span className="profile-meta-tag-item">
                <Mail size={14} style={{ color: "var(--text-muted)" }} />
                <span>{user?.email || "—"}</span>
              </span>
              <span className="profile-meta-tag-item">
                <Shield size={14} style={{ color: "var(--text-muted)" }} />
                <span style={{ textTransform: "capitalize" }}>
                  {user?.role || "Employee"} Role
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Grid of Cards */}
      <div className="profile-cards-grid">
        {/* Left: Account details */}
        <section className="profile-white-card" aria-labelledby="heading-account-details">
          <h2 id="heading-account-details" className="profile-card-header-row">
            <User size={16} style={{ color: "var(--brand-yellow-dark, #b48a08)" }} />
            <span>Account details</span>
          </h2>

          <div className="profile-details-list">
            <div className="profile-detail-row">
              <span className="profile-detail-label">
                <User size={13} /> Full name
              </span>
              <span className="profile-detail-val">{user?.name || "—"}</span>
            </div>

            <div className="profile-detail-row">
              <span className="profile-detail-label">
                <Mail size={13} /> Email address
              </span>
              <span className="profile-detail-val">{user?.email || "—"}</span>
            </div>

            <div className="profile-detail-row">
              <span className="profile-detail-label">
                <Shield size={13} /> Assigned role
              </span>
              <span className="profile-detail-val" style={{ textTransform: "capitalize" }}>
                {user?.role || "Employee"}
              </span>
            </div>

            {userId && (
              <div className="profile-detail-row">
                <span className="profile-detail-label">
                  <Hash size={13} /> User ID
                </span>
                <code className="profile-id-chip">{userId}</code>
              </div>
            )}
          </div>
        </section>

        {/* Right: What you can do */}
        <section className="profile-white-card" aria-labelledby="heading-permissions">
          <h2 id="heading-permissions" className="profile-card-header-row">
            <CheckCircle2 size={16} style={{ color: "var(--brand-yellow-dark, #b48a08)" }} />
            <span>What you can do</span>
          </h2>

          <ul className="profile-permissions-list">
            {permissions.map((p, idx) => (
              <li key={idx} className="profile-permission-item">
                {p.allowed ? (
                  <span className="profile-perm-check" aria-label="Permitted">
                    <Check size={12} strokeWidth={3} />
                  </span>
                ) : (
                  <span className="profile-perm-cross" aria-label="Restricted">
                    <X size={12} strokeWidth={2.5} />
                  </span>
                )}
                <span style={{ color: p.allowed ? "var(--text-primary)" : "var(--text-muted)", fontWeight: 500 }}>
                  {p.label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Second Small Card: "Your activity" (if tasks available) or "Security" */}
        {hasLoadedStats && taskStats ? (
          <section className="profile-white-card" aria-labelledby="heading-activity">
            <h2 id="heading-activity" className="profile-card-header-row">
              <TrendingUp size={16} style={{ color: "var(--brand-yellow-dark, #b48a08)" }} />
              <span>Your activity</span>
            </h2>

            <div className="profile-activity-grid">
              <div className="profile-stat-box">
                <span className="profile-stat-number">{taskStats.total}</span>
                <span className="profile-stat-label">
                  <span className="profile-stat-dot" style={{ backgroundColor: "#64748b" }} />
                  Total tasks
                </span>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-number">{taskStats.pending}</span>
                <span className="profile-stat-label">
                  <span className="profile-stat-dot" style={{ backgroundColor: "#ea580c" }} />
                  Pending
                </span>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-number">{taskStats.completed}</span>
                <span className="profile-stat-label">
                  <span className="profile-stat-dot" style={{ backgroundColor: "#16a34a" }} />
                  Completed
                </span>
              </div>
            </div>
          </section>
        ) : null}

        {/* Security & Account Protection Card */}
        <section
          className="profile-white-card"
          aria-labelledby="heading-security"
          style={hasLoadedStats && taskStats ? {} : { gridColumn: "span 2" }}
        >
          <h2 id="heading-security" className="profile-card-header-row">
            <ShieldCheck size={16} style={{ color: "var(--brand-yellow-dark, #b48a08)" }} />
            <span>Security &amp; protection</span>
          </h2>

          <div className="profile-security-box">
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
              Your account is protected by salted bcrypt password hashing and a registered security question.
              If you ever lose access or forget your credentials, you can safely reset your password using the recovery workflow.
            </p>

            <Link to="/forgot-password" className="profile-security-link-row">
              <span>Forgot your password? Recover it</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>

      {/* Info note */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)", padding: "0 0.5rem" }}>
        <Info size={14} />
        <span>Account credentials and role assignments are managed by workspace administration.</span>
      </div>
    </div>
  );
}

export default Profile;
