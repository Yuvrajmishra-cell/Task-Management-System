import React from "react";
import { Calendar } from "lucide-react";

/**
 * Reusable DueDate helper component.
 * Displays calendar icon + formatted date with computed relative states:
 * - "Overdue" (red) — only when status !== "Completed"
 * - "Due today" (amber)
 * - "Due in N days" (neutral)
 * - "Completed" (green / neutral)
 */
function DueDate({
  date,
  status = "",
  showIcon = true,
  showPill = true,
  className = "",
  ...props
}) {
  if (!date) {
    return (
      <span className={`ui-due-date ui-due-date-empty ${className}`.trim()} {...props}>
        {showIcon && <Calendar size={14} className="ui-due-date-icon" />}
        <span className="ui-due-date-text" style={{ color: "var(--text-muted)" }}>
          No due date
        </span>
      </span>
    );
  }

  const targetDate = new Date(date);
  const formattedDate = targetDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Calculate day difference relative to midnight today
  const targetMidnight = new Date(targetDate);
  targetMidnight.setHours(0, 0, 0, 0);

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const diffTime = targetMidnight.getTime() - todayMidnight.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const isCompleted = status === "Completed";

  let state = "neutral";
  let pillText = "";

  if (isCompleted) {
    state = "completed";
    pillText = "Completed";
  } else if (diffDays < 0) {
    state = "overdue";
    pillText = "Overdue";
  } else if (diffDays === 0) {
    state = "today";
    pillText = "Due today";
  } else if (diffDays === 1) {
    state = "neutral";
    pillText = "Due tomorrow";
  } else {
    state = "neutral";
    pillText = `Due in ${diffDays} days`;
  }

  const pillClass = `ui-due-date-pill ui-due-date-pill-${state}`;

  return (
    <div className={`ui-due-date ui-due-date-state-${state} ${className}`.trim()} {...props}>
      {showIcon && <Calendar size={14} className="ui-due-date-icon" />}
      <span className="ui-due-date-text">{formattedDate}</span>
      {showPill && <span className={pillClass}>{pillText}</span>}
    </div>
  );
}

export default DueDate;
