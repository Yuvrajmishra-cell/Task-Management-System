import React, { useState, useRef, useEffect, useCallback } from "react";
import { MoreVertical } from "lucide-react";
import IconButton from "./IconButton";

/**
 * Keyboard-accessible Dropdown / Action Menu with kebab trigger,
 * focus trapping, Arrow navigation, and Escape-to-close behavior.
 */
function Dropdown({
  trigger = null,
  align = "right", // right | left
  children,
  className = "",
  label = "More actions",
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Keyboard navigation inside dropdown menu
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      closeDropdown();
      return;
    }

    if (e.key === "Tab") {
      setIsOpen(false);
      return;
    }

    const items = menuRef.current
      ? Array.from(
          menuRef.current.querySelectorAll(
            'button:not([disabled]), a:not([disabled]), [role="menuitem"]:not([disabled])'
          )
        )
      : [];

    if (!items.length) return;

    const currentIndex = items.indexOf(document.activeElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      items[nextIndex]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      items[prevIndex]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  };

  // Focus the first item when menu opens
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstItem = menuRef.current.querySelector(
        'button:not([disabled]), a:not([disabled]), [role="menuitem"]:not([disabled])'
      );
      firstItem?.focus();
    }
  }, [isOpen]);

  const defaultTrigger = (
    <IconButton
      ref={triggerRef}
      icon={<MoreVertical size={16} />}
      label={label}
      onClick={toggleDropdown}
      aria-haspopup="true"
      aria-expanded={isOpen}
    />
  );

  return (
    <div
      ref={containerRef}
      className={`ui-dropdown ${className}`.trim()}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {trigger
        ? React.cloneElement(trigger, {
            ref: triggerRef,
            onClick: (e) => {
              trigger.props.onClick?.(e);
              toggleDropdown();
            },
            "aria-haspopup": "true",
            "aria-expanded": isOpen,
          })
        : defaultTrigger}

      {isOpen && (
        <div
          ref={menuRef}
          className={`ui-dropdown-menu ui-dropdown-menu-${align}`}
          role="menu"
          aria-label={label}
        >
          {React.Children.map(children, (child) => {
            if (!child) return null;
            if (child.type === DropdownItem) {
              return React.cloneElement(child, {
                onClose: closeDropdown,
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
}

function DropdownItem({
  children,
  icon = null,
  onClick,
  danger = false,
  disabled = false,
  className = "",
  onClose,
  ...props
}) {
  const handleClick = (e) => {
    if (disabled) return;
    onClick?.(e);
    onClose?.();
  };

  const dangerClass = danger ? "ui-dropdown-item-danger" : "";

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      className={`ui-dropdown-item ${dangerClass} ${className}`.trim()}
      onClick={handleClick}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {icon && <span className="ui-dropdown-item-icon">{icon}</span>}
      <span className="ui-dropdown-item-label">{children}</span>
    </button>
  );
}

function DropdownDivider({ className = "" }) {
  return <div className={`ui-dropdown-divider ${className}`.trim()} role="separator" />;
}

Dropdown.Item = DropdownItem;
Dropdown.Divider = DropdownDivider;

export { Dropdown, DropdownItem, DropdownDivider };
export default Dropdown;
