import { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Circle,
  Check,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useReveal } from "../../hooks/useReveal";

function CountUp({ value, active }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frame = 0;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 900, 1);
      setCount(Math.round(value * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value]);

  return active && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? value : count;
}

/**
 * Faux dashboard preview widget composition for the Landing Page Hero.
 * Built from the SAME widget components:
 * 1. Calendar widget with day dots & today in yellow
 * 2. My tasks list with highlighted open urgent task
 * 3. Status donut SVG chart
 * Labelled "Preview"
 */
function HeroIllustration() {
  const { setNode: visualRef, isRevealed } = useReveal();
  // Calendar days for October 2026 (starting Thu = day 4 of week)
  // Weekday initials Mo, Tu, We, Th, Fr, Sa, Su
  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  
  // Sample tasks for "My tasks" widget
  const previewTasks = [
    {
      id: "pt-1",
      title: "Design database schema",
      due: "Today",
      status: "Pending",
      isUrgent: true,
    },
    {
      id: "pt-2",
      title: "Review auth rate limiters",
      due: "Tomorrow",
      status: "In Progress",
      isUrgent: false,
    },
    {
      id: "pt-3",
      title: "Setup CI/CD deployment",
      due: "Yesterday",
      status: "Completed",
      isUrgent: false,
    },
  ];

  // SVG Donut calculation (Total = 12: 6 Completed, 4 In Progress, 2 Pending)
  // Circumference for r=36 is 2 * PI * 36 ~= 226.195
  const circumference = 226.195;
  const completedStroke = (6 / 12) * circumference; // ~113.1
  const progressStroke = (4 / 12) * circumference;  // ~75.4
  const pendingStroke = (2 / 12) * circumference;   // ~37.7

  return (
    <div className="hero-visual" ref={visualRef} role="img" aria-label="TaskFlow dashboard preview with task assignments and status tracking">
      <span className="hero-floating-chip hero-floating-chip-assigned" aria-hidden="true">
        <CheckCircle2 size={16} />Task assigned
      </span>
      <span className="hero-floating-chip hero-floating-chip-updated" aria-hidden="true">
        <TrendingUp size={16} />Status updated
      </span>
      <div className="faux-dashboard-container" aria-hidden="true">
      {/* Top Window Chrome */}
      <div className="faux-dashboard-chrome">
        <div className="faux-window-dots" aria-hidden="true">
          <span className="faux-dot red" />
          <span className="faux-dot yellow" />
          <span className="faux-dot green" />
        </div>

        <div className="faux-search-bar">
          <span className="faux-search-dot" />
          <span>app.taskflow.local/dashboard</span>
        </div>

        <div className="faux-preview-pill">
          <span className="faux-pulse-indicator" />
          <span>Preview</span>
        </div>
      </div>

      {/* Faux Dashboard Grid */}
      <div className="faux-dashboard-body">
        {/* Top Summary Chips Row */}
        <div className="faux-stat-chips-row">
          <div className="faux-stat-chip">
            <span className="faux-chip-num"><CountUp value={12} active={isRevealed} /></span>
            <span className="faux-chip-label">Total</span>
          </div>
          <div className="faux-stat-chip">
            <span className="faux-chip-num text-orange"><CountUp value={2} active={isRevealed} /></span>
            <span className="faux-chip-label">Pending</span>
          </div>
          <div className="faux-stat-chip">
            <span className="faux-chip-num text-blue"><CountUp value={4} active={isRevealed} /></span>
            <span className="faux-chip-label">Active</span>
          </div>
          <div className="faux-stat-chip">
            <span className="faux-chip-num text-green"><CountUp value={6} active={isRevealed} /></span>
            <span className="faux-chip-label">Done</span>
          </div>
        </div>

        {/* Widgets Grid: Calendar + Tasks + Donut */}
        <div className="faux-widgets-grid">
          {/* Widget 1: Calendar */}
          <div className="faux-widget-card faux-calendar-widget">
            <div className="faux-widget-header">
              <span className="faux-widget-title">
                <CalendarIcon size={13} className="text-yellow-dark" />
                <span>October 2026</span>
              </span>
              <div className="faux-cal-arrows">
                <ChevronLeft size={12} />
                <ChevronRight size={12} />
              </div>
            </div>

            <div className="faux-cal-grid">
              {weekdays.map((d) => (
                <span key={d} className="faux-cal-weekday">
                  {d}
                </span>
              ))}

              {/* Empty leading days (starts Thu, so 3 empty: Mo, Tu, We) */}
              <span className="faux-cal-day empty" />
              <span className="faux-cal-day empty" />
              <span className="faux-cal-day empty" />

              {/* Days 1 to 21 for compact preview */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((day) => {
                const isToday = day === 12;
                const hasDot = day === 8 || day === 12 || day === 15 || day === 18;
                return (
                  <div
                    key={day}
                    className={`faux-cal-day ${isToday ? "today" : ""}`}
                  >
                    <span>{day}</span>
                    {hasDot && <span className="faux-cal-dot" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Widget 2: My tasks list with highlighted row */}
          <div className="faux-widget-card faux-tasks-widget">
            <div className="faux-widget-header">
              <span className="faux-widget-title">
                <CheckCircle2 size={13} className="text-yellow-dark" />
                <span>My tasks (3)</span>
              </span>
              <span className="faux-badge-count">Active</span>
            </div>

            <div className="faux-tasks-list">
              {previewTasks.map((t) => {
                const isDone = t.status === "Completed";
                return (
                  <div
                    key={t.id}
                    className={`faux-task-row ${
                      t.isUrgent ? "task-highlight-urgent" : ""
                    }`}
                  >
                    <div className="faux-task-row-left">
                      <div
                        className={`faux-task-check ${
                          isDone
                            ? "completed"
                            : t.status === "In Progress"
                            ? "in-progress"
                            : "pending"
                        }`}
                      >
                        {isDone ? (
                          <Check size={9} strokeWidth={3} />
                        ) : t.status === "In Progress" ? (
                          <Clock size={8} strokeWidth={2.5} />
                        ) : (
                          <Circle size={7} strokeWidth={2} />
                        )}
                      </div>

                      <span
                        className={`faux-task-title ${
                          isDone ? "completed" : ""
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>

                    <span
                      className={`faux-task-due ${
                        t.isUrgent ? "due-urgent" : ""
                      }`}
                    >
                      {t.due}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Widget 3: Status Donut Chart */}
          <div className="faux-widget-card faux-donut-widget">
            <div className="faux-widget-header">
              <span className="faux-widget-title">
                <TrendingUp size={13} className="text-yellow-dark" />
                <span>Status Overview</span>
              </span>
            </div>

            <div className="faux-donut-content">
              <div className="faux-donut-svg-wrap">
                <svg width="78" height="78" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="none"
                    stroke="#ECE6DF"
                    strokeWidth="12"
                  />
                  {/* Completed Segment (Green) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="none"
                    stroke="#15803D"
                    strokeWidth="12"
                    strokeDasharray={`${completedStroke} ${circumference}`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                  {/* In Progress Segment (Blue) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="none"
                    stroke="#1D4ED8"
                    strokeWidth="12"
                    strokeDasharray={`${progressStroke} ${circumference}`}
                    strokeDashoffset={-completedStroke}
                    transform="rotate(-90 50 50)"
                  />
                  {/* Pending Segment (Orange) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="none"
                    stroke="#EA580C"
                    strokeWidth="12"
                    strokeDasharray={`${pendingStroke} ${circumference}`}
                    strokeDashoffset={-(completedStroke + progressStroke)}
                    transform="rotate(-90 50 50)"
                  />
                </svg>

                <div className="faux-donut-center-text">
                  <span className="faux-donut-number">12</span>
                  <span className="faux-donut-sub">Tasks</span>
                </div>
              </div>

              <div className="faux-donut-legend">
                <div className="faux-legend-item">
                  <span className="faux-legend-dot bg-green" />
                  <span>6 Done</span>
                </div>
                <div className="faux-legend-item">
                  <span className="faux-legend-dot bg-blue" />
                  <span>4 Progress</span>
                </div>
                <div className="faux-legend-item">
                  <span className="faux-legend-dot bg-orange" />
                  <span>2 Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default HeroIllustration;
