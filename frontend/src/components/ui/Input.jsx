import { AlertCircle } from "lucide-react";

function Input({
  id,
  label,
  helperText,
  error,
  icon = null,
  required = false,
  className = "",
  type = "text",
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const helperId = inputId ? `${inputId}-helper` : undefined;
  const errorId = inputId ? `${inputId}-error` : undefined;

  return (
    <div className={`ui-form-group ${className}`.trim()}>
      {label && (
        <label className="ui-label" htmlFor={inputId}>
          <span>{label}</span>
          {required && <span className="required-mark" aria-hidden="true">*</span>}
        </label>
      )}

      <div className={`ui-input-wrapper ${icon ? "has-icon" : ""}`}>
        {icon && <span className="ui-input-icon">{icon}</span>}
        <input
          id={inputId}
          type={type}
          className={`ui-input ${error ? "has-error" : ""}`}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
      </div>

      {error ? (
        <div id={errorId} className="ui-error-text" role="alert">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <div id={helperId} className="ui-helper-text">
          {helperText}
        </div>
      ) : null}
    </div>
  );
}

export default Input;
