import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

function Alert({
  children,
  variant = "info",
  title = null,
  icon = null,
  onClose = null,
  className = "",
  ...props
}) {
  let defaultIcon;
  if (variant === "error") {
    defaultIcon = <AlertCircle size={18} />;
  } else if (variant === "success") {
    defaultIcon = <CheckCircle2 size={18} />;
  } else if (variant === "warning") {
    defaultIcon = <AlertTriangle size={18} />;
  } else {
    defaultIcon = <Info size={18} />;
  }

  const renderedIcon = icon !== null ? icon : defaultIcon;

  return (
    <div
      className={`ui-alert ui-alert-${variant} ${className}`.trim()}
      role="alert"
      {...props}
    >
      {renderedIcon && <div className="ui-alert-icon">{renderedIcon}</div>}
      <div className="ui-alert-content">
        {title && <div className="ui-alert-title">{title}</div>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          className="ui-alert-close"
          onClick={onClose}
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default Alert;
