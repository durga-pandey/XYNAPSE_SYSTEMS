import React, { useState, useEffect } from "react";
import CourseList from "./CourseList";
import CourseFilters from "./CourseFilters";
import CreateCourseModal from "./CreateCourseModal";
import courseService from "../../services/courseService";
import Loader from "../../components/Loader";


const CourseAdminPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    isFree: "",
    isFeatured: "",
    visibility: "",
    moderationStatus: "",
    sortBy: "createdAt",
    order: "desc",
    minPrice: "",
    maxPrice: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });

  const fetchCourses = async (page = 1) => {
    try {
      setLoading(true);
      // Filter out empty values and convert appropriate values
      const params = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== "" && filters[key] !== undefined && filters[key] !== null) {
          params[key] = filters[key];
        }
      });
      
      // Add pagination params
      params.page = page;
      params.limit = pagination.limit;
      
      const response = await courseService.getAllCourses(params);
      setCourses(response.data || []);
      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        total: response.total,
        limit: response.limit,
      });
    } catch (err) {
      setError("Failed to fetch courses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(1);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchCourses(newPage);
  };

  const handleRefresh = () => {
    fetchCourses(pagination.page);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await courseService.deleteCourse(courseId);
        handleRefresh();
      } catch (err) {
        console.error("Failed to delete course:", err);
        alert("Failed to delete course");
      }
    }
  };

  const handleTogglePublish = async (courseId, currentStatus) => {
    try {
      await courseService.togglePublishCourse(courseId, !currentStatus);
      handleRefresh();
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
      alert("Failed to update publish status");
    }
  };

  const handleToggleFeature = async (courseId, currentStatus) => {
    try {
      await courseService.toggleFeatureCourse(courseId, !currentStatus);
      handleRefresh();
    } catch (err) {
      console.error("Failed to toggle feature status:", err);
      alert("Failed to update feature status");
    }
  };

  const handleModerate = async (courseId, action) => {
    try {
      await courseService.moderateCourse(courseId, action);
      handleRefresh();
    } catch (err) {
      console.error("Failed to moderate course:", err);
      alert("Failed to moderate course");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Course Management</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage and organize your courses
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
          >
            Create New Course
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
        <CourseFilters filters={filters} onFilterChange={handleFilterChange} />
        
        {/* Results Info */}
        <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Showing {courses.length} of {pagination.total} courses
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-200/80 dark:bg-slate-800"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
          <div className="text-center text-red-500 dark:text-red-400 mt-10 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
          <div className="text-center text-gray-500 dark:text-slate-400 mt-10 p-8 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold mt-4">No Courses Found</h3>
            <p className="mt-2">Try adjusting your filters to see more results</p>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
            <CourseList
              courses={courses}
              onDelete={handleDelete}
              onTogglePublish={handleTogglePublish}
              onToggleFeature={handleToggleFeature}
              onModerate={handleModerate}
              onRefresh={handleRefresh}
            />
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                Previous
              </button>
              
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showCreateModal && (
        <CreateCourseModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCourseCreated={handleRefresh}
        />
      )}
    </div>
  );
};

export default CourseAdminPage;