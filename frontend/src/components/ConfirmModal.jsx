export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__backdrop" onClick={onCancel} />
      <div className="modal__card">
        <h3 className="modal__title">{title}</h3>
        {description && <div className="modal__desc">{description}</div>}
        <div className="modal__actions">
          <button className="btn btn--secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn btn--danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
