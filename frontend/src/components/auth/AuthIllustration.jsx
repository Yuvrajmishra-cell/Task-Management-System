import React from "react";
import { CheckSquare } from "lucide-react";

/**
 * Single concentric ring element: 3 concentric circles + center dot
 */
function ConcentricRing({ cx, cy }) {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <circle cx="14" cy="14" r="13" fill="none" stroke="#1F1B16" strokeWidth="1.5" opacity="0.2" />
      <circle cx="14" cy="14" r="8.5" fill="none" stroke="#1F1B16" strokeWidth="1.5" opacity="0.2" />
      <circle cx="14" cy="14" r="4.2" fill="none" stroke="#1F1B16" strokeWidth="1.5" opacity="0.22" />
      <circle cx="14" cy="14" r="1.5" fill="#1F1B16" opacity="0.28" />
    </g>
  );
}

/**
 * Top-left decoration: 4 rows x 3 columns of concentric rings
 */
function TopLeftRings() {
  const cols = 3;
  const rows = 4;
  const spacing = 32;
  return (
    <svg
      className="auth-ill-rings auth-ill-rings-tl"
      width={cols * spacing + 12}
      height={rows * spacing + 12}
      viewBox={`0 0 ${cols * spacing + 12} ${rows * spacing + 12}`}
      fill="none"
      aria-hidden="true"
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <ConcentricRing key={`tl-${r}-${c}`} cx={c * spacing + 4} cy={r * spacing + 4} />
        ))
      )}
    </svg>
  );
}

/**
 * Bottom-right decoration: staircase triangle (1, 2, 3, 4 rings)
 */
function BottomRightRings() {
  const spacing = 32;
  return (
    <svg
      className="auth-ill-rings auth-ill-rings-br"
      width={4 * spacing + 12}
      height={4 * spacing + 12}
      viewBox={`0 0 ${4 * spacing + 12} ${4 * spacing + 12}`}
      fill="none"
      aria-hidden="true"
    >
      <ConcentricRing cx={3 * spacing + 4} cy={0 * spacing + 4} />
      <ConcentricRing cx={2 * spacing + 4} cy={1 * spacing + 4} />
      <ConcentricRing cx={3 * spacing + 4} cy={1 * spacing + 4} />
      <ConcentricRing cx={1 * spacing + 4} cy={2 * spacing + 4} />
      <ConcentricRing cx={2 * spacing + 4} cy={2 * spacing + 4} />
      <ConcentricRing cx={3 * spacing + 4} cy={2 * spacing + 4} />
      <ConcentricRing cx={0 * spacing + 4} cy={3 * spacing + 4} />
      <ConcentricRing cx={1 * spacing + 4} cy={3 * spacing + 4} />
      <ConcentricRing cx={2 * spacing + 4} cy={3 * spacing + 4} />
      <ConcentricRing cx={3 * spacing + 4} cy={3 * spacing + 4} />
    </svg>
  );
}

export default function AuthIllustration({
  tagline = "Assign. Track. Complete.",
}) {
  return (
    <div className="auth-ill-panel" aria-hidden="true">
      {/* Corner Concentric Ring Decorations (dark at ~20% opacity) */}
      <TopLeftRings />
      <BottomRightRings />

      {/* Top Brand Logo */}
      <div className="auth-ill-header">
        <div className="auth-ill-logo">
          <CheckSquare size={20} strokeWidth={2.5} />
        </div>
        <span className="auth-ill-brand">TaskFlow</span>
      </div>

      {/* Centered Stage Illustration */}
      <div className="auth-ill-center">
        {/* Soft Arch Backdrop */}
        <div className="auth-ill-arch" />

        <div className="auth-ill-progress" aria-hidden="true">
          <span className="auth-ill-progress-label">3 of 5 done</span>
          <span className="auth-ill-progress-track"><span /></span>
        </div>

        {/* 3 Initials Avatars */}
        <div className="auth-ill-avatar auth-ill-avatar-1" aria-hidden="true">
          SC
        </div>
        <div className="auth-ill-avatar auth-ill-avatar-2" aria-hidden="true">
          MV
        </div>
        <div className="auth-ill-avatar auth-ill-avatar-3" aria-hidden="true">
          JT
        </div>

        {/* Sparkle Accents */}
        <svg
          className="auth-ill-sparkle auth-ill-sparkle-1"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="#1F1B16"
          aria-hidden="true"
        >
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" opacity="0.25" />
        </svg>
        <svg
          className="auth-ill-sparkle auth-ill-sparkle-2"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="#1F1B16"
          aria-hidden="true"
        >
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" opacity="0.2" />
        </svg>

        {/* Mini Task Card */}
        <div className="auth-ill-task-card">
          <div className="auth-ill-card-top">
            <div className="auth-ill-card-title-wrap">
              <CheckSquare size={14} strokeWidth={2.5} className="auth-ill-card-icon" />
              <span className="auth-ill-card-title">Sprint Overview</span>
            </div>
            <span className="auth-ill-card-pill">Active</span>
          </div>

          <div className="auth-ill-card-rows">
            {/* Pending Row */}
            <div className="auth-ill-row auth-ill-row-pending">
              <div className="auth-ill-row-left">
                <span className="auth-ill-status-dot status-dot-pending" />
                <span className="auth-ill-row-title">Design system tokens</span>
              </div>
              <span className="auth-ill-status-badge badge-pending">Pending</span>
              <span className="auth-ill-status-badge badge-completed auth-ill-swap-badge">
                <span className="auth-ill-check" aria-hidden="true" />Completed
              </span>
            </div>

            {/* Completed Row */}
            <div className="auth-ill-row auth-ill-row-completed">
              <div className="auth-ill-row-left">
                <span className="auth-ill-status-dot status-dot-completed" />
                <span className="auth-ill-row-title">API authentication</span>
              </div>
              <span className="auth-ill-status-badge badge-completed">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tagline */}
      <div className="auth-ill-footer">
        <p className="auth-ill-tagline">{tagline}</p>
      </div>
    </div>
  );
}
