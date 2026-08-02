import { useEffect, useState } from "react";
import courseFormService from "../services/courseFormService";

const CourseForms = ({ userEmail }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseForms = async () => {
      if (!userEmail) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Since there's no direct endpoint to get forms by user email,
        // we'll need to get all forms and filter on the client side
        // In a production app, you'd want a proper backend endpoint for this
        const response = await courseFormService.searchCourseForms(userEmail);
        setForms(response.data || []);
      } catch (err) {
        console.error("Failed to fetch course forms:", err);
        setError("Failed to load your course forms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseForms();
  }, [userEmail]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 rounded-2xl bg-slate-200/80 dark:bg-slate-800"></div>
        <div className="h-16 rounded-2xl bg-slate-200/80 dark:bg-slate-800"></div>
        <div className="h-16 rounded-2xl bg-slate-200/80 dark:bg-slate-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-200">
        {error}
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-100 p-6 text-center dark:bg-slate-900">
        <p className="text-slate-500 dark:text-slate-400">
          You haven't submitted any course forms yet.
        </p>
      </div>
    );
  }

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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your Course Forms</h3>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
        <ul className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
          {forms.map((form) => (
            <li key={form._id} className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">
                    {form.courseId?.title || "Untitled Course"}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Submitted on {new Date(form.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                      form.status
                    )}`}
                  >
                    {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                  </span>
                </div>
              </div>
              {form.adminNotes && (
                <div className="mt-2 rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-900">
                  <p className="font-medium text-slate-700 dark:text-slate-300">Admin Notes:</p>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">{form.adminNotes}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseForms;