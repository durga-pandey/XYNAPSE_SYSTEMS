import { Link } from "react-router-dom";
import { AnimatedReveal } from "./Landing";

const sectionCardClasses =
  "rounded-3xl border border-slate-00/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50 sm:p-10";

const gradientAnimationStyle = `
@keyframes gradient-x {
  0%,100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}
`;

const CourseSection = ({ topCoursesLoading, topCourses }) => {
  const displayedCourses = topCourses?.slice(0, 6) || [];

  return (
    <>
      <style>{gradientAnimationStyle}</style>
      <section className={`${sectionCardClasses} space-y-6`}>
        <AnimatedReveal className="space-y-2">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Popular Courses
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Explore our most-enrolled courses — industry-aligned, mentor-led, and project-focused.
          </p>
        </AnimatedReveal>

        {/* Courses Grid */}
        {topCoursesLoading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60 h-[420px]"
              >
                <div className="h-40 w-full rounded-md bg-slate-100 dark:bg-slate-800" />
                <div className="mt-3 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mt-2 h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        ) : displayedCourses.length ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {displayedCourses.map((c) => (
              <AnimatedReveal key={c._id} delay={50}>
                <Link
                  to={`/course/${c._id}`}
                  className="relative group block rounded-2xl overflow-hidden p-0.5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500 via-slate-700 to-gray-400  dark:from-gray-400 dark:via-slate-500 dark:to-gray-600  rounded-2xl blur opacity-50 transition-opacity duration-500 group-hover:opacity-100 animate-gradient-x"></div>

                  <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl h-[420px] flex flex-col">
                    <div className="h-40 w-full overflow-hidden rounded-md bg-slate-100">
                      <img
                        src={
                          c.thumbnail?.secure_url ||
                          "https://th.bing.com/th/id/OIP.zClTcXaFYpmlBiFl-7QJeQHaHa?w=215&h=215&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3"
                        }
                        alt={c.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-3 flex flex-col gap-2 flex-1">
                      <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                        {c.title}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-4 flex-1">
                        {c.description || "No description available."}
                      </p>

                      {/* Tags */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {c.tags?.slice(0, 5).map((tag, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 dark:bg-slate-700 text-xs font-medium px-2 py-1 rounded-full text-slate-800 dark:text-slate-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedReveal>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No courses available.</p>
        )}

        {/* View All Courses */}
        <div className="text-center">
          <Link
            to="/courses"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:text-slate-200"
          >
            View all courses
          </Link>
        </div>
      </section>
    </>
  );
};

export default CourseSection;
