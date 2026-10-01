import { useEffect, useRef } from "react";
import { X } from "lucide-react";

function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  size = "md",
  closeOnOverlayClick = true,
  className = "",
}) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore focus on close
    previousFocusRef.current = document.activeElement;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the modal or first focusable element
    const focusableElements = modalRef.current?.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      modalRef.current?.focus();
    }

    const handleKeyDown = (event) => {
      // Close on Escape key
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      // Focus trap on Tab key
      if (event.key === "Tab") {
        if (!modalRef.current) return;
        const focusables = Array.from(
          modalRef.current.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );

        if (focusables.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const titleId = title ? "ui-modal-title" : undefined;

  return (
    <div
      className="ui-modal-overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`ui-modal-container size-${size} ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="ui-modal-header">
          {title ? (
            <h2 id={titleId} className="ui-modal-title">
              {title}
            </h2>
          ) : (
            <div />
          )}
          <button
            type="button"
            className="ui-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="ui-modal-body">{children}</div>

        {footer && <div className="ui-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
