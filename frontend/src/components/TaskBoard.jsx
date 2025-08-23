import TaskCard from "./TaskCard.jsx";

export default function TaskBoard({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  categories,
}) {
  const groups = categories.length
    ? categories
    : Array.from(new Set(tasks.map((t) => t.category)));

  return (
    <div className="board">
      {groups.map((cat) => (
        <div key={cat} className="board__column">
          <div className="board__header">
            <span>{cat}</span>
            <span className="board__count">
              {tasks.filter((t) => t.category === cat).length}
            </span>
          </div>
          <div className="board__list">
            {tasks
              .filter((t) => t.category === cat)
              .map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
