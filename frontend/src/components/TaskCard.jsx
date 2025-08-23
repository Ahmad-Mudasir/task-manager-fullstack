export default function TaskCard({
  task,
  onToggle,
  onDelete,
  onEdit,
  currentUserId,
}) {
  const dateStr = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString("en-GB")
    : "";
  return (
    <div className="card taskCard taskCard--accent">
      <div className="taskCard__header">
        <h3 className={`taskCard__title ${task.completed ? "strike" : ""}`}>
          {task.title}
        </h3>
        {(!task.user || task.user.id === currentUserId) && (
          <div className="taskCard__icons">
            <button
              className="iconBtn iconBtn--success"
              title="Edit"
              aria-label="Edit"
              onClick={() => onEdit(task)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
            </button>
            <button
              className="iconBtn iconBtn--danger"
              title="Delete"
              aria-label="Delete"
              onClick={() => onDelete(task)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {task.description && (
        <div className="taskCard__desc">{task.description}</div>
      )}
      <div className="taskCard__bottom">
        <label className="completeCtrl">
          <input
            type="checkbox"
            className="taskCheckbox"
            checked={task.completed}
            onChange={() => onToggle(task)}
          />
          <span>Mark complete</span>
        </label>
        <div className="taskCard__meta">
          {task.user && (
            <span className="chip" title={task.user.email}>
              {task.user.name || task.user.email}
            </span>
          )}
          <span className={`chip chip--${task.category.toLowerCase()}`}>
            {task.category}
          </span>
          {dateStr && (
            <span className="taskDate">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: 4 }}
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {dateStr}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
