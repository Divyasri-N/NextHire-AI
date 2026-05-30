import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@context/AuthContext";
import { useTheme } from "@context/ThemeContext";
import {
  LayoutDashboard, FileText, Target, MessageSquare,
  BarChart2, Sun, Moon, LogOut, User, Menu, X, UserCircle
} from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/dashboard",  label: "Dashboard", icon: LayoutDashboard },
  { to: "/builder",    label: "Builder",   icon: FileText },
  { to: "/ats",        label: "ATS Score", icon: Target },
  { to: "/interview",  label: "Interview", icon: MessageSquare },
  { to: "/analytics",  label: "Analytics", icon: BarChart2 },
  { to: "/profile",    label: "Profile",   icon: UserCircle },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Get initials for avatar fallback
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 32" fill="none">
    <path d="M12 11V9.5A1.5 1.5 0 0 1 13.5 8h5A1.5 1.5 0 0 1 20 9.5V11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <rect x="7" y="11" width="18" height="13" rx="2.5" fill="white"/>
    <line x1="7" y1="17" x2="25" y2="17" stroke="#2563eb" strokeWidth="1.8"/>
    <rect x="14" y="15.5" width="4" height="3" rx="1" fill="#2563eb"/>
  </svg>
</div>
          <span className="text-brand-600 dark:text-brand-400">NextHire</span>
          <span className="text-slate-800 dark:text-slate-100">AI</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${location.pathname === to
                  ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">

          {/* Dark / Light toggle */}
          <button onClick={toggle} className="btn-ghost p-2" aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Desktop: avatar + name → goes to /profile, plus logout */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-6 h-6 rounded-md object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold leading-none">{initials}</span>
                </div>
              )}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {user?.name?.split(" ")[0]}
              </span>
            </Link>

            <button
              onClick={() => { logout(); navigate("/"); }}
              className="btn-ghost p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Logout"
            >
              <LogOut size={17} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden btn-ghost p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pb-4"
        >
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium my-0.5
                ${location.pathname === to
                  ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600"
                  : "text-slate-600 dark:text-slate-400"}`}
            >
              <Icon size={17} />{label}
            </Link>
          ))}

          {/* Mobile profile link */}
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium my-0.5 text-slate-600 dark:text-slate-400"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-5 h-5 rounded-md object-cover" />
            ) : (
              <div className="w-5 h-5 rounded-md bg-brand-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold leading-none">{initials}</span>
              </div>
            )}
            {user?.name?.split(" ")[0]} (Profile)
          </Link>

          <button
            onClick={() => { logout(); navigate("/"); setOpen(false); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 w-full mt-2"
          >
            <LogOut size={17} /> Logout
          </button>
        </motion.div>
      )}
    </nav>
  );
}