import { useState } from "react";
import StatusBadge from "./StatusBadge";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import EditOfferModal from "./modal/EditOfferModal";
import EditExperienceModal from "./modal/EditExperienceModal";
import EditCertificateModal from "./modal/EditCertificateModal";

const InternshipCard = ({ intern: initialIntern, refreshInternships }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [intern, setIntern] = useState(initialIntern);

  const [loadingOffer, setLoadingOffer] = useState(false);
  const [loadingExperience, setLoadingExperience] = useState(false);
  const [loadingCertificate, setLoadingCertificate] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  console.log(intern);

  const handleStatusChange = async (newStatus) => {
    try {
      const { data } = await axiosInstance.patch(
        `/internship/status/${intern._id}`,
        { status: newStatus }
      );

      if (data.success) {
        setIntern(data.application);
      }
    } catch (err) {
      const message = err.response?.data?.message;
      console.error(message);
      alert(message);
    }
  };

  const handleOfferLetter = async (id) => {
    try {
      setLoadingOffer(true);
      const response = await axiosInstance.get(
        `/internship/download-offer-letter/${id}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `offer_letter_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      const message = error.response?.data?.message;
      toast.error(message);
      console.log(message);
    } finally {
      setLoadingOffer(false);
    }
  };

  const handleExperienceLetter = async (id) => {
    try {
      setLoadingExperience(true);
      const response = await axiosInstance.get(
        `/internship/download-experience-letter/${id}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `experience_letter_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      const message = error.response?.data?.message;
      toast.error(message);
      console.log(message);
    } finally {
      setLoadingExperience(false);
    }
  };

  const handleCertificate = async (id) => {
    try {
      setLoadingCertificate(true);
      const response = await axiosInstance.get(
        `/internship/download-certificate/${id}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      const message = error.response?.data?.message;
      toast.error(message);
      console.log(message);
    } finally {
      setLoadingCertificate(false);
    }
  };

  const handleSaveOffer = async (updatedData) => {
    try {
      const response = await axiosInstance.patch(
        `/internship/offer-letter/${intern._id}`,
        { offerLetterData: updatedData }
      );

      if (response.data.success) {
        toast.success("Offer letter updated successfully");
        setIsOfferModalOpen(false);
        // Refresh the data after successful update
        if (refreshInternships) {
          refreshInternships();
        }
      } else {
        toast.error(response.data.message || "Failed to update offer letter");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update offer letter";
      toast.error(message);
      console.log(message);
    }
  };

  const handleSaveExperience = async (updatedData) => {
    try {
      const response = await axiosInstance.patch(
        `/internship/experience-point/${intern._id}`,
        updatedData
      );

      if (response.data.success) {
        toast.success("Experience letter updated successfully");
        setIsExperienceModalOpen(false);
        // Refresh the data after successful update
        if (refreshInternships) {
          refreshInternships();
        }
      } else {
        toast.error(
          response.data.message || "Failed to update experience letter"
        );
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update experience letter";
      toast.error(message);
      console.log(message);
    }
  };

  const handleSaveCertificate = async (updatedData) => {
    try {
      const response = await axiosInstance.patch(
        `/internship/certificate/${intern._id}`,
        updatedData
      );

      if (response.data.success) {
        toast.success("Certificate updated successfully");
        setIsCertificateModalOpen(false);
        // Refresh the data after successful update
        if (refreshInternships) {
          refreshInternships();
        }
      } else {
        toast.error(response.data.message || "Failed to update certificate");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update certificate";
      toast.error(message);
      console.log(message);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Header with edit buttons */}
      <div
        className="flex justify-between items-center px-6 py-4 bg-slate-50 dark:bg-slate-800/50 cursor-pointer rounded-t-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-slate-900 dark:text-white">
            {intern.name}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {intern.email}
          </span>
        </div>

        <div className="flex flex-col items-end gap-2">
          <select
            value={intern.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-xl border px-3 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            {[
              "pending",
              "reviewed",
              "selected",
              "offer_letter_issued",
              "internship_ongoing",
              "certificate_ready",
              "completed",
              "rejected",
            ].map((status) => (
              <option key={status} value={status}>
                {status.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>

          {/* Edit buttons */}
          <div className="flex items-center gap-2">
            <button
              className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsOfferModalOpen(true);
              }}
            >
              Edit Offer
            </button>

            {isOfferModalOpen && (
              <EditOfferModal
                isOpen={isOfferModalOpen}
                onClose={() => setIsOfferModalOpen(false)}
                intern={intern}
                onSave={handleSaveOffer}
              />
            )}
            <button
              className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsExperienceModalOpen(true);
              }}
            >
              Edit Experience
            </button>

            {isExperienceModalOpen && (
              <EditExperienceModal
                isOpen={isExperienceModalOpen}
                onClose={() => setIsExperienceModalOpen(false)}
                intern={intern}
                onSave={handleSaveExperience}
              />
            )}

            <button
              className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsCertificateModalOpen(true);
              }}
            >
              Edit Certificate
            </button>

            {isCertificateModalOpen && (
              <EditCertificateModal
                isOpen={isCertificateModalOpen}
                onClose={() => setIsCertificateModalOpen(false)}
                intern={intern}
                onSave={handleSaveCertificate}
              />
            )}

            <StatusBadge status={intern.status} />
          </div>
        </div>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900 rounded-b-2xl border-t border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Department
              </p>
              <p className="font-medium text-slate-900 dark:text-white">
                {intern.department || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Course
              </p>
              <p className="font-medium text-slate-900 dark:text-white">
                {intern.courseName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Year</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {intern.year || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                LinkedIn
              </p>
              <p className="font-medium text-slate-900 dark:text-white">
                {intern.linkedin ? (
                  <a
                    href={intern.linkedin}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {intern.linkedin}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Portfolio
              </p>
              <p className="font-medium text-slate-900 dark:text-white">
                {intern.portfolio ? (
                  <a
                    href={intern.portfolio}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {intern.portfolio}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Status
              </p>
              <div className="mt-1">
                <StatusBadge status={intern.status} />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Experience Points
              </p>
              <p className="font-medium text-slate-900 dark:text-white">
                {intern.experiencePoints?.date || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Stipend
              </p>
              <p className="font-medium text-slate-900 dark:text-white">
                {intern.offerLetterData?.stipend || "N/A"}
              </p>
            </div>
          </div>

          {/* Download buttons */}
          <div className="col-span-1 md:col-span-2 flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => handleOfferLetter(intern._id)}
              disabled={loadingOffer}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {loadingOffer && (
                <span className="loader-border animate-spin rounded-full w-4 h-4 border-2 border-slate-700 border-t-transparent mr-2"></span>
              )}
              {loadingOffer ? "Downloading..." : "Download Offer Letter"}
            </button>

            <button
              onClick={() => handleExperienceLetter(intern._id)}
              disabled={loadingExperience}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {loadingExperience && (
                <span className="loader-border animate-spin rounded-full w-4 h-4 border-2 border-slate-700 border-t-transparent mr-2"></span>
              )}
              {loadingExperience
                ? "Downloading..."
                : "Download Experience Letter"}
            </button>

            <button
              onClick={() => handleCertificate(intern._id)}
              disabled={loadingCertificate}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {loadingCertificate && (
                <span className="loader-border animate-spin rounded-full w-4 h-4 border-2 border-slate-700 border-t-transparent mr-2"></span>
              )}
              {loadingCertificate ? "Downloading..." : "Download Certificate"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipCard;
