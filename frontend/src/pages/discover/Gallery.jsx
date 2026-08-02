import { useEffect, useState } from "react";
import galleryService from "../../services/galleryService";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";

const containerCard =
  "rounded-3xl border border-slate-00/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50 sm:p-6";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const resp = await galleryService.listGallery({ page, limit });
        if (!mounted) return;
        setItems(resp?.data || []);
        setTotal(resp?.totalItems || 0);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load gallery",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [page, limit]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <>
      <SEO
        title={`Gallery | Xynapse Systems`}
        description="Browse images and highlights from Xynapse Systems programs and events."
        canonical={`https://xynapsesystems.com/gallery`}
        image="https://xynapsesystems.com/images/Logo.png"
      />
      <main className="min-h-screen text-slate-900 dark:text-slate-50">
        <div className="mx-auto w-full space-y-6 px-4 py-10 sm:px-6 lg:px-10">
          <div className={containerCard}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Gallery
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Browse images and highlights from our programs.
                </p>
              </div>
              <Link to="/about" className="text-sm text-sky-600">
                About us
              </Link>
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: limit }).map((_, i) => (
                    <div
                      key={i}
                      className="h-44 rounded-md bg-slate-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="text-red-600">{error}</div>
              ) : items.length === 0 ? (
                <div className="text-slate-600">No items found.</div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {items.map((it) => (
                    <div
                      key={it._id}
                      className="rounded-md overflow-hidden border border-slate-200 bg-white"
                    >
                      <img
                        src={it.image?.secure_url}
                        alt={it.title}
                        className="h-44 w-full object-cover"
                      />
                      <div className="p-3">
                        {/* <h3 className="text-sm font-semibold text-slate-900">{it.title || "Untitled"}</h3> */}
                        <p className="text-xs text-slate-500 mt-1">
                          {it.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded px-3 py-1 border border-slate-200 text-sm disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded px-3 py-1 border border-slate-200 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
