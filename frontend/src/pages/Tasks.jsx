import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import useEmployeeMap from "../hooks/useEmployeeMap";
import {
  Calendar,
  RotateCcw,
  Trash2,
  PlusCircle,
  Search,
  LayoutGrid,
  List,
  Eye,
  X,
  SortAsc,
  AlertCircle,
  Clock,
  User,
  CheckCircle2,
  Circle,
  MoreVertical,
  Check,
} from "lucide-react";
import {
  Button,
  StatusBadge,
  Skeleton,
  EmptyState,
  Alert,
  ConfirmDialog as ConfirmModal,
  Spinner,
  PageHeader,
  Avatar,
  DueDate,
  Dropdown,
  DropdownItem,
} from "../components/ui";
import { usePageTitle } from "../hooks/usePageTitle";
import "./Tasks.css";

const STATUS_TABS = ["All", "Pending", "In Progress", "Completed"];

const SORT_OPTIONS = [
  { value: "due_asc", label: "Due date (earliest)" },
  { value: "due_desc", label: "Due date (latest)" },
  { value: "newest", label: "Newest first" },
  { value: "title", label: "Title A \u2192 Z" },
];

function getAssigneeId(task) {
  if (!task.assignedTo) return "";
  if (typeof task.assignedTo === "object") {
    return String(task.assignedTo._id || task.assignedTo.id || "");
  }
  return String(task.assignedTo);
}

/* ──────────────────── Task Details Drawer ──────────────────── */
function TaskDrawer({
  task,
  onClose,
  user,
  onStatusChange,
  onDelete,
  updatingTaskId,
  canDelete,
  canUpdate,
  getAssignee,
}) {
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!task) return;
    const prev = document.activeElement;
    drawerRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      prev?.focus();
    };
  }, [task, onClose]);

  if (!task) return null;
  const assignee = getAssignee(task.assignedTo);
  const isUpdating = updatingTaskId === task._id;

  return (
    <>
      <div className="tasks-drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <aside
        ref={drawerRef}
        className="tasks-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label={"Task details: " + task.title}
        tabIndex={-1}
      >
        <div className="tasks-drawer-topbar">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: "0.4rem" }}>
              <StatusBadge status={task.status} />
            </div>
            <h2 className="tasks-grid-card-title" style={{ fontSize: "1.2rem" }}>
              {task.title}
            </h2>
          </div>
          <button
            className="tasks-drawer-close-btn"
            onClick={onClose}
            aria-label="Close task details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="tasks-drawer-content">
          {task.description && (
            <section className="tasks-drawer-section">
              <h3 className="tasks-drawer-section-heading">Description</h3>
              <p className="tasks-drawer-body-text">{task.description}</p>
            </section>
          )}

          <section className="tasks-drawer-section">
            <h3 className="tasks-drawer-section-heading">Details</h3>
            <div className="tasks-drawer-meta-box">
              <div className="tasks-drawer-meta-item">
                <span className="tasks-drawer-meta-label">
                  <Calendar size={15} /> Due Date
                </span>
                <DueDate date={task.dueDate} status={task.status} showPill />
              </div>

              <div className="tasks-drawer-meta-item">
                <span className="tasks-drawer-meta-label">
                  <User size={15} /> Assignee
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Avatar name={assignee.name} size="sm" />
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                    {assignee.name}
                  </span>
                </div>
              </div>

              <div className="tasks-drawer-meta-item">
                <span className="tasks-drawer-meta-label">
                  <Clock size={15} /> Status
                </span>
                <StatusBadge status={task.status} />
              </div>
            </div>
          </section>

          {(canUpdate || canDelete) && (
            <section className="tasks-drawer-section">
              <h3 className="tasks-drawer-section-heading">Actions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.25rem" }}>
                {canUpdate && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                    <label htmlFor={"drawer-status-" + task._id} style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                      Change Status:
                    </label>
                    <select
                      id={"drawer-status-" + task._id}
                      className="tasks-status-select-pill"
                      value={task.status}
                      disabled={isUpdating}
                      onChange={(e) => onStatusChange(task._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    {isUpdating && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        <Spinner size="sm" /> Updating...
                      </span>
                    )}
                  </div>
                )}

                {canDelete && (
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Trash2 size={15} />}
                      onClick={() => {
                        onClose();
                        onDelete(task);
                      }}
                      style={{ color: "var(--danger)", paddingLeft: 0 }}
                    >
                      Delete task
                    </Button>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </aside>
    </>
  );
}

/* ═══════════════════════════ Tasks Page ═══════════════════════════ */
function Tasks() {
  usePageTitle("Tasks");
  const { user } = useAuth();
  const { getAssignee } = useEmployeeMap();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [dueBeforeFilter, setDueBeforeFilter] = useState("");

  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const urlStatus = searchParams.get("status");

  const [activeTab, setActiveTab] = useState(() => {
    if (urlStatus && ["Pending", "In Progress", "Completed"].includes(urlStatus)) {
      return urlStatus;
    }
    return "All";
  });
  const [sortBy, setSortBy] = useState("due_asc");
  // Default view is Primary list view per requirement
  const [viewMode, setViewMode] = useState("list");
  const [drawerTask, setDrawerTask] = useState(null);

  // Sync activeTab with status query parameter when it changes
  useEffect(() => {
    const s = searchParams.get("status");
    if (s && ["Pending", "In Progress", "Completed"].includes(s)) {
      setActiveTab(s);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (tab === "All") {
          next.delete("status");
        } else {
          next.set("status", tab);
        }
        return next;
      },
      { replace: true }
    );
  };

  const handleSearchChange = (val) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (val.trim()) {
          next.set("search", val);
        } else {
          next.delete("search");
        }
        return next;
      },
      { replace: true }
    );
  };

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (dueBeforeFilter) params.dueBefore = dueBeforeFilter;
      const response = await api.get("/tasks", { params });
      setTasks(response.data);
    } catch (err) {
      console.error("Tasks fetch error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load tasks. Please check your network and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, dueBeforeFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const clearFilters = () => {
    setStatusFilter("");
    setDueBeforeFilter("");
    setActiveTab("All");
    setSortBy("due_asc");
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters = Boolean(
    statusFilter || dueBeforeFilter || searchQuery || activeTab !== "All"
  );

  const updateTaskStatus = async (taskId, newStatus) => {
    const previousTask = tasks.find((t) => t._id === taskId);
    const previousStatus = previousTask?.status;

    setTasks((cur) =>
      cur.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
    setUpdatingTaskId(taskId);
    setError("");

    try {
      await api.patch("/tasks/" + taskId + "/status", { status: newStatus });
      setSuccessToast(`Task status updated to "${newStatus}".`);
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err) {
      console.error("Update task status error:", err);
      setTasks((cur) =>
        cur.map((t) => (t._id === taskId ? { ...t, status: previousStatus } : t))
      );
      setError(
        err.response?.data?.message ||
          "Failed to update task status. Changes have been rolled back."
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    setError("");
    try {
      await api.delete("/tasks/" + taskToDelete._id);
      setTasks((cur) => cur.filter((t) => t._id !== taskToDelete._id));
      setSuccessToast(`Task "${taskToDelete.title}" was successfully deleted.`);
      setTimeout(() => setSuccessToast(""), 4000);
      setTaskToDelete(null);
    } catch (err) {
      console.error("Delete task error:", err);
      setError(
        err.response?.data?.message || "Failed to delete task. Please try again."
      );
      setTaskToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const canDeleteTask = (task) => {
    if (!user) return false;
    if (user.role === "manager") return true;
    if (user.role === "employee") {
      const id = getAssigneeId(task);
      const currentUserId = String(user.id || user._id || "");
      return String(id) === currentUserId && task.status === "Completed";
    }
    return false;
  };

  const isAssignedToUser = (task) => {
    if (!user) return false;
    const currentUserId = String(user.id || user._id || "");
    return String(getAssigneeId(task)) === currentUserId;
  };

  const tabCounts = useMemo(
    () => ({
      All: tasks.length,
      Pending: tasks.filter((t) => t.status === "Pending").length,
      "In Progress": tasks.filter((t) => t.status === "In Progress").length,
      Completed: tasks.filter((t) => t.status === "Completed").length,
    }),
    [tasks]
  );

  const displayedTasks = useMemo(() => {
    let result = [...tasks];
    if (activeTab !== "All") {
      result = result.filter((t) => t.status === activeTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      if (sortBy === "due_asc") return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === "due_desc") return new Date(b.dueDate) - new Date(a.dueDate);
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
      return 0;
    });
    return result;
  }, [tasks, activeTab, searchQuery, sortBy]);

  // Find the most urgent open task (earliest due date among open tasks)
  const mostUrgentTaskId = useMemo(() => {
    const openTasks = displayedTasks.filter(
      (t) => t.status !== "Completed" && t.dueDate
    );
    if (openTasks.length === 0) return null;
    let minTask = openTasks[0];
    let minTime = new Date(minTask.dueDate).getTime();
    for (let i = 1; i < openTasks.length; i++) {
      const time = new Date(openTasks[i].dueDate).getTime();
      if (time < minTime) {
        minTime = time;
        minTask = openTasks[i];
      }
    }
    return minTask._id;
  }, [displayedTasks]);

  useEffect(() => {
    if (drawerTask) {
      const updated = tasks.find((t) => t._id === drawerTask._id);
      if (updated) setDrawerTask(updated);
    }
  }, [tasks]);

  const openDrawer = (task) => setDrawerTask(task);

  const renderSkeletons = () => {
    if (viewMode === "list") {
      return (
        <div className="tasks-skeleton-list-card">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="tasks-skeleton-row">
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 2 }}>
                <Skeleton variant="circle" width="24px" height="24px" />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", width: "70%" }}>
                  <Skeleton variant="text" width="60%" height="1rem" />
                  <Skeleton variant="text" width="90%" height="0.8rem" />
                </div>
              </div>
              <Skeleton variant="rect" width="80px" height="24px" style={{ borderRadius: "9999px" }} />
              <Skeleton variant="rect" width="90px" height="24px" style={{ borderRadius: "9999px" }} />
              <Skeleton variant="circle" width="28px" height="28px" />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="tasks-grid-wrapper">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="tasks-skeleton-grid-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Skeleton variant="text" width="55%" height="1.1rem" />
              <Skeleton variant="rect" width="70px" height="22px" style={{ borderRadius: "9999px" }} />
            </div>
            <Skeleton variant="text" width="100%" height="0.85rem" />
            <Skeleton variant="text" width="75%" height="0.85rem" />
            <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between" }}>
              <Skeleton variant="text" width="40%" height="0.9rem" />
              <Skeleton variant="rect" width="60px" height="24px" style={{ borderRadius: "9999px" }} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  /* ──────────────────── Grid Card ──────────────────── */
  const renderGridCard = (task) => {
    const assignee = getAssignee(task.assignedTo);
    const userCanUpdate = user?.role === "employee" && isAssignedToUser(task);
    const userCanDelete = canDeleteTask(task);
    const isUpdating = updatingTaskId === task._id;
    const isUrgent = task._id === mostUrgentTaskId;

    return (
      <article
        key={task._id}
        className={`tasks-grid-card ${isUrgent ? "task-urgent-highlight" : ""}`}
        tabIndex={0}
        onClick={(e) => {
          if (e.target.closest("select,button,a,[role='menuitem']")) return;
          openDrawer(task);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openDrawer(task);
          }
        }}
        aria-label={`Task: ${task.title}, status: ${task.status}`}
      >
        <div className="tasks-grid-card-body">
          <div className="tasks-grid-card-top">
            <h3 className="tasks-grid-card-title">{task.title}</h3>
            <StatusBadge status={task.status} />
          </div>

          {task.description && (
            <p className="tasks-grid-card-desc">{task.description}</p>
          )}

          <div className="tasks-grid-card-meta">
            <DueDate date={task.dueDate} status={task.status} showPill={false} />
          </div>
        </div>

        {/* Real Footer with Equal Heights */}
        <div className="tasks-grid-card-footer">
          {user?.role === "employee" ? (
            <>
              <div className="tasks-grid-footer-left">
                {userCanUpdate ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <select
                      id={"grid-status-" + task._id}
                      className="tasks-status-select-pill"
                      value={task.status}
                      disabled={isUpdating}
                      onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                      aria-label="Update task status"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    {isUpdating && <Spinner size="sm" />}
                  </div>
                ) : (
                  <StatusBadge status={task.status} />
                )}
              </div>

              <div className="tasks-grid-footer-right">
                {userCanDelete ? (
                  <button
                    type="button"
                    className="tasks-quiet-delete-btn"
                    onClick={() => setTaskToDelete(task)}
                    title="Delete task"
                    aria-label="Delete task"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            /* Manager footer */
            <>
              <div className="tasks-grid-footer-left">
                <Avatar name={assignee.name} size="sm" />
                <span className="tasks-row-assignee-name" title={assignee.name}>
                  {assignee.name}
                </span>
              </div>

              <div className="tasks-grid-footer-right">
                <Dropdown
                  trigger={
                    <button
                      type="button"
                      className="tasks-kebab-trigger"
                      aria-label="Task options"
                    >
                      <MoreVertical size={16} />
                    </button>
                  }
                >
                  <DropdownItem
                    icon={<Eye size={14} />}
                    onClick={() => openDrawer(task)}
                  >
                    View details
                  </DropdownItem>
                  {userCanDelete && (
                    <DropdownItem
                      icon={<Trash2 size={14} />}
                      danger
                      onClick={() => setTaskToDelete(task)}
                    >
                      Delete task
                    </DropdownItem>
                  )}
                </Dropdown>
              </div>
            </>
          )}
        </div>
      </article>
    );
  };

  /* ──────────────────── Primary List Row ──────────────────── */
  const renderListRow = (task) => {
    const assignee = getAssignee(task.assignedTo);
    const userCanUpdate = user?.role === "employee" && isAssignedToUser(task);
    const userCanDelete = canDeleteTask(task);
    const isCompleted = task.status === "Completed";
    const isUrgent = task._id === mostUrgentTaskId;
    const isManager = user?.role === "manager";
    const isUpdating = updatingTaskId === task._id;

    return (
      <div
        key={task._id}
        className={`tasks-list-row-item ${!isManager ? "employee-view" : ""} ${
          isUrgent ? "task-urgent-highlight" : ""
        }`}
        tabIndex={0}
        onClick={(e) => {
          if (e.target.closest("select,button,a,[role='menuitem']")) return;
          openDrawer(task);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openDrawer(task);
          }
        }}
        role="row"
        aria-label={`Task: ${task.title}, status: ${task.status}`}
      >
        {/* Left: Circle status icon + Title + 1-line description */}
        <div className="tasks-row-title-col">
          {userCanUpdate ? (
            <button
              type="button"
              className={`tasks-row-status-circle ${
                isCompleted
                  ? "completed"
                  : task.status === "In Progress"
                  ? "in-progress"
                  : "pending"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                // Toggle between Pending/Completed or cycle status smoothly
                const nextStatus = isCompleted ? "Pending" : "Completed";
                updateTaskStatus(task._id, nextStatus);
              }}
              title={
                isCompleted
                  ? "Mark pending"
                  : "Mark completed"
              }
              aria-label={`Mark task ${isCompleted ? "pending" : "completed"}`}
            >
              {isCompleted ? (
                <Check size={12} strokeWidth={3} />
              ) : task.status === "In Progress" ? (
                <Clock size={11} strokeWidth={2.5} />
              ) : (
                <Circle size={10} strokeWidth={2} />
              )}
            </button>
          ) : (
            <div
              className={`tasks-row-status-circle ${
                isCompleted
                  ? "completed"
                  : task.status === "In Progress"
                  ? "in-progress"
                  : "pending"
              }`}
              aria-hidden="true"
            >
              {isCompleted ? (
                <Check size={12} strokeWidth={3} />
              ) : task.status === "In Progress" ? (
                <Clock size={11} strokeWidth={2.5} />
              ) : (
                <Circle size={10} strokeWidth={2} />
              )}
            </div>
          )}

          <div className="tasks-row-texts">
            <span
              className={`tasks-row-title-text ${
                isCompleted ? "completed" : ""
              }`}
              title={task.title}
            >
              {task.title}
            </span>
            {task.description && (
              <span className="tasks-row-desc-text" title={task.description}>
                {task.description}
              </span>
            )}
          </div>
        </div>

        {/* Manager: Assignee Avatar + Name */}
        {isManager && (
          <div className="tasks-row-assignee-col">
            <Avatar name={assignee.name} size="sm" />
            <span className="tasks-row-assignee-name" title={assignee.name}>
              {assignee.name}
            </span>
          </div>
        )}

        {/* Due Date */}
        <div className="tasks-row-due-col">
          <DueDate date={task.dueDate} status={task.status} showPill={false} />
        </div>

        {/* Status Badge */}
        <div className="tasks-row-status-col">
          <StatusBadge status={task.status} />
        </div>

        {/* Actions / Kebab Menu */}
        <div className="tasks-row-actions-col">
          <Dropdown
            trigger={
              <button
                type="button"
                className="tasks-kebab-trigger"
                aria-label="Task actions"
              >
                <MoreVertical size={16} />
              </button>
            }
          >
            <DropdownItem
              icon={<Eye size={14} />}
              onClick={() => openDrawer(task)}
            >
              View details
            </DropdownItem>
            {userCanDelete && (
              <DropdownItem
                icon={<Trash2 size={14} />}
                danger
                onClick={() => setTaskToDelete(task)}
              >
                Delete task
              </DropdownItem>
            )}
          </Dropdown>
        </div>
      </div>
    );
  };

  return (
    <div className="tasks-page-container">
      <PageHeader
        title="Tasks"
        subtitle="Manage, filter, and track project tasks across your organization."
      />

      {successToast && (
        <Alert
          variant="success"
          title="Success"
          onClose={() => setSuccessToast("")}
        >
          {successToast}
        </Alert>
      )}

      {error && (
        <Alert
          variant="error"
          title="Action Error"
          onClose={() => setError("")}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <span>{error}</span>
            <Button
              variant="danger"
              size="sm"
              onClick={fetchTasks}
              leftIcon={<RotateCcw size={14} />}
            >
              Retry
            </Button>
          </div>
        </Alert>
      )}

      {/* ──────────────────── Single White Rounded Toolbar Bar ──────────────────── */}
      <div className="tasks-toolbar-card">
        {/* Top: Status Tabs Segmented Control + Showing Count + View Toggle */}
        <div className="tasks-toolbar-top">
          <div
            className="tasks-segmented-tabs"
            role="tablist"
            aria-label="Filter tasks by status"
          >
            {STATUS_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`tasks-segmented-tab ${
                    isActive ? "tasks-segmented-tab-active" : ""
                  }`}
                  onClick={() => handleTabChange(tab)}
                >
                  <span>{tab}</span>
                  <span className="tasks-tab-count-chip">
                    {tabCounts[tab]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="tasks-toolbar-top-right">
            <span className="tasks-count-label">
              Showing {displayedTasks.length} of {tasks.length} task
              {tasks.length !== 1 ? "s" : ""}
            </span>

            <div
              className="tasks-view-switch"
              role="group"
              aria-label="View layout switch"
            >
              <button
                type="button"
                className={`tasks-view-switch-btn ${
                  viewMode === "list" ? "tasks-view-switch-btn-active" : ""
                }`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
                title="List view"
              >
                <List size={16} />
              </button>
              <button
                type="button"
                className={`tasks-view-switch-btn ${
                  viewMode === "grid" ? "tasks-view-switch-btn-active" : ""
                }`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                title="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Search + Due Before Filter + Sort + Clear */}
        <div className="tasks-toolbar-bottom">
          <div className="tasks-search-field">
            <Search size={15} className="tasks-search-field-icon" />
            <input
              type="text"
              className="tasks-search-input-field"
              placeholder="Search tasks by title or description..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Search tasks"
            />
            {searchQuery && (
              <button
                type="button"
                className="tasks-search-clear-btn"
                onClick={() => handleSearchChange("")}
                aria-label="Clear search query"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Due Before — styled pill with invisible native input overlay */}
          <div className="tasks-filter-pill-item tasks-date-pill">
            <Calendar size={14} />
            <span className="tasks-filter-pill-label">Due before</span>
            <span className={`tasks-date-display${dueBeforeFilter ? " tasks-date-display--active" : ""}`}>
              {dueBeforeFilter
                ? new Date(dueBeforeFilter + "T00:00:00").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Any date"}
            </span>
            {dueBeforeFilter && (
              <button
                type="button"
                className="tasks-date-clear-btn"
                onClick={(e) => { e.stopPropagation(); setDueBeforeFilter(""); }}
                aria-label="Clear due date filter"
              >
                <X size={11} />
              </button>
            )}
            <input
              id="due-before-filter"
              type="date"
              className="tasks-date-native-overlay"
              value={dueBeforeFilter}
              onChange={(e) => setDueBeforeFilter(e.target.value)}
              aria-label="Filter by due date"
            />
          </div>

          {/* Sort */}
          <div className="tasks-filter-pill-item">
            <SortAsc size={14} />
            <label htmlFor="task-sort-select" className="tasks-filter-pill-label">Sort</label>
            <select
              id="task-sort-select"
              className="tasks-filter-select-native"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="tasks-clear-inline-btn"
              onClick={clearFilters}
              aria-label="Clear all filters"
            >
              <RotateCcw size={13} />
              <span>Clear</span>
            </button>
          )}
        </div>

      </div>

      {/* ──────────────────── Tasks Content Area ──────────────────── */}
      {isLoading ? (
        renderSkeletons()
      ) : displayedTasks.length === 0 ? (
        <EmptyState
          icon={<AlertCircle size={32} />}
          title={
            tasks.length === 0 ? "No tasks yet" : "No tasks match your filters"
          }
          description={
            tasks.length === 0
              ? user?.role === "manager"
                ? "Get started by creating your first task."
                : "You have no tasks assigned to you yet."
              : "Try adjusting your search, status tab, or date filter."
          }
          action={
            tasks.length > 0 ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={clearFilters}
                leftIcon={<RotateCcw size={14} />}
              >
                Clear filters
              </Button>
            ) : user?.role === "manager" ? (
              <Link to="/tasks/create">
                <Button variant="primary" leftIcon={<PlusCircle size={16} />}>
                  New Task
                </Button>
              </Link>
            ) : null
          }
        />
      ) : viewMode === "list" ? (
        /* Primary List View */
        <div className="tasks-list-card" role="table" aria-label="Tasks list">
          <div
            className={`tasks-list-header-row ${
              user?.role !== "manager" ? "employee-view" : ""
            }`}
            role="row"
          >
            <div>Task</div>
            {user?.role === "manager" && (
              <div className="tasks-header-assignee">Assignee</div>
            )}
            <div>Due</div>
            <div>Status</div>
            <div style={{ textAlign: "right" }}>Actions</div>
          </div>

          {displayedTasks.map(renderListRow)}
        </div>
      ) : (
        /* Grid View */
        <div className="tasks-grid-wrapper">
          {displayedTasks.map(renderGridCard)}
        </div>
      )}

      {/* Details Drawer */}
      {drawerTask && (
        <TaskDrawer
          task={drawerTask}
          onClose={() => setDrawerTask(null)}
          user={user}
          onStatusChange={updateTaskStatus}
          onDelete={(t) => {
            setDrawerTask(null);
            setTaskToDelete(t);
          }}
          updatingTaskId={updatingTaskId}
          canDelete={canDeleteTask(drawerTask)}
          canUpdate={user?.role === "employee" && isAssignedToUser(drawerTask)}
          getAssignee={getAssignee}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        onClose={() => !isDeleting && setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete task?"
        message={
          taskToDelete ? (
            <span>
              Are you sure you want to delete{" "}
              <strong>&ldquo;{taskToDelete.title}&rdquo;</strong>? This action
              cannot be undone.
            </span>
          ) : (
            "Are you sure you want to delete this task? This action cannot be undone."
          )
        }
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default Tasks;
