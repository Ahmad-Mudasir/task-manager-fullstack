import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocketStatus } from "../hooks/useSocketStatus.js";
import { socket } from "../services/socket.js";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const online = useSocketStatus(socket);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
    };
  }, [open]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50  bg-[#00010f]/70  border-b-1 border-[#0ef]  shadow-[0_8px_24px_rgba(0,238,255,.12)]">
      <div className="max-w-[1200px] mx-auto px-4 py-3  flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-transparent border-2 border-[#0ef] grid place-items-center font-extrabold text-emerald-600 shadow-[0_8px_24px_rgba(0,238,255,.12)]">
              ✓
            </span>
            <span className="font-extrabold">TaskFlow</span>
          </Link>
          {user && (
            <nav className="ml-4 flex items-center gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-xl text-sm ${isActive ? "border-2 border-[#0ef] text-slate-100" : "text-slate-100 hover:opacity-90"}`
                }
              >
                Tasks
              </NavLink>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="w-9 h-9 rounded-full border-2 border-emerald-400 bg-transparent text-emerald-400 font-bold grid place-items-center cursor-pointer"
              >
                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </button>
              {open && (
                <div
                  className="absolute right-0 top-12 min-w-[220px] rounded-xl bg-transparent border-2 border-[#0ef] shadow-[0_12px_30px_rgba(0,238,255,.18)] p-2 text-slate-100 backdrop-blur-xl"
                  role="menu"
                >
                  <div
                    className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/10"
                    role="menuitem"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${online ? "bg-emerald-500" : "bg-red-500"}`}
                    />
                    <span className="text-sm">
                      {online ? "Online" : "Offline"}
                    </span>
                  </div>
                  <div
                    className="px-2 py-2 text-sm text-slate-200"
                    role="menuitem"
                  >
                    {user.email}
                  </div>
                  <div className="h-px bg-slate-500/40 my-1" />
                  <button
                    onClick={logout}
                    className="w-full text-left px-2 py-2 rounded-lg text-red-400 hover:bg-white/10 cursor-pointer"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="text-slate-100 hover:opacity-90">
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white shadow hover:bg-emerald-600"
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
