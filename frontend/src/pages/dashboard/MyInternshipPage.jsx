import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const StatusBadge = ({ status }) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    reviewed: "bg-blue-100 text-blue-700",
    selected: "bg-indigo-100 text-indigo-700",
    offer_letter_issued: "bg-purple-100 text-purple-700",
    internship_ongoing: "bg-orange-100 text-orange-700",
    certificate_ready: "bg-teal-100 text-teal-700",
    completed: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${map[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
};

const MyInternshipPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState({});

  useEffect(() => {
    axiosInstance
      .get("/internship/my-internships")
      .then((res) => setApplications(res.data.applications || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const downloadPdf = async (url, fileName, key) => {
    try {
      setDownloadLoading((prev) => ({ ...prev, [key]: true }));

      const res = await axiosInstance.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
    } finally {
      setDownloadLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleDownloadOfferLetter = (applicationId, name) => {
    downloadPdf(
      `/internship/download-offer-letter/${applicationId}`,
      `Offer_Letter_${name}.pdf`,
      `${applicationId}-offer`
    );
  };

  const handleDownloadExperienceLetter = (applicationId, name) => {
    downloadPdf(
      `/internship/download-experience-letter/${applicationId}`,
      `Experience_Letter_${name}.pdf`,
      `${applicationId}-experience`
    );
  };

  const handleDownloadCertificate = (applicationId, name) => {
    downloadPdf(
      `/internship/download-certificate/${applicationId}`,
      `Certificate_${name}.pdf`,
      `${applicationId}-certificate`
    );
  };

  if (loading) return <p className="text-slate-500">Loading applications...</p>;

  return (
    <section className="px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
        My Internship Applications
      </h1>

      <div className="space-y-6">
        {applications.map((app) => (
          <div
            key={app._id}
            className="rounded-2xl border bg-white dark:bg-slate-900 shadow-md hover:shadow-lg transition-all"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {app.courseId?.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {app.name} ({app.email})
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {app.year} - {app.department}
                </p>
              </div>
              <StatusBadge status={app.status} />
            </div>

            {/* Body */}
            <div className="p-6 grid gap-6 md:grid-cols-2">
              {/* Left Info */}
              <div className="space-y-3">
                <p>
                  <strong>Phone:</strong> {app.phone}
                </p>
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  {app.linkedin ? (
                    <a
                      href={app.linkedin}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      View Profile
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
                <p>
                  <strong>Portfolio:</strong>{" "}
                  {app.portfolio ? (
                    <a
                      href={app.portfolio}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      View Portfolio
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
                <p>
                  <strong>Resume:</strong>{" "}
                  {app.resumeUrl?.secure_url ? (
                    <a
                      href={app.resumeUrl.secure_url}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>

              {/* Right Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  disabled={
                    downloadLoading[`${app._id}-offer`] ||
                    app.status !== "completed"
                  }
                  onClick={() => handleDownloadOfferLetter(app._id, app.name)}
                  className={`w-full rounded-xl px-4 py-3 text-sm font-medium text-white flex justify-center items-center gap-2 ${
                    app.status !== "completed"
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  {downloadLoading[`${app._id}-offer`] && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  Download Offer Letter
                </button>

                {/* Experience Letter */}
                <button
                  disabled={
                    downloadLoading[`${app._id}-experience`] ||
                    app.status !== "completed"
                  }
                  onClick={() =>
                    handleDownloadExperienceLetter(app._id, app.name)
                  }
                  className={`w-full rounded-xl px-4 py-3 text-sm font-medium text-white flex justify-center items-center gap-2 ${
                    app.status !== "completed"
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  {downloadLoading[`${app._id}-experience`] && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  Download Experience Letter
                </button>

                {/* Certificate */}
                <button
                  disabled={
                    downloadLoading[`${app._id}-certificate`] ||
                    app.status !== "completed"
                  }
                  onClick={() => handleDownloadCertificate(app._id, app.name)}
                  className={`w-full rounded-xl px-4 py-3 text-sm font-medium text-white flex justify-center items-center gap-2 ${
                    app.status !== "completed"
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  {downloadLoading[`${app._id}-certificate`] && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  Download Certificate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyInternshipPage;
