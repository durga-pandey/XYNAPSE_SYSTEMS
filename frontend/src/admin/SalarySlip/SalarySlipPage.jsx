import { useEffect, useState } from "react";
import salarySlipService from "../../services/salarySlipService";
import Modal from "./Modal";
import authService from "../../services/authService";

const SalarySlipPage = () => {
  const [salarySlips, setSalarySlips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingSlip, setEditingSlip] = useState(null);
  const [viewingSlip, setViewingSlip] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    authId: "",
    designation: "",
    department: "",
    salary: "",
    contactNumber: "",
    bankDetails: {
      accountNumber: "",
      bankName: "",
      ifscCode: "",
    },
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    notes: "",
  });

  const [historyData, setHistoryData] = useState({
    month: "",
    salary: "",
    paidOn: "",
    paymentMethod: "Bank Transfer",
    notes: "",
  });

  useEffect(() => {
    fetchSalarySlips();
    fetchEmployees();
  }, [currentPage, statusFilter, departmentFilter]);

  const fetchEmployees = async () => {
    try {
      const response = await authService.getAllUsers();
      setEmployees(
        response.data.filter((user) => user.role === "instructor") || []
      );
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  const fetchSalarySlips = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await salarySlipService.getAllSalarySlips({
        page: currentPage,
        limit,
        status: statusFilter,
        department: departmentFilter,
        search: searchTerm,
      });
      setSalarySlips(response.salarySlips || []);
      setTotalPages(Math.ceil(response.total / limit) || 1);
    } catch (err) {
      console.error("Failed to fetch salary slips:", err);
      setError("Failed to load salary slips. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await salarySlipService.deleteSalarySlip(id);
      // Refresh the list
      fetchSalarySlips();
    } catch (err) {
      console.error("Failed to delete salary slip:", err);
      setError("Failed to delete salary slip. Please try again.");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await salarySlipService.updateSalarySlipStatus(id, { status });
      // Refresh the list
      fetchSalarySlips();
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update status. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [name]: value,
      },
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleHistoryChange = (e) => {
    const { name, value } = e.target;
    setHistoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        salary: parseFloat(formData.salary),
      };

      if (editingSlip) {
        await salarySlipService.updateSalarySlip(editingSlip._id, payload);
      } else {
        await salarySlipService.createSalarySlip(payload);
      }

      // Reset form and refresh list
      setFormData({
        authId: "",
        designation: "",
        department: "",
        salary: "",
        contactNumber: "",
        bankDetails: {
          accountNumber: "",
          bankName: "",
          ifscCode: "",
        },
        address: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
        notes: "",
      });
      setEditingSlip(null);
      setShowModal(false);
      fetchSalarySlips();
    } catch (err) {
      console.error("Failed to save salary slip:", err);
      setError("Failed to save salary slip. Please try again.");
    }
  };

  const handleHistorySubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...historyData,
        salary: parseFloat(historyData.salary),
        paidOn: new Date(historyData.paidOn),
      };

      await salarySlipService.addSalaryHistory(selectedEmployee._id, payload);

      // Reset form and refresh
      setHistoryData({
        month: "",
        salary: "",
        paidOn: "",
        paymentMethod: "Bank Transfer",
        notes: "",
      });
      setShowHistoryModal(false);
      setSelectedEmployee(null);
      fetchSalarySlips();
    } catch (err) {
      console.error("Failed to add salary history:", err);
      setError("Failed to add salary history. Please try again.");
    }
  };

  const openEditModal = (slip) => {
    setEditingSlip(slip);
    setFormData({
      authId: slip.authId?._id || "",
      designation: slip.designation || "",
      department: slip.department || "",
      salary: slip.salary?.$numberDecimal || slip.salary || "",
      contactNumber: slip.contactNumber || "",
      bankDetails: {
        accountNumber: slip.bankDetails?.accountNumber || "",
        bankName: slip.bankDetails?.bankName || "",
        ifscCode: slip.bankDetails?.ifscCode || "",
      },
      address: {
        line1: slip.address?.line1 || "",
        line2: slip.address?.line2 || "",
        city: slip.address?.city || "",
        state: slip.address?.state || "",
        country: slip.address?.country || "",
        zipCode: slip.address?.zipCode || "",
      },
      notes: slip.notes || "",
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingSlip(null);
    setFormData({
      authId: "",
      designation: "",
      department: "",
      salary: "",
      contactNumber: "",
      bankDetails: {
        accountNumber: "",
        bankName: "",
        ifscCode: "",
      },
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
      notes: "",
    });
    setShowModal(true);
  };

  const openHistoryModal = (slip) => {
    setSelectedEmployee(slip);
    setHistoryData({
      month: "",
      salary: slip.salary?.$numberDecimal || slip.salary || "",
      paidOn: new Date().toISOString().split("T")[0],
      paymentMethod: "Bank Transfer",
      notes: "",
    });
    setShowHistoryModal(true);
  };

  const viewSalarySlipDetails = (slip) => {
    setViewingSlip(slip);
  };

  const closeViewModal = () => {
    setViewingSlip(null);
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    const num =
      typeof amount === "object"
        ? parseFloat(amount.$numberDecimal)
        : parseFloat(amount);
    return `₹${num.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Salary Slips
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage employee salary slips
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
          >
            Create Salary Slip
          </button>
          <button
            onClick={fetchSalarySlips}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
        {/* Search + Filters */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
          />
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
            <option value="onLeave">On Leave</option>
            <option value="resigned">Resigned</option>
            <option value="terminated">Terminated</option>
          </select>
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
          <div className="text-sm text-slate-500 dark:text-slate-400 self-center">
            Showing {salarySlips.length} of {totalPages * limit} salary slips
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-2xl bg-slate-200/80 dark:bg-slate-800"
              ></div>
            ))}
          </div>
        ) : salarySlips.length === 0 ? (
          <div className="rounded-2xl bg-slate-100 p-8 text-center dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">
              {searchTerm || statusFilter || departmentFilter
                ? "No salary slips match your filters."
                : "No salary slips found."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table (≥1080px) */}
            <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
              <table className="min-w-full divide-y divide-slate-200/80 dark:divide-slate-800/80">
                <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Employee Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Designation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Salary
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
                  {salarySlips.map((slip) => (
                    <tr
                      key={slip._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                        {slip.authId?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {slip.employeeCode || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {slip.designation || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {slip.department || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {formatCurrency(slip.salary)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            slip.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                              : slip.status === "onLeave"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                              : slip.status === "resigned"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                          }`}
                        >
                          {slip.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => viewSalarySlipDetails(slip)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEditModal(slip)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openHistoryModal(slip)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Pay
                          </button>
                          <button
                            onClick={() => handleDelete(slip._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (<1080px) */}
            <div className="block lg:hidden flex-col gap-4">
              {salarySlips.map((slip) => (
                <div
                  key={slip._id}
                  className="bg-white/90 dark:bg-slate-950/50 p-4 rounded-2xl shadow flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {slip.authId?.name || "N/A"}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        slip.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                          : slip.status === "onLeave"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                          : slip.status === "resigned"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                      }`}
                    >
                      {slip.status || "N/A"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Emp. Code: {slip.employeeCode || "N/A"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Designation: {slip.designation || "N/A"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Department: {slip.department || "N/A"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Salary: {formatCurrency(slip.salary)}
                  </p>
                  <div className="flex justify-end gap-2 flex-wrap">
                    <button
                      onClick={() => viewSalarySlipDetails(slip)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEditModal(slip)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openHistoryModal(slip)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    >
                      Pay
                    </button>
                    <button
                      onClick={() => handleDelete(slip._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal for adding/editing salary slips */}
      <Modal
        isOpen={showModal}
        title={editingSlip ? "Edit Salary Slip" : "Create Salary Slip"}
        onClose={() => {
          setShowModal(false);
          setEditingSlip(null);
          setFormData({
            authId: "",
            designation: "",
            department: "",
            salary: "",
            contactNumber: "",
            bankDetails: {
              accountNumber: "",
              bankName: "",
              ifscCode: "",
            },
            address: {
              line1: "",
              line2: "",
              city: "",
              state: "",
              country: "",
              zipCode: "",
            },
            notes: "",
          });
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Employee
              </label>
              <select
                name="authId"
                value={formData.authId}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                required
                disabled={!!editingSlip}
              >
                <option value="">Select an employee</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Monthly Salary
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                required
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Contact Number
              </label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                required
              />
            </div>
          </div>

          <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
              Bank Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleBankDetailsChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleBankDetailsChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.bankDetails.ifscCode}
                  onChange={handleBankDetailsChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
              Address
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="line1"
                  value={formData.address.line1}
                  onChange={handleAddressChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="line2"
                  value={formData.address.line2}
                  onChange={handleAddressChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.address.zipCode}
                    onChange={handleAddressChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.address.country}
                  onChange={handleAddressChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              rows="3"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingSlip(null);
                setFormData({
                  authId: "",
                  designation: "",
                  department: "",
                  salary: "",
                  contactNumber: "",
                  bankDetails: {
                    accountNumber: "",
                    bankName: "",
                    ifscCode: "",
                  },
                  address: {
                    line1: "",
                    line2: "",
                    city: "",
                    state: "",
                    country: "",
                    zipCode: "",
                  },
                  notes: "",
                });
              }}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {editingSlip ? "Update Salary Slip" : "Create Salary Slip"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal for adding salary history */}
      <Modal
        isOpen={showHistoryModal}
        title={`Add Salary History for ${
          selectedEmployee?.authId?.name || "Employee"
        }`}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedEmployee(null);
          setHistoryData({
            month: "",
            salary: "",
            paidOn: "",
            paymentMethod: "Bank Transfer",
            notes: "",
          });
        }}
      >
        <form onSubmit={handleHistorySubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Month
              </label>
              <input
                type="text"
                name="month"
                value={historyData.month}
                onChange={handleHistoryChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="e.g., January 2023"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Salary Amount
              </label>
              <input
                type="number"
                name="salary"
                value={historyData.salary}
                onChange={handleHistoryChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                required
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Paid On
              </label>
              <input
                type="date"
                name="paidOn"
                value={historyData.paidOn}
                onChange={handleHistoryChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={historyData.paymentMethod}
                onChange={handleHistoryChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={historyData.notes}
              onChange={handleHistoryChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              rows="3"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowHistoryModal(false);
                setSelectedEmployee(null);
                setHistoryData({
                  month: "",
                  salary: "",
                  paidOn: "",
                  paymentMethod: "Bank Transfer",
                  notes: "",
                });
              }}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Add Salary History
            </button>
          </div>
        </form>
      </Modal>

      {/* View Salary Slip Details Modal */}
      {viewingSlip && (
        <Modal
          isOpen={!!viewingSlip}
          title={`Salary Slip Details: ${
            viewingSlip.authId?.name || "Employee"
          }`}
          onClose={closeViewModal}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Employee Name
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingSlip.authId?.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Employee Code
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingSlip.employeeCode || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Email
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingSlip.authId?.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Designation
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingSlip.designation || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Department
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingSlip.department || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Monthly Salary
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {formatCurrency(viewingSlip.salary)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Contact Number
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingSlip.contactNumber || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Status
                </p>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    viewingSlip.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                      : viewingSlip.status === "onLeave"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                      : viewingSlip.status === "resigned"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                  }`}
                >
                  {viewingSlip.status || "N/A"}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                Bank Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Account Number
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {viewingSlip.bankDetails?.accountNumber || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Bank Name
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {viewingSlip.bankDetails?.bankName || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    IFSC Code
                  </p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {viewingSlip.bankDetails?.ifscCode || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                Address
              </h3>
              <div className="space-y-2">
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingSlip.address?.line1 || ""}{" "}
                  {viewingSlip.address?.line2 || ""}
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingSlip.address?.city || ""},{" "}
                  {viewingSlip.address?.state || ""}
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {viewingSlip.address?.zipCode || ""},{" "}
                  {viewingSlip.address?.country || ""}
                </p>
              </div>
            </div>

            {viewingSlip.notes && (
              <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Notes
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {viewingSlip.notes}
                </p>
              </div>
            )}

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

export default SalarySlipPage;
