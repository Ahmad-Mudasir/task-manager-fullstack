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

  if (loading) return <div className="container">Loading tasks...</div>;

  return (
    <div className="container">
      <h2>Tasks</h2>

      <form onSubmit={submitTask} className="form" style={{ marginBottom: 16 }}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        {errors.title && (
          <div style={{ color: "crimson", fontSize: 12 }}>{errors.title}</div>
        )}
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {errors.description && (
          <div style={{ color: "crimson", fontSize: 12 }}>
            {errors.description}
          </div>
        )}
        <select
          style={{ cursor: "pointer" }}
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option>Work</option>
          <option>Personal</option>
          <option>Urgent</option>
        </select>
        <button type="submit">{editingId ? "Save Changes" : "Add Task"}</button>
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
