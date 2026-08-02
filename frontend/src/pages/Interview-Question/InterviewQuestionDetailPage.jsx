import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import SEO from "../../components/SEO";

const QuestionSkeleton = () => (
  <div className="animate-pulse rounded-xl border p-5 space-y-3">
    <div className="h-4 w-3/4 bg-slate-200 rounded" />
    <div className="h-3 w-1/2 bg-slate-200 rounded" />
  </div>
);

const InterviewQuestionDetailPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const courseId = location.state?.courseId || searchParams.get("courseId");

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = 8;
  const [total, setTotal] = useState(0);

  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const fetchQuestions = async () => {
    if (!courseId) return;
    setLoading(true);

    try {
      const res = await axiosInstance.get("/interview/all", {
        params: {
          courseId,
          page,
          limit,
          search: debouncedSearch || undefined,
        },
      });

      setQuestions(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [courseId, page, debouncedSearch]);

  const totalPages = Math.ceil(total / limit);

  const formatAnswer = (answer) => {
    if (!answer) return [];

    if (Array.isArray(answer)) {
      return answer.map((a) => String(a).trim()).filter(Boolean);
    }

    if (typeof answer === "string") {
      return answer
        .split(/\n|•|-/)
        .map((a) => a.trim())
        .filter(Boolean);
    }

    return [];
  };

  const courseInfo = questions[0]?.courseId;

  return (
    <>
      <SEO
        title={`${courseInfo?.title || "Interview Questions"} | Xynapse Systems`}
        description={
          courseInfo?.description ||
          "Curated interview questions with clear explanations to build deep understanding and confidence."
        }
        canonical={`https://xynapsesystems.com/interview-questions/${courseInfo?._id || ""}`}
        image="https://xynapsesystems.com/images/Logo.png"
      />
      <section className="px-6 py-14 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">
            {courseInfo?.title || "Interview Questions"}
          </h1>
          <p className="mt-3 text-sm text-slate-600 max-w-3xl">
            {courseInfo?.description ||
              "Curated interview questions with clear explanations to build deep understanding and confidence."}
          </p>
        </div>

        <div className="mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search question or answer..."
            className="w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="space-y-4">
          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <QuestionSkeleton key={i} />
            ))}

          {!loading && questions.length === 0 && (
            <div className="rounded-xl border p-10 text-center text-slate-500">
              No interview questions found.
            </div>
          )}

          {!loading &&
            questions.map((q, index) => (
              <div key={q._id} className="rounded-xl border bg-white shadow-sm">
                {/* Question */}
                <button
                  onClick={() => setOpenId(openId === q._id ? null : q._id)}
                  className="flex w-full items-start justify-between gap-4 p-5 text-left"
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-400">
                      Q{(page - 1) * limit + index + 1}
                    </span>
                    <h3 className="mt-1 font-medium text-slate-900">
                      {q.question}
                    </h3>
                  </div>
                  <span className="text-xl">
                    {openId === q._id ? "−" : "+"}
                  </span>
                </button>

                {/* Answer */}
                {openId === q._id && (
                  <div className="border-t px-6 pb-6 pt-4">
                    <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                      {formatAnswer(q.answer).map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default InterviewQuestionDetailPage;
