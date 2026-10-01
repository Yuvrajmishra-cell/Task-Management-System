import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  StatusBadge,
  EmptyState,
  Skeleton,
  PageHeader,
  Spinner,
  DueDate,
} from "../components/ui";
import { usePageTitle } from "../hooks/usePageTitle";
import {
  CheckCircle2,
  AlertCircle,
  ClipboardList,
  RefreshCw,
  X,
  Clock,
  Check,
  Circle,
} from "lucide-react";
import "./UpdateStatus.css";

/* ─── Toast Component ────────────────────────────────────────── */
function Toast({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="us-toast-stack" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className={`us-toast us-toast-${t.type}`}>
          <span className="us-toast-icon">
            {t.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
          </span>
          <span className="us-toast-msg">{t.message}</span>
          <button
            type="button"
            className="us-toast-close"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Skeleton Loader ────────────────────────────────────────── */
function SkeletonLoader() {
  return (
    <div className="us-skeleton-card">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="us-skeleton-row">
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flex: 2 }}>
            <Skeleton variant="circle" width="24px" height="24px" />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", width: "70%" }}>
              <Skeleton variant="text" width="60%" height="1.05rem" />
              <Skeleton variant="text" width="90%" height="0.8rem" />
            </div>
          </div>
          <Skeleton variant="rect" width="80px" height="24px" style={{ borderRadius: "9999px" }} />
          <Skeleton variant="rect" width="90px" height="24px" style={{ borderRadius: "9999px" }} />
          <Skeleton variant="rect" width="120px" height="32px" style={{ borderRadius: "9999px" }} />
        </div>
      ))}
    </div>
  );
}

const STATUSES = ["Pending", "In Progress", "Completed"];
let toastIdCounter = 0;

/* ─── Main Component ─────────────────────────────────────────── */
function UpdateStatus() {
  usePageTitle("Update Task Status");
  const { user } = useAuth();

  // Route guard: employee only
  if (user && user.role !== "employee") {
    return <Navigate to="/dashboard" replace />;
  }

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const [toasts, setToasts] = useState([]);

  const toastTimers = useRef({});

  /* ── Toast helpers ── */
  const addToast = useCallback((message, type = "success") => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    toastTimers.current[id] = setTimeout(() => dismissToast(id), 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    clearTimeout(toastTimers.current[id]);
    delete toastTimers.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Clear timers on unmount
  useEffect(() => {
    return () => Object.values(toastTimers.current).forEach(clearTimeout);
  }, []);

  /* ── Fetch tasks ── */
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const response = await api.get("/tasks");
      const currentUserId = String(user?.id || user?._id || "");
      const myTasks = (response.data || []).filter((task) => {
        const assignedId =
          typeof task.assignedTo === "object"
            ? task.assignedTo?._id || task.assignedTo?.id
            : task.assignedTo;
        return String(assignedId) === currentUserId;
      });
      setTasks(myTasks);
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setFetchError("Could not load your tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  /* ── Sort: open tasks first sorted by due date ── */
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const aDone = a.status === "Completed";
      const bDone = b.status === "Completed";
      if (aDone !== bDone) {
        return aDone ? 1 : -1; // open tasks first
      }
      const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return aTime - bTime;
    });
  }, [tasks]);

  /* ── Update status ── */
  const updateStatus = async (taskId, newStatus) => {
    const prevTasks = tasks;

    // Optimistic update
    setTasks((curr) =>
      curr.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
    setUpdatingIds((prev) => new Set([...prev, taskId]));

    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      addToast(`Status updated to "${newStatus}"`, "success");
    } catch (err) {
      console.error("Update status error:", err);
      // Rollback
      setTasks(prevTasks);
      const msg =
        err.response?.data?.message || "Failed to update status. Please retry.";
      addToast(msg, "error");
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  return (
    <div className="us-page-container">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <PageHeader
        title="Update Task Status"
        subtitle="Review your assigned tasks and keep your progress up to date."
      />

      {fetchError && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", borderRadius: "14px", background: "#fef2f2", color: "#dc2626", border: "1px solid rgba(220, 38, 38, 0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{fetchError}</span>
          </div>
          <button
            type="button"
            className="us-refresh-btn-v2"
            onClick={fetchTasks}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <SkeletonLoader />
      ) : !fetchError && sortedTasks.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={36} />}
          title="You're all caught up"
          description="You have no pending tasks assigned right now. Tasks assigned to you by your manager will appear here."
        />
      ) : (
        /* "My work" Main Card in Dashboard "My tasks" style */
        <div className="us-work-card">
          <div className="us-work-card-header">
            <div className="us-work-title-wrap">
              <h2 className="us-work-title">My work</h2>
              <span className="us-work-count-pill">
                {sortedTasks.length} {sortedTasks.length === 1 ? "task" : "tasks"}
              </span>
            </div>

            <button
              type="button"
              className="us-refresh-btn-v2"
              onClick={fetchTasks}
              title="Refresh tasks"
            >
              <RefreshCw size={13} />
              <span>Refresh</span>
            </button>
          </div>

          <div>
            {sortedTasks.map((task) => {
              const isCompleted = task.status === "Completed";
              const isUpdating = updatingIds.has(task._id);

              return (
                <div key={task._id} className="us-work-row">
                  {/* Left: Circle check + Title + Description */}
                  <div className="us-work-row-left">
                    <button
                      type="button"
                      className={`us-check-circle-btn ${
                        isCompleted
                          ? "completed"
                          : task.status === "In Progress"
                          ? "in-progress"
                          : "pending"
                      }`}
                      onClick={() => {
                        const next = isCompleted ? "Pending" : "Completed";
                        updateStatus(task._id, next);
                      }}
                      disabled={isUpdating}
                      title={isCompleted ? "Mark pending" : "Mark completed"}
                      aria-label={`Mark ${task.title} as ${isCompleted ? "pending" : "completed"}`}
                    >
                      {isCompleted ? (
                        <Check size={12} strokeWidth={3} />
                      ) : task.status === "In Progress" ? (
                        <Clock size={11} strokeWidth={2.5} />
                      ) : (
                        <Circle size={10} strokeWidth={2} />
                      )}
                    </button>

                    <div className="us-row-text-block">
                      <span
                        className={`us-row-task-title ${isCompleted ? "completed" : ""}`}
                        title={task.title}
                      >
                        {task.title}
                      </span>
                      {task.description && (
                        <span className="us-row-task-desc" title={task.description}>
                          {task.description}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Due Date + StatusBadge + Select control + Updating text */}
                  <div className="us-work-row-right">
                    <DueDate date={task.dueDate} status={task.status} showPill={false} />
                    <StatusBadge status={task.status} />

                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <select
                        id={`status-select-${task._id}`}
                        className="us-status-select-pill"
                        value={task.status}
                        disabled={isUpdating}
                        onChange={(e) => updateStatus(task._id, e.target.value)}
                        aria-label={`Change status for ${task.title}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      {isUpdating && (
                        <span className="us-updating-indicator">
                          <Spinner size="sm" />
                          <span>Updating...</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateStatus;
