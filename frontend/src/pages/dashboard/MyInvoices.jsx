import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-sm">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
      {value}
    </p>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${map[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
};

const money = (v) =>
  Number(v?.$numberDecimal || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium text-slate-900 dark:text-white">{value}</span>
  </div>
);

const MyInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMap, setLoadingMap] = useState({});

  useEffect(() => {
    axiosInstance
      .get("/invoice/my-invoices")
      .then((res) => setInvoices(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const paid = invoices.filter((i) => i.paymentStatus === "paid").length;
  const pending = invoices.filter((i) => i.paymentStatus === "pending").length;

  const handleDownload = async (invoiceId, invoiceNumber) => {
    setLoadingMap((prev) => ({ ...prev, [invoiceId]: true }));
    try {
      const response = await axiosInstance.get(
        `/invoice/download/${invoiceId}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download invoice:", error);
      alert("Failed to download invoice. Try again!");
    } finally {
      setLoadingMap((prev) => ({ ...prev, [invoiceId]: false }));
    }
  };

  return (
    <section className="px-6 py-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          My Invoices
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Complete billing history with downloadable invoices
        </p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Invoices" value={invoices.length} />
        <StatCard label="Paid" value={paid} />
        <StatCard label="Pending" value={pending} />
      </div>

      {/* Invoice Cards */}
      <div className="space-y-6">
        {loading && <p className="text-slate-500">Loading invoices...</p>}

        {!loading &&
          invoices.map((inv) => (
            <div
              key={inv._id}
              className="rounded-2xl border bg-white dark:bg-slate-900 shadow-sm"
            >
              {/* Header */}
              <button
                onClick={() => setOpenId(openId === inv._id ? null : inv._id)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <div>
                  <p className="text-xs text-slate-500">Invoice</p>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {inv.invoiceNumber}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {inv.courseId?.title}
                  </p>
                </div>

                <div className="text-right">
                  <StatusBadge status={inv.paymentStatus} />
                  <p className="mt-2 font-bold text-slate-900 dark:text-white">
                    {money(inv.totalAmount)}
                  </p>
                </div>
              </button>

              {/* Expanded Details */}
              {openId === inv._id && (
                <div className="border-t px-6 py-6 grid gap-6 md:grid-cols-2">
                  {/* Left */}
                  <div className="space-y-3">
                    <InfoRow label="Student" value={inv.studentId?.name} />
                    <InfoRow label="Email" value={inv.studentId?.email} />
                    <InfoRow
                      label="Instructor"
                      value={inv.instructorId?.name}
                    />
                    <InfoRow label="Payment Mode" value={inv.paymentMode} />
                    <InfoRow
                      label="Payment Date"
                      value={new Date(inv.paymentDate).toLocaleDateString()}
                    />
                    {inv.notes && <InfoRow label="Notes" value={inv.notes} />}
                  </div>

                  {/* Right */}
                  <div className="space-y-3">
                    <InfoRow label="Course Fee" value={money(inv.courseFee)} />
                    <InfoRow label="Discount" value={money(inv.discount)} />
                    <InfoRow label="CGST" value={money(inv.taxes?.cgst)} />
                    <InfoRow label="SGST" value={money(inv.taxes?.sgst)} />
                    <InfoRow label="IGST" value={money(inv.taxes?.igst)} />
                    <InfoRow
                      label="Other Taxes"
                      value={money(inv.taxes?.otherTaxes)}
                    />

                    <div className="pt-3 border-t flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg">
                        {money(inv.totalAmount)}
                      </span>
                    </div>

                    <button
                      disabled={
                        inv.paymentStatus !== "paid" || loadingMap[inv._id]
                      }
                      onClick={() => handleDownload(inv._id, inv.invoiceNumber)}
                      className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-medium text-white flex justify-center items-center gap-2 ${
                        inv.paymentStatus === "paid"
                          ? "bg-slate-900 hover:bg-slate-800"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {loadingMap[inv._id] && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      )}
                      Download Invoice (PDF)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </section>
  );
};

export default MyInvoices;
