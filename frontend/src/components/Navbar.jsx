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
    <header className="nav">
      <div className="nav__inner">
        <div className="nav__left">
          <Link to="/" className="nav__brand">
            <span className="nav__brandIcon">✓</span>
            <span className="nav__brandText">TaskFlow</span>
          </Link>
          {user && (
            <nav className="nav__menu">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav__link ${isActive ? "nav__link--active" : ""}`
                }
              >
                Tasks
              </NavLink>
            </nav>
          )}
        </div>
        <div className="nav__right">
          {user ? (
            <>
              <div className="avatarMenu" ref={menuRef}>
                <button
                  className="nav__avatar avatarMenu__btn"
                  onClick={() => setOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={open}
                >
                  {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </button>
                {open && (
                  <div className="avatarMenu__menu" role="menu">
                    <div className="avatarMenu__item" role="menuitem">
                      <span
                        className={`dot ${online ? "dot--online" : "dot--offline"}`}
                      />
                      <span>{online ? "Online" : "Offline"}</span>
                    </div>
                    <div
                      className="avatarMenu__item"
                      role="menuitem"
                      style={{ opacity: 0.8 }}
                    >
                      {user.email}
                    </div>
                    <div className="avatarMenu__sep" />
                    <button
                      className="avatarMenu__item avatarMenu__logout"
                      role="menuitem"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="nav__links">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `nav__authLink ${isActive ? "nav__authLink--active" : ""}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `nav__authLink ${isActive ? "nav__authLink--active" : ""}`
                }
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
