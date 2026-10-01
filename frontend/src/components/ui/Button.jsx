import Spinner from "./Spinner";

function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}) {
  const variantClass = `ui-btn-${variant}`;
  const sizeClass = `ui-btn-${size}`;
  const fullClass = fullWidth ? "ui-btn-full" : "";
  const loadingClass = isLoading ? "is-loading" : "";

  return (
    <button
      type={type}
      className={`ui-btn ${variantClass} ${sizeClass} ${fullClass} ${loadingClass} ${className}`.trim()}
      disabled={disabled || isLoading}
      aria-busy={isLoading ? "true" : undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size={size === "lg" ? "md" : "sm"} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="ui-btn-icon-left">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="ui-btn-icon-right">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

export default Button;
