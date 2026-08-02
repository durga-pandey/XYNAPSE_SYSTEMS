import Select from "react-select";

export default function FormModal({
  modalOpen,
  modalBranch,
  closeModal,
  submitForm,
  formData,
  setFormDataFormModal,
  countryOptions,
  handleFormChange,
  loading,
  courses,
  showSuccess,
}) {
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="relative z-10 w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-gray-900 transform transition-all scale-100 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-3 mb-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white break-words">
            Enroll - {modalBranch?.name}
          </h3>
          <button
            type="button"
            onClick={closeModal}
            className="mt-2 sm:mt-0 rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {showSuccess && (
          <div className="mb-4 p-3 bg-green-500 text-white text-center rounded">
            Form submitted successfully!
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => submitForm(e, formData)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                placeholder="you@example.com"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            {/* City */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                City
              </label>
              <input
                name="city"
                value={formData.city}
                onChange={handleFormChange}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                placeholder="Your city"
              />
            </div>

            {/* Country */}
            <div className="flex flex-col sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Country
              </label>
              <Select
                value={
                  countryOptions.find((c) => c.value === formData.country) ||
                  null
                }
                onChange={(selected) =>
                  setFormDataFormModal((prev) => ({
                    ...prev,
                    country: selected?.value || "",
                  }))
                }
                options={countryOptions}
                placeholder="Select your country"
                className="mt-2"
              />
            </div>

            {/* Course */}
            <div className="flex flex-col sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Course
              </label>
              <Select
                value={
                  courses.find((c) => c.value === formData.courseId) || null
                }
                onChange={(selected) =>
                  setFormDataFormModal((prev) => ({
                    ...prev,
                    courseId: selected?.value || "",
                  }))
                }
                options={courses}
                placeholder="Select a course"
                className="mt-2"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-md transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg hover:from-sky-600 hover:to-blue-700"
            }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
