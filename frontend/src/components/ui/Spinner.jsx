function Spinner({ size = "md", className = "", ...props }) {
  const sizeClass = `ui-spinner-${size}`;

  return (
    <span
      className={`ui-spinner ${sizeClass} ${className}`.trim()}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
}

export default Spinner;
