import React from "react";
import { CheckSquare } from "lucide-react";

export default function AuthIllustration({
  title = "Assign. Track. Complete.",
  supportingText = "A clearer view of every task, together.",
}) {
  return (
    <div className="auth-ill-panel" aria-hidden="true">
      <div className="auth-ill-header">
        <span className="auth-ill-logo"><CheckSquare size={21} strokeWidth={2.5} /></span>
        <span className="auth-ill-brand">TaskFlow</span>
      </div>
      <div className="auth-ill-message">
        <h2>{title}</h2>
        <p>{supportingText}</p>
      </div>

      <div className="auth-ill-scene">
        <svg className="auth-ill-tree" viewBox="0 0 440 350" fill="none">
          <defs>
          <linearGradient id="treeTrunk" x1="84" y1="205" x2="112" y2="340" gradientUnits="userSpaceOnUse">
            <stop stopColor="#CA8A04" /><stop offset="1" stopColor="#92400E" />
          </linearGradient>
            <linearGradient id="treeCanopy" x1="24" y1="46" x2="184" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBBF24" /><stop offset=".58" stopColor="#E99A16" /><stop offset="1" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="treeShade" x1="112" y1="124" x2="190" y2="170" gradientUnits="userSpaceOnUse">
              <stop stopColor="#92400E" stopOpacity="0" /><stop offset="1" stopColor="#92400E" stopOpacity=".26" />
            </linearGradient>
            <linearGradient id="treeHighlight" x1="35" y1="38" x2="84" y2="146" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity=".52" /><stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          <ellipse cx="95" cy="331" rx="112" ry="13" fill="#854D0E" opacity=".2" />
          <path d="M77 204Q77 194 87 194h16q10 0 10 10v103q0 10 11 16l5 3v5H61v-5l5-3q11-6 11-16V204Z" fill="url(#treeTrunk)" />
          <g className="auth-ill-canopy">
            <path d="M95 18c31 0 48 19 48 50 0 25 15 42 26 70 18 48-13 90-74 98-61-8-92-50-74-98 11-28 26-45 26-70 0-31 17-50 48-50Z" fill="url(#treeCanopy)" />
            <path d="M95 18c31 0 48 19 48 50 0 25 15 42 26 70 18 48-13 90-74 98 27-20 37-50 32-78-4-25-20-42-21-73-1-24-5-47-11-67Z" fill="url(#treeShade)" />
            <path d="M31 136c-9-36 1-72 26-94 12-11 26-17 38-18-19 20-23 47-18 72 5 26 18 45 35 58-29 6-58-1-74-18-4-4-6-8-7-13Z" fill="url(#treeHighlight)" />
          </g>
        </svg>

        <svg className="auth-ill-bird" viewBox="0 0 64 46" fill="none" aria-hidden="true">
          <path d="M2 38c12-11 20-21 31-34l9 27L2 38Z" fill="#D97706" />
          <path d="M33 4 62 20 42 31 33 4Z" fill="#A16207" />
          <path d="m33 8 9 23-25 2L33 8Z" fill="#FEF3C7" />
          <path d="M1 44c10-5 18-7 27-8" stroke="#A16207" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 5" />
        </svg>

        <div className="auth-ill-avatar auth-ill-avatar-1">SC</div>
        <div className="auth-ill-avatar auth-ill-avatar-2">MV</div>
        <div className="auth-ill-avatar auth-ill-avatar-3">JT</div>

        <div className="auth-ill-task-card">
          <div className="auth-ill-card-top">
            <div className="auth-ill-card-title-wrap"><CheckSquare size={15} /><span>Sprint</span></div>
            <span className="auth-ill-card-pill">Active</span>
          </div>
          <div className="auth-ill-card-rows">
            <div className="auth-ill-row auth-ill-row-pending">
              <span className="auth-ill-row-title">Design schema</span>
              <span className="auth-ill-status-badge badge-pending">Pending</span>
              <span className="auth-ill-status-badge badge-completed auth-ill-swap-badge"><i className="auth-ill-check" />Completed</span>
            </div>
            <div className="auth-ill-row auth-ill-row-completed">
              <span className="auth-ill-row-title">API auth</span>
              <span className="auth-ill-status-badge badge-completed">Completed</span>
            </div>
          </div>
          <div className="auth-ill-progress">
            <span className="auth-ill-progress-label">3 of 5 done</span>
            <span className="auth-ill-progress-track"><span /></span>
          </div>
        </div>

        <svg className="auth-ill-sparkle auth-ill-sparkle-1" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m12 1 2.7 8.3L23 12l-8.3 2.7L12 23l-2.7-8.3L1 12l8.3-2.7L12 1Z" fill="#FFFBEB" />
        </svg>
        <svg className="auth-ill-sparkle auth-ill-sparkle-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m12 1 2.7 8.3L23 12l-8.3 2.7L12 23l-2.7-8.3L1 12l8.3-2.7L12 1Z" fill="#FFFBEB" />
        </svg>
      </div>

      <div className="auth-ill-footer">
        <p>{supportingText}</p>
        <span>© 2026 TaskFlow</span>
      </div>
    </div>
  );
}
