import React from "react";

const ActionButtons = ({ onEdit, onToggleStatus, onDelete, isActive }) => {
  return (
    <div className="flex gap-2">
      {onEdit && (
        <button
          onClick={onEdit}
          className="rounded-2xl border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/30 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/50"
        >
          Edit
        </button>
      )}
      {onToggleStatus && (
        <button
          onClick={onToggleStatus}
          className="rounded-2xl border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/30 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/50"
        >
          {isActive ? "Deactivate" : "Activate"}
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="rounded-2xl border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default ActionButtons;