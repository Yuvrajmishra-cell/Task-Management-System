import React, { forwardRef } from "react";

/**
 * Reusable IconButton with built-in tooltip, accessible aria-label,
 * and variants for ghost, secondary, primary, and danger styles.
 */
const IconButton = forwardRef(function IconButton(
  {
    icon,
    label,
    tooltip = null,
    variant = "ghost", // ghost | secondary | primary | danger
    size = "md", // sm | md | lg
    disabled = false,
    className = "",
    type = "button",
    onClick,
    ...props
  },
  ref
) {
  const tooltipText = tooltip ?? label;
  const sizeClass = `ui-icon-btn-${size}`;
  const variantClass = `ui-icon-btn-${variant}`;

  const buttonElement = (
    <button
      ref={ref}
      type={type}
      className={`ui-icon-btn ${sizeClass} ${variantClass} ${className}`.trim()}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon}
    </button>
  );

  if (!tooltipText || disabled) {
    return buttonElement;
  }

  return (
    <span className="ui-tooltip-wrapper">
      {buttonElement}
      <span className="ui-tooltip" role="tooltip">
        {tooltipText}
      </span>
    </span>
  );
});

export default IconButton;
