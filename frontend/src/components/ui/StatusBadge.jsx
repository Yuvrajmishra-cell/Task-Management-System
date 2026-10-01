import React from "react";

/**
 * StatusBadge component dedicated to task status indicators.
 * Supported statuses: "Pending", "In Progress", "Completed", or generic status keys.
 * Implements Organizo tokens: fully rounded pill, dot indicator, and semantic status colors.
 */
function StatusBadge({
  status,
  children,
  withDot = true,
  className = "",
  ...props
}) {
  const displayStatus = status || children || "Pending";
  let variant = "pending";

  if (typeof displayStatus === "string") {
    const normalized = displayStatus.trim().toLowerCase();
    if (normalized === "in progress" || normalized === "in-progress" || normalized === "progress") {
      variant = "progress";
    } else if (normalized === "completed" || normalized === "done") {
      variant = "completed";
    } else if (normalized === "pending") {
      variant = "pending";
    } else if (normalized === "danger" || normalized === "overdue" || normalized === "error") {
      variant = "danger";
    }
  }

  return (
    <span
      className={`ui-badge ui-badge-${variant} ${className}`.trim()}
      {...props}
    >
      {withDot && <span className="ui-badge-dot" aria-hidden="true" />}
      <span>{children || status}</span>
    </span>
  );
}

export default StatusBadge;
