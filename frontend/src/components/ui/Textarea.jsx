import { AlertCircle } from "lucide-react";

function Textarea({
  id,
  label,
  helperText,
  error,
  required = false,
  rows = 4,
  className = "",
  ...props
}) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const helperId = textareaId ? `${textareaId}-helper` : undefined;
  const errorId = textareaId ? `${textareaId}-error` : undefined;

  return (
    <div className={`ui-form-group ${className}`.trim()}>
      {label && (
        <label className="ui-label" htmlFor={textareaId}>
          <span>{label}</span>
          {required && <span className="required-mark" aria-hidden="true">*</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        className={`ui-textarea ${error ? "has-error" : ""}`}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        {...props}
      />

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

export default Textarea;
