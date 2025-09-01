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
    const { data } = await api.post("/api/tasks", form);
    // Optimistically add; socket will reconcile
    setTasks((prev) =>
      prev.some((x) => x.id === data.id) ? prev : [data, ...prev]
    );
    toast.success("Task added successfully");
    setForm({ title: "", description: "", category: "Work" });
    setErrors({ title: "", description: "" });
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

      <form
        onSubmit={submitTask}
        className="grid md:grid-cols-3 gap-3 mb-6 rounded-2xl bg-transparent border-2 border-[#0ef] p-3 shadow-[0_12px_30px_rgba(0,238,255,.18)]"
      >
        <div className="col-span-1">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="h-11 w-full rounded-xl border border-cyan-300/60 bg-transparent px-3 outline-none text-slate-100 placeholder:text-slate-400"
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
            className="h-11 w-full rounded-xl border border-cyan-300/60 bg-transparent px-3 outline-none text-slate-100 placeholder:text-slate-400"
          />
          {errors.description && (
            <div className="text-red-300 text-xs mt-1">
              {errors.description}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-2 md:flex">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="h-11 w-full md:flex-1 rounded-xl border border-cyan-300/60 bg-transparent px-3 outline-none text-slate-100"
          >
            <option>Work</option>
            <option>Personal</option>
            <option>Urgent</option>
          </select>
          <button
            type="submit"
            className="h-11 w-full md:w-auto px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg cursor-pointer"
          >
            {editingId ? "Save Changes" : "Add"}
          </button>
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
