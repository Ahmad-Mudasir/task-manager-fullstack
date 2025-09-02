import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { io } from "socket.io-client";
//import { useSocketStatus } from "../hooks/useSocketStatus.js";
import TaskBoard from "../components/TaskBoard.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import EditTaskModal from "../components/EditTaskModal.jsx";
import toast from "react-hot-toast";

export default function Tasks() {
  const { user } = useAuth();
  const displayName =
    user?.name || (user?.email ? user.email.split("@")[0] : "");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Work",
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({ title: "", description: "" });
  const [pendingDelete, setPendingDelete] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [adding, setAdding] = useState(false);

  const socketUrl =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";
  const socket = useMemo(
    () => io(socketUrl, { autoConnect: true }),
    [socketUrl]
  );
  //const online = useSocketStatus(socket);

  useEffect(() => {
    api
      .get("/api/tasks")
      .then((res) => setTasks(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    socket.on("taskCreated", (t) =>
      setTasks((prev) =>
        prev.some((x) => x.id === t.id) ? prev : [t, ...prev]
      )
    );
    socket.on("taskUpdated", (t) =>
      setTasks((prev) => prev.map((x) => (x.id === t.id ? t : x)))
    );
    socket.on("taskDeleted", ({ id }) =>
      setTasks((prev) => prev.filter((x) => x.id !== id))
    );
    return () => socket.disconnect();
  }, [socket]);

  // const logout = () => {
  //   localStorage.removeItem("token");
  //   setUser(null);
  //   window.location.href = "/login";
  // };

  const submitTask = async (e) => {
    e.preventDefault();
    const nextErrors = { title: "", description: "" };
    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.description.trim())
      nextErrors.description = "Description is required";
    setErrors(nextErrors);
    if (nextErrors.title || nextErrors.description) return;
    try {
      setAdding(true);
      const { data } = await api.post("/api/tasks", form);
      // Optimistically add; socket will reconcile
      setTasks((prev) =>
        prev.some((x) => x.id === data.id) ? prev : [data, ...prev]
      );
      toast.success("Task added successfully");
      setForm({ title: "", description: "", category: "Work" });
      setErrors({ title: "", description: "" });
    } finally {
      setAdding(false);
    }
  };

  const toggle = async (task) => {
    const { data } = await api.patch(`/api/tasks/${task.id}`, {
      completed: !task.completed,
    });
    setTasks((prev) => prev.map((x) => (x.id === data.id ? data : x)));
  };

  const remove = async (task) => {
    setPendingDelete(task);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await api.delete(`/api/tasks/${pendingDelete.id}`);
    setTasks((prev) => prev.filter((x) => x.id !== pendingDelete.id));
    setPendingDelete(null);
    toast.success("Task deleted successfully");
  };

  const startEdit = (task) => {
    setEditingTask(task);
  };

  if (loading)
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-6">Loading tasks...</div>
    );

  return (
    <div className="max-w-[1200px] mx-auto px-4   py-6">
      <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-2">
        Tasks
        <span className="text-xs rounded-full px-2 py-0.5 text-emerald-300 border border-emerald-400/60 bg-emerald-500/10">
          Realtime
        </span>
      </h2>

      {user && (
        <div className="mb-5">
          <div className="relative overflow-hidden rounded-2xl border-2 border-white/10 bg-white/[0.03] p-4 shadow-[0_0_4px_2px_rgba(0,238,255,0.18)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#0ef] grid place-items-center text-[#0ef] font-bold">
                {displayName?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="text-sm text-slate-300">Welcome back</div>
                <div className="text-lg font-extrabold tracking-wide">
                  {displayName}
                </div>
              </div>
              <div className="ml-auto text-xs text-slate-300">
                Have a productive day ✨
              </div>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={submitTask}
        className="grid md:grid-cols-3 gap-4 md:gap-3 mb-6 rounded-2xl border-2 border-white/10 bg-white/[0.03] p-4 md:p-3 shadow-[0_0_4px_2px_rgba(0,238,255,0.18)]"
      >
        <div className="col-span-1">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="h-12 w-full rounded-xl border-2 border-[#0ef]/40 bg-transparent px-4 outline-none text-slate-100 placeholder:text-slate-400/70 transition focus:border-[#0ef] focus:shadow-[0_0_12px_rgba(0,238,255,.35)]"
          />
          {errors.title && (
            <div className="text-red-300 text-xs mt-1">{errors.title}</div>
          )}
        </div>
        <div className="col-span-1">
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="h-12 w-full rounded-xl border-2 border-[#0ef]/40 bg-transparent px-4 outline-none text-slate-100 placeholder:text-slate-400/70 transition focus:border-[#0ef] focus:shadow-[0_0_12px_rgba(0,238,255,.35)]"
          />
          {errors.description && (
            <div className="text-red-300 text-xs mt-1">
              {errors.description}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 md:gap-2 md:flex md:items-center">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="h-12 w-full md:flex-1 rounded-xl border-2 border-[#0ef]/40 bg-transparent px-4 outline-none text-slate-100 transition focus:border-[#0ef] focus:shadow-[0_0_12px_rgba(0,238,255,.35)]"
          >
            <option>Work</option>
            <option>Personal</option>
            <option>Urgent</option>
          </select>
          {editingId ? (
            <button
              type="submit"
              className="h-11 w-full md:w-auto px-4 rounded-xl border-2 border-[#0ef] text-[#0ef] bg-transparent shadow-[0_0_0] cursor-pointer"
            >
              Save Changes
            </button>
          ) : adding ? (
            <button
              type="button"
              disabled
              className="h-11 w-full md:w-auto px-4 rounded-xl border-2 border-[#0ef] text-[#0ef] bg-transparent shadow-[0_0_0] cursor-not-allowed"
            >
              Adding...
            </button>
          ) : (
            <button
              type="submit"
              className="h-11 w-full md:w-auto px-4 rounded-xl border-2 border-[#0ef] text-[#0ef] bg-transparent shadow-[0_0_0] cursor-pointer transition-all duration-200 hover:bg-[#0ef]/10 hover:shadow-glow hover:scale-105"
            >
              Add
            </button>
          )}
        </div>
      </form>

      <TaskBoard
        tasks={tasks}
        onToggle={toggle}
        onDelete={remove}
        onEdit={startEdit}
        currentUserId={user?.id}
        categories={["Work", "Personal", "Urgent"]}
      />

      <ConfirmModal
        open={!!pendingDelete}
        title="Delete task?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <EditTaskModal
        open={!!editingTask}
        task={editingTask}
        onClose={() => {
          setEditingTask(null);
          setEditingId(null);
        }}
        onSave={async (payload) => {
          const { data } = await api.patch(
            `/api/tasks/${editingTask.id}`,
            payload
          );
          setTasks((prev) => prev.map((x) => (x.id === data.id ? data : x)));
          setEditingTask(null);
          setEditingId(null);
          toast.success("Task updated successfully");
        }}
      />
    </div>
  );
}
