import { useState } from "react";
export default function EditTaskModal({ open, task, onSave, onClose }) {
  const [errors, setErrors] = useState({ title: "", description: "" });

  if (!open || !task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const category = String(formData.get("category") || "Work");
    const nextErrors = { title: "", description: "" };
    if (!title) nextErrors.title = "Title is required";
    if (!description) nextErrors.description = "Description is required";
    setErrors(nextErrors);
    if (nextErrors.title || nextErrors.description) return;
    onSave({ title, description, category });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-transparent border-2 border-[#0ef] shadow-[0_12px_30px_rgba(0,238,255,.18)] p-4 text-slate-100">
        <h3 className="text-lg font-bold">Edit task</h3>
        <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
          <input
            name="title"
            defaultValue={task.title}
            placeholder="Title"
            aria-invalid={!!errors.title}
            onInput={() =>
              errors.title && setErrors((p) => ({ ...p, title: "" }))
            }
            required
            className="h-11 w-full rounded-xl border border-cyan-300/60 bg-transparent px-3 outline-none"
          />
          {errors.title && (
            <div className="text-red-600 text-xs">{errors.title}</div>
          )}
          <input
            name="description"
            defaultValue={task.description || ""}
            placeholder="Description"
            aria-invalid={!!errors.description}
            onInput={() =>
              errors.description &&
              setErrors((p) => ({ ...p, description: "" }))
            }
            required
            className="h-11 w-full rounded-xl border border-cyan-300/60 bg-transparent px-3 outline-none"
          />
          {errors.description && (
            <div className="text-red-600 text-xs">{errors.description}</div>
          )}
          <select
            name="category"
            defaultValue={task.category}
            className="h-11 w-full rounded-xl border border-cyan-300/60 bg-transparent px-3 outline-none"
          >
            <option>Work</option>
            <option>Personal</option>
            <option>Urgent</option>
          </select>
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-xl border cursor-pointer border-slate-300 hover:bg-white/10 hover:shadow-[0_8px_20px_rgba(148,163,184,.25)]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl border-2 cursor-pointer border-[#0ef] hover:bg-white/10 hover:shadow-[0_8px_20px_rgba(16,185,129,.35)]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
