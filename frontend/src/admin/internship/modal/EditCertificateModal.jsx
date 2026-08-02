import React, { useState } from "react";

const EditCertificateModal = ({ isOpen, onClose, intern, onSave }) => {
  const [formData, setFormData] = useState({
    startDate: intern.certificateData?.startDate || "",
    endDate: intern.certificateData?.endDate || "",
    domain: intern.certificateData?.domain || "",
    location: intern.certificateData?.location || "",
    signatoryName: intern.certificateData?.signatoryName || "",
    signatoryDesignation: intern.certificateData?.signatoryDesignation || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Certificate</h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Domain
              </label>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900"
                placeholder="e.g. CS & Engineering"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900"
                placeholder="e.g. Pune, Maharashtra"
              />
            </div>
          </div>

          {/* Signatory Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Signatory Name
              </label>
              <input
                type="text"
                name="signatoryName"
                value={formData.signatoryName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Signatory Designation
              </label>
              <input
                type="text"
                name="signatoryDesignation"
                value={formData.signatoryDesignation}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-4 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCertificateModal;
