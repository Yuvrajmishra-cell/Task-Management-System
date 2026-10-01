function EmptyState({
  icon,
  title,
  description,
  action = null,
  className = "",
  ...props
}) {
  return (
    <div className={`ui-empty-state ${className}`.trim()} {...props}>
      {icon && <div className="ui-empty-icon">{icon}</div>}
      {title && <h3 className="ui-empty-title">{title}</h3>}
      {description && <p className="ui-empty-desc">{description}</p>}
      {action && <div className="ui-empty-action">{action}</div>}
    </div>
  );
}

export default EmptyState;
