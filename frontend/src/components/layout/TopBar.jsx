import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Globe3D from "../Globe3D";

// COMPLETE SOCIAL ICONS WITH PROPER SVGs - FULLY RESPONSIVE
const DEFAULT_SOCIALS = [
  {
    label: "YouTube",
    href: "https://youtube.com/@realxynapse",
    color: "#FF0000",
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/realxynapse",
    color: "#1877F2",
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.154 12.137c0-6.756-5.492-12.249-12.249-12.249-6.757 0-12.25 5.493-12.25 12.249 0 6.211 4.547 11.369 10.457 12.31v-8.66h-3.153v-3.562h3.153v-2.7c0-3.135 1.916-4.846 4.712-4.846 1.392 0 2.907.247 2.907.247v3.184h-1.637c-1.616 0-2.122 1.004-2.122 2.033v2.45h3.626l-.585 3.562h-3.041v8.66c5.91-.941 10.457-4.099 10.457-12.31z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/realxynapse",
    color: "#E4405F",
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm6.5-10.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/realxynapse",
    color: "#0A66C2",
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1 4.98 2.12 4.98 3.5zM.48 8.98h4V24h-4V8.98zM8.98 8.98h3.84v2.05h.05c.53-1 1.82-2.05 3.75-2.05 4 0 4.74 2.63 4.74 6.05V24h-4v-7.98c0-1.9-.03-4.35-2.65-4.35-2.65 0-3.06 2.07-3.06 4.21V24h-4V8.98z"/>
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://twitter.com/realxynapse",
    color: "#1DA1F2",
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.38 0-4.3 1.92-4.3 4.29 0 .34.04.67.11.98-3.58-.18-6.75-1.9-8.88-4.51a4.28 4.28 0 0 0-.58 2.16c0 1.49.76 2.81 1.92 3.58a4.28 4.28 0 0 1-1.95-.54v.05c0 2.08 1.48 3.81 3.44 4.2a4.3 4.3 0 0 1-1.94.07c.55 1.72 2.14 2.97 4.03 3a8.6 8.6 0 0 1-5.33 1.84c-.35 0-.69-.02-1.02-.06A12.14 12.14 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.35-.02-.53A8.32 8.32 0 0 0 22.46 6z"/>
      </svg>
    ),
  },
];


export default function TopBar({
  openModal,
  isAuthenticated,
  goToProfile,
  socials = DEFAULT_SOCIALS,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <>
      <div className="border-b border-slate-200/70 bg-slate-50 text-[13px] text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-7xl  py-2 sm:px-4 sm:py-3 md:px-6 lg:px-8 flex items-center justify-between">
         
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <video
                src="https://res.cloudinary.com/dcll0n88n/video/upload/v1769241488/earth_qghxkj.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="brand-text mt-1 sm:mt-2 hidden sm:flex text-[10px] sm:text-xs md:text-sm leading-tight tracking-tighter text-slate-900 dark:text-white">
              <span>X</span>
              <span>Y</span>
              <span>N</span>
              <span>A</span>
              <span>P</span>
              <span>S</span>
              <span>E</span>
              <span className="gap"></span>
              <span>S</span>
              <span>Y</span>
              <span>S</span>
              <span>T</span>
              <span>E</span>
              <span>M</span>
              <span>S</span>
            </div>
          </div>

          {/* Center: Contact info - Responsive stacking */}
          <div className="hidden sm:flex flex-1 flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 text-slate-600 dark:text-slate-200">
            <span className="inline-flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap">
              📞 +91 7309900393
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap">
              📱 Download Mobile App
            </span>
            <span className="hidden lg:inline-flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap">
              ➕ Blogs
            </span>
          </div>

          {/* Right: Smart Responsive Buttons - NO SCROLLING */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 flex-nowrap min-w-0">
            {/* Job Mela - Hide on very small tablets */}
            <Link
              to="/job-mela"
              className="hidden sm:inline-flex lg:flex items-center gap-1 rounded-full bg-rose-600 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-white shadow-md shadow-rose-600/30 hover:shadow-lg transition-all whitespace-nowrap flex-shrink-0 login-btn"
            >
              Job Mela
            </Link>

            {/* Enroll - Priority 1, always visible */}
            <button
              onClick={() => openModal("enroll", { name: "Online Enrollment" })}
              className="sm:inline-flex items-center gap-1 rounded-full bg-sky-600 px-2 sm:px-2.5 md:px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-white hover:bg-sky-500 enroll-cta transition-all whitespace-nowrap flex-shrink-0 login-btn"
            >
              Enroll
            </button>

            {/* Internship - Hide on small tablets */}
            <button
              onClick={() =>
                openModal("internship", { name: "Internship Application" })
              }
              className="hidden sm:inline-flex md:flex items-center gap-1 text-white rounded-full border border-slate-300 px-2 sm:px-2.5 py-1.5 text-[10px] sm:text-xs font-semibold hover:bg-slate-100 dark:border-white/30 dark:text-slate-300 dark:hover:text-slate-800 shimmer-btn transition-all whitespace-nowrap flex-shrink-0 login-btn"
            >
              Internship
            </button>

            {/* Resources - Hide first on tablets */}
            <div className="relative hidden lg:inline-block xl:inline-flex group flex-shrink-0">
              <button className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/30 dark:text-slate-300 dark:hover:text-slate-800 transition-all whitespace-nowrap">
                Resources
                <svg
                  className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="invisible absolute left-0 top-full z-30 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-xl opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:border-white/20 dark:bg-slate-900">
                <a
                  href="https://youtube.com/@realxynapse?si=7PS2DXi8SZKJ_3Tb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-t-xl px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  🎥 Video Lectures
                </a>
                <Link
                  to="/resources/interview-questions"
                  className="block w-full rounded-b-xl px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  📄 Interview Questions
                </Link>
              </div>
            </div>

            {/* Login/Profile - Priority 2 */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="sm:inline-flex items-center gap-1 rounded-full px-2 sm:px-3 py-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-white border border-indigo-300/40 dark:border-indigo-500/30 overflow-hidden hover:shadow-md transition-all whitespace-nowrap flex-shrink-0 login-btn"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={goToProfile}
                className="hidden sm:inline-flex items-center gap-1 rounded-full border border-slate-300 px-2 sm:px-2.5 py-1.5 text-[10px] sm:text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/30 dark:text-slate-300 transition-all whitespace-nowrap flex-shrink-0"
              >
                Profile
              </button>
            )}

            {/* Social Icons - Show 3 on XL+, all 5 in sidebar */}
            <div className="hidden xl:flex xl:items-center gap-1 xl:gap-2 flex-shrink-0">
             {socials.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  title={item.label}
                  className="group relative flex h-7 w-7 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-900 hover:shadow-lg hover:scale-110 transition-all duration-300 flex-shrink-0"
                  style={{
                    borderColor: item.color,
                    color: item.color,
                    animation: `socialFloat 4.5s ease-in-out ${index * 0.6}s infinite`,
                  }}
                >
                  <span className="relative z-10">{item.icon}</span>
                  <div
                    className="absolute inset-0 rounded-full opacity-20 blur-sm"
                    style={{ backgroundColor: item.color }}
                  />
                </a>
              ))}
            </div>

            {/* Hamburger - Always last, larger touch target */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden ml-1 sm:ml-2 p-2.5 text-xl flex-shrink-0 hover:bg-slate-200 rounded-full transition-all duration-200"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar - Full height, perfect touch targets */}
      <div
        className={`fixed inset-0 z-50 ${
          sidebarOpen ? "visible opacity-100" : "invisible opacity-0"
        } transition-all duration-300 md:hidden`}
      >
        <div
          onClick={() => setSidebarOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 p-6 transition-transform duration-300 shadow-2xl flex flex-col ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close Button */}
          <div className="flex justify-end mb-6 pt-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-3xl font-bold text-slate-700 dark:text-slate-200 hover:text-red-500 transition-all p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6 text-base flex-1 overflow-y-auto pb-8">
            {/* Contact Info */}
            <div className="flex flex-col gap-3 text-slate-600 dark:text-slate-200 pb-6 border-b border-slate-200 dark:border-slate-700">
              <span className="flex items-center gap-3 text-lg">
                📞 1800-120-4748
              </span>
              <span className="flex items-center gap-3 text-lg">
                📱 Download Mobile App
              </span>
              <span className="flex items-center gap-3 text-lg">➕ Blogs</span>
            </div>

            {/* ALL Action Buttons - Full width, large touch targets */}
            <div className="flex flex-col gap-4">
              <Link
                to="/job-mela"
                className="group rounded-2xl bg-rose-600 px-6 py-4 text-white text-left font-bold shadow-xl hover:bg-rose-500 hover:shadow-2xl transition-all duration-200 flex items-center gap-3 login-btn"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-2xl">🎯</span>
                Job Mela
              </Link>

              <button
                onClick={() => {
                  openModal("enroll", { name: "Online Enrollment" });
                  setSidebarOpen(false);
                }}
                className="group rounded-2xl bg-sky-600 px-6 py-4 text-white text-left font-bold shadow-xl hover:bg-sky-500 hover:shadow-2xl transition-all duration-200 flex items-center gap-3 enroll-cta login-btn"
              >
                <span className="text-2xl">🚀</span>
                Enroll Now
              </button>

              <button
                onClick={() => {
                  openModal("internship", { name: "Internship Application" });
                  setSidebarOpen(false);
                }}
                className="group rounded-2xl border-2 border-slate-300 px-6 py-4 text-left font-bold hover:bg-slate-50 hover:shadow-xl dark:border-white/30 dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-3 shimmer-btn"
              >
                <span className="text-2xl">💼</span>
                Internship
              </button>

              {/* Resources Accordion */}
              <div className="relative">
                <button
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className="w-full group rounded-2xl border-2 border-slate-300 px-6 py-4 text-left font-bold flex justify-between items-center hover:bg-slate-50 hover:shadow-xl dark:border-white/30 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📚</span>
                    Resources
                  </div>
                  <ChevronDown
                    className={`h-6 w-6 transition-transform duration-200 ease-in-out ${
                      resourcesOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                {resourcesOpen && (
                  <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-lg dark:border-white/20 dark:bg-slate-800/50">
                    <a
                      href="https://youtube.com/@realxynapse?si=7PS2DXi8SZKJ_3Tb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-xl px-5 py-4 font-semibold text-slate-700 transition-all duration-200 hover:bg-white hover:shadow-md hover:-translate-x-1 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <span className="text-2xl flex-shrink-0">🎥</span>
                      <span>Video Lectures</span>
                    </a>
                    <Link
                      to="/resources/interview-questions"
                      className="group flex items-center gap-4 rounded-xl px-5 py-4 font-semibold text-slate-700 transition-all duration-200 hover:bg-white hover:shadow-md hover:-translate-x-1 dark:text-slate-200 dark:hover:bg-slate-700"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="text-2xl flex-shrink-0">📄</span>
                      <span>Interview Questions</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Login/Profile */}
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="group rounded-2xl border-2 border-slate-300 px-6 py-4 text-left font-bold hover:bg-slate-50 hover:shadow-xl dark:border-white/30 dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-3 login-btn"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-2xl">👤</span>
                  Student Login
                </Link>
              ) : (
                <button
                  onClick={() => {
                    goToProfile();
                    setSidebarOpen(false);
                  }}
                  className="group rounded-2xl border-2 border-slate-300 px-6 py-4 text-left font-bold hover:bg-slate-50 hover:shadow-xl dark:border-white/30 dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-3 login-btn"
                >
                  <span className="text-2xl">👤</span>
                  My Profile
                </button>
              )}
            </div>

            {/* Social Icons Bottom - ALL 5 icons */}
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 pt-8 border-t border-slate-200 dark:border-slate-700 mt-auto">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative p-3 sm:p-4 rounded-2xl border-2 bg-white dark:bg-slate-800 flex items-center justify-center hover:scale-110 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-14 h-14 sm:w-16 sm:h-16"
                  title={item.label}
                  style={{
                    borderColor: item.color,
                    color: item.color,
                  }}
                >
                  <span className="relative z-10 text-lg sm:text-xl">
                    {item.icon}
                  </span>
                  <div
                    className="absolute inset-0 rounded-2xl opacity-20 blur-sm -z-10"
                    style={{ backgroundColor: item.color }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes socialFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        @keyframes enrollPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(14, 165, 233, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(14, 165, 233, 0);
          }
        }
        .enroll-cta {
          animation: enrollPulse 2s ease-in-out infinite;
        }
        .shimmer-btn {
          position: relative;
          overflow: hidden;
        }
        .shimmer-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: left 0.5s;
        }
        .shimmer-btn:hover::before {
          left: 100%;
        }
        .login-btn {
          transition: all 0.2s ease-in-out;
        }
        .login-btn:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}
