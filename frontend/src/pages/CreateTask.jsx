import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  PlusCircle,
  Calendar,
  User,
  FileText,
  RotateCcw,
  ChevronDown,
  Check,
  CheckCircle2,
  Lightbulb,
  AlertCircle,
  X,
  Circle,
} from "lucide-react";
import {
  Button,
  StatusBadge,
  Alert,
  Spinner,
  PageHeader,
  Avatar,
  DueDate,
} from "../components/ui";
import { usePageTitle } from "../hooks/usePageTitle";
import "./CreateTask.css";

function getLocalDateStr(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function CreateTask() {
  usePageTitle("Create Task");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Route guard: manager only
  if (user && user.role !== "manager") {
    return <Navigate to="/dashboard" replace />;
  }

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Employees data state
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [employeeError, setEmployeeError] = useState("");

  // Custom select dropdown open state
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef(null);

  // Submission state
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdTaskInfo, setCreatedTaskInfo] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const todayStr = getLocalDateStr(0);

  const quickDateChips = [
    { label: "Today", value: getLocalDateStr(0) },
    { label: "Tomorrow", value: getLocalDateStr(1) },
    { label: "In 3 days", value: getLocalDateStr(3) },
    { label: "Next week", value: getLocalDateStr(7) },
  ];

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    setIsLoadingEmployees(true);
    setEmployeeError("");

    try {
      const response = await api.get("/auth/employees");
      setEmployees(response.data || []);
    } catch (err) {
      console.error("Employee loading error:", err);
      setEmployeeError(
        err.response?.data?.message ||
          "Failed to load employees list. Please retry."
      );
    } finally {
      setIsLoadingEmployees(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Click outside listener for custom select
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsSelectOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsSelectOpen((prev) => !prev);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!title.trim()) {
      errors.title = "Task title is required.";
    }

    if (!description.trim()) {
      errors.description = "Task description is required.";
    }

    if (!assignedTo) {
      errors.assignedTo = "Please select an assigned employee.";
    }

    if (!dueDate) {
      errors.dueDate = "Due date is required.";
    } else {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.dueDate = "Due date cannot be in the past.";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/tasks", {
        title: title.trim(),
        description: description.trim(),
        assignedTo,
        dueDate,
      });

      const selectedEmp = employees.find((emp) => emp._id === assignedTo);
      setCreatedTaskInfo({
        title: title.trim(),
        assigneeName: selectedEmp ? selectedEmp.name : "Team Member",
        dueDate,
      });

      setIsSuccess(true);
      setToastMessage("Task created successfully!");
      setTimeout(() => setToastMessage(""), 4500);
    } catch (err) {
      console.error("Create task error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create task. Please verify your inputs and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAnother = () => {
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setDueDate("");
    setValidationErrors({});
    setError("");
    setIsSuccess(false);
    setCreatedTaskInfo(null);
  };

  const selectedEmployee = employees.find((emp) => emp._id === assignedTo);

  return (
    <div className="ct-page-container">
      {/* PageHeader with breadcrumb */}
      <PageHeader
        title="Create Task"
        subtitle="Define deliverables, assign to an active team member, and establish a deadline."
        breadcrumb={
          <nav className="ct-breadcrumb-nav" aria-label="Breadcrumb">
            <Link to="/tasks" className="ct-breadcrumb-link">
              Tasks
            </Link>
            <span className="ct-breadcrumb-sep">/</span>
            <span className="ct-breadcrumb-current">Create</span>
          </nav>
        }
      />

      {toastMessage && (
        <Alert variant="success" onClose={() => setToastMessage("")}>
          {toastMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <div className="ct-two-column-grid">
        {/* LEFT COLUMN: Form inside white 20px card */}
        <div className="ct-card">
          {isSuccess ? (
            /* Success State */
            <div className="ct-success-box">
              <div className="ct-success-icon">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.4rem 0" }}>
                  Task Created Successfully
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>
                  <strong>&ldquo;{createdTaskInfo?.title}&rdquo;</strong> has been created and assigned to{" "}
                  <strong>{createdTaskInfo?.assigneeName}</strong> with a due date of{" "}
                  <strong>{createdTaskInfo?.dueDate}</strong>.
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <Button variant="primary" onClick={() => navigate("/tasks")}>
                  View tasks
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCreateAnother}
                  leftIcon={<PlusCircle size={15} />}
                >
                  Create another
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* SECTION 1: Task details */}
              <section className="ct-form-section" aria-labelledby="heading-task-details">
                <h2 id="heading-task-details" className="ct-section-title">
                  <FileText size={14} className="ct-section-icon" />
                  <span>Task details</span>
                </h2>

                {/* Title */}
                <div className="ct-form-field">
                  <label className="ct-field-label" htmlFor="task-title">
                    <span>Task Title</span>
                    <span className="ct-required-star" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="task-title"
                    type="text"
                    className={`ct-text-input ${validationErrors.title ? "has-error" : ""}`}
                    placeholder="e.g. Design database schema for user profiles"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (validationErrors.title) {
                        setValidationErrors((prev) => ({ ...prev, title: null }));
                      }
                    }}
                    required
                  />
                  {validationErrors.title ? (
                    <span className="ct-field-error-msg">
                      <AlertCircle size={13} /> {validationErrors.title}
                    </span>
                  ) : (
                    <span className="ct-field-hint">Actionable title summarizing the deliverable.</span>
                  )}
                </div>

                {/* Description */}
                <div className="ct-form-field">
                  <div className="ct-field-header">
                    <label className="ct-field-label" htmlFor="task-desc">
                      <span>Description</span>
                      <span className="ct-required-star" aria-hidden="true">*</span>
                    </label>
                    <span className="ct-field-counter">{description.length} chars</span>
                  </div>
                  <textarea
                    id="task-desc"
                    rows={3}
                    className={`ct-textarea-input ${validationErrors.description ? "has-error" : ""}`}
                    placeholder="Provide instructions, acceptance criteria, and context..."
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (validationErrors.description) {
                        setValidationErrors((prev) => ({ ...prev, description: null }));
                      }
                    }}
                    required
                  />
                  {validationErrors.description ? (
                    <span className="ct-field-error-msg">
                      <AlertCircle size={13} /> {validationErrors.description}
                    </span>
                  ) : (
                    <span className="ct-field-hint">Key specifications and acceptance criteria.</span>
                  )}
                </div>
              </section>

              {/* SECTION 2: Assignment */}
              <section className="ct-form-section" aria-labelledby="heading-assignment">
                <h2 id="heading-assignment" className="ct-section-title">
                  <User size={14} className="ct-section-icon" />
                  <span>Assignment</span>
                </h2>

                {/* Employee select */}
                <div className="ct-form-field">
                  <label className="ct-field-label" id="task-assignee-label">
                    <span>Assign Employee</span>
                    <span className="ct-required-star" aria-hidden="true">*</span>
                  </label>

                  {isLoadingEmployees ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      <Spinner size="sm" /> Loading employees...
                    </div>
                  ) : employeeError ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem" }}>
                      <span style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{employeeError}</span>
                      <Button type="button" variant="danger" size="sm" onClick={fetchEmployees} leftIcon={<RotateCcw size={12} />}>
                        Retry
                      </Button>
                    </div>
                  ) : (
                    <div className="ct-emp-select-wrap" ref={selectRef}>
                      <button
                        id="task-assignee-btn"
                        type="button"
                        className={`ct-emp-select-btn ${validationErrors.assignedTo ? "has-error" : ""} ${isSelectOpen ? "is-open" : ""}`}
                        onClick={() => setIsSelectOpen((prev) => !prev)}
                        onKeyDown={handleSelectKeyDown}
                        aria-haspopup="listbox"
                        aria-expanded={isSelectOpen}
                      >
                        <div className="ct-emp-selected-info">
                          {selectedEmployee ? (
                            <>
                              <Avatar name={selectedEmployee.name} size="sm" />
                              <div className="ct-emp-selected-text">
                                <span className="ct-emp-name">{selectedEmployee.name}</span>
                                <span className="ct-emp-email">{selectedEmployee.email}</span>
                              </div>
                            </>
                          ) : (
                            <span className="ct-emp-placeholder">Select an employee...</span>
                          )}
                        </div>
                        <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />
                      </button>

                      {isSelectOpen && (
                        <ul className="ct-emp-dropdown-list" role="listbox">
                          {employees.map((emp) => {
                            const isSelected = assignedTo === emp._id;
                            return (
                              <li
                                key={emp._id}
                                role="option"
                                aria-selected={isSelected}
                                className={`ct-emp-dropdown-item ${isSelected ? "is-selected" : ""}`}
                                onClick={() => {
                                  setAssignedTo(emp._id);
                                  setIsSelectOpen(false);
                                  if (validationErrors.assignedTo) {
                                    setValidationErrors((prev) => ({ ...prev, assignedTo: null }));
                                  }
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                  <Avatar name={emp.name} size="sm" />
                                  <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span className="ct-emp-name">{emp.name}</span>
                                    <span className="ct-emp-email">{emp.email}</span>
                                  </div>
                                </div>
                                {isSelected && <Check size={16} style={{ color: "var(--brand-yellow-dark, #b48a08)" }} />}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  )}

                  {validationErrors.assignedTo && (
                    <span className="ct-field-error-msg">
                      <AlertCircle size={13} /> {validationErrors.assignedTo}
                    </span>
                  )}
                </div>

                {/* Due Date with Quick Chips */}
                <div className="ct-form-field">
                  <label className="ct-field-label" htmlFor="task-duedate">
                    <span>Due Date</span>
                    <span className="ct-required-star" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="task-duedate"
                    type="date"
                    min={todayStr}
                    className={`ct-text-input ${validationErrors.dueDate ? "has-error" : ""}`}
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      if (validationErrors.dueDate) {
                        setValidationErrors((prev) => ({ ...prev, dueDate: null }));
                      }
                    }}
                    required
                  />

                  {/* Quick-pick chips as pills with active in yellow */}
                  <div className="ct-quick-chips-row" role="group" aria-label="Quick pick due date">
                    {quickDateChips.map((chip) => {
                      const isActive = dueDate === chip.value;
                      return (
                        <button
                          key={chip.label}
                          type="button"
                          className={`ct-pill-chip ${isActive ? "is-active" : ""}`}
                          onClick={() => {
                            setDueDate(chip.value);
                            if (validationErrors.dueDate) {
                              setValidationErrors((prev) => ({ ...prev, dueDate: null }));
                            }
                          }}
                        >
                          {chip.label}
                        </button>
                      );
                    })}
                  </div>

                  {validationErrors.dueDate && (
                    <span className="ct-field-error-msg">
                      <AlertCircle size={13} /> {validationErrors.dueDate}
                    </span>
                  )}
                </div>
              </section>

              {/* Actions row: Cancel + Yellow Pill Primary Button */}
              <div className="ct-actions-row">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/tasks")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>

                <button
                  type="submit"
                  className="ct-yellow-pill-btn"
                  disabled={isSubmitting || isLoadingEmployees}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" />
                      <span>Creating task...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} />
                      <span>Create Task</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN: Live preview card & Tips card inside white 20px card */}
        <aside className="ct-preview-sticky" aria-label="Task preview and recommendations">
          <div className="ct-card">
            <div className="ct-preview-header">
              <span className="ct-preview-title">Live preview</span>
              <span className="ct-live-indicator">
                <span className="ct-pulse-dot" />
                Live preview
              </span>
            </div>

            {/* Task Row formatted in the exact same style as Tasks list row */}
            <div className="ct-preview-task-row">
              <div className="ct-preview-row-left">
                <div
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    borderRadius: "50%",
                    border: "1.5px solid #ea580c",
                    backgroundColor: "#fff7ed",
                    color: "#ea580c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  <Circle size={10} strokeWidth={2.5} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", minWidth: 0, gap: "0.15rem" }}>
                  <span
                    style={{
                      fontSize: "0.92rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {title.trim() ? title : <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Task title...</span>}
                  </span>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-secondary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {description.trim() ? description : <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Task description will appear here...</span>}
                  </span>
                </div>
              </div>

              <div className="ct-preview-row-right">
                {selectedEmployee ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Avatar name={selectedEmployee.name} size="sm" />
                    <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--text-primary)" }}>
                      {selectedEmployee.name}
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>Unassigned</span>
                )}

                <DueDate date={dueDate} status="Pending" showPill={false} />
                <StatusBadge status="Pending" />
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="ct-tips-box">
            <div className="ct-tips-title">
              <Lightbulb size={15} style={{ color: "var(--brand-yellow-dark, #b48a08)" }} />
              <span>Tips for a clear task</span>
            </div>
            <ul className="ct-tips-list">
              <li>
                <strong>Action title:</strong> Start with verbs like <em>Build</em>, <em>Design</em>, or <em>Review</em>.
              </li>
              <li>
                <strong>Acceptance criteria:</strong> Detail expectations in description so requirements are crystal clear.
              </li>
              <li>
                <strong>Realistic dates:</strong> Align target dates with current sprint capacity.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CreateTask;
