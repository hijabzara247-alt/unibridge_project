import React from "react";
import RoleBadge from "./RoleBadge";

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function UserCard({ person }) {
  return (
    <div className="card flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold shrink-0">
        {initials(person.fullName)}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-gray-900 truncate">{person.fullName}</h4>
          <RoleBadge role={person.role} />
        </div>
        <p className="text-sm text-gray-500 truncate">{person.department}</p>
        <p className="text-xs text-gray-400">Year {person.yearOfStudy}</p>
      </div>
    </div>
  );
}
