import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import QuestionCard from "../components/QuestionCard";

export default function Dashboard() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // The backend automatically scopes this to the logged-in user's
        // university - no university filter needs to be sent from here.
        const res = await api.get("/questions");
        setQuestions(res.data.questions);
      } catch (err) {
        setError("Could not load the Q&A feed. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Q&A Community Feed</h1>
          <p className="text-sm text-gray-500">
            Questions from students at <span className="font-medium">{user?.universityName}</span>
          </p>
        </div>
        <Link to="/ask" className="btn-primary text-sm whitespace-nowrap">
          + Ask a Question
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && questions.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500">No questions yet at your university.</p>
          <Link to="/ask" className="text-brand-600 font-medium hover:underline text-sm mt-2 inline-block">
            Be the first to ask one
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q) => (
          <QuestionCard key={q._id} question={q} />
        ))}
      </div>
    </div>
  );
}
