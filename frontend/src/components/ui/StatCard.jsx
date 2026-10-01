import React from "react";

/**
 * Reusable StatCard displaying a metric value, label, colored icon chip,
 * and an optional contextual caption (e.g. "+2 this week" or "Past deadline").
 */
function StatCard({
  label,
  value,
  icon = null,
  caption = null,
  variant = "default", // total | pending | progress | completed | default
  interactive = true,
  className = "",
  onClick = null,
  ...props
}) {
  const variantClass = variant !== "default" ? `ui-stat-card-${variant}` : "";
  const interactiveClass = interactive ? "ui-card-interactive hoverable" : "";

  return (
    <div
      className={`ui-stat-card ${variantClass} ${interactiveClass} ${className}`.trim()}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      <div className="ui-stat-card-header">
        <span className="ui-stat-card-label">{label}</span>
        {icon && <div className="ui-stat-card-chip">{icon}</div>}
      </div>

      <div className="ui-stat-card-value">{value}</div>

      {caption && <div className="ui-stat-card-caption">{caption}</div>}
    </div>
  );
}

export default StatCard;
