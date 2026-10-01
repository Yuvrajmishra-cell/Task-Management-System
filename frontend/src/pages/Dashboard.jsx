import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  CheckSquare,
  Clock,
  PlayCircle,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FolderOpen,
} from "lucide-react";

function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");

        setTasks(response.data);
        setError("");
      } catch (error) {
        console.error(error);
        setError("Failed to load tasks.");
      }
    };

    fetchTasks();
  }, []);

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const getStatusClass = (status) => {
    if (status === "Pending") return "pending";
    if (status === "In Progress") return "in-progress";
    if (status === "Completed") return "completed";
    return "pending";
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="page-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back{user?.name ? `, ${user.name}` : ""}! Here is an overview of your team's task progress.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert-banner error" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* 4 Summary Cards */}
        <div className="dashboard-summary">
          {/* Total Tasks */}
          <div className="dashboard-card card-total">
            <div className="card-header-row">
              <span className="card-label">Total Tasks</span>
              <div className="card-icon-wrapper">
                <CheckSquare size={20} />
              </div>
            </div>
            <p className="card-value">{totalTasks}</p>
          </div>

          {/* Pending Tasks */}
          <div className="dashboard-card card-pending">
            <div className="card-header-row">
              <span className="card-label">Pending</span>
              <div className="card-icon-wrapper">
                <Clock size={20} />
              </div>
            </div>
            <p className="card-value">{pendingTasks}</p>
          </div>

          {/* In Progress Tasks */}
          <div className="dashboard-card card-progress">
            <div className="card-header-row">
              <span className="card-label">In Progress</span>
              <div className="card-icon-wrapper">
                <PlayCircle size={20} />
              </div>
            </div>
            <p className="card-value">{inProgressTasks}</p>
          </div>

          {/* Completed Tasks */}
          <div className="dashboard-card card-completed">
            <div className="card-header-row">
              <span className="card-label">Completed</span>
              <div className="card-icon-wrapper">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <p className="card-value">{completedTasks}</p>
          </div>
        </div>

        {/* Recent Tasks Section */}
        <div className="recent-tasks-section">
          <div className="section-header">
            <h2 className="section-title">Recent Tasks</h2>
            <span className="section-count">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FolderOpen size={28} />
              </div>
              <h3 className="empty-title">No tasks found</h3>
              <p className="empty-desc">
                There are currently no tasks in the system. Create a task to get started!
              </p>
            </div>
          ) : (
            <div className="task-grid">
              {tasks.map((task) => (
                <div key={task._id} className="task-card">
                  <div className="task-card-header">
                    <h3 className="task-card-title">{task.title}</h3>
                    <span
                      className={`status-pill ${getStatusClass(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  {task.description && (
                    <p className="task-card-desc">{task.description}</p>
                  )}

                  <div className="task-meta-row">
                    <span className="meta-due-date">
                      <Calendar size={15} />
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    {task.assignedTo?.name && (
                      <span className="meta-assignee">
                        Assigned to: {task.assignedTo.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;