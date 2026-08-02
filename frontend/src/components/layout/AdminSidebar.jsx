import {
  FaUserGraduate,
  FaHome,
  FaEnvelope,
  FaFileAlt,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaMoon,
  FaSun,
  FaBook,
  FaClipboardList,
  FaQuestionCircle,
  FaReceipt,
  FaMoneyBill,
  FaUserPlus,
  FaBriefcase,
  FaUser,
  FaUserCog,
  FaDiscourse,
  FaBookReader,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const menuItems = [
  { name: "Users", icon: <FaUser />, link: "/admin/users" },
  { name: "Courses", icon: <FaBook />, link: "/admin/courses" },
  {
    name: "Course Forms",
    icon: <FaClipboardList />,
    link: "/admin/course-forms",
  },
  { name: "Internship", icon: <FaUserGraduate />, link: "/admin/internship" },
  { name: "Course Completion", icon: <FaDiscourse />, link: "/admin/course-completion" },
  { name: "Syllabus", icon: <FaBookReader />, link: "/admin/syllabus" },
  { name: "College", icon: <FaUserCog />, link: "/admin/college" },
  {
    name: "Interview Q&A",
    icon: <FaQuestionCircle />,
    link: "/admin/interview",
  },
  { name: "Invoices", icon: <FaReceipt />, link: "/admin/invoices" },
  { name: "Salary Slips", icon: <FaMoneyBill />, link: "/admin/salary-slips" },
  {
    name: "Employee Applications",
    icon: <FaUserPlus />,
    link: "/admin/employee-applications",
  },
  { name: "Job Postings", icon: <FaBriefcase />, link: "/admin/job-postings" },
];

const AdminSidebar = ({
  isOpen,
  toggleSidebar,
  isMobileOpen,
  toggleMobileSidebar,
}) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile menu button */}
      {!isOpen && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={toggleMobileSidebar}
            className="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-300"
          >
            <FaBars size={20} />
          </button>
        </div>
      )}

      {/* Sidebar container */}
      <div
        className={`fixed top-0 left-0 h-screen text-white shadow-2xl z-40 flex flex-col transition-all duration-300
          ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0
          ${
            isOpen
              ? "w-60 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-slate-900 dark:to-slate-950"
              : "w-16 bg-gray-100 dark:bg-slate-900"
          }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            theme === "light"
              ? "border-gray-200 bg-white"
              : "border-gray-700 dark:border-slate-700"
          }`}
        >
          {isOpen && (
            <div className="flex items-center space-x-2">
              <div className="bg-slate-100 dark:bg-slate-700 p-1.5 rounded-lg">
                <FaHome className="text-slate-700 dark:text-white" size={16} />
              </div>
              <span className="text-base font-bold tracking-wide text-slate-700 dark:text-white">
                XYNAPSE SYSTEM
              </span>
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className={`hidden md:flex items-center justify-center p-1.5 rounded-full ${
              theme === "light"
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-gray-700 dark:bg-slate-800 hover:bg-gray-600 dark:hover:bg-slate-700"
            } transition-all duration-300
              ${isMobileOpen ? "hidden" : ""}`}
          >
            {isOpen ? (
              <FaChevronLeft
                className={`${
                  theme === "light" ? "text-slate-700" : "text-gray-300"
                }`}
                size={16}
              />
            ) : (
              <FaChevronRight
                className={`${
                  theme === "light" ? "text-slate-700" : "text-gray-300"
                }`}
                size={16}
              />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 px-1.5 overflow-y-auto">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.link;
            return (
              <Link
                key={idx}
                to={item.link}
                className={`flex items-center px-3 py-2.5 my-1 rounded-lg text-sm font-medium transition-all duration-300
                  ${
                    isActive
                      ? theme === "light"
                        ? "bg-slate-800 text-slate-200 shadow-sm"
                        : "bg-sky-700 dark:bg-sky-800 text-white shadow-md"
                      : isOpen
                      ? theme === "light"
                        ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        : "text-gray-300 hover:bg-sky-700/30 dark:hover:bg-sky-800/30 hover:text-white"
                      : theme === "light"
                      ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      : "text-gray-400 hover:bg-gray-700/50 dark:hover:bg-slate-800/50 hover:text-white"
                  }`}
              >
                <div className="text-base">{item.icon}</div>
                {(isOpen || isMobileOpen) && (
                  <span className="ml-2.5 font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        {isOpen && (
          <div
            className={`p-3 border-t ${
              theme === "light"
                ? "border-gray-200 bg-white"
                : "border-gray-700 dark:border-slate-700"
            }`}
          >
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-between w-full p-2.5 rounded-lg ${
                theme === "light"
                  ? "bg-slate-100 hover:bg-slate-200"
                  : "bg-gray-700/50 dark:bg-slate-800 hover:bg-gray-700 dark:hover:bg-slate-700"
              } transition-all duration-300`}
            >
              <div className="flex items-center">
                {theme === "dark" ? (
                  <FaMoon className="text-yellow-400 mr-2.5" size={16} />
                ) : (
                  <FaSun className="text-amber-500 mr-2.5" size={16} />
                )}
                <span
                  className={`${
                    theme === "light"
                      ? "text-slate-700 font-medium"
                      : "text-gray-200 font-medium"
                  }`}
                >
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </span>
              </div>
              <div className="flex items-center">
                {theme === "dark" ? (
                  <span className="text-yellow-400 text-xs">ON</span>
                ) : (
                  <span className="text-amber-500 text-xs">OFF</span>
                )}
              </div>
            </button>
          </div>
        )}

        {/* Footer */}
        {isOpen && (
          <div
            className={`p-3 border-t ${
              theme === "light"
                ? "border-gray-200 bg-white text-slate-600"
                : "border-gray-700 dark:border-slate-700 text-gray-400 dark:text-slate-400"
            } text-xs`}
          >
            <div className="flex items-center justify-between">
              <span>Logged in as</span>
              <span className="font-medium">Admin</span>
            </div>
            <div className="mt-1 text-[0.6rem] opacity-75">
              Xynapse Systems © {new Date().getFullYear()}
            </div>
          </div>
        )}
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-slate-900/50 z-30 md:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}
    </>
  );
};

export default AdminSidebar;
