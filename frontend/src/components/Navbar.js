import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
            UB
          </div>
          <span className="font-bold text-lg text-brand-900">UniBridge</span>
        </Link>

        {user && (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/dashboard" className="hover:text-brand-700">
              Q&A Feed
            </Link>
            <Link to="/find-people" className="hover:text-brand-700">
              Find People
            </Link>
            <Link to="/ask" className="hover:text-brand-700">
              Ask a Question
            </Link>
          </div>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-sm font-semibold text-gray-800">{user.fullName}</span>
                <span className="text-xs text-gray-500">{user.universityName}</span>
              </div>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      {user && (
        <div className="md:hidden flex justify-around border-t border-gray-100 text-xs font-medium text-gray-600 py-2">
          <Link to="/dashboard">Q&A Feed</Link>
          <Link to="/find-people">Find People</Link>
          <Link to="/ask">Ask</Link>
        </div>
      )}
    </nav>
  );
}
