import Select from "react-select";

export default function InternshipModal({
  modalOpen,
  modalBranch,
  closeModal,
  submitForm,
  formData,
  handleFormChange,
  handleFileChange,
  loading,
  courses,
}) {
  if (!modalOpen) return null;

  const selectStyles = {
    control: (styles, state) => ({
      ...styles,
      backgroundColor: state.isFocused
        ? document.documentElement.classList.contains("dark")
          ? "#1f2937"
          : "#f0f9ff"
        : document.documentElement.classList.contains("dark")
        ? "#111827"
        : "#fff",
      borderColor: state.isFocused
        ? "#0ea5e9"
        : document.documentElement.classList.contains("dark")
        ? "#374151"
        : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #0ea5e9" : "none",
      minHeight: 42,
      borderRadius: 8,
    }),
    singleValue: (styles) => ({
      ...styles,
      color: document.documentElement.classList.contains("dark")
        ? "#f9fafb"
        : "#111827",
    }),
    placeholder: (styles) => ({
      ...styles,
      color: document.documentElement.classList.contains("dark")
        ? "#9ca3af"
        : "#6b7280",
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: document.documentElement.classList.contains("dark")
        ? "#1f2937"
        : "#fff",
      zIndex: 50,
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isFocused
        ? document.documentElement.classList.contains("dark")
          ? "rgba(14,165,233,0.3)"
          : "#bae6fd"
        : isSelected
        ? document.documentElement.classList.contains("dark")
          ? "rgba(14,165,233,0.5)"
          : "#7dd3fc"
        : "transparent",
      color: document.documentElement.classList.contains("dark")
        ? "#f9fafb"
        : "#111827",
      cursor: "pointer",
    }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-3xl rounded-xl bg-white p-6 sm:p-8 shadow-xl dark:bg-gray-900 transform transition-all scale-100 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-2 mb-4">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white break-words">
            Apply Internship - {modalBranch?.name}
          </h3>
          <button
            type="button"
            onClick={closeModal}
            className="mt-2 sm:mt-0 rounded-full p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submitForm} className="space-y-4">
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
                placeholder="Full Name"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
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
                placeholder="you@example.com"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
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
                placeholder="123-456-7890"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            {/* Resume */}
            <div className="flex flex-col sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Resume (optional)
              </label>
              <label className="relative cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition flex items-center justify-between px-4 py-2">
                <span className="text-gray-700 dark:text-gray-300">
                  {formData.resume ? formData.resume.name : "Choose a file..."}
                </span>
                <span className="inline-block bg-sky-500 text-white px-3 py-1 text-sm font-medium rounded-lg hover:bg-sky-600 transition">
                  Browse
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </label>
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
                  handleFormChange({
                    target: { name: "courseId", value: selected?.value },
                  })
                }
                options={courses}
                placeholder="Select a course"
                styles={selectStyles}
              />
            </div>

            {/* Year */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Year
              </label>
              <Select
                value={
                  formData.year
                    ? { value: formData.year, label: formData.year }
                    : null
                }
                onChange={(selected) =>
                  handleFormChange({
                    target: { name: "year", value: selected?.value },
                  })
                }
                options={[
                  { value: "1st", label: "1st" },
                  { value: "2nd", label: "2nd" },
                  { value: "3rd", label: "3rd" },
                  { value: "4th", label: "4th" },
                  { value: "Other", label: "Other" },
                ]}
                placeholder="Select Year"
                styles={selectStyles}
              />
            </div>

            {/* Department */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Department
              </label>
              <input
                name="department"
                value={formData.department || ""}
                onChange={handleFormChange}
                placeholder="Department"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            {/* LinkedIn */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                LinkedIn
              </label>
              <input
                name="linkedin"
                value={formData.linkedin || ""}
                onChange={handleFormChange}
                placeholder="LinkedIn URL"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            {/* Portfolio */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Portfolio
              </label>
              <input
                name="portfolio"
                value={formData.portfolio || ""}
                onChange={handleFormChange}
                placeholder="Portfolio URL"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow transition
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
