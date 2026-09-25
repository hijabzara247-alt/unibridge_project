import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
  Sticky top header for logged-in pages.

  IMPORTANT: this used to be `fixed` (taken out of page flow), which
  meant every page had to manually add matching padding-top so its
  content wouldn't render underneath it. `sticky` keeps it in the
  normal flow instead — it takes up real space, so whatever renders
  after it automatically starts in the right place. No pixel math,
  nothing to keep in sync, nothing can render "behind" it.

  This is rendered INSIDE the ml-[250px] content wrapper (see
  ProtectedPage in App.js), so it already sits to the right of the
  sidebar without needing its own left offset.
*/
export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Mobile Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white font-bold">
            UB
          </div>
          <span className="font-bold text-gray-900">UniBridge</span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden lg:flex items-center w-72">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search..."
              className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <button
            className="relative w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center"
            title="Notifications"
          >
            🔔
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">
              0
            </span>
          </button>

          {/* User */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="hidden md:block leading-tight">
              <p className="text-sm font-semibold text-gray-800">
                {user?.fullName || "Student"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role || "Student"}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="hidden md:block text-sm font-medium text-gray-600 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}