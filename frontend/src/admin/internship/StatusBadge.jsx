const StatusBadge = ({ status }) => {
  const colors = {
    pending: "bg-yellow-200 text-yellow-800",
    reviewed: "bg-blue-200 text-blue-800",
    selected: "bg-green-200 text-green-800",
    rejected: "bg-red-200 text-red-800",
    "offer_letter_issued": "bg-purple-200 text-purple-800",
    "internship_ongoing": "bg-indigo-200 text-indigo-800",
    "certificate_ready": "bg-teal-200 text-teal-800",
    completed: "bg-gray-200 text-gray-800",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
      {status.replace("_", " ").toUpperCase()}
    </span>
  );
};

export default StatusBadge;
