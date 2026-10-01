import React from "react";

/**
 * Standardized PageHeader component ensuring consistent title, subtitle,
 * breadcrumbs / eyebrow label, and right-aligned actions slot across routes.
 */
function PageHeader({
  title,
  subtitle,
  action = null,
  actions = null,
  breadcrumb = null,
  eyebrow = null,
  className = "",
  ...props
}) {
  const actionsSlot = action || actions;

  return (
    <header className={`page-header ${className}`.trim()} {...props}>
      {breadcrumb && (
        <nav className="page-header-breadcrumb" aria-label="Breadcrumb">
          {breadcrumb}
        </nav>
      )}
      <div className="page-header-main">
        <div className="page-header-headings">
          {eyebrow && <span className="page-header-eyebrow">{eyebrow}</span>}
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actionsSlot && <div className="page-header-actions">{actionsSlot}</div>}
      </div>
    </header>
  );
}

export default PageHeader;
