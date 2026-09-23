import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import RoleBadge from "../components/RoleBadge";

export default function QuestionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestion = async () => {
    try {
      const res = await api.get(`/questions/${id}`);
      setQuestion(res.data.question);
    } catch (err) {
      setError("Question not found, or it's not available at your university.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/questions/${id}/answers`, { text: answerText });
      setQuestion(res.data.question);
      setAnswerText("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not post your answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (answerId) => {
    try {
      const res = await api.patch(`/questions/${id}/answers/${answerId}/upvote`);
      setQuestion(res.data.question);
    } catch (err) {
      // Non-critical - fail silently with a console log so the UI stays smooth
      console.error("Upvote failed", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600">{error}</p>
        <Link to="/dashboard" className="text-brand-600 font-medium hover:underline text-sm mt-3 inline-block">
          Back to feed
        </Link>
      </div>
    );
  }

  // Sort answers by upvote count, descending, so the most helpful ones float up.
  const sortedAnswers = [...question.answers].sort(
    (a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0)
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/dashboard" className="text-sm text-brand-600 hover:underline">
        &larr; Back to feed
      </Link>

      <div className="card mt-4">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-lg font-bold text-gray-900">{question.title}</h1>
          <RoleBadge role={question.askedByRole} />
        </div>
        <p className="text-sm text-gray-600 mt-3 whitespace-pre-wrap">{question.description}</p>
        <p className="text-xs text-gray-400 mt-4">
          Asked by <span className="font-medium text-gray-600">{question.askedByName}</span>
        </p>
      </div>

      <h2 className="font-semibold text-gray-900 mt-8 mb-3">
        {sortedAnswers.length} Answer{sortedAnswers.length === 1 ? "" : "s"}
      </h2>

      <div className="space-y-3">
        {sortedAnswers.map((answer) => {
          const hasUpvoted = answer.upvotes?.some((uid) => uid === user.id || uid?._id === user.id);
          return (
            <div key={answer._id} className="card flex gap-4">
              <button
                onClick={() => handleUpvote(answer._id)}
                className={`flex flex-col items-center justify-center w-12 shrink-0 rounded-lg border py-2 transition-colors ${
                  hasUpvoted
                    ? "bg-brand-600 border-brand-600 text-white"
                    : "bg-white border-gray-200 text-gray-500 hover:border-brand-300"
                }`}
                title="Upvote this answer"
              >
                <span className="text-lg leading-none">&uarr;</span>
                <span className="text-xs font-semibold">{answer.upvotes?.length || 0}</span>
              </button>

              <div className="min-w-0">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{answer.text}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <span className="font-medium text-gray-600">{answer.postedByName}</span>
                  <RoleBadge role={answer.postedByRole} />
                </div>
              </div>
            </div>
          );
        })}

        {sortedAnswers.length === 0 && (
          <p className="text-sm text-gray-400 py-4">No answers yet. Be the first to help out.</p>
        )}
      </div>

      <form onSubmit={handleAnswerSubmit} className="card mt-6 space-y-3">
        <label className="block text-sm font-medium text-gray-700">Your Answer</label>
        <textarea
          rows={4}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          className="input-field resize-none"
          placeholder="Share your advice or experience..."
        />
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Posting..." : "Post Answer"}
        </button>
      </form>
    </div>
  );
}
