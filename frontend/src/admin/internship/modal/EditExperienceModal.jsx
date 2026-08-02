import React, { useState } from "react";

const EditExperienceModal = ({ isOpen, onClose, intern, onSave }) => {
  const [formData, setFormData] = useState({
    date: intern.experiencePoints?.date || "",
    startDate: intern.experiencePoints?.startDate || "",
    endDate: intern.experiencePoints?.endDate || "",
    responsibilities: intern.experiencePoints?.responsibilities || [""],
    signatoryName: intern.experiencePoints?.signatoryName || "",
    signatoryDesignation: intern.experiencePoints?.signatoryDesignation || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, value) => {
    const arr = [...formData.responsibilities];
    arr[index] = value;
    setFormData((prev) => ({ ...prev, responsibilities: arr }));
  };

  const addResponsibility = () => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""],
    }));
  };

  const removeResponsibility = (index) => {
    const arr = [...formData.responsibilities];
    arr.splice(index, 1);
    setFormData((prev) => ({ ...prev, responsibilities: arr }));
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
          <h2 className="text-xl font-semibold">Edit Experience Letter</h2>
          <button className="text-gray-500 hover:text-gray-800" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900"
              />
            </div>
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

          {/* Responsibilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Responsibilities
            </label>
            {formData.responsibilities.map((res, idx) => (
              <div key={idx} className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={res}
                  onChange={(e) => handleArrayChange(idx, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md p-2 text-gray-900 placeholder-gray-400"
                  placeholder={`Responsibility #${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeResponsibility(idx)}
                  className="bg-red-500 text-white px-2 rounded-md"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addResponsibility}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md"
            >
              + Add Responsibility
            </button>
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

export default EditExperienceModal;
