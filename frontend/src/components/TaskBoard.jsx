import TaskCard from "./TaskCard.jsx";

export default function TaskBoard({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  categories,
  currentUserId,
}) {
  const groups = categories.length
    ? categories
    : Array.from(new Set(tasks.map((t) => t.category)));

  return (
    <div className="board-scroll w-full overflow-x-auto overflow-y-hidden pb-2">
      <div className="flex items-start gap-3 w-max">
        {groups.map((cat) => (
          <div
            key={cat}
            className="shrink-0 min-w-[280px] sm:min-w-[320px] lg:min-w-[360px] rounded-2xl  border-2 border-white/10 bg-white/[0.03]  p-5 sm:p-6 shadow-[0_0_10px_#00eeff22] overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-100 tracking-wide">
                {cat}
              </span>
              <span className="text-xs text-slate-300">
                {tasks.filter((t) => t.category === cat).length}
              </span>
            </div>
            <div className="space-y-3 pr-1">
              {tasks
                .filter((t) => t.category === cat)
                .map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    currentUserId={currentUserId}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
