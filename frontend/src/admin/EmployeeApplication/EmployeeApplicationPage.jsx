import { useEffect, useState } from "react";
import employeeApplicationService from "../../services/employeeApplicationService";
import Modal from "./Modal";

const EmployeeApplicationPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [viewingApplication, setViewingApplication] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchEmployeeApplications();
  }, [currentPage, statusFilter, departmentFilter]);

  const fetchEmployeeApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const response =
        await employeeApplicationService.getAllEmployeeApplications({
          page: currentPage,
          limit,
          status: statusFilter,
          department: departmentFilter,
          search: searchTerm,
        });
      setApplications(response.applications || []);
      setTotalPages(Math.ceil(response.total / limit) || 1);
    } catch (err) {
      console.error("Failed to fetch employee applications:", err);
      setError("Failed to load employee applications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await employeeApplicationService.updateEmployeeApplicationStatus(id, {
        status,
      });
      // Refresh the list
      fetchEmployeeApplications();
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update status. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await employeeApplicationService.deleteEmployeeApplication(id);
      // Refresh the list
      fetchEmployeeApplications();
    } catch (err) {
      console.error("Failed to delete application:", err);
      setError("Failed to delete application. Please try again.");
    }
  };

  const viewApplicationDetails = (application) => {
    setViewingApplication(application);
  };

  const closeViewModal = () => {
    setViewingApplication(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "reviewed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "shortlisted":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200";
      case "selected":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Employee Applications
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage employee job applications
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchEmployeeApplications}
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
              placeholder="Search applicants..."
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
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              placeholder="Filter by department..."
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
            />
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400 self-center">
            Showing {applications.length} of {totalPages * limit} applications
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
        ) : applications.length === 0 ? (
          <div className="rounded-2xl bg-slate-100 p-8 text-center dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">
              {searchTerm || statusFilter || departmentFilter
                ? "No applications match your filters."
                : "No employee applications found."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table (1080px and above) */}
            <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
              <table className="min-w-full divide-y divide-slate-200/80 dark:divide-slate-800/80">
                <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Applied Date
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
                  {applications.map((application) => (
                    <tr
                      key={application._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                        <div>{application.name}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-xs">
                          {application.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {application.positionApplied || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {application.department || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(application.appliedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                            application.status
                          )}`}
                        >
                          {application.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2 flex-wrap">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          onClick={() => viewApplicationDetails(application)}
                        >
                          View
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() =>
                            handleStatusUpdate(application._id, "reviewed")
                          }
                        >
                          Review
                        </button>
                        <button
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          onClick={() =>
                            handleStatusUpdate(application._id, "shortlisted")
                          }
                        >
                          Shortlist
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleDelete(application._id)}
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
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {application.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {application.email}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {application.positionApplied || "N/A"} -{" "}
                        {application.department || "N/A"}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Applied: {formatDate(application.appliedDate)}
                      </div>
                    </div>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        application.status
                      )}`}
                    >
                      {application.status || "N/A"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      onClick={() => viewApplicationDetails(application)}
                    >
                      View
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      onClick={() =>
                        handleStatusUpdate(application._id, "reviewed")
                      }
                    >
                      Review
                    </button>
                    <button
                      className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                      onClick={() =>
                        handleStatusUpdate(application._id, "shortlisted")
                      }
                    >
                      Shortlist
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => handleDelete(application._id)}
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

      {/* View Application Details Modal */}
      {viewingApplication && (
        <Modal
          isOpen={!!viewingApplication}
          title={`Application Details: ${viewingApplication.name}`}
          onClose={closeViewModal}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Full Name
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingApplication.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Email
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingApplication.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Phone
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingApplication.phone || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Gender
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingApplication.gender || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Date of Birth
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {formatDate(viewingApplication.dob)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Position Applied
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingApplication.positionApplied || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Department
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingApplication.department || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Application Source
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingApplication.applicationSource || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Applied Date
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {formatDate(viewingApplication.appliedDate)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Status
                </p>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                    viewingApplication.status
                  )}`}
                >
                  {viewingApplication.status || "N/A"}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                Address
              </h3>
              <div className="space-y-2">
                {viewingApplication.address ? (
                  <>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {viewingApplication.address.line1 || ""}{" "}
                      {viewingApplication.address.line2 || ""}
                    </p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {viewingApplication.address.city || ""},{" "}
                      {viewingApplication.address.state || ""}
                    </p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {viewingApplication.address.zipCode || ""},{" "}
                      {viewingApplication.address.country || ""}
                    </p>
                  </>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">
                    No address provided
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                Experience
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                {viewingApplication.experience ||
                  "No experience details provided"}
              </p>
            </div>

            <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                Qualifications
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                {viewingApplication.qualifications ||
                  "No qualifications provided"}
              </p>
            </div>

            <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                Message
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                {viewingApplication.message || "No message provided"}
              </p>
            </div>

            {viewingApplication.reviewNotes && (
              <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Review Notes
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {viewingApplication.reviewNotes}
                </p>
              </div>
            )}

            <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                Documents
              </h3>
              <div className="space-y-3">
                {viewingApplication.resumeUrl ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-slate-500 dark:text-slate-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="font-medium text-slate-900 dark:text-white">
                        Resume
                      </span>
                    </div>
                    <a
                      href={viewingApplication.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                    >
                      View
                    </a>
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">
                    No resume uploaded
                  </p>
                )}

                {viewingApplication.attachments &&
                viewingApplication.attachments.length > 0 ? (
                  viewingApplication.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800"
                    >
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 text-slate-500 dark:text-slate-400 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="font-medium text-slate-900 dark:text-white">
                          Attachment {index + 1}
                        </span>
                      </div>
                      <a
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                      >
                        View
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">
                    No additional attachments
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                Update Status
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    handleStatusUpdate(viewingApplication._id, "pending")
                  }
                  className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:hover:bg-yellow-900/50"
                >
                  Pending
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(viewingApplication._id, "reviewed")
                  }
                  className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/50"
                >
                  Reviewed
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(viewingApplication._id, "shortlisted")
                  }
                  className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-200 dark:hover:bg-purple-900/50"
                >
                  Shortlisted
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(viewingApplication._id, "selected")
                  }
                  className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-200 dark:hover:bg-green-900/50"
                >
                  Selected
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(viewingApplication._id, "rejected")
                  }
                  className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50"
                >
                  Rejected
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

export default EmployeeApplicationPage;
