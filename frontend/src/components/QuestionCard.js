import React from "react";
import { Link } from "react-router-dom";
import RoleBadge from "./RoleBadge";

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const intervals = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [label, secondsInUnit] of intervals) {
    const count = Math.floor(seconds / secondsInUnit);
    if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export default function QuestionCard({ question }) {
  return (
    <Link to={`/questions/${question._id}`} className="card hover:shadow-md transition-shadow block">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900 text-base leading-snug">{question.title}</h3>
        <RoleBadge role={question.askedByRole} />
      </div>

      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{question.description}</p>

      <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
        <span>
          Asked by <span className="text-gray-600 font-medium">{question.askedByName}</span> &middot;{" "}
          {timeAgo(question.createdAt)}
        </span>
        <span className="text-brand-600 font-medium">
          {question.answers?.length || 0} answer{question.answers?.length === 1 ? "" : "s"}
        </span>
      </div>
    </Link>
  );
}
