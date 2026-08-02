import { useState, useEffect } from "react";
import InternshipList from "./InternshipList";
import InternshipHero from "./InternshipHero";
import axiosInstance from "../../utils/axiosInstance";
import Loader from "../../components/Loader";

const InternshipPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    courseId: "",
    year: "",
    status: "",
  });

  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPages: 1,
  });

  const [courses, setCourses] = useState([]);
  const [years] = useState(["1st", "2nd", "3rd", "4th"]);
  const [statuses] = useState([
    "pending",
    "reviewed",
    "selected",
    "offer_letter_issued",
    "internship_ongoing",
    "certificate_ready",
    "completed",
    "rejected",
  ]);

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get("/course/all-courses");
      setCourses(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  const fetchInternships = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page,
        limit: 10,
        sortBy: "createdAt",
        order: "desc",
      };
      const response = await axiosInstance.get("/internship/all", { params });
      setData(response.data.applications || []);
      setPageInfo({
        page: response.data.page || 1,
        totalPages: response.data.totalPages || 1,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch internship data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchInternships(1);
  }, [filters]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pageInfo.totalPages) return;
    fetchInternships(newPage);
  };

  // Function to refresh data after edits
  const refreshInternships = () => {
    fetchInternships(pageInfo.page);
  };

  const handleRefresh = () => {
    fetchInternships(pageInfo.page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= pageInfo.totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-1 rounded-md transition-all duration-200 ${
            i === pageInfo.page
              ? "bg-sky-600 dark:bg-sky-700 text-white shadow-md"
              : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-600"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          className={`px-3 py-1 rounded-md transition-all duration-200 ${
            pageInfo.page === 1
              ? "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 cursor-not-allowed"
              : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-600"
          }`}
          onClick={() => handlePageChange(pageInfo.page - 1)}
          disabled={pageInfo.page === 1}
        >
          Prev
        </button>
        {pages}
        <button
          className={`px-3 py-1 rounded-md transition-all duration-200 ${
            pageInfo.page === pageInfo.totalPages
              ? "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 cursor-not-allowed"
              : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-600"
          }`}
          onClick={() => handlePageChange(pageInfo.page + 1)}
          disabled={pageInfo.page === pageInfo.totalPages}
        >
          Next
        </button>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Internship Applications</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage and track internship applications
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
        </div>
      </div>

      {/* Hero Section with Filters */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
        <InternshipHero
          filters={filters}
          setFilters={setFilters}
          courses={courses} 
          years={years} 
          statuses={statuses} 
        />

        {/* Results Info */}
        <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Showing {data.length} of {pageInfo.totalPages * 10} applications
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
      ) : data.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
          <div className="text-center text-gray-500 dark:text-slate-400 mt-10 p-8 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold mt-4">No Applications Found</h3>
            <p className="mt-2">Try adjusting your filters to see more results</p>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
            <InternshipList 
              internships={data} 
              refreshInternships={refreshInternships} 
            />
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default InternshipPage;