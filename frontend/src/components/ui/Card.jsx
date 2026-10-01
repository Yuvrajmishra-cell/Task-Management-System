function Card({
  children,
  variant = "default",
  interactive = false,
  className = "",
  ...props
}) {
  const variantClass = variant === "elevated" ? "ui-card-elevated" : "";
  const interactiveClass = interactive ? "ui-card-interactive" : "";

  return (
    <div
      className={`ui-card ${variantClass} ${interactiveClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`ui-card-header ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ children, className = "", ...props }) {
  return (
    <h3 className={`ui-card-title ${className}`.trim()} {...props}>
      {children}
    </h3>
  );
}

function CardDescription({ children, className = "", ...props }) {
  return (
    <p className={`ui-card-description ${className}`.trim()} {...props}>
      {children}
    </p>
  );
}

function CardBody({ children, className = "", ...props }) {
  return (
    <div className={`ui-card-body ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={`ui-card-footer ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
