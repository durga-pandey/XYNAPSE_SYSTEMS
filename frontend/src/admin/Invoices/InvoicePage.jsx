import { useEffect, useState } from "react";
import invoiceService from "../../services/invoiceService";
import Modal from "./Modal";
import authService from "../../services/authService";
import courseService from "../../services/courseService";
import axiosInstance from "../../utils/axiosInstance";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    paymentMode: "Cash",
    discount: "",
    taxes: {
      cgst: "",
      sgst: "",
      igst: "",
      otherTaxes: "",
    },
    notes: "",
    courses: [
      {
        courseId: "",
        instructorId: "",
        paidAmount: "",
        installments: [
          {
            amount: "",
            status: "pending",
            paidDate: "",
          },
        ],
      },
    ],
  });

  useEffect(() => {
    fetchInvoices();
    fetchStudents();
    fetchCourses();
    fetchInstructors();
  }, [currentPage]);

  const fetchStudents = async () => {
    try {
      const response = await authService.getAllUsers();
      setStudents(
        response.data.filter((user) => user.role === "student") || []
      );
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await authService.getAllUsers();
      setInstructors(
        response.data.filter((user) => user.role === "instructor") || []
      );
    } catch (err) {
      console.error("Failed to fetch instructors:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAllCourses();
      setCourses(response.data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await invoiceService.getAllInvoices({
        page: currentPage,
        limit,
        search: searchTerm,
      });
      setInvoices(response.invoices || []);
      setTotalPages(Math.ceil(response.total / limit) || 1);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
      setError("Failed to load invoices. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      const { data } = await axiosInstance.patch(
        `/invoice/update-payment-status/${invoiceId}`,
        {
          paymentStatus: newStatus,
        }
      );

      if (data.success) {
        setInvoices((prev) =>
          prev.map((inv) =>
            inv._id === invoiceId ? { ...inv, paymentStatus: newStatus } : inv
          )
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Try again!");
    }
  };

  const handleDelete = async (invoiceId) => {
    try {
      await invoiceService.deleteInvoice(invoiceId);
      // Refresh the list
      fetchInvoices();
    } catch (err) {
      console.error("Failed to delete invoice:", err);
      setError("Failed to delete invoice. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCourseChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedCourses = [...prev.courses];
      updatedCourses[index][field] = value;
      return { ...prev, courses: updatedCourses };
    });
  };

  const handleTaxChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      taxes: {
        ...prev.taxes,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        studentId: formData.studentId,
        paymentMode: formData.paymentMode,
        discount: parseFloat(formData.discount || 0),
        taxes: {
          cgst: parseFloat(formData.taxes.cgst || 0),
          sgst: parseFloat(formData.taxes.sgst || 0),
          igst: parseFloat(formData.taxes.igst || 0),
          otherTaxes: parseFloat(formData.taxes.otherTaxes || 0),
        },
        notes: formData.notes,
        courses: formData.courses.map((c) => ({
          courseId: c.courseId,
          instructorId: c.instructorId,
          paidAmount: parseFloat(c.paidAmount || 0),
          installments: c.installments.map((i) => ({
            amount: parseFloat(i.amount || 0),
            status: i.status || "pending",
            paidDate: i.paidDate || (i.status === "paid" ? new Date() : null),
          })),
        })),
      };

      if (editingInvoice) {
        await invoiceService.updateInvoice(editingInvoice._id, payload);
      } else {
        await invoiceService.createInvoice(payload);
      }

      setFormData({
        studentId: "",
        paymentMode: "Cash",
        discount: "",
        taxes: { cgst: "", sgst: "", igst: "", otherTaxes: "" },
        notes: "",
        courses: [
          {
            courseId: "",
            instructorId: "",
            paidAmount: "",
            installments: [{ amount: "", status: "pending", paidDate: "" }],
          },
        ],
      });
      setEditingInvoice(null);
      setShowModal(false);
      fetchInvoices();
    } catch (err) {
      console.error("Failed to save invoice:", err);
      setError("Failed to save invoice. Please try again.");
    }
  };

  const openEditModal = (invoice) => {
    setEditingInvoice(invoice);

    setFormData({
      studentId: invoice.studentId?._id || "",
      paymentMode: invoice.paymentMode || "Cash",
      discount: invoice.discount?.$numberDecimal || invoice.discount || "",
      taxes: {
        cgst: invoice.taxes?.cgst?.$numberDecimal || invoice.taxes?.cgst || "",
        sgst: invoice.taxes?.sgst?.$numberDecimal || invoice.taxes?.sgst || "",
        igst: invoice.taxes?.igst?.$numberDecimal || invoice.taxes?.igst || "",
        otherTaxes:
          invoice.taxes?.otherTaxes?.$numberDecimal ||
          invoice.taxes?.otherTaxes ||
          "",
      },
      notes: invoice.notes || "",
      courses: invoice.courses?.map((c) => ({
        courseId: c.courseId?._id || c.courseId || "",
        instructorId: c.instructorId?._id || c.instructorId || "",
        paidAmount: c.paidAmount?.$numberDecimal || c.paidAmount || "",
        installments: c.installments || [
          { amount: "", status: "pending", paidDate: "" },
        ],
      })) || [
        {
          courseId: "",
          instructorId: "",
          paidAmount: "",
          installments: [{ amount: "", status: "pending", paidDate: "" }],
        },
      ],
    });

    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingInvoice(null);
    setFormData({
      studentId: "",
      paymentMode: "Cash",
      discount: "",
      taxes: { cgst: "", sgst: "", igst: "", otherTaxes: "" },
      notes: "",
      courses: [
        {
          courseId: "",
          instructorId: "",
          paidAmount: "",
          installments: [{ amount: "", status: "pending", paidDate: "" }],
        },
      ],
    });
    setShowModal(true);
  };

  const viewInvoiceDetails = (invoice) => {
    setViewingInvoice(invoice);
  };

  const closeViewModal = () => {
    setViewingInvoice(null);
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    const num =
      typeof amount === "object"
        ? parseFloat(amount.$numberDecimal)
        : parseFloat(amount);
    return `₹${num.toFixed(2)}`;
  };

  const calculateTotal = (invoice) => {
    const courseFee = parseFloat(
      invoice.courseFee?.$numberDecimal || invoice.courseFee || 0
    );
    const discount = parseFloat(
      invoice.discount?.$numberDecimal || invoice.discount || 0
    );
    const cgst = parseFloat(
      invoice.taxes?.cgst?.$numberDecimal || invoice.taxes?.cgst || 0
    );
    const sgst = parseFloat(
      invoice.taxes?.sgst?.$numberDecimal || invoice.taxes?.sgst || 0
    );
    const igst = parseFloat(
      invoice.taxes?.igst?.$numberDecimal || invoice.taxes?.igst || 0
    );
    const otherTaxes = parseFloat(
      invoice.taxes?.otherTaxes?.$numberDecimal ||
        invoice.taxes?.otherTaxes ||
        0
    );

    return courseFee - discount + cgst + sgst + igst + otherTaxes;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Invoices
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage all invoices
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
          >
            Create Invoice
          </button>
          <button
            onClick={fetchInvoices}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
        {/* Search + Info */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
            />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Showing {invoices.length} of {totalPages * limit} invoices
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
        ) : invoices.length === 0 ? (
          <div className="rounded-2xl bg-slate-100 p-8 text-center dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">
              {searchTerm
                ? "No invoices match your search."
                : "No invoices found."}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden xl:block overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
              <table className="min-w-full divide-y divide-slate-200/80 dark:divide-slate-800/80">
                <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Invoice #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-slate-200/80 dark:bg-slate-950/50 dark:divide-slate-800/80">
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {invoice.studentId?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {invoice.courseId?.title || "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {formatCurrency(calculateTotal(invoice))}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <select
                          value={invoice.paymentStatus}
                          onChange={(e) =>
                            handleStatusChange(invoice._id, e.target.value)
                          }
                          className={`px-2 py-1 text-xs font-semibold rounded-full outline-none ${
                            invoice.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                              : invoice.paymentStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2 flex-wrap">
                          <button
                            onClick={() => viewInvoiceDetails(invoice)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEditModal(invoice)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(invoice._id)}
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

            <div className="xl:hidden flex flex-col gap-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice._id}
                  className="bg-white/90 dark:bg-slate-950/50 p-4 rounded-2xl shadow flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      {invoice.invoiceNumber}
                    </span>
                    <select
                      value={invoice.paymentStatus}
                      onChange={(e) =>
                        handleStatusChange(invoice._id, e.target.value)
                      }
                      className={`px-2 py-1 text-xs font-semibold rounded-full outline-none ${
                        invoice.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                          : invoice.paymentStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {invoice.studentId?.name || "N/A"}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {invoice.courseId?.title || "N/A"}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {formatCurrency(calculateTotal(invoice))}
                  </div>
                  <div className="flex justify-end gap-2 mt-2 flex-wrap">
                    <button
                      onClick={() => viewInvoiceDetails(invoice)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEditModal(invoice)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(invoice._id)}
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

      <Modal
        isOpen={showModal}
        title={editingInvoice ? "Edit Invoice" : "Create Invoice"}
        onClose={() => {
          setShowModal(false);
          setEditingInvoice(null);
          setFormData({
            studentId: "",
            paymentMode: "Cash",
            discount: "",
            taxes: { cgst: "", sgst: "", igst: "", otherTaxes: "" },
            notes: "",
            courses: [
              {
                courseId: "",
                instructorId: "",
                paidAmount: "",
                installments: [{ amount: "", status: "pending", paidDate: "" }],
              },
            ],
          });
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Select */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Student
            </label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              required
            >
              <option value="">Select a student</option>
              {(students || []).map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>
          </div>

          {/* Courses List */}
          {(formData.courses || []).map((course, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-xl p-4 shadow-sm bg-gray-50 dark:bg-gray-900"
            >
              <h4 className="text-md font-medium mb-3 text-gray-800 dark:text-gray-100">
                Course {index + 1}
              </h4>

              {/* Course Select */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Course
                </label>
                <select
                  value={course.courseId}
                  onChange={(e) =>
                    handleCourseChange(index, "courseId", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  required
                >
                  <option value="">Select a course</option>
                  {(courses || []).map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instructor Select */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Instructor
                </label>
                <select
                  value={course.instructorId}
                  onChange={(e) =>
                    handleCourseChange(index, "instructorId", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  required
                >
                  <option value="">Select an instructor</option>
                  {(instructors || []).map((i) => (
                    <option key={i._id} value={i._id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Paid Amount */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Paid Amount
                </label>
                <input
                  type="number"
                  value={course.paidAmount}
                  onChange={(e) =>
                    handleCourseChange(index, "paidAmount", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  step="0.01"
                  min="0"
                />
              </div>

              {formData.courses.length > 1 && (
                <div className="col-span-full text-right">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.courses];
                      updated.splice(index, 1);
                      setFormData({ ...formData, courses: updated });
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove Course
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add Course Button */}
          <div>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  courses: [
                    ...formData.courses,
                    {
                      courseId: "",
                      instructorId: "",
                      amount: "",
                      paidAmount: "",
                      installments: [
                        { amount: "", status: "pending", paidDate: "" },
                      ],
                    },
                  ],
                });
              }}
              className="rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition"
            >
              Add Another Course
            </button>
          </div>

          {/* Taxes */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Taxes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["cgst", "sgst", "igst", "otherTaxes"].map((tax) => (
                <div key={tax} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {tax.toUpperCase()}
                  </label>
                  <input
                    type="number"
                    name={tax}
                    value={formData.taxes[tax]}
                    onChange={handleTaxChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    step="0.01"
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 transition"
            >
              {editingInvoice ? "Update Invoice" : "Create Invoice"}
            </button>
          </div>
        </form>
      </Modal>

      {viewingInvoice && (
        <Modal
          isOpen={!!viewingInvoice}
          title={`Invoice Details: ${viewingInvoice?.invoiceNumber}`}
          onClose={closeViewModal}
        >
          <div className="space-y-4">
            {/* Student Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Student</p>
                <p className="font-medium text-slate-900">
                  {viewingInvoice.studentId?.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium text-slate-900">
                  {viewingInvoice.studentId?.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Payment Mode</p>
                <p className="font-medium text-slate-900">
                  {viewingInvoice.paymentMode || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Payment Status</p>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    viewingInvoice.paymentStatus === "paid"
                      ? "bg-green-100 text-green-800"
                      : viewingInvoice.paymentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {viewingInvoice.paymentStatus || "N/A"}
                </span>
              </div>
            </div>

            {/* Courses Table */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Courses</h3>
              <div className="space-y-3">
                {viewingInvoice.courses?.map((course) => (
                  <div
                    key={course._id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 border rounded-lg bg-gray-50"
                  >
                    <div>
                      <p className="text-sm text-slate-500">Course</p>
                      <p className="font-medium text-slate-900">
                        {course.courseId?.title || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Instructor</p>
                      <p className="font-medium text-slate-900">
                        {course.instructorId?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Paid Amount</p>
                      <p className="font-medium text-slate-900">
                        {formatCurrency(course.paidAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Amount</p>
                      <p className="font-medium text-slate-900">
                        {formatCurrency(course.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Details */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Financial Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Discount:</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(viewingInvoice.discount)}
                  </span>
                </div>
                {["cgst", "sgst", "igst", "otherTaxes"].map((tax) => (
                  <div key={tax} className="flex justify-between">
                    <span className="text-slate-500">{tax.toUpperCase()}:</span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(viewingInvoice.taxes?.[tax])}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-medium text-slate-900">
                    Total Amount:
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(viewingInvoice.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {viewingInvoice.notes && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Notes</h3>
                <p className="text-slate-700">{viewingInvoice.notes}</p>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={closeViewModal}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
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

export default InvoicePage;
