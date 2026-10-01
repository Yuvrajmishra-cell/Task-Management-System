function Badge({
  children,
  variant,
  status,
  role,
  withDot = true,
  className = "",
  ...props
}) {
  let computedVariant = variant || "default";

  if (status) {
    if (status === "Pending") computedVariant = "pending";
    else if (status === "In Progress") computedVariant = "progress";
    else if (status === "Completed") computedVariant = "completed";
  } else if (role) {
    if (role === "manager") computedVariant = "manager";
    else if (role === "employee") computedVariant = "employee";
  }

  const isStatusVariant = ["pending", "progress", "completed", "danger"].includes(computedVariant);
  const showDot = withDot && isStatusVariant;

  return (
    <span
      className={`ui-badge ui-badge-${computedVariant} ${className}`.trim()}
      {...props}
    >
      {showDot && <span className="ui-badge-dot" aria-hidden="true" />}
      <span>{children || status || role}</span>
    </span>
  );
}

export { default as StatusBadge } from "./StatusBadge";
export default Badge;

