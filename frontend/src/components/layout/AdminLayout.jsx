import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import ThemeToggle from "../ThemeToggle";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [isMobileOpen, setIsMobileOpen] = useState(false); 

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900">
      <AdminSidebar
        isOpen={isSidebarOpen}
        isMobileOpen={isMobileOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        toggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
      />

      <div
        className={`flex-1 transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "md:ml-60" : "md:ml-16"} `}
      >
        {/* Mobile header */}
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-800 text-slate-900 dark:text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <span className="ml-4 font-bold text-base">XYNAPSE SYSTEM</span>
          </div>
          <ThemeToggle />
        </div>

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;