import React from "react";

const StatusBadge = ({ isActive }) => {
  const statusClass = isActive 
    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}>
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};

export default StatusBadge;