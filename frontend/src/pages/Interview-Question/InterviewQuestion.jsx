import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";

const useDebounce = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const buildQuery = (params) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") q.set(k, String(v));
  });
  return q;
};

const InterviewQuestion = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [tags, setTags] = useState("");
  const [isFree, setIsFree] = useState("");
  const [isFeatured, setIsFeatured] = useState("");
  const [visibility, setVisibility] = useState("");

  const [page, setPage] = useState(1);
  const limit = 9;
  const sortBy = "createdAt";
  const order = "desc";
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setSearch(q.get("search") || "");
    setTags(q.get("tags") || "");
    setIsFree(q.get("isFree") || "");
    setIsFeatured(q.get("isFeatured") || "");
    setVisibility(q.get("visibility") || "");
    setPage(Number(q.get("page") || 1));
  }, []);

  useEffect(() => {
    const q = buildQuery({
      page,
      limit,
      sortBy,
      order,
      search: debouncedSearch || undefined,
      tags: tags || undefined,
      isFree: isFree !== "" ? isFree : undefined,
      isFeatured: isFeatured !== "" ? isFeatured : undefined,
      visibility: visibility || undefined,
    });
    const url = `${window.location.pathname}?${q.toString()}`;
    window.history.replaceState({}, "", url);
  }, [page, debouncedSearch, tags, isFree, isFeatured, visibility]);

  // fetch
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/course/all-courses", {
        params: {
          page,
          limit,
          sortBy,
          order,
          search: debouncedSearch || undefined,
          tags: tags || undefined,
          isFree: isFree !== "" ? isFree : undefined,
          isFeatured: isFeatured !== "" ? isFeatured : undefined,
          visibility: visibility || undefined,
        },
      });
      setCourses(data.data || []);
      setTotalPages(totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, tags, isFree, isFeatured, visibility]);

  const chips = useMemo(() => {
    const c = [];
    if (debouncedSearch)
      c.push({
        k: "search",
        label: `Search: ${debouncedSearch}`,
        clear: () => setSearch(""),
      });
    if (tags)
      c.push({ k: "tags", label: `Tags: ${tags}`, clear: () => setTags("") });
    if (isFree !== "")
      c.push({
        k: "isFree",
        label: isFree === "true" ? "Free" : "Paid",
        clear: () => setIsFree(""),
      });
    if (isFeatured !== "")
      c.push({
        k: "isFeatured",
        label: isFeatured === "true" ? "Featured" : "Not Featured",
        clear: () => setIsFeatured(""),
      });
    if (visibility)
      c.push({
        k: "visibility",
        label: `Visibility: ${visibility}`,
        clear: () => setVisibility(""),
      });
    return c;
  }, [debouncedSearch, tags, isFree, isFeatured, visibility]);

  return (
    <>
    <SEO
        title="Interview Questions | Xynapse Systems"
        description="Access a comprehensive list of interview questions curated by Xynapse Systems to prepare students and professionals for job interviews."
        canonical="https://xynapsesystems.com/resources/interview-questions"
        image="https://xynapsesystems.com/images/Logo.png"
      />
      <section className="px-6 py-14">
        {/* Heading */}
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900">
            Interview Questions
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Enterprise-grade interview question courses designed to build
            clarity, confidence, and deep understanding for real technical
            interviews.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-6">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search courses"
            className="md:col-span-2 outline-none rounded-xl border px-3 py-2 text-sm"
          />
          <input
            value={tags}
            onChange={(e) => {
              setPage(1);
              setTags(e.target.value);
            }}
            placeholder="Tags (comma separated)"
            className="rounded-xl outline-none border px-3 py-2 text-sm"
          />
          <select
            value={isFree}
            onChange={(e) => {
              setPage(1);
              setIsFree(e.target.value);
            }}
            className="rounded-xl outline-none border px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="true">Free</option>
            <option value="false">Paid</option>
          </select>
          <select
            value={isFeatured}
            onChange={(e) => {
              setPage(1);
              setIsFeatured(e.target.value);
            }}
            className="rounded-xl outline-none border px-3 py-2 text-sm"
          >
            <option value="">Featured?</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <select
            value={visibility}
            onChange={(e) => {
              setPage(1);
              setVisibility(e.target.value);
            }}
            className="rounded-xl outline-none border px-3 py-2 text-sm"
          >
            <option value="">Visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <button
            onClick={() => setPage(1)}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Apply
          </button>
        </div>

        {chips.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span
                key={c.k}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
              >
                {c.label}
                <button
                  onClick={() => {
                    setPage(1);
                    c.clear();
                  }}
                  className="text-slate-500"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border bg-white p-6"
              >
                <div className="mb-4 h-12 w-12 rounded-xl bg-slate-200" />
                <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
                <div className="mb-2 h-3 w-full rounded bg-slate-200" />
                <div className="mb-6 h-3 w-5/6 rounded bg-slate-200" />
                <div className="h-9 w-full rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course._id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                  <img
                    src={course.logo?.secure_url || "/logo.svg"}
                    alt={course.title}
                    className="h-8 w-8 rounded-full"
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {course.title}
                </h3>
                <p className="mb-6 text-sm text-slate-600 line-clamp-3">
                  {course.description}
                </p>
                <Link
                  to={`/interview-questions/${course.title}?courseId=${course._id}`}
                  state={{ courseId: course._id }}
                  className="mt-auto inline-flex justify-center rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-slate-900 hover:text-white"
                >
                  Read More
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </section>
    </>
  );
};

export default InterviewQuestion;
