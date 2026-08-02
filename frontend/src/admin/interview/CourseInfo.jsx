import React from "react";

const CourseInfo = ({ course }) => {
  if (!course) return null;

  return (
    <p className="text-sm text-slate-500 dark:text-slate-400">
      Course: {course.title || "Unknown"}
    </p>
  );
};

export default CourseInfo;