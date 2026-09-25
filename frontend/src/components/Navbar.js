import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Don't show dashboard navbar on public pages
  if (!user) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white font-bold">
              UB
            </div>

            <div>
              <div className="font-bold text-lg text-gray-900 leading-none">
                UniBridge
              </div>
              <div className="text-[10px] text-gray-500">
                Your university, Your seniors, Your guide.
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-700"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "▣",
    },
    {
      name: "Q&A Community",
      path: "/community",
      icon: "💬",
    },
    {
      name: "Find Seniors",
      path: "/find-people",
      icon: "👥",
    },
    {
      name: "Find Juniors",
      path: "/find-people",
      icon: "🎓",
    },
    {
      name: "My Profile",
      path: "/profile",
      icon: "👤",
    },
  ];

  return (
    <>
      {/* Top header now lives in Header.js, rendered inside the
          content wrapper in App.js — not here. This component only
          renders the sidebar (desktop) and bottom nav (mobile). */}

      {/* ================= SIDEBAR ================= */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[250px] bg-[#102A43] text-white z-[60] flex-col">
        
        {/* Logo */}
        <div className="h-16 px-6 flex items-center border-b border-white/10">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center font-bold">
              UB
            </div>

            <div>
              <div className="font-bold text-lg">UniBridge</div>
              <div className="text-[9px] text-blue-200">
                Your university, Your seniors, Your guide.
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <p className="px-3 mb-3 text-[10px] uppercase tracking-wider text-blue-200 font-semibold">
            Main Menu
          </p>

          {menuItems.map((item, index) => {
            const active =
              item.path === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="w-6 text-center">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* University */}
        <div className="px-4 mb-4">
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-[10px] uppercase tracking-wide text-blue-200 mb-1">
              Your University
            </p>

            <p className="text-sm font-semibold leading-5">
              {user?.universityName || "University"}
            </p>

            <p className="text-xs text-blue-200 mt-1">
              {user?.role || "Student"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-blue-100 hover:bg-red-500/20 hover:text-white transition"
          >
            <span>↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4">
          <Link
            to="/dashboard"
            className="py-3 text-center text-xs text-gray-600"
          >
            <div>▣</div>
            Dashboard
          </Link>

          <Link
            to="/community"
            className="py-3 text-center text-xs text-gray-600"
          >
            <div>💬</div>
            Community
          </Link>

          <Link
            to="/find-people"
            className="py-3 text-center text-xs text-gray-600"
          >
            <div>👥</div>
            People
          </Link>

          <Link
            to="/profile"
            className="py-3 text-center text-xs text-gray-600"
          >
            <div>👤</div>
            Profile
          </Link>
        </div>
      </div>
    </>
  );
}
