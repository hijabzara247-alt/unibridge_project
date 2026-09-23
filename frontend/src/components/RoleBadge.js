import React from "react";

// Small colored pill used everywhere we show a user's role.
export default function RoleBadge({ role }) {
  const isSenior = role === "Senior";
  return (
    <span
      className={`badge-role ${
        isSenior ? "bg-brand-100 text-brand-800" : "bg-gray-100 text-gray-700"
      }`}
    >
      {role}
    </span>
  );
}
