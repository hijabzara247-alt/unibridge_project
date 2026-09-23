import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Landing() {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
        Built for students, by students
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-900 tracking-tight">
        UniBridge
      </h1>
      <p className="text-lg text-gray-500 mt-3 max-w-xl mx-auto">
        Your university, Your seniors, Your guide.
      </p>
      <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
        Connect with seniors and juniors from your own university. Ask questions, get real
        answers, and find people who've been exactly where you are — no noise from other
        institutions, ever.
      </p>

      <div className="flex items-center justify-center gap-4 mt-8">
        <Link to="/register" className="btn-primary">
          Join your university
        </Link>
        <Link to="/login" className="btn-secondary">
          Log in
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mt-16 text-left">
        <div className="card">
          <h3 className="font-semibold text-gray-900">University-Only Feed</h3>
          <p className="text-sm text-gray-500 mt-1">
            Every question and answer stays within your own institution.
          </p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900">Find Real Seniors</h3>
          <p className="text-sm text-gray-500 mt-1">
            Browse seniors and juniors by department and year of study.
          </p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900">Community Q&A</h3>
          <p className="text-sm text-gray-500 mt-1">
            Ask anything, get answers, and upvote the most helpful advice.
          </p>
        </div>
      </div>
    </div>
  );
}
