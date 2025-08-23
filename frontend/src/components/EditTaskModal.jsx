import { useState } from "react";
export default function EditTaskModal({ open, task, onSave, onClose }) {
  if (!open || !task) return null;

  const [errors, setErrors] = useState({ title: "", description: "" });

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
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__card">
        <h3 className="modal__title">Edit task</h3>
        <form className="form" onSubmit={handleSubmit}>
          <input
            name="title"
            defaultValue={task.title}
            placeholder="Title"
            aria-invalid={!!errors.title}
            onInput={() =>
              errors.title && setErrors((p) => ({ ...p, title: "" }))
            }
            required
          />
          {errors.title && (
            <div style={{ color: "crimson", fontSize: 12 }}>{errors.title}</div>
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
          />
          {errors.description && (
            <div style={{ color: "crimson", fontSize: 12 }}>
              {errors.description}
            </div>
          )}
          <select name="category" defaultValue={task.category}>
            <option>Work</option>
            <option>Personal</option>
            <option>Urgent</option>
          </select>
          <div className="modal__actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
