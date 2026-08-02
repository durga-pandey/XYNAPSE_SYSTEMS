import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { AnimatedReveal } from "./landing/Landing";
import SEO from "../components/SEO";

const gradientAnimationStyle = `
@keyframes gradient-x {
  0%,100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}
`;

const AllCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    tags: [],
    isFree: "",
    isFeatured: "",
    visibility: "",
    moderationStatus: "",
    sortBy: "createdAt",
    order: "desc",
    page: 1,
    limit: 12,
  });

  const [totalPages, setTotalPages] = useState(1);
  const [allTags] = useState(["React", "JavaScript", "Python", "UI/UX"]);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const params = {
        ...filters,
        tags: filters.tags.length ? filters.tags.join(",") : undefined,
        isFree: filters.isFree || undefined,
        isFeatured: filters.isFeatured || undefined,
      };

      const res = await axiosInstance.get("/course/all-courses", { params });
      setCourses(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const toggleTag = (tag) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  return (
    <>
    <SEO
        title="All Courses | Xynapse Systems"
        description="Explore all courses offered by Xynapse Systems, including software training, IT solutions, and career-focused programs for students and working professionals."
        canonical="https://xynapsesystems.com/courses"
        image="https://xynapsesystems.com/images/Logo.png"
      />
      <style>{gradientAnimationStyle}</style>

      <div className="p-6 sm:p-10 space-y-8">
        <AnimatedReveal>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            All Courses
          </h1>
        </AnimatedReveal>

        {/* FILTER PANEL */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            placeholder="Search courses..."
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value, page: 1 })
            }
            className="rounded-xl border px-4 py-2"
          />

          <select
            value={filters.isFree}
            onChange={(e) =>
              setFilters({ ...filters, isFree: e.target.value, page: 1 })
            }
            className="rounded-xl border px-4 py-2"
          >
            <option value="">All</option>
            <option value="true">Free</option>
            <option value="false">Paid</option>
          </select>

          <select
            value={filters.isFeatured}
            onChange={(e) =>
              setFilters({ ...filters, isFeatured: e.target.value, page: 1 })
            }
            className="rounded-xl border px-4 py-2"
          >
            <option value="">All</option>
            <option value="true">Featured</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({ ...filters, sortBy: e.target.value, page: 1 })
            }
            className="rounded-xl border px-4 py-2"
          >
            <option value="createdAt">Newest</option>
            <option value="title">Title</option>
            <option value="publishedAt">Published</option>
          </select>
        </div>

        {/* TAG FILTER */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                filters.tags.includes(tag)
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 dark:bg-slate-800"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* COURSES GRID */}
        {loading ? (
          <p className="text-sm text-slate-500">Loading courses...</p>
        ) : courses.length ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {courses.map((c) => (
              <AnimatedReveal key={c._id} delay={50}>
                <Link
                  to={`/course/${c._id}`}
                  className="relative group block rounded-2xl overflow-hidden p-0.5"
                >
                  {/* Animated Gradient Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500 via-slate-700 to-gray-400 dark:from-gray-400 dark:via-slate-500 dark:to-gray-600 rounded-2xl blur opacity-50 transition-opacity duration-500 group-hover:opacity-100 animate-gradient-x" />

                  {/* Card */}
                  <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl h-[420px] flex flex-col">
                    <div className="h-40 w-full overflow-hidden rounded-md bg-slate-100">
                      <img
                        src={
                          c.thumbnail?.secure_url ||
                          "https://via.placeholder.com/400x300"
                        }
                        alt={c.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-3 flex flex-col gap-2 flex-1">
                      <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                        {c.title}
                      </p>

                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-4 flex-1">
                        {c.description || "No description available."}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {c.tags?.slice(0, 5).map((tag, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 dark:bg-slate-700 text-xs font-medium px-2 py-1 rounded-full text-slate-800 dark:text-slate-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedReveal>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No courses found</p>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-4 pt-4">
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {filters.page} of {totalPages}
          </span>

          <button
            disabled={filters.page === totalPages}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default AllCoursesPage;
