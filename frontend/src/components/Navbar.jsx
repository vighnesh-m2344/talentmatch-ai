import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Briefcase,
  Moon,
  Sun,
  FileText,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

export default function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setUser(jwtDecode(token));
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/jobs", label: "Jobs", icon: Briefcase },
    { path: "/applications", label: "Applications", icon: FileText },
    ...(user?.role === "ADMIN"
      ? [{ path: "/dashboard", label: "Admin", icon: LayoutDashboard }]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-100 dark:border-slate-800">
      
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* BRAND */}
        <div
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Briefcase size={16} />
          </div>

          <span className="font-semibold text-gray-900 dark:text-white tracking-tight">
            TalentMatch
          </span>
        </div>

        {/* NAV */}
        <div className="flex items-center gap-1">

          {navLinks.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-all ${
                isActive(path)
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}

          {/* THEME */}
          <button
            onClick={() => setDarkMode((p) => !p)}
            className="ml-1 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            {darkMode ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* USER */}
          {user && (
            <div className="relative ml-1" ref={dropdownRef}>

              <button
                onClick={() => setOpen((p) => !p)}
                className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center hover:bg-blue-700 transition"
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95">

                  {/* USER INFO */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email || user.role}
                    </p>
                  </div>

                  {/* MENU */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate("/applications");
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                      <FileText size={14} />
                      My Applications
                    </button>

                    <button
                      onClick={() => {
                        navigate("/jobs");
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                      <Briefcase size={14} />
                      Browse Jobs
                    </button>
                  </div>

                  {/* LOGOUT */}
                  <div className="border-t border-gray-100 dark:border-slate-800">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}