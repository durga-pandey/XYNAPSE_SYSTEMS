import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  const userName = user?.name || "User";
  return (
    <>
      <SEO
        title={`${userName}'s Dashboard`}
        description="Manage your invoices, internships, and job-related activities"
        canonical="https://xynapsesystems.com/dashboard"
        image="https://xynapsesystems.com/images/Logo.png"
      />
      <section className="px-6 py-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Manage your invoices, internships, and job-related activities
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Invoices */}
          <Link
            to="/dashboard/my-invoices"
            className="group rounded-2xl border border-slate-200 dark:border-white/20 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl">🧾</span>
              <span className="text-xs rounded-full bg-green-100 text-green-700 px-3 py-1 font-medium">
                Active
              </span>
            </div>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
              Invoices
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              View payment history, invoice details, and transaction status.
            </p>

            <p className="mt-4 text-sm font-medium text-slate-900 dark:text-white group-hover:underline">
              View invoices →
            </p>
          </Link>

          {/* Internship */}
          <Link
            to="/dashboard/my-internships"
            className="group rounded-2xl border border-slate-200 dark:border-white/20 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl">🎓</span>
              <span className="text-xs rounded-full bg-blue-100 text-blue-700 px-3 py-1 font-medium">
                Active
              </span>
            </div>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
              Internship
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Track your internship applications, status, and certificates.
            </p>

            <p className="mt-4 text-sm font-medium text-slate-900 dark:text-white group-hover:underline">
              View internships →
            </p>
          </Link>

          {/* Job Mela (Future) */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-slate-800 p-6 opacity-70 cursor-not-allowed">
            <span className="text-4xl">💼</span>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
              Job Mela
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Apply for jobs, view interviews, and placement updates.
            </p>

            <span className="mt-4 inline-block text-xs font-medium text-slate-500">
              Coming Soon
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
