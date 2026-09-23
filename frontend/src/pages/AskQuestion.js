import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AskQuestion() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/questions", form);
      navigate(`/questions/${res.data.question._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not post your question. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Ask a Question</h1>
      <p className="text-sm text-gray-500 mb-6">
        Your question will be visible to seniors and juniors at your university only.
      </p>

      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            required
            maxLength={200}
            value={form.title}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g. How do I choose an elective for 3rd semester?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            required
            maxLength={5000}
            rows={6}
            value={form.description}
            onChange={handleChange}
            className="input-field resize-none"
            placeholder="Add any details that will help seniors give you a useful answer..."
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Posting..." : "Post Question"}
        </button>
      </form>
    </div>
  );
}
