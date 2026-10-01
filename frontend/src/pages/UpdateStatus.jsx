import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  Calendar,
  AlertCircle,
  FolderCheck,
  Clock,
} from "lucide-react";

function UpdateStatus() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        console.log("Logged-in user:", user);
        console.log("Tasks from backend:", response.data);

        const myTasks = response.data.filter((task) => {
          const assignedEmployeeId =
            typeof task.assignedTo === "object"
              ? task.assignedTo._id
              : task.assignedTo;

          return String(assignedEmployeeId) === String(user?.id);
        });

        setTasks(myTasks);
        setError("");
      } catch (error) {
        console.error(error);
        setError("Failed to load tasks.");
      }
    };

    if (user?.id) {
      fetchTasks();
    }
  }, [user]);

  const updateStatus = async (taskId, status) => {
    try {
      setUpdatingTaskId(taskId);
      await api.patch(`/tasks/${taskId}/status`, {
        status,
      });

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === taskId
            ? { ...task, status }
            : task
        )
      );

      setError("");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to update task status."
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

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
        <div className="page-header">
          <h1 className="page-title">Update Task Status</h1>
          <p className="page-subtitle">
            Review your assigned tasks and keep your progress up to date.
          </p>
        </div>

        {error && (
          <div className="alert-banner error" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FolderCheck size={28} />
            </div>
            <h3 className="empty-title">No tasks assigned to you</h3>
            <p className="empty-desc">
              You are completely caught up! Tasks assigned to you by your manager will appear here.
            </p>
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
                  </div>

                  <div
                    style={{
                      marginTop: "0.85rem",
                      paddingTop: "0.85rem",
                      borderTop: "1px dashed var(--border-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                    }}
                  >
                    <label
                      htmlFor={`status-select-${task._id}`}
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <Clock size={14} />
                      Status:
                    </label>

                    <select
                      id={`status-select-${task._id}`}
                      className="status-change-select"
                      value={task.status}
                      disabled={updatingTaskId === task._id}
                      onChange={(e) => updateStatus(task._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
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

export default UpdateStatus;
