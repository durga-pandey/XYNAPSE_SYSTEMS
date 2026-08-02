import React from "react";

const ActionButtons = ({ onView, onDownload, onDelete }) => {
  return (
    <div className="flex gap-2">
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={onView}
      >
        View
      </button>
      <button
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
        onClick={onDownload}
      >
        Download
      </button>
      <button
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default ActionButtons;
