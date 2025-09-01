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

  const categoryStyles = {
    Work: {
      border: "border-task-work/40",
      text: "text-task-work",
      bg: "bg-task-work/8",
      dot: "bg-task-work",
    },
    Personal: {
      border: "border-task-personal/40",
      text: "text-task-personal",
      bg: "bg-task-personal/8",
      dot: "bg-task-personal",
    },
    Urgent: {
      border: "border-task-urgent/40",
      text: "text-task-urgent",
      bg: "bg-task-urgent/8",
      dot: "bg-task-urgent",
    },
  };

  const categoryStyle = categoryStyles[task.category] || {
    border: "border-task-cyan/40",
    text: "text-task-cyan",
    bg: "bg-task-cyan/8",
    dot: "bg-task-cyan",
  };

  return (
    <li className="group relative list-none animate-fade-in-up">
      {/* Card container - no hover color changes */}
      <div className="relative overflow-hidden rounded-xl bg-transparent border-2 border-[#0ef] shadow-task hover:shadow-task-hover transition-shadow duration-300">
        {/* Signature cyan accent border */}
        <div className="absolute left-0 top-0 h-full w-1 bg-[#0ef]/60 rounded-l-xl" />

        {/* Main content */}
        <div className="relative p-3 space-y-3">
          {/* Header section */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-2">
              {/* Enhanced title with status indicator */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${categoryStyle.dot} ${
                    task.completed ? "animate-pulse" : ""
                  }`}
                />
                <h3
                  className={`font-semibold leading-tight transition-all duration-300 ${
                    task.completed
                      ? "line-through text-gray-300"
                      : "text-foreground"
                  }`}
                >
                  {task.title}
                </h3>
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-slate-200 text-sm leading-relaxed max-w-[40ch] break-words">
                  {task.description}
                </p>
              )}

              {/* Meta information */}
              <div className="flex items-center gap-2 flex-wrap mt-1">
                {/* User badge */}
                {task.user && (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs border border-slate-300/70 text-slate-200 rounded-full px-2 py-0.5 font-medium"
                    title={task.user.email}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0ef]" />
                    {task.user.name || task.user.email}
                  </span>
                )}

                {/* Category chip */}
                <span
                  className={`inline-flex items-center gap-1.5 text-xs rounded-full px-2 py-0.5 font-medium border ${categoryStyle.border} ${categoryStyle.text}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${categoryStyle.dot}`}
                  />
                  {task.category}
                </span>

                {/* Date */}
                {dateStr && (
                  <span className="text-xs text-rose-300">{dateStr}</span>
                )}
              </div>
            </div>

            {/* Enhanced action buttons */}
            {(!task.user || task.user.id === currentUserId) && (
              <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                {/* Edit button */}
                <div className="relative group/tooltip">
                  <button
                    onClick={() => onEdit(task)}
                    aria-label="Edit task"
                    className="flex items-center justify-center p-2 rounded-lg bg-transparent border-2 border-[#0ef] hover:shadow-glow transition-all duration-200 hover:scale-105 cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4 text-[#0ef]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  {/* Tooltip */}
                  <span className="pointer-events-none absolute -bottom-7 right-0 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-75">
                    Edit
                  </span>
                </div>

                {/* Delete button */}
                <div className="relative group/tooltip">
                  <button
                    onClick={() => onDelete(task)}
                    aria-label="Delete task"
                    className="flex items-center justify-center p-2 rounded-lg bg-transparent border-2 border-[#0ef] hover:shadow-glow transition-all duration-200 hover:scale-105 cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>

                  {/* Tooltip */}
                  <span className="pointer-events-none absolute -bottom-7 right-0 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-75">
                    Delete
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced completion toggle section */}
          <div className="flex items-center gap-2 mt-2">
            <label className="flex items-center gap-2 cursor-pointer group/checkbox select-none">
              {/* Custom animated checkbox */}
              <div className="relative">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task)}
                  className="sr-only"
                />
                <div
                  className={`relative w-4 h-4 rounded border-2 transition-all duration-300 ${
                    task.completed
                      ? "bg-[#0ef] border-[#0ef] shadow-glow"
                      : "border-slate-400 group-hover/checkbox:border-[#0ef]/60"
                  }`}
                >
                  {/* Checkmark */}
                  <svg
                    className={`absolute  inset-0 w-3 h-3 text-black transition-all duration-300 ${
                      task.completed ? "scale-100" : "scale-0"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Label */}
              <span
                className={`text-sm transition-colors duration-200 ${
                  task.completed ? "text-[#0ef] font-medium" : "text-slate-200"
                }`}
              >
                {task.completed ? "Completed" : "Mark complete"}
              </span>
            </label>
          </div>
        </div>
      </div>
    </li>
  );
}
