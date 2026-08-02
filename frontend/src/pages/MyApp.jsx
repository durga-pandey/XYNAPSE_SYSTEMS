import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import courseService from "../services/courseService";
import courseFormService from "../services/courseFormService";

const sectionCardClasses =
  "rounded-3xl border border-slate-00/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50 sm:p-10";

function AnimatedReveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenTransforms = {
    up: "opacity-0 translate-y-8",
    left: "opacity-0 -translate-x-8",
    right: "opacity-0 translate-x-8",
    scale: "opacity-0 scale-95",
  };
  const visibleClasses = "opacity-100 translate-y-0 translate-x-0 scale-100";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible
          ? visibleClasses
          : hiddenTransforms[variant] ?? hiddenTransforms.up
      } ${className}`}
    >
      {children}
    </div>
  );
}

function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const course = await courseService.getCourseById(courseId);
        setCourse(course);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Course not found");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      await courseFormService.submitCourseForm({
        ...formData,
        courseId,
      });
      setFormSubmitted(true);
      setFormData({ name: "", email: "", mobile: "", city: "" });
    } catch (err) {
      console.error("Form submission failed:", err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading) {
    return (
      <main className="min-h-screen text-slate-900 dark:text-slate-50">
        <div className="mx-auto w-full space-y-16 px-4 py-16 sm:px-6 lg:px-10">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-32 bg-slate-200 rounded"></div>
                <div className="h-48 bg-slate-200 rounded"></div>
              </div>
              <div className="h-96 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen text-slate-900 dark:text-slate-50">
        <div className="mx-auto w-full space-y-16 px-4 py-16 sm:px-6 lg:px-10">
          <div className={`${sectionCardClasses} text-center`}>
            <h1 className="text-4xl font-semibold text-slate-900 dark:text-white mb-4">
              Course Not Found
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-slate-900 dark:text-slate-50">
      <div className="mx-auto w-full space-y-16 px-4 py-16 sm:px-6 lg:px-10">
        {/* Hero Section */}
        <section className={`${sectionCardClasses} grid gap-10 lg:grid-cols-3`}>
          <AnimatedReveal className="lg:col-span-2 space-y-6" variant="left">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
                {course.title}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-5 w-5 ${
                        star <= 4 ? "text-yellow-400 fill-current" : "text-slate-300"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  (4.5) • 2,345 reviews
                </span>
              </div>

              <p className="text-lg text-slate-600 dark:text-slate-300">
                {course.description}
              </p>

              <div className="space-y-2">
                {course.aboutCourse?.slice(0, 4).map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-sm text-slate-700 dark:text-slate-200">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {course.isFree ? "FREE" : `₹${course.price}`}
                </span>
                {!course.isFree && (
                  <span className="text-sm text-slate-500 line-through">₹{course.price * 1.5}</span>
                )}
              </div>

              <button className="rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                Enroll Now
              </button>
            </div>
          </AnimatedReveal>

          <AnimatedReveal variant="right">
            <div className={`${sectionCardClasses} space-y-6`}>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Download Syllabus
              </h3>
              
              {formSubmitted ? (
                <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-center dark:bg-green-900/20 dark:border-green-800">
                  <div className="text-2xl mb-2">✅</div>
                  <p className="text-green-800 dark:text-green-200 font-semibold">
                    Thank you! Syllabus will be sent to your email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="name@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="Your city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                      Course
                    </label>
                    <input
                      type="text"
                      value={course.title}
                      disabled
                      className="w-full rounded border border-slate-300 bg-slate-100 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    {formSubmitting ? "Submitting..." : "Download Syllabus"}
                  </button>
                </form>
              )}
            </div>
          </AnimatedReveal>
        </section>

        {/* Course Details Sections */}
        <section className={`${sectionCardClasses} space-y-8`}>
          <AnimatedReveal>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-6">
              What you will learn
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {course.aboutCourse?.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 text-green-500 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  <span className="text-sm text-slate-700 dark:text-slate-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedReveal>

          <AnimatedReveal>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-6">
              Key Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {course.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-600 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </AnimatedReveal>

          <AnimatedReveal>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-6">
              Curriculum
            </h2>
            <div className="space-y-3">
              {[
                "Module 1: Introduction & Fundamentals",
                "Module 2: Core Concepts & Best Practices",
                "Module 3: Advanced Topics & Techniques",
                "Module 4: Real-world Projects",
                "Module 5: Portfolio Development",
              ].map((module, index) => (
                <div key={index} className="rounded-2xl border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {module}
                    </span>
                    <svg
                      className={`h-5 w-5 transition-transform ${
                        expandedSection === index ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {expandedSection === index && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Comprehensive coverage of {module.toLowerCase()} with hands-on exercises and real-world applications.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AnimatedReveal>

          <AnimatedReveal>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-6">
              Instructor Information
            </h2>
            <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                <div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {course.instructor?.name || "Expert Instructor"}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {course.instructor?.email || "industry@expert.com"}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                Experienced professional with years of industry expertise and passion for teaching.
              </p>
            </div>
          </AnimatedReveal>

          <AnimatedReveal>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-6">
              Placement Assistance
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Resume Building Workshops",
                "Mock Interview Sessions",
                "Portfolio Review",
                "Job Referrals",
                "Career Counseling",
                "Interview Preparation",
              ].map((service, index) => (
                <div key={index} className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span className="text-sm text-slate-700 dark:text-slate-200">
                    {service}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedReveal>
        </section>
      </div>
    </main>
  );
}

export default CourseDetail;
