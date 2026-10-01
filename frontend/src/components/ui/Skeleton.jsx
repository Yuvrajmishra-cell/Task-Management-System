import React from "react";

/**
 * Primitives and composite skeleton loaders for text, circles, cards, and stat cards.
 */
function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
  style = {},
  ...props
}) {
  const variantClass = `ui-skeleton-${variant}`;

  const customStyle = {
    ...style,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  return (
    <div
      className={`ui-skeleton ${variantClass} ${className}`.trim()}
      style={customStyle}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * Composite skeleton for StatCard components.
 */
function SkeletonStatCard({ className = "", ...props }) {
  return (
    <div className={`ui-skeleton-stat-card ${className}`.trim()} aria-hidden="true" {...props}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <Skeleton variant="text" width="45%" height="0.9rem" />
        <Skeleton variant="rect" width="38px" height="38px" style={{ borderRadius: "8px" }} />
      </div>
      <Skeleton variant="text" width="60%" height="2.25rem" style={{ marginBottom: "0.5rem" }} />
      <Skeleton variant="text" width="35%" height="0.75rem" />
    </div>
  );
}

/**
 * Composite skeleton for standard content cards.
 */
function SkeletonCard({ className = "", ...props }) {
  return (
    <div className={`ui-skeleton-card ${className}`.trim()} aria-hidden="true" {...props}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <Skeleton variant="text" width="55%" height="1.15rem" />
        <Skeleton variant="rect" width="64px" height="22px" style={{ borderRadius: "9999px" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.25rem" }}>
        <Skeleton variant="text" width="100%" height="0.85rem" />
        <Skeleton variant="text" width="85%" height="0.85rem" />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Skeleton variant="circle" width="24px" height="24px" />
          <Skeleton variant="text" width="80px" height="0.8rem" />
        </div>
        <Skeleton variant="text" width="70px" height="0.8rem" />
      </div>
    </div>
  );
}

Skeleton.StatCard = SkeletonStatCard;
Skeleton.Card = SkeletonCard;

export { Skeleton, SkeletonStatCard, SkeletonCard };
export default Skeleton;
