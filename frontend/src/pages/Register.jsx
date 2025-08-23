import { useState } from "react";
import { api } from "../api/client.js";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/auth/register", form);
      toast.success("Account created successfully");
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.error || "Register failed");
      toast.error(err?.response?.data?.error || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centerPage">
      <div className="card" style={{ width: 420 }}>
        <h2>Register</h2>
        <form onSubmit={onSubmit} className="form">
          <label>Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <div style={{ marginTop: 12, color: "#6b7280" }}>
          Have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
