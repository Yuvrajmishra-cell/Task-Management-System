import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  User,
  FileText,
  Type,
} from "lucide-react";

function CreateTask() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/auth/employees");
        console.log("Employees:", response.data);
        setEmployees(response.data);
      } catch (error) {
        console.error("Employee loading error:", error);
        setError(
          error.response?.data?.message ||
          "Failed to load employees."
        );
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await api.post("/tasks", {
        title,
        description,
        assignedTo,
        dueDate,
      });

      setSuccess("Task created successfully! Redirecting to tasks list...");

      setTitle("");
      setDescription("");
      setAssignedTo("");
      setDueDate("");

      setTimeout(() => {
        navigate("/tasks");
      }, 1000);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
        "Failed to create task."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="page-wrapper">
        <div className="form-page-container">
          <div className="form-card">
            <div className="page-header" style={{ marginBottom: "1.5rem" }}>
              <h1 className="page-title">Create New Task</h1>
              <p className="page-subtitle">
                Assign a new task with a deadline to a team member.
              </p>
            </div>

            {error && (
              <div className="alert-banner error" role="alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert-banner success" role="alert">
                <CheckCircle2 size={18} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Task Title */}
              <div className="form-group">
                <label className="form-label" htmlFor="task-title">
                  <Type size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                  Title <span className="required-indicator">*</span>
                </label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="e.g. Design database schema for user profiles"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Task Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="task-desc">
                  <FileText size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                  Description <span className="required-indicator">*</span>
                </label>
                <textarea
                  id="task-desc"
                  rows={4}
                  placeholder="Provide detailed instructions and requirements for this task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Assign Employee */}
              <div className="form-group">
                <label className="form-label" htmlFor="task-assignee">
                  <User size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                  Assign Employee <span className="required-indicator">*</span>
                </label>
                {employees.length === 0 ? (
                  <p className="form-hint" style={{ color: "#d97706" }}>
                    No employees available to assign. Ensure employees have registered.
                  </p>
                ) : (
                  <select
                    id="task-assignee"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    required
                  >
                    <option value="">Select an employee</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name} ({employee.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Due Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="task-duedate">
                  <Calendar size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                  Due Date <span className="required-indicator">*</span>
                </label>
                <input
                  id="task-duedate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginTop: "1.75rem" }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: "100%", padding: "0.75rem" }}
                  disabled={isSubmitting}
                >
                  <PlusCircle size={18} />
                  <span>{isSubmitting ? "Creating Task..." : "Create Task"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateTask;
