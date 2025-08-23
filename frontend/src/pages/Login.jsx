import { useState } from "react";
import { api } from "../api/client.js";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/api/auth/login", form);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/");
      toast.success("Logged in successfully");
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
      toast.error(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centerPage">
      <div className="card" style={{ width: 420 }}>
        <h2>Login</h2>
        <form onSubmit={onSubmit} className="form">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
          {error && (
            <div style={{ color: "crimson", marginTop: 4 }}>{error}</div>
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div style={{ marginTop: 12, color: "#6b7280" }}>
          No account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
