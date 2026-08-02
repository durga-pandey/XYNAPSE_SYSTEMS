import React, { useState } from "react";
import EditCourseModal from "./EditCourseModal";

const CourseCard = ({ course, onDelete, onTogglePublish, onToggleFeature, onModerate, onRefresh }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  const getVisibilityColor = (visibility) => {
    switch (visibility) {
      case "public":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "private":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80  hover:shadow-md transition-shadow duration-300">
        {course.thumbnail?.secure_url ? (
          <img
            src={course.thumbnail.secure_url}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="bg-gray-200 dark:bg-slate-800 h-48 flex items-center justify-center">
            <span className="text-gray-500 dark:text-slate-400">No Image</span>
          </div>
        )}

        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
              {course.title}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(course.moderationStatus)}`}>
              {course.moderationStatus}
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
            {course.shortDescription || "No description available"}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs px-2 py-1 rounded-full ${getVisibilityColor(course.visibility)}`}>
              {course.visibility}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
              {course.isFeatured ? "Featured" : "Not Featured"}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200">
              {course.isFree ? "Free" : `₹${course.price}`}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 mb-4">
            <span>Category: {course.category}</span>
            <span>{new Date(course.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Dropdown container */}
          <div className="dropdown-container relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              Actions
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-48 rounded-2xl bg-white dark:bg-slate-800 shadow-lg z-50 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
                <div className="py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEditModal(true);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-t-2xl"
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePublish(course._id, course.visibility === "public");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {course.visibility === "public" ? "Unpublish" : "Publish"}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFeature(course._id, course.isFeatured);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {course.isFeatured ? "Unfeature" : "Feature"}
                  </button>
                  
                  {course.moderationStatus !== "approved" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onModerate(course._id, "approve");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                      Approve
                    </button>
                  )}
                  
                  {course.moderationStatus !== "rejected" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onModerate(course._id, "reject");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Reject
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(course._id);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-b-2xl"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditCourseModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          course={course}
          onCourseUpdated={onRefresh}
        />
      )}
    </>
  );
};

export default CourseCard;