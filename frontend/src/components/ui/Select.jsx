import { AlertCircle } from "lucide-react";

function Select({
  id,
  label,
  helperText,
  error,
  icon = null,
  required = false,
  options = [],
  children,
  className = "",
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const helperId = selectId ? `${selectId}-helper` : undefined;
  const errorId = selectId ? `${selectId}-error` : undefined;

  return (
    <div className={`ui-form-group ${className}`.trim()}>
      {label && (
        <label className="ui-label" htmlFor={selectId}>
          <span>{label}</span>
          {required && <span className="required-mark" aria-hidden="true">*</span>}
        </label>
      )}

      <div className={`ui-input-wrapper ${icon ? "has-icon" : ""}`}>
        {icon && <span className="ui-input-icon">{icon}</span>}
        <select
          id={selectId}
          className={`ui-select ${error ? "has-error" : ""}`}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
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

export default Select;
