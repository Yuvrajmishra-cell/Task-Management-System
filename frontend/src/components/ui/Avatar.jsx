import React from "react";

const AVATAR_PALETTES = [
  { bg: "#FDF6D3", text: "#1F1B16", border: "#F8DC5C" }, // brand yellow tint
  { bg: "#dcfce7", text: "#15803d", border: "#bbf7d0" }, // emerald
  { bg: "#dbeafe", text: "#1d4ed8", border: "#bfdbfe" }, // blue
  { bg: "#fef3c7", text: "#b45309", border: "#fde68a" }, // amber
  { bg: "#ffedd5", text: "#c2410c", border: "#fed7aa" }, // orange/terracotta
  { bg: "#f3e8ff", text: "#7e22ce", border: "#e9d5ff" }, // purple
  { bg: "#e2dad1", text: "#1f1b16", border: "#d4cac0" }, // warm stone/cream
  { bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" }, // sky
];

/**
 * Deterministically generates an accessible color theme from an arbitrary string.
 */
function getDeterministicPalette(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}

/**
 * Computes up to 2 uppercase initials from a name string.
 */
function getInitials(str = "") {
  if (!str || typeof str !== "string") return "U";
  const parts = str.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) {
    return parts[0].substring(0, Math.min(2, parts[0].length)).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Reusable Avatar with initials, deterministic color palettes, and size variants.
 */
function Avatar({
  name = "User",
  size = "md",
  src = null,
  className = "",
  title,
  style = {},
  ...props
}) {
  const initials = getInitials(name);
  const palette = getDeterministicPalette(name);
  const sizeClass = `ui-avatar-${size}`;

  const customStyle = {
    backgroundColor: palette.bg,
    color: palette.text,
    borderColor: palette.border,
    ...style,
  };

  return (
    <div
      className={`ui-avatar ${sizeClass} ${className}`.trim()}
      style={customStyle}
      title={title || name}
      aria-label={name}
      role="img"
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

/**
 * AvatarStack component for overlapping group avatars with a max count indicator.
 */
function AvatarStack({
  users = [],
  names = [],
  max = 3,
  size = "sm",
  className = "",
  ...props
}) {
  const rawList = users.length > 0 ? users : names;
  const normalizedList = rawList.map((item) =>
    typeof item === "string" ? { name: item } : item
  );

  const visibleList = normalizedList.slice(0, max);
  const overflowCount = normalizedList.length - max;
  const sizeClass = `ui-avatar-${size}`;

  return (
    <div
      className={`ui-avatar-stack ${className}`.trim()}
      role="group"
      aria-label="User avatars"
      {...props}
    >
      {visibleList.map((user, idx) => (
        <Avatar
          key={user.id || user._id || `${user.name}-${idx}`}
          name={user.name || "User"}
          size={size}
          src={user.avatar || user.src}
        />
      ))}

      {overflowCount > 0 && (
        <div
          className={`ui-avatar-more ${sizeClass}`}
          title={`${overflowCount} more`}
          aria-label={`${overflowCount} more members`}
        >
          +{overflowCount}
        </div>
      )}
    </div>
  );
}

Avatar.Stack = AvatarStack;

export { Avatar, AvatarStack };
export default Avatar;
