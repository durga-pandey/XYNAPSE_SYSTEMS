import { useEffect, useState } from "react";
import courseFormService from "../../services/courseFormService";

const CourseFormAdminPage = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllCourseForms();
  }, []);

  const fetchAllCourseForms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await courseFormService.getAllCourseForms();
      setForms(response.data || []);
    } catch (err) {
      console.error("Failed to fetch course forms:", err);
      setError("Failed to load course forms. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (formId, status) => {
    try {
      await courseFormService.updateCourseForm(formId, { status });
      // Refresh the list
      fetchAllCourseForms();
    } catch (err) {
      console.error("Failed to update form status:", err);
      setError("Failed to update form status. Please try again.");
    }
  };

  const handleDelete = async (formId) => {
    try {
      await courseFormService.deleteCourseForm(formId);
      // Refresh the list
      fetchAllCourseForms();
    } catch (err) {
      console.error("Failed to delete form:", err);
      setError("Failed to delete form. Please try again.");
    }
  };

  const filteredForms = forms.filter(form => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      form.name.toLowerCase().includes(term) ||
      form.email.toLowerCase().includes(term) ||
      form.mobile.includes(term) ||
      form.city?.toLowerCase().includes(term) ||
      form.courseId?.title?.toLowerCase().includes(term)
    );
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200";
      case "verified":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "assigned":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200";
      case "ongoing":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "paid":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Course Forms</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage all course enrollment forms
          </p>
        </div>
        <button
          onClick={fetchAllCourseForms}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
            />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing {filteredForms.length} of {forms.length} forms
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-slate-200/80 dark:bg-slate-800"></div>
            ))}
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="rounded-2xl bg-slate-100 p-8 text-center dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">
              {searchTerm ? "No forms match your search." : "No course forms found."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
            <ul className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
              {filteredForms.map((form) => (
                <li key={form._id} className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white">
                            {form.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {form.email} • {form.mobile}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            Course: {form.courseId?.title || "Unknown"}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Submitted: {new Date(form.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {form.adminNotes && (
                        <div className="mt-2 rounded-xl bg-slate-100 p-2 text-sm dark:bg-slate-900">
                          <p className="font-medium text-slate-700 dark:text-slate-300">Notes:</p>
                          <p className="text-slate-600 dark:text-slate-400">{form.adminNotes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          form.status
                        )}`}
                      >
                        {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                      </span>
                      <div className="flex gap-2">
                        <select
                          value={form.status}
                          onChange={(e) => handleStatusUpdate(form._id, e.target.value)}
                          className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-xs focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        >
                          <option value="pending">Pending</option>
                          <option value="verified">Verified</option>
                          <option value="assigned">Assigned</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                          <option value="paid">Paid</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <button
                          onClick={() => handleDelete(form._id)}
                          className="rounded-2xl border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseFormAdminPage;