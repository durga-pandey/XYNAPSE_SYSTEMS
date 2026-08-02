import { useEffect, useState } from "react";
import Select from "react-select";
import axiosInstance from "../../utils/axiosInstance";

const College = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    program: "all",
    search: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const programOptions = [
    { value: "all", label: "All Programs" },
    { value: "College Partners", label: "College Partners" },
    { value: "Classroom Trainings", label: "Classroom Trainings" },
    { value: "College Connect Program", label: "College Connect Program" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "New", label: "New" },
    { value: "Contacted", label: "Contacted" },
    { value: "Qualified", label: "Qualified" },
    { value: "Converted", label: "Converted" },
    { value: "Rejected", label: "Rejected" },
  ];

  // Fetch applications with filters
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (filters.status !== "all") query.append("status", filters.status);
      if (filters.program !== "all") query.append("program", filters.program);
      if (filters.search) query.append("search", filters.search);

      const { data } = await axiosInstance.get(
        `/collegeProgram/all-application?${query.toString()}`
      );
      if (data.success) setApplications(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  const updateStatus = async (id, newStatus) => {
    try {
      const { data } = await axiosInstance.patch(
        `/collegeProgram/status/${id}`,
        { status: newStatus }
      );
      if (data.success) {
        setShowSuccess(true);
        fetchApplications();
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const softDelete = async (id) => {
    try {
      const { data } = await axiosInstance.patch(
        `/collegeProgram/soft-delete/${id}`
      );
      if (data.success) fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const restore = async (id) => {
    try {
      const { data } = await axiosInstance.patch(
        `/collegeProgram/restore/${id}`
      );
      if (data.success) fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const hardDelete = async (id) => {
    try {
      const { data } = await axiosInstance.delete(
        `/collegeProgram/hard-delete/${id}`
      );
      if (data.success) fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-6">
      {/* Header */}
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
        College Applications
      </h2>

      {/* Success message */}
      {showSuccess && (
        <div className="p-3 bg-green-500 text-white rounded-lg shadow-md text-center font-medium transition">
          Action performed successfully!
        </div>
      )}

      {/* Filters row */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="w-48">
          <Select
            options={programOptions}
            value={programOptions.find((o) => o.value === filters.program)}
            onChange={(selected) =>
              setFilters((prev) => ({ ...prev, program: selected.value }))
            }
            placeholder="Program"
            className="text-sm"
          />
        </div>
        <div className="w-48">
          <Select
            options={statusOptions}
            value={statusOptions.find((o) => o.value === filters.status)}
            onChange={(selected) =>
              setFilters((prev) => ({ ...prev, status: selected.value }))
            }
            placeholder="Status"
            className="text-sm"
          />
        </div>
        <input
          type="text"
          placeholder="Search by college/contact"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
        />
      </div>

      {/* Applications */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No applications found.
        </p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-900 rounded-xl shadow-lg p-5 hover:shadow-2xl transition"
            >
              {/* Left: Info */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xl text-gray-900 dark:text-white truncate">
                    {app.collegeName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {app.contactPerson}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {app.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {app.phone}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                    Program: {app.programType}
                  </p>
                </div>
                {/* Status Badge */}
                <span
                  className={`inline-block mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                    app.status === "New"
                      ? "bg-yellow-100 text-yellow-800"
                      : app.status === "Contacted"
                      ? "bg-blue-100 text-blue-800"
                      : app.status === "Qualified"
                      ? "bg-indigo-100 text-indigo-800"
                      : app.status === "Converted"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-col md:flex-row gap-2 ml-4 mt-3 md:mt-0">
                <Select
                  options={statusOptions.filter((o) => o.value !== "all")}
                  onChange={(selected) => updateStatus(app._id, selected.value)}
                  placeholder="Change Status"
                  className="w-44 text-sm"
                />
                <button
                  className="px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-800 text-sm font-medium transition"
                  onClick={() => softDelete(app._id)}
                >
                  Soft Delete
                </button>
                <button
                  className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium transition"
                  onClick={() => restore(app._id)}
                >
                  Restore
                </button>
                <button
                  className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium transition"
                  onClick={() => hardDelete(app._id)}
                >
                  Hard Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default College;
