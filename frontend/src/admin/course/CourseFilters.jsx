import React from "react";

const CourseFilters = ({ filters, onFilterChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert "true"/"false" strings to actual booleans for specific fields
    let processedValue = value;
    if (name === "isFree" || name === "isFeatured") {
      processedValue = value === "true" ? true : value === "false" ? false : value;
    }
    onFilterChange({ [name]: processedValue });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      category: "",
      isFree: "",
      isFeatured: "",
      visibility: "",
      moderationStatus: "",
      sortBy: "createdAt",
      order: "desc",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Search
          </label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            placeholder="Search courses..."
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Category
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
          >
            <option value="">All Categories</option>
            <option value="web-development">Web Development</option>
            <option value="mobile-development">Mobile Development</option>
            <option value="data-science">Data Science</option>
            <option value="ai-ml">AI/ML</option>
            <option value="cybersecurity">Cybersecurity</option>
            <option value="cloud-computing">Cloud Computing</option>
            <option value="devops">DevOps</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Price
          </label>
          <select
            name="isFree"
            value={filters.isFree === true ? "true" : filters.isFree === false ? "false" : ""}
            onChange={handleInputChange}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
          >
            <option value="">All Prices</option>
            <option value="true">Free</option>
            <option value="false">Paid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Min Price
          </label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice || ""}
            onChange={handleInputChange}
            placeholder="Min price"
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Max Price
          </label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice || ""}
            onChange={handleInputChange}
            placeholder="Max price"
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Featured
          </label>
          <select
            name="isFeatured"
            value={filters.isFeatured === true ? "true" : filters.isFeatured === false ? "false" : ""}
            onChange={handleInputChange}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
          >
            <option value="">All</option>
            <option value="true">Featured</option>
            <option value="false">Not Featured</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Visibility
          </label>
          <select
            name="visibility"
            value={filters.visibility}
            onChange={handleInputChange}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
          >
            <option value="">All</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Moderation Status
          </label>
          <select
            name="moderationStatus"
            value={filters.moderationStatus}
            onChange={handleInputChange}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Sort By
          </label>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleInputChange}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
          >
            <option value="createdAt">Created At</option>
            <option value="title">Title</option>
            <option value="price">Price</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Order
          </label>
          <select
            name="order"
            value={filters.order}
            onChange={handleInputChange}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={clearFilters}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default CourseFilters;