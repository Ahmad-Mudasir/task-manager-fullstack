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
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-transparent border-2 border-[#0ef] shadow-[0_12px_30px_rgba(0,238,255,.18)] p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        {description && (
          <div className="text-slate-200 mt-1">{description}</div>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-xl border border-slate-300 cursor-pointer hover:bg-white/10 hover:shadow-[0_8px_20px_rgba(148,163,184,.25)]"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 rounded-xl border-2 border-[#0ef] text-red-600 cursor-pointer hover:bg-white/10 hover:shadow-[0_8px_20px_rgba(239,68,68,.35)]"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
