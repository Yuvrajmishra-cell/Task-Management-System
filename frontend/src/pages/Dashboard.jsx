import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  MoreVertical,
  RotateCcw,
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FolderOpen,
} from "lucide-react";
import { Avatar, Badge, Button, Alert, Skeleton } from "../components/ui";
import { usePageTitle } from "../hooks/usePageTitle";
import useEmployeeMap from "../hooks/useEmployeeMap";
import "./Dashboard.css";

// Weekday initials starting Monday (matches Organizo reference: Mo, Tu, We, Th, Fr, Sa, Su)
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function Dashboard() {
  usePageTitle("Dashboard");
  const { user } = useAuth();
  const { getAssignee } = useEmployeeMap();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Status updating state for employee checkbox click
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [statusToast, setStatusToast] = useState("");

  // Calendar State
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(() => new Date());

  // Kebab menu open state for My Tasks widget
  const [kebabOpen, setKebabOpen] = useState(false);
  const kebabRef = useRef(null);

  // Close kebab menu on outside click
  useEffect(() => {
    if (!kebabOpen) return;
    const handleOutsideClick = (e) => {
      if (kebabRef.current && !kebabRef.current.contains(e.target)) {
        setKebabOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [kebabOpen]);

  // Fetch Tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get("/tasks");
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load tasks from server. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const isManager = user?.role === "manager";
  const firstName = user?.name
    ? user.name.trim().split(" ")[0]
    : isManager
    ? "Manager"
    : "Team Member";

  // Greeting by time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  // Real data metrics computation
  const totalTasks = tasks.length;
  const pendingTasks = useMemo(
    () => tasks.filter((t) => t.status === "Pending").length,
    [tasks]
  );
  const inProgressTasks = useMemo(
    () => tasks.filter((t) => t.status === "In Progress").length,
    [tasks]
  );
  const completedTasks = useMemo(
    () => tasks.filter((t) => t.status === "Completed").length,
    [tasks]
  );
  const completionPct =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Overdue & Due this week counts
  const { dueThisWeekCount, overdueCount } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    let dueThisWeek = 0;
    let overdue = 0;

    tasks.forEach((t) => {
      if (t.status === "Completed" || !t.dueDate) return;
      const d = new Date(t.dueDate);
      if (d.getTime() < now.getTime()) {
        overdue++;
      } else if (d >= now && d <= next7Days) {
        dueThisWeek++;
      }
    });

    return { dueThisWeekCount: dueThisWeek, overdueCount: overdue };
  }, [tasks]);

  // One-line summary
  const summaryText = useMemo(() => {
    if (totalTasks === 0) {
      return isManager
        ? "No tasks in the pipeline yet. Create the first task to get your team rolling."
        : "You have no active tasks at the moment. Enjoy the clean slate!";
    }
    if (overdueCount > 0) {
      return `You have ${pendingTasks} pending ${
        pendingTasks === 1 ? "task" : "tasks"
      } and ${overdueCount} overdue.`;
    }
    return `You have ${pendingTasks} pending ${
      pendingTasks === 1 ? "task" : "tasks"
    } and ${dueThisWeekCount} due this week.`;
  }, [totalTasks, isManager, overdueCount, pendingTasks, dueThisWeekCount]);

  // Helper: Format due label (Today, Tomorrow, This week, or date; overdue in red)
  const getDueLabelInfo = (dueDateStr) => {
    if (!dueDateStr) return { text: "No due date", isOverdue: false, isUrgent: false };
    const due = new Date(dueDateStr);
    const now = new Date();

    const dueMidnight = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffMs = dueMidnight.getTime() - todayMidnight.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: "Overdue", isOverdue: true, isUrgent: true };
    }
    if (diffDays === 0) {
      return { text: "Today", isOverdue: false, isUrgent: true };
    }
    if (diffDays === 1) {
      return { text: "Tomorrow", isOverdue: false, isUrgent: true };
    }
    if (diffDays <= 7) {
      return { text: "This week", isOverdue: false, isUrgent: false };
    }
    return {
      text: due.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      isOverdue: false,
      isUrgent: false,
    };
  };

  // Mark task completed (Employee only)
  const handleMarkComplete = async (task) => {
    if (isManager || task.status === "Completed" || updatingTaskId === task._id) return;

    setUpdatingTaskId(task._id);
    const previousStatus = task.status;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: "Completed" } : t))
    );

    try {
      await api.patch(`/tasks/${task._id}/status`, { status: "Completed" });
      setStatusToast(`"${task.title}" marked as completed!`);
      setTimeout(() => setStatusToast(""), 3500);
    } catch (err) {
      console.error("Mark completed error:", err);
      // Rollback
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: previousStatus } : t))
      );
      setError(
        err.response?.data?.message ||
          "Failed to update task status. Please try again."
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // Row 2: "My Tasks" widget (5 rows)
  // Sorted by urgency: open overdue first, then upcoming due date, then newest
  // ──────────────────────────────────────────────────────────────────────────
  const myTasksList = useMemo(() => {
    const list = [...tasks];
    list.sort((a, b) => {
      // Completed at bottom
      if (a.status === "Completed" && b.status !== "Completed") return 1;
      if (a.status !== "Completed" && b.status === "Completed") return -1;

      // Earliest due date first
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      if (dateA !== dateB) return dateA - dateB;

      // Fallback newest first
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return list.slice(0, 5);
  }, [tasks]);

  // First open task index for yellow highlight (pale yellow bg + yellow left bar)
  const firstOpenTaskIndex = myTasksList.findIndex((t) => t.status !== "Completed");

  // ──────────────────────────────────────────────────────────────────────────
  // Row 2: Calendar Computation
  // ──────────────────────────────────────────────────────────────────────────
  const calendarYear = currentMonthDate.getFullYear();
  const calendarMonth = currentMonthDate.getMonth();

  const monthName = currentMonthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    setCurrentMonthDate(new Date(calendarYear, calendarMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(calendarYear, calendarMonth + 1, 1));
  };

  // Calendar Days Grid (Monday start: 0=Mo, 1=Tu ... 6=Su)
  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1);
    // Sunday is 0, so convert Monday=0 to Sunday=6
    let startingDay = firstDayOfMonth.getDay() - 1;
    if (startingDay === -1) startingDay = 6;

    const daysInCurrentMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(calendarYear, calendarMonth, 0).getDate();

    const cells = [];

    // Leading days from previous month
    for (let i = startingDay - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const dateObj = new Date(calendarYear, calendarMonth - 1, dayNum);
      cells.push({
        dayNum,
        dateObj,
        isCurrentMonth: false,
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateObj = new Date(calendarYear, calendarMonth, d);
      cells.push({
        dayNum: d,
        dateObj,
        isCurrentMonth: true,
      });
    }

    // Trailing days from next month to make complete 7-column rows (up to 35 or 42)
    const totalSlots = Math.ceil(cells.length / 7) * 7;
    const remaining = totalSlots - cells.length;
    for (let nextD = 1; nextD <= remaining; nextD++) {
      const dateObj = new Date(calendarYear, calendarMonth + 1, nextD);
      cells.push({
        dayNum: nextD,
        dateObj,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [calendarYear, calendarMonth]);

  // Tasks due on a specific day
  const isSameCalendarDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Map of days that have tasks due
  const taskDatesMap = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      const d = new Date(t.dueDate);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  const today = useMemo(() => new Date(), []);

  // Tasks due on selected date
  const selectedDayTasks = useMemo(() => {
    if (!selectedCalendarDate) return [];
    const key = `${selectedCalendarDate.getFullYear()}-${selectedCalendarDate.getMonth()}-${selectedCalendarDate.getDate()}`;
    return taskDatesMap[key] || [];
  }, [selectedCalendarDate, taskDatesMap]);

  // ──────────────────────────────────────────────────────────────────────────
  // Row 2: Status Donut SVG Calculations
  // ──────────────────────────────────────────────────────────────────────────
  const donutGeometry = useMemo(() => {
    const radius = 52;
    const circumference = 2 * Math.PI * radius; // ~326.72

    if (totalTasks === 0) {
      return {
        circumference,
        completedArc: 0,
        inProgressArc: 0,
        pendingArc: 0,
      };
    }

    const completedArc = (completedTasks / totalTasks) * circumference;
    const inProgressArc = (inProgressTasks / totalTasks) * circumference;
    const pendingArc = (pendingTasks / totalTasks) * circumference;

    return {
      circumference,
      completedArc,
      inProgressArc,
      pendingArc,
    };
  }, [totalTasks, completedTasks, inProgressTasks, pendingTasks]);

  // ──────────────────────────────────────────────────────────────────────────
  // Row 3: "Needs Attention" (Overdue + Due within 3 days)
  // ──────────────────────────────────────────────────────────────────────────
  const needsAttentionTasks = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const next3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    return tasks
      .filter((t) => {
        if (t.status === "Completed" || !t.dueDate) return false;
        const due = new Date(t.dueDate);
        return due <= next3Days;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 4);
  }, [tasks]);

  // ──────────────────────────────────────────────────────────────────────────
  // Row 3: Team Workload (Manager)
  // ──────────────────────────────────────────────────────────────────────────
  const teamWorkload = useMemo(() => {
    if (!isManager) return [];
    const openTasks = tasks.filter((t) => t.status !== "Completed");
    const workloadMap = {};

    openTasks.forEach((t) => {
      let key = "unassigned";
      let name = "Unassigned";

      if (t.assignedTo) {
        key = String(
          typeof t.assignedTo === "object"
            ? t.assignedTo._id || t.assignedTo.id
            : t.assignedTo
        );
        const assignee = getAssignee(t.assignedTo);
        name = assignee.name;
      }

      if (!workloadMap[key]) {
        workloadMap[key] = { key, name, count: 0 };
      }
      workloadMap[key].count += 1;
    });

    const list = Object.values(workloadMap).sort((a, b) => b.count - a.count);
    const maxCount = list.length > 0 ? list[0].count : 1;

    return list.map((item) => ({
      ...item,
      pct: Math.round((item.count / maxCount) * 100),
    }));
  }, [tasks, isManager, getAssignee]);

  // ──────────────────────────────────────────────────────────────────────────
  // Loading Skeletons
  // ──────────────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="page-wrapper">
        <div className="dashboard-root">
          {/* Header Skeleton */}
          <div className="dashboard-header-card">
            <div style={{ flex: 1 }}>
              <Skeleton variant="text" width="220px" height="1.6rem" />
              <div style={{ height: "6px" }} />
              <Skeleton variant="text" width="340px" height="1rem" />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Skeleton variant="rectangular" width="80px" height="34px" />
              <Skeleton variant="rectangular" width="90px" height="34px" />
              <Skeleton variant="rectangular" width="100px" height="34px" />
              <Skeleton variant="rectangular" width="95px" height="34px" />
            </div>
          </div>

          {/* Grid Skeletons */}
          <div className="dashboard-grid">
            <div className="widget-card widget-calendar">
              <Skeleton variant="rectangular" width="100%" height="240px" />
            </div>
            <div className="widget-card widget-my-tasks">
              <Skeleton variant="rectangular" width="100%" height="240px" />
            </div>
            <div className="widget-card widget-status">
              <Skeleton variant="rectangular" width="100%" height="240px" />
            </div>
            <div className="widget-card widget-attention">
              <Skeleton variant="rectangular" width="100%" height="180px" />
            </div>
            <div className="widget-card widget-workload">
              <Skeleton variant="rectangular" width="100%" height="180px" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="dashboard-root">
        {/* Error Notification with Retry */}
        {error && (
          <Alert
            variant="error"
            title="Failed to Load Dashboard"
            onClose={() => setError("")}
            className="mb-4"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.75rem",
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

        {/* Optimistic Status Toast */}
        {statusToast && (
          <Alert
            variant="success"
            title="Task Updated"
            onClose={() => setStatusToast("")}
            className="mb-2"
          >
            {statusToast}
          </Alert>
        )}

        {/* ──────────────────────────────────────────────────────────────────
           Row 1: Slim Greeting Header + 4 Compact Stat Chips
           ────────────────────────────────────────────────────────────────── */}
        <section
          className="dashboard-header-card"
          aria-label="Welcome and summary overview"
        >
          <div className="dashboard-header-left">
            <h1 className="dashboard-greeting-title">
              {greeting}, {firstName}
            </h1>
            <p className="dashboard-greeting-summary">{summaryText}</p>
          </div>

          <div
            className="dashboard-stat-chips"
            role="region"
            aria-label="Quick task status counts"
          >
            <Link
              to="/tasks"
              className="stat-chip stat-chip-total"
              title="View all tasks"
              aria-label={`Total tasks: ${totalTasks}`}
            >
              <span>Total</span>
              <span className="stat-chip-count">{totalTasks}</span>
            </Link>

            <Link
              to="/tasks?status=Pending"
              className="stat-chip stat-chip-pending"
              title="View pending tasks"
              aria-label={`Pending tasks: ${pendingTasks}`}
            >
              <span>Pending</span>
              <span className="stat-chip-count">{pendingTasks}</span>
            </Link>

            <Link
              to="/tasks?status=In+Progress"
              className="stat-chip stat-chip-progress"
              title="View in-progress tasks"
              aria-label={`In Progress tasks: ${inProgressTasks}`}
            >
              <span>In Progress</span>
              <span className="stat-chip-count">{inProgressTasks}</span>
            </Link>

            <Link
              to="/tasks?status=Completed"
              className="stat-chip stat-chip-completed"
              title="View completed tasks"
              aria-label={`Completed tasks: ${completedTasks}`}
            >
              <span>Completed</span>
              <span className="stat-chip-count">{completedTasks}</span>
            </Link>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────────
           Main 12-Column Widget Grid
           ────────────────────────────────────────────────────────────────── */}
        <div className="dashboard-grid">
          {/* ────────────────────────────────────────────────────────────────
             Row 2: (4 cols) CALENDAR WIDGET
             ──────────────────────────────────────────────────────────────── */}
          <section className="widget-card widget-calendar" aria-label="Task Calendar">
            <div className="widget-header">
              <h2 className="widget-title">{monthName}</h2>
              <div className="calendar-nav-wrap">
                <button
                  type="button"
                  className="calendar-nav-btn"
                  onClick={prevMonth}
                  aria-label="Previous month"
                  title="Previous month"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="calendar-nav-btn"
                  onClick={nextMonth}
                  aria-label="Next month"
                  title="Next month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Weekday Labels (Mo, Tu, We, Th, Fr, Sa, Su) */}
            <div className="calendar-weekdays" aria-hidden="true">
              {WEEKDAYS.map((wd) => (
                <div key={wd}>{wd}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="calendar-days-grid" role="grid" aria-label="Month calendar">
              {calendarCells.map((cell, idx) => {
                const isCurrentMonth = cell.isCurrentMonth;
                const isCurrentDay = isSameCalendarDay(cell.dateObj, today);
                const isSelected = isSameCalendarDay(
                  cell.dateObj,
                  selectedCalendarDate
                );

                const key = `${cell.dateObj.getFullYear()}-${cell.dateObj.getMonth()}-${cell.dateObj.getDate()}`;
                const dueTasks = taskDatesMap[key] || [];
                const hasDueTasks = dueTasks.length > 0;

                const dateAriaLabel = `${cell.dateObj.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}${hasDueTasks ? ` - ${dueTasks.length} tasks due` : ""}`;

                return (
                  <button
                    key={`${cell.dayNum}-${idx}`}
                    type="button"
                    className={`calendar-day-cell ${
                      !isCurrentMonth ? "calendar-day-other-month" : ""
                    } ${isCurrentDay ? "calendar-day-today" : ""} ${
                      isSelected ? "calendar-day-selected" : ""
                    }`}
                    onClick={() => setSelectedCalendarDate(cell.dateObj)}
                    aria-label={dateAriaLabel}
                    title={dateAriaLabel}
                  >
                    <span>{cell.dayNum}</span>
                    {hasDueTasks && (
                      <span className="calendar-task-dot" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Day Tasks Preview Drawer below Calendar */}
            {selectedDayTasks.length > 0 && (
              <div className="calendar-day-tasks-box">
                <div className="calendar-day-tasks-title">
                  Due on{" "}
                  {selectedCalendarDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  ({selectedDayTasks.length})
                </div>
                {selectedDayTasks.map((t) => (
                  <div key={t._id} className="calendar-day-task-item">
                    <Link to="/tasks">{t.title}</Link>
                    <Badge status={t.status} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ────────────────────────────────────────────────────────────────
             Row 2: (5 cols) "MY TASKS (N)" WIDGET
             ──────────────────────────────────────────────────────────────── */}
          <section className="widget-card widget-my-tasks" aria-label="My Tasks List">
            <div className="widget-header">
              <h2 className="widget-title">
                My tasks ({String(totalTasks).padStart(2, "0")})
              </h2>

              <div style={{ position: "relative" }} ref={kebabRef}>
                <button
                  type="button"
                  className="widget-action-btn"
                  onClick={() => setKebabOpen((prev) => !prev)}
                  aria-label="Task options"
                  aria-expanded={kebabOpen}
                >
                  <MoreVertical size={18} />
                </button>

                {kebabOpen && (
                  <div className="kebab-menu-popover" role="menu">
                    <Link
                      to="/tasks"
                      className="kebab-menu-item"
                      role="menuitem"
                      onClick={() => setKebabOpen(false)}
                    >
                      View all tasks
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Task Rows (5 rows max) */}
            <div className="my-tasks-list">
              {myTasksList.length === 0 ? (
                <div
                  style={{
                    padding: "36px 0",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                  }}
                >
                  No tasks available.
                </div>
              ) : (
                myTasksList.map((task, index) => {
                  const isCompleted = task.status === "Completed";
                  const isUrgentHighlight =
                    index === firstOpenTaskIndex && !isCompleted;
                  const dueInfo = getDueLabelInfo(task.dueDate);
                  const isUpdating = updatingTaskId === task._id;

                  return (
                    <div
                      key={task._id}
                      className={`my-task-row ${
                        isUrgentHighlight ? "task-highlight-urgent" : ""
                      }`}
                    >
                      <div className="my-task-left">
                        {/* Circle Checkbox Icon */}
                        {isManager ? (
                          // Manager: display-only circle
                          <div
                            className="my-task-check-btn"
                            aria-hidden="true"
                            title="Task status"
                          >
                            <div
                              className={`my-task-check-circle ${
                                isCompleted ? "my-task-check-circle-completed" : ""
                              }`}
                            >
                              {isCompleted && (
                                <CheckCircle2 size={13} strokeWidth={3} />
                              )}
                            </div>
                          </div>
                        ) : (
                          // Employee: clickable circle marks task completed
                          <button
                            type="button"
                            className="my-task-check-btn"
                            onClick={() => handleMarkComplete(task)}
                            disabled={isCompleted || isUpdating}
                            aria-label={
                              isCompleted
                                ? `Task "${task.title}" is completed`
                                : isUpdating
                                ? "Updating task status..."
                                : `Mark "${task.title}" as completed`
                            }
                            title={
                              isCompleted
                                ? "Completed"
                                : isUpdating
                                ? "Updating..."
                                : "Mark as Completed"
                            }
                          >
                            <div
                              className={`my-task-check-circle ${
                                isCompleted ? "my-task-check-circle-completed" : ""
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 size={13} strokeWidth={3} />
                              ) : isUpdating ? (
                                <span
                                  style={{
                                    fontSize: "8px",
                                    fontWeight: 700,
                                    lineHeight: 1,
                                  }}
                                >
                                  ...
                                </span>
                              ) : null}
                            </div>
                          </button>
                        )}

                        {/* Title with Ellipsis */}
                        <Link
                          to="/tasks"
                          className={`my-task-title ${
                            isCompleted ? "my-task-title-completed" : ""
                          }`}
                          title={task.title}
                        >
                          {task.title}
                        </Link>
                      </div>

                      {/* Right-aligned Due Label */}
                      <span
                        className={`my-task-due ${
                          dueInfo.isOverdue
                            ? "my-task-due-overdue"
                            : dueInfo.isUrgent
                            ? "my-task-due-urgent"
                            : ""
                        }`}
                      >
                        {dueInfo.text}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* ────────────────────────────────────────────────────────────────
             Row 2: (3 cols) STATUS WIDGET (SVG Donut + Legend)
             ──────────────────────────────────────────────────────────────── */}
          <section className="widget-card widget-status" aria-label="Status Overview">
            <div className="widget-header">
              <h2 className="widget-title">Task Status</h2>
            </div>

            <div className="status-donut-container">
              {/* Compact SVG Donut */}
              <div className="donut-svg-wrap">
                <svg
                  className="donut-svg"
                  viewBox="0 0 120 120"
                  aria-hidden="true"
                >
                  {/* Background Track */}
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="transparent"
                    stroke="#EFE9E1"
                    strokeWidth="11"
                  />

                  {/* Completed Arc (Green #16a34a) */}
                  {donutGeometry.completedArc > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="transparent"
                      stroke="#16a34a"
                      strokeWidth="11"
                      strokeDasharray={`${donutGeometry.completedArc} ${donutGeometry.circumference}`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                  )}

                  {/* In Progress Arc (Blue #3b82f6) */}
                  {donutGeometry.inProgressArc > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="transparent"
                      stroke="#3b82f6"
                      strokeWidth="11"
                      strokeDasharray={`${donutGeometry.inProgressArc} ${donutGeometry.circumference}`}
                      strokeDashoffset={-donutGeometry.completedArc}
                      strokeLinecap="round"
                    />
                  )}

                  {/* Pending Arc (Orange #ea580c) */}
                  {donutGeometry.pendingArc > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="transparent"
                      stroke="#ea580c"
                      strokeWidth="11"
                      strokeDasharray={`${donutGeometry.pendingArc} ${donutGeometry.circumference}`}
                      strokeDashoffset={-(donutGeometry.completedArc + donutGeometry.inProgressArc)}
                      strokeLinecap="round"
                    />
                  )}
                </svg>

                {/* Center Stats */}
                <div className="donut-center-label">
                  <span className="donut-center-count">{totalTasks}</span>
                  <span className="donut-center-sub">Total</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="status-legend-list">
                <div className="status-legend-item">
                  <div className="status-legend-left">
                    <span
                      className="status-legend-dot"
                      style={{ backgroundColor: "#16a34a" }}
                    />
                    <span>Completed</span>
                  </div>
                  <span className="status-legend-val">
                    {completedTasks}{" "}
                    <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>
                      ({totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%)
                    </span>
                  </span>
                </div>

                <div className="status-legend-item">
                  <div className="status-legend-left">
                    <span
                      className="status-legend-dot"
                      style={{ backgroundColor: "#3b82f6" }}
                    />
                    <span>In Progress</span>
                  </div>
                  <span className="status-legend-val">
                    {inProgressTasks}{" "}
                    <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>
                      ({totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0}%)
                    </span>
                  </span>
                </div>

                <div className="status-legend-item">
                  <div className="status-legend-left">
                    <span
                      className="status-legend-dot"
                      style={{ backgroundColor: "#ea580c" }}
                    />
                    <span>Pending</span>
                  </div>
                  <span className="status-legend-val">
                    {pendingTasks}{" "}
                    <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>
                      ({totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0}%)
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ────────────────────────────────────────────────────────────────
             Row 3: (6 cols) "NEEDS ATTENTION" WIDGET
             ──────────────────────────────────────────────────────────────── */}
          <section className="widget-card widget-attention" aria-label="Needs Attention">
            <div className="widget-header">
              <h2 className="widget-title">
                <AlertTriangle size={18} color="#EA580C" aria-hidden="true" />
                <span>Needs attention</span>
              </h2>

              <Link to="/tasks" className="widget-action-btn" title="View tasks">
                <ArrowRight size={16} />
              </Link>
            </div>

            {needsAttentionTasks.length === 0 ? (
              <div className="attention-empty">
                <div className="attention-empty-icon" aria-hidden="true">
                  <CheckCircle2 size={24} />
                </div>
                <div className="attention-empty-text">
                  Nothing urgent, nice work.
                </div>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--text-muted)",
                    margin: "4px 0 0",
                  }}
                >
                  No tasks are overdue or due within the next 3 days.
                </p>
              </div>
            ) : (
              <div className="attention-list">
                {needsAttentionTasks.map((task) => {
                  const now = new Date();
                  now.setHours(0, 0, 0, 0);
                  const isOverdue =
                    task.dueDate && new Date(task.dueDate).getTime() < now.getTime();

                  const assignee =
                    isManager && task.assignedTo
                      ? getAssignee(task.assignedTo).name
                      : null;

                  return (
                    <div key={task._id} className="attention-item">
                      <div className="attention-left">
                        <span
                          className={`attention-marker ${
                            isOverdue
                              ? "attention-marker-overdue"
                              : "attention-marker-soon"
                          }`}
                          aria-hidden="true"
                        />
                        <div className="attention-info">
                          <Link
                            to="/tasks"
                            className="attention-title"
                            title={task.title}
                          >
                            {task.title}
                          </Link>
                          {assignee && (
                            <span className="attention-assignee">
                              Assigned to {assignee}
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        className={`attention-badge ${
                          isOverdue
                            ? "attention-badge-overdue"
                            : "attention-badge-soon"
                        }`}
                      >
                        {isOverdue ? "Overdue" : "Due Soon"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ────────────────────────────────────────────────────────────────
             Row 3: (6 cols) TEAM WORKLOAD (Manager) / MY PROGRESS (Employee)
             ──────────────────────────────────────────────────────────────── */}
          <section
            className="widget-card widget-workload"
            aria-label={isManager ? "Team Workload" : "My Progress"}
          >
            <div className="widget-header">
              <h2 className="widget-title">
                {isManager ? (
                  <span>Team workload</span>
                ) : (
                  <span>My progress</span>
                )}
              </h2>
            </div>

            {isManager ? (
              // Manager View: Team Workload rows
              teamWorkload.length === 0 ? (
                <div
                  style={{
                    padding: "32px 0",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                  }}
                >
                  No active team workload yet.
                </div>
              ) : (
                <div className="workload-list">
                  {teamWorkload.map((emp) => (
                    <div key={emp.key} className="workload-row">
                      <div className="workload-user-meta">
                        <Avatar name={emp.name} size="sm" />
                        <span className="workload-user-name" title={emp.name}>
                          {emp.name}
                        </span>
                      </div>

                      <div className="workload-bar-wrap">
                        <div className="workload-bar-bg">
                          <div
                            className="workload-bar-fill"
                            style={{ width: `${Math.max(emp.pct, 6)}%` }}
                          />
                        </div>
                      </div>

                      <span className="workload-count-label">
                        {emp.count} {emp.count === 1 ? "task" : "tasks"}
                      </span>
                    </div>
                  ))}
                </div>
              )
            ) : (
              // Employee View: My Progress
              <div className="progress-card-content">
                <div className="progress-headline">
                  <span className="progress-pct-big">{completionPct}%</span>
                  <span className="progress-ratio-label">
                    {completedTasks} of {totalTasks} tasks completed
                  </span>
                </div>

                <div
                  className="progress-bar-container"
                  role="progressbar"
                  aria-valuenow={completionPct}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>

                <div className="progress-status-pills">
                  <div className="progress-status-pill">
                    <span className="progress-pill-label">Pending</span>
                    <span className="progress-pill-num">{pendingTasks}</span>
                  </div>
                  <div className="progress-status-pill">
                    <span className="progress-pill-label">In Progress</span>
                    <span className="progress-pill-num">{inProgressTasks}</span>
                  </div>
                  <div className="progress-status-pill">
                    <span className="progress-pill-label">Completed</span>
                    <span className="progress-pill-num">{completedTasks}</span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}