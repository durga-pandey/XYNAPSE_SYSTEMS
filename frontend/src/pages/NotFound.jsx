import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white">404</h1>
      <p className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-300">
        Page not found
      </p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
        >
          Go back home
        </Link>
        <Link
          to="/about"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:text-slate-200"
        >
          Learn about us
        </Link>
      </div>
    </div>
  );
}
