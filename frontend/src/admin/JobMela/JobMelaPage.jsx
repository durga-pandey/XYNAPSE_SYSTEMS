import { useEffect, useState } from "react";
import jobMelaService from "../../services/jobMelaService";
import Modal from "./Modal";

const JobMelaPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [viewingJob, setViewingJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    jobLink: "",
    jobType: "Full-time",
    location: "",
    salary: "",
    description: "",
    applicationDeadline: "",
  });

  useEffect(() => {
    fetchJobPostings();
  }, [currentPage, statusFilter, jobTypeFilter]);

  const fetchJobPostings = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await jobMelaService.getAllJobFairs({
        page: currentPage,
        limit,
        status: statusFilter,
        jobType: jobTypeFilter,
        companyName: searchTerm,
      });
      setJobs(response.jobs || []);
      setTotalPages(Math.ceil(response.total / limit) || 1);
    } catch (err) {
      console.error("Failed to fetch job postings:", err);
      setError("Failed to load job postings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await jobMelaService.updateJobFairStatus(id, { status });
      // Refresh the list
      fetchJobPostings();
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update status. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await jobMelaService.deleteJobFair(id);
      // Refresh the list
      fetchJobPostings();
    } catch (err) {
      console.error("Failed to delete job posting:", err);
      setError("Failed to delete job posting. Please try again.");
    }
  };

  const viewJobDetails = (job) => {
    setViewingJob(job);
  };

  const closeViewModal = () => {
    setViewingJob(null);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || "",
      companyName: job.companyName || "",
      jobLink: job.jobLink || "",
      jobType: job.jobType || "Full-time",
      location: job.location || "",
      salary: job.salary?.$numberDecimal || job.salary || "",
      description: job.description || "",
      applicationDeadline: job.applicationDeadline
        ? new Date(job.applicationDeadline).toISOString().split("T")[0]
        : "",
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingJob(null);
    setFormData({
      title: "",
      companyName: "",
      jobLink: "",
      jobType: "Full-time",
      location: "",
      salary: "",
      description: "",
      applicationDeadline: "",
    });
    setShowModal(true);
  };

  const closeEditModal = () => {
    setShowModal(false);
    setEditingJob(null);
    setFormData({
      title: "",
      companyName: "",
      jobLink: "",
      jobType: "Full-time",
      location: "",
      salary: "",
      description: "",
      applicationDeadline: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
      };

      if (editingJob) {
        await jobMelaService.updateJobFair(editingJob._id, payload);
      } else {
        await jobMelaService.createJobFair(payload);
      }

      // Reset form and refresh list
      closeEditModal();
      fetchJobPostings();
    } catch (err) {
      console.error("Failed to save job posting:", err);
      setError("Failed to save job posting. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "closed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  const getJobTypeClass = (jobType) => {
    switch (jobType) {
      case "Full-time":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "Part-time":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200";
      case "Internship":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "Contract":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Job Postings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage job fair postings
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
          >
            Add Job Posting
          </button>
          <button
            onClick={fetchJobPostings}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <input
              type="text"
              placeholder="Search by company..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <select
              value={jobTypeFilter}
              onChange={(e) => {
                setJobTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400 self-center">
            Showing {jobs.length} of {totalPages * limit} postings
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Loading / Empty */}
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-2xl bg-slate-200/80 dark:bg-slate-800"
              ></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl bg-slate-100 p-8 text-center dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">
              {searchTerm || statusFilter || jobTypeFilter
                ? "No job postings match your filters."
                : "No job postings found."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table (1080px+) */}
            <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
              <table className="min-w-full divide-y divide-slate-200/80 dark:divide-slate-800/80">
                <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Job Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-slate-200/80 dark:bg-slate-950/50 dark:divide-slate-800/80">
                  {jobs.map((job) => (
                    <tr
                      key={job._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                        {job.title || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {job.companyName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {job.location || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getJobTypeClass(
                            job.jobType
                          )}`}
                        >
                          {job.jobType || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(job.applicationDeadline)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                            job.status
                          )}`}
                        >
                          {job.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2 flex-wrap">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          onClick={() => viewJobDetails(job)}
                        >
                          View
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => openEditModal(job)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          onClick={() =>
                            handleStatusUpdate(
                              job._id,
                              job.status === "active" ? "closed" : "active"
                            )
                          }
                        >
                          {job.status === "active" ? "Close" : "Activate"}
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleDelete(job._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (below 1080px) */}
            <div className="lg:hidden space-y-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {job.title || "N/A"}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {job.companyName || "N/A"}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {job.location || "N/A"} - {job.jobType || "N/A"}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Deadline: {formatDate(job.applicationDeadline)}
                      </div>
                    </div>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        job.status
                      )}`}
                    >
                      {job.status || "N/A"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      onClick={() => viewJobDetails(job)}
                    >
                      View
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      onClick={() => openEditModal(job)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      onClick={() =>
                        handleStatusUpdate(
                          job._id,
                          job.status === "active" ? "closed" : "active"
                        )
                      }
                    >
                      {job.status === "active" ? "Close" : "Activate"}
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => handleDelete(job._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal for adding/editing job postings */}
      <Modal
        isOpen={showModal}
        title={editingJob ? "Edit Job Posting" : "Add Job Posting"}
        onClose={closeEditModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Job Link
              </label>
              <input
                type="url"
                name="jobLink"
                value={formData.jobLink}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Job Type
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Salary (Optional)
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                step="0.01"
                min="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                rows="4"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={closeEditModal}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {editingJob ? "Update Job Posting" : "Add Job Posting"}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Job Details Modal */}
      {viewingJob && (
        <Modal
          isOpen={!!viewingJob}
          title={`Job Details: ${viewingJob.title}`}
          onClose={closeViewModal}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Job Title
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingJob.title || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Company Name
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingJob.companyName || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Location
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingJob.location || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Job Type
                </p>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getJobTypeClass(
                    viewingJob.jobType
                  )}`}
                >
                  {viewingJob.jobType || "N/A"}
                </span>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Application Deadline
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {formatDate(viewingJob.applicationDeadline)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Status
                </p>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                    viewingJob.status
                  )}`}
                >
                  {viewingJob.status || "N/A"}
                </span>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Salary
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingJob.salary
                    ? `₹${parseFloat(
                        viewingJob.salary.$numberDecimal || viewingJob.salary
                      ).toFixed(2)}`
                    : "Not specified"}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                Description
              </h3>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {viewingJob.description || "No description provided"}
              </p>
            </div>

            <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                Job Link
              </h3>
              <a
                href={viewingJob.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {viewingJob.jobLink || "No link provided"}
              </a>
            </div>

            <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                Update Status
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusUpdate(viewingJob._id, "active")}
                  className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-200 dark:hover:bg-green-900/50"
                >
                  Active
                </button>
                <button
                  onClick={() => handleStatusUpdate(viewingJob._id, "closed")}
                  className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50"
                >
                  Closed
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={closeViewModal}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default JobMelaPage;
