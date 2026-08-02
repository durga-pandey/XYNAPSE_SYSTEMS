import React from "react";
import CourseCard from "./CourseCard";

const CourseList = ({ courses, onDelete, onTogglePublish, onToggleFeature, onModerate, onRefresh }) => {
  if (!courses || courses.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
        <p className="text-gray-500 dark:text-slate-400">Try adjusting your filters or create a new course.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course._id}
          course={course}
          onDelete={onDelete}
          onTogglePublish={onTogglePublish}
          onToggleFeature={onToggleFeature}
          onModerate={onModerate}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
};

export default CourseList;