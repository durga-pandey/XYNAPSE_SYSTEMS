import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

export default function Footer({ footerNav = [], socials = [] }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const branches = [
    "Ameerpet",
    "Hitec City",
    "Secunderabad",
    "Dilsukhnagar",
    "Mehdipatnam",
    "Kukatpally",
    "Bangalore",
    "Visakhapatnam",
    "Delhi",
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axiosInstance.get("/course/all-courses");

        if (data.success) {
          setCourses(data.data || []);
        }
      } catch (err) {
        const message = err?.response?.data?.message;
        console.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <footer className="mt-12 border-t border-slate-200/70 bg-white px-4 py-12 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
      {/* TOP GRID */}
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-4">
        {/* BRAND */}
        <div className="space-y-4">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            XYNAPSE SYSTEMS
          </Link>
          <p className="leading-relaxed">
            Cohort-based learning, live mentorship, and production-grade
            projects.
          </p>

          <div className="flex gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-sky-400 hover:text-sky-500 dark:border-slate-700 dark:text-slate-300"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* EXPLORE */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Explore
          </p>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="font-medium transition hover:text-sky-500"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                className="font-medium transition hover:text-sky-500"
              >
                Courses
              </Link>
            </li>
            <li>
              <Link
                to="/branches"
                className="font-medium transition hover:text-sky-500"
              >
                Branches
              </Link>
            </li>
            <li>
              <Link
                to="/colleges"
                className="font-medium transition hover:text-sky-500"
              >
                Colleges
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="font-medium transition hover:text-sky-500"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className="font-medium transition hover:text-sky-500"
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                to="/placements/alumni"
                className="font-medium transition hover:text-sky-500"
              >
                Alumni
              </Link>
            </li>
            <li>
              <Link
                to="/placements/recruiters"
                className="font-medium transition hover:text-sky-500"
              >
                Recruiter
              </Link>
            </li>
          </ul>
        </div>

        {/* COURSES */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Courses
          </p>

          {loading && (
            <p className="text-xs text-slate-400">Loading courses…</p>
          )}

          {!loading && courses.length === 0 && (
            <p className="text-xs text-slate-400">No courses available</p>
          )}

          <ul className="space-y-2">
            {courses.map((course) => (
              <li key={course._id}>
                <Link
                  to={`/course/${course._id}`}
                  className="font-medium transition hover:text-sky-500 cursor-pointer"
                >
                  {course.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* BRANCHES */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Branches
          </p>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
            {branches.map((branch) => (
              <li key={branch}>
                <span className="font-medium transition hover:text-sky-500 cursor-pointer">
                  {branch}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} Xynapse Systems. All rights reserved.
        </span>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-sky-500">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-sky-500">
            Terms
          </Link>
          <Link to="/accessibility" className="hover:text-sky-500">
            Accessibility
          </Link>
        </div>
      </div>
    </footer>
  );
}
