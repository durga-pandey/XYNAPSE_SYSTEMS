import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import courseService from "../services/courseService";
import courseFormService from "../services/courseFormService";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import SEO from "../components/SEO";

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
      { threshold: 0.2 },
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
          : (hiddenTransforms[variant] ?? hiddenTransforms.up)
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
    country: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const [replyContent, setReplyContent] = useState({});
  const [editContent, setEditContent] = useState({});
  const [editingId, setEditingId] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/review/all-review/${courseId}`,
      );
      setReviews(data.data);
    } catch (err) {
      const message = err?.response?.data?.message;
      console.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const submitReview = async () => {
    if (!content) return;

    try {
      const { data } = await axiosInstance.post(`/review/create/${courseId}`, {
        rating,
        content,
      });
      if (data.success) {
        toast.success(data.message);
        setContent("");
        setRating(5);
        fetchReviews();
      }
    } catch (err) {
      const message = err.response?.data?.message;
      toast.error(message);
      console.log(message);
    }
  };

  const submitReply = async (reviewId) => {
    if (!replyContent[reviewId]) return;

    try {
      const { data } = await axiosInstance.post(`/review/reply/${reviewId}`, {
        content: replyContent[reviewId],
      });
      if (data.success) {
        toast.success(data.message);
        setReplyContent({ ...replyContent, [reviewId]: "" });
        fetchReviews();
      }
    } catch (err) {
      const message = err.response?.data?.message;
      console.log(message);
      toast.error(message);
    }
  };

  const updateReview = async (reviewId) => {
    try {
      const { data } = await axiosInstance.patch(`/review/update/${reviewId}`, {
        content: editContent[reviewId],
      });
      if (data.success) {
        toast.success(data.message);
        setEditingId(null);
        fetchReviews();
      }
    } catch (err) {
      const message = err.response?.data?.message;
      console.log(message);
      toast.error(message);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm("Delete this review?")) return;

    try {
      const { data } = await axiosInstance.patch(
        `/review/soft-delete/${reviewId}`,
      );
      if (data.success) {
        toast.success(data.message);
        fetchReviews();
      }
    } catch (err) {
      const message = err.response?.data?.message;
      console.log(message);
      toast.error(message);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const course = await courseService.getCourseById(courseId);
        setCourse(course);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Course not found",
        );
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
      const response = await courseFormService.submitCourseForm({
        ...formData,
        courseId,
      });

      const url = response?.downloadUrl;
      const courseTitle = response?.data?.courseId?.title || "Syllabus";

      if (url) {
        const res = await fetch(url);
        const blob = await res.blob();

        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;

        const safeFileName = `${courseTitle.replace(/[^a-z0-9]/gi, "_")}.pdf`;

        link.setAttribute("download", safeFileName);
        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(blobUrl);
      }

      setFormSubmitted(true);
      setFormData({ name: "", email: "", mobile: "", city: "", country: "" });
    } catch (err) {
      console.error("Submission/Download failed:", err);
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
    <>
      <SEO
        title={`${course?.title || "Course Detail"} | Xynapse Systems`}
        description={
          course?.description ||
          "Explore course details, syllabus, and career opportunities at Xynapse Systems."
        }
        canonical={`https://xynapsesystems.com/course/${courseId}`}
        image="https://xynapsesystems.com/images/Logo.png"
      />
      <main className="min-h-screen text-slate-900 dark:text-slate-50">
        <div className="mx-auto w-full space-y-16 px-4 py-16 sm:px-6 lg:px-10">
          <section
            className={`${sectionCardClasses} grid gap-10 lg:grid-cols-3`}
          >
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
                          star <= 4
                            ? "text-yellow-400 fill-current"
                            : "text-slate-300"
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

                <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
                  {course.description}
                </p>

                <div className="mt-4 space-y-3">
                  {course.aboutCourse?.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <svg
                        className="h-6 w-6 text-green-500 group-hover:scale-110 transition-transform duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                      <span className="text-sm md:text-base text-slate-700 dark:text-slate-200 font-medium">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">
                    {course.isFree ? "" : `₹${course.price}`}
                  </span>
                  {!course.isFree && (
                    <span className="text-sm text-slate-500 line-through">
                      ₹{course.price * 1.5}
                    </span>
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
                      Thank you! Syllabus downloaded. We will get back to you soon.
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
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
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

          <section className={`${sectionCardClasses} space-y-8`}>
            <AnimatedReveal>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-6">
                What you will learn
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                {course.aboutCourse?.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <svg
                      className="h-6 w-6 text-green-500 mt-1 group-hover:scale-110 transition-transform duration-300"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-sm md:text-base text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
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
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 dark:border-slate-700"
                  >
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
                          Comprehensive coverage of {module.toLowerCase()} with
                          hands-on exercises and real-world applications.
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
                  Experienced professional with years of industry expertise and
                  passion for teaching.
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

            <div className="mt-10 space-y-6">
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold mb-2">Add Review</h3>

                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-6 h-6 cursor-pointer ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.965a1 1 0 00.95.69h4.184c.969 0 1.371 1.24.588 1.81l-3.388 2.462a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.539 1.118l-3.388-2.462a1 1 0 00-1.176 0l-3.388 2.462c-.783.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.044 9.392c-.783-.57-.38-1.81.588-1.81h4.184a1 1 0 00.95-.69l1.286-3.965z" />
                    </svg>
                  ))}
                </div>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border rounded p-2 outline-none"
                  placeholder="Write your review..."
                />

                <button
                  onClick={submitReview}
                  className="mt-2 rounded bg-sky-500 px-4 py-2 text-white"
                >
                  Submit Review
                </button>
              </div>

              {/* REVIEWS LIST */}
              {loading ? (
                <p>Loading reviews...</p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="rounded-xl border p-4 space-y-3"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">{review.user.name}</p>
                        <p className="text-sm">{review.rating} ⭐</p>
                      </div>

                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() => setEditingId(review._id)}
                          className="text-sky-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteReview(review._id)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* EDIT MODE */}
                    {editingId === review._id ? (
                      <>
                        <textarea
                          defaultValue={review.content}
                          onChange={(e) =>
                            setEditContent({
                              ...editContent,
                              [review._id]: e.target.value,
                            })
                          }
                          className="w-full border rounded p-2"
                        />
                        <button
                          onClick={() => updateReview(review._id)}
                          className="mt-1 text-sm text-green-600"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <p>{review.content}</p>
                    )}

                    {/* REPLIES */}
                    <div className="ml-6 space-y-3">
                      {review.replies.map((reply) => (
                        <div key={reply._id} className="border-l pl-3">
                          <div className="flex justify-between">
                            <p className="font-medium text-sm">
                              {reply.user.name}
                            </p>
                            <button
                              onClick={() => deleteReview(reply._id)}
                              className="text-xs text-red-500"
                            >
                              Delete
                            </button>
                          </div>
                          <p className="text-sm">{reply.content}</p>
                        </div>
                      ))}

                      {/* ADD REPLY */}
                      <textarea
                        value={replyContent[review._id] || ""}
                        onChange={(e) =>
                          setReplyContent({
                            ...replyContent,
                            [review._id]: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 text-sm"
                        placeholder="Reply..."
                      />
                      <button
                        onClick={() => submitReply(review._id)}
                        className="text-xs text-sky-500"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default CourseDetail;
