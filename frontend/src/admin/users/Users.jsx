import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    roleStatus: "",
    isTwofaEnabled: "",
    emailVerified: "",
    phoneVerified: "",
    page: 1,
    limit: 10,
  });
  const [totalPages, setTotalPages] = useState(1);

  // Modal state for role update
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  // Modal state for view user
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  // Fetch users with filters
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        isTwofaEnabled:
          filters.isTwofaEnabled === ""
            ? undefined
            : filters.isTwofaEnabled === true ||
              filters.isTwofaEnabled === "true",
        emailVerified:
          filters.emailVerified === ""
            ? undefined
            : filters.emailVerified === true ||
              filters.emailVerified === "true",
        phoneVerified:
          filters.phoneVerified === ""
            ? undefined
            : filters.phoneVerified === true ||
              filters.phoneVerified === "true",
      };
      const res = await axiosInstance.get("/auth/all-users", { params });
      setUsers(res.data.data || []);
      setTotalPages(Math.ceil(res.data.total / filters.limit));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  // Role modal functions
  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleModalOpen(true);
  };

  const updateRole = async () => {
    if (!selectedUser) return;
    try {
      await axiosInstance.patch(`/auth/role/${selectedUser._id}`, {
        role: newRole,
      });
      setRoleModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // View modal function
  const openViewModal = (user) => {
    setViewUser(user); // user data already available
    setViewModalOpen(true);
  };

  // Toggle functions
  const toggleDeleted = async (userId, value) => {
    try {
      await axiosInstance.patch(`/auth/soft-delete/${userId}`, { value });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleActive = async (userId, value) => {
    try {
      await axiosInstance.patch(`/auth/toggle/${userId}`, { value });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBlock = async (userId, value) => {
    try {
      await axiosInstance.patch(`/auth/block/${userId}`, { value });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const hardDelete = async (userId) => {
    try {
      await axiosInstance.delete(`/auth/hard-delete/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
        Users Management
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by name, email or mobile..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value, page: 1 })
          }
          className="rounded-xl outline-none border px-4 py-2 focus:ring focus:ring-indigo-200 w-full"
        />
        <select
          value={filters.role}
          onChange={(e) =>
            setFilters({ ...filters, role: e.target.value, page: 1 })
          }
          className="rounded-xl outline-none border px-4 py-2 w-full"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
        </select>
        <select
          value={filters.roleStatus}
          onChange={(e) =>
            setFilters({ ...filters, roleStatus: e.target.value, page: 1 })
          }
          className="rounded-xl outline-none border px-4 py-2 w-full"
        >
          <option value="">All Role Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={filters.isTwofaEnabled}
          onChange={(e) =>
            setFilters({
              ...filters,
              isTwofaEnabled:
                e.target.value === "" ? "" : e.target.value === "true",
              page: 1,
            })
          }
          className="rounded-xl border px-4 py-2 w-full"
        >
          <option value="">2FA Status</option>
          <option value="true">Enabled</option>
          <option value="false">Disabled</option>
        </select>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse h-28 bg-slate-200 rounded-xl dark:bg-slate-700"
            ></div>
          ))}
        </div>
      ) : users?.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 mt-6">
          No users found
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white dark:bg-slate-900 shadow-md rounded-2xl p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    {user.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {user.email || user.mobile}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Role: {user.role} ({user.roleStatus})
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs"
                  onClick={() => openRoleModal(user)}
                >
                  Change Role
                </button>

                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs"
                  onClick={() => openViewModal(user)}
                >
                  View
                </button>

                <button
                  className={`px-3 py-1 rounded-lg text-xs ${
                    user.isDeleted ? "bg-red-500" : "bg-green-500"
                  } text-white`}
                  onClick={() => {
                    setUsers((prev) =>
                      prev.map((u) =>
                        u._id === user._id
                          ? { ...u, isDeleted: !u.isDeleted }
                          : u
                      )
                    );
                    toggleDeleted(user._id, !user.isDeleted);
                  }}
                >
                  {user.isDeleted ? "Restore" : "Delete"}
                </button>

                <button
                  className={`px-3 py-1 rounded-lg text-xs ${
                    user.isActive ? "bg-green-500" : "bg-gray-500"
                  } text-white`}
                  onClick={() => {
                    setUsers((prev) =>
                      prev.map((u) =>
                        u._id === user._id ? { ...u, isActive: !u.isActive } : u
                      )
                    );
                    toggleActive(user._id, !user.isActive);
                  }}
                >
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>

                <button
                  className={`px-3 py-1 rounded-lg text-xs ${
                    user.isBlock ? "bg-red-600" : "bg-indigo-600"
                  } text-white`}
                  onClick={() => {
                    setUsers((prev) =>
                      prev.map((u) =>
                        u._id === user._id ? { ...u, isBlock: !u.isBlock } : u
                      )
                    );
                    toggleBlock(user._id, !user.isBlock);
                  }}
                >
                  {user.isBlock ? "Unblock" : "Block"}
                </button>

                <button
                  className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded-lg text-xs"
                  onClick={() => {
                    setUsers((prev) => prev.filter((u) => u._id !== user._id));
                    hardDelete(user._id);
                  }}
                >
                  Hard Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Role Modal */}
      {roleModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-80 space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Update Role
            </h3>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full outline-none rounded-xl border px-4 py-2"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-black"
                onClick={() => setRoleModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white"
                onClick={updateRole}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && viewUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-2xl space-y-6 shadow-xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 text-center">
              User Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-300">
              {Object.entries(viewUser)
                .filter(
                  ([key]) =>
                    !["id", "_id", "createdAt", "updatedAt"].includes(key)
                )
                .map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="font-semibold capitalize">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </span>
                    {key === "role" ? (
                      <span
                        className={`mt-1 px-2 py-1 rounded-full text-white text-xs w-max ${
                          value === "student"
                            ? "bg-blue-500"
                            : value === "instructor"
                            ? "bg-green-500"
                            : value === "admin"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {value}
                      </span>
                    ) : typeof value === "object" ? (
                      <pre className="mt-1 bg-slate-100 dark:bg-slate-800 p-2 rounded-md overflow-x-auto">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    ) : (
                      <span className="mt-1">{value?.toString()}</span>
                    )}
                  </div>
                ))}
            </div>

            <div className="flex justify-center mt-4">
              <button
                className="px-6 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-black hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                onClick={() => setViewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          disabled={filters.page === 1}
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
        >
          Previous
        </button>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Page {filters.page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          disabled={filters.page === totalPages}
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;
