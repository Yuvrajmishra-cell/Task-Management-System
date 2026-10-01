import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  Calendar,
  Filter,
  AlertCircle,
  FolderOpen,
  RotateCcw,
  User,
  Trash2,
} from "lucide-react";

function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dueBeforeFilter, setDueBeforeFilter] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      setUpdatingTaskId(taskId);
      await api.patch(`/tasks/${taskId}/status`, {
        status: newStatus,
      });

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === taskId
            ? { ...task, status: newStatus }
            : task
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update task status.");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setDeletingTaskId(taskId);
      await api.delete(`/tasks/${taskId}`);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== taskId)
      );
    } catch (err) {
      console.error("Delete task error:", err);
      const message =
        err.response?.data?.message || "Failed to delete task. Please try again.";
      alert(message);
    } finally {
      setDeletingTaskId(null);
    }
  };

  const canDeleteTask = (task) => {
    if (!user) return false;

    // Manager is authorized to delete any task
    if (user.role === "manager") return true;

    // Employee is ONLY authorized to delete their own completed task
    if (user.role === "employee") {
      const assignedEmployeeId =
        typeof task.assignedTo === "object"
          ? task.assignedTo?._id
          : task.assignedTo;

      return (
        String(assignedEmployeeId) === String(user.id) &&
        task.status === "Completed"
      );
    }

    return false;
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const params = {};

        if (statusFilter) {
          params.status = statusFilter;
        }

        if (dueBeforeFilter) {
          params.dueBefore = dueBeforeFilter;
        }

        const response = await api.get("/tasks", {
          params,
        });

        setTasks(response.data);
        setError("");
      } catch (error) {
        console.error(error);
        setError("Failed to load tasks.");
      }
    };

    fetchTasks();
  }, [statusFilter, dueBeforeFilter]);

  const clearFilters = () => {
    setStatusFilter("");
    setDueBeforeFilter("");
  };

  const getStatusClass = (status) => {
    if (status === "Pending") return "pending";
    if (status === "In Progress") return "in-progress";
    if (status === "Completed") return "completed";
    return "pending";
  };

  const hasActiveFilters = Boolean(statusFilter || dueBeforeFilter);

  return (
    <div className="app-container">
      <Navbar />

      <main className="page-wrapper">
        <div className="page-header">
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">
            Manage, filter, and track project tasks across your organization.
          </p>
        </div>

        {error && (
          <div className="alert-banner error" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="tasks-toolbar">
          <div className="filters-wrapper">
            <div className="filter-item">
              <label htmlFor="status-filter">
                <Filter size={15} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                Status:
              </label>
              <select
                id="status-filter"
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="due-before-filter">
                <Calendar size={15} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                Due Before:
              </label>
              <input
                id="due-before-filter"
                className="filter-date-input"
                type="date"
                value={dueBeforeFilter}
                onChange={(e) => setDueBeforeFilter(e.target.value)}
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: "0.45rem 0.85rem", fontSize: "0.85rem" }}
                onClick={clearFilters}
              >
                <RotateCcw size={14} />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          <div className="section-count">
            Showing {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </div>
        </div>

        {/* Task Cards Grid */}
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FolderOpen size={28} />
            </div>
            <h3 className="empty-title">No tasks found</h3>
            <p className="empty-desc">
              {hasActiveFilters
                ? "No tasks match your selected filters. Try changing or clearing filters."
                : "No tasks are currently available in the system."}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                className="btn-secondary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <div key={task._id} className="task-card">
                <div>
                  <div className="task-card-header">
                    <h3 className="task-card-title">{task.title}</h3>
                    <span
                      className={`status-pill ${getStatusClass(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  {task.description && (
                    <p className="task-card-desc" style={{ marginTop: "0.6rem" }}>
                      {task.description}
                    </p>
                  )}
                </div>

                <div>
                  <div className="task-meta-row">
                    <span className="meta-due-date">
                      <Calendar size={15} />
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>

                    {task.assignedTo?.name && (
                      <span className="meta-assignee">
                        <User size={13} />
                        {task.assignedTo.name}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: "0.75rem",
                      paddingTop: "0.75rem",
                      borderTop: "1px dashed var(--border-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.825rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                        Status:
                      </span>
                      <select
                        className="status-change-select"
                        value={task.status}
                        disabled={updatingTaskId === task._id}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    {/* Role-based Delete Button */}
                    {canDeleteTask(task) && (
                      <button
                        type="button"
                        className="btn-delete"
                        disabled={deletingTaskId === task._id}
                        onClick={() => handleDeleteTask(task._id)}
                        title="Delete task"
                      >
                        <Trash2 size={14} />
                        <span>{deletingTaskId === task._id ? "Deleting..." : "Delete"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Tasks;