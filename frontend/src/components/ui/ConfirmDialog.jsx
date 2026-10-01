import Modal from "./Modal";
import Button from "./Button";
import { AlertTriangle } from "lucide-react";

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}) {
  const footer = (
    <>
      <Button
        variant="secondary"
        onClick={onClose}
        disabled={isLoading}
      >
        {cancelText}
      </Button>
      <Button
        variant={variant}
        onClick={onConfirm}
        isLoading={isLoading}
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={footer}
    >
      <div style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
        {variant === "danger" && (
          <div
            style={{
              padding: "0.5rem",
              borderRadius: "50%",
              backgroundColor: "var(--danger-light)",
              color: "var(--danger)",
              display: "flex",
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <AlertTriangle size={20} />
          </div>
        )}
        <div style={{ flex: 1, paddingTop: "0.2rem" }}>
          {typeof message === "string" ? <p>{message}</p> : message}
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
