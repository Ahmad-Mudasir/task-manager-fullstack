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
      const message = err?.response?.data?.error || "Register failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center p-8">
        <div className="w-full max-w-md rounded-2xl border-2 border-[#0ef] bg-white/10 backdrop-blur-xl shadow-[0_12px_30px_rgba(0,238,255,.18)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl border-2 border-[#0ef] grid place-items-center">
              <svg
                className="w-6 h-6 text-[#0ef]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 00-3-3.87M4 21v-2a4 4 0 013-3.87M7 7a4 4 0 118 0 4 4 0 01-8 0z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              Join TaskFlow
            </h3>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed mb-3">
            Create your account to collaborate and stay in sync in real time.
          </p>
          <ul className="text-slate-300 text-sm space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0ef]"></span>
              Secure authentication (JWT)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0ef]"></span>
              Real‑time updates with Socket.IO
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0ef]"></span>
              Trello‑style task board
            </li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-transparent border-2 border-[#0ef] shadow-[0_12px_30px_rgba(0,238,255,.18)] rounded-2xl p-6">
          <div className="text-center mb-4 text-slate-100">
            <div className="w-14 h-14 rounded-full bg-cyan-50 grid place-items-center border border-cyan-200 shadow-[0_8px_24px_rgba(0,238,255,.12)] mx-auto mb-3" />
            <h2 className="text-xl font-extrabold">Create account</h2>
            <p className="text-slate-300 text-sm">
              Please enter your details to sign up
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-sm text-slate-200">Name</label>
            <div className="flex items-center gap-2 rounded-xl border-2 border-[#0ef] bg-transparent px-3 h-12">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-400"
              />
            </div>

            <label className="block text-sm text-slate-200">
              Email address
            </label>
            <div className="flex items-center gap-2 rounded-xl border-2 border-[#0ef] bg-transparent px-3 h-12">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-400"
              />
            </div>

            <label className="block text-sm text-slate-200">Password</label>
            <div className="flex items-center gap-2 rounded-xl border-2 border-[#0ef] bg-transparent px-3 h-12">
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-400"
              />
            </div>

            {error && <div className="text-red-300 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg cursor-pointer"
            >
              {loading ? "Creating..." : "Sign up"}
            </button>
          </form>

          <div className="mt-3 text-white text-sm text-center">
            Have an account?{" "}
            <Link to="/login" className="text-white hover:text-[#0ef]">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
