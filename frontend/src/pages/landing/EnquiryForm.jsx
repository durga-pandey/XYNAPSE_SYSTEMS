import { useState, useEffect } from "react";
import { AnimatedReveal } from "./Landing";
import axiosInstance from "../../utils/axiosInstance";

const sectionCardClasses =
  "rounded-3xl border border-slate-00/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50 sm:p-10";

const featuresList = [
  "Free Career Guidance",
  "IIT Approved Curriculum",
  "Dedicated Student Dashboard",
  "Classroom & Online Trainings",
  "Class Recordings",
  "Course Materials",
  "Module Based Assessments",
  "Hands-On Projects",
  "Internship Opportunity",
  "100% Job Assistance",
];

const EnquiryForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axiosInstance.post("/getTouch/create", formData);

      if (res.data?.success) {
        setSuccessMsg(res.data.message || "Request submitted successfully");

        setFormData({
          fullName: "",
          email: "",
          mobile: "",
          message: "",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  return (
    <>
      <section className={`${sectionCardClasses} grid gap-10 lg:grid-cols-2`}>
        {/* LEFT CONTENT */}
        <AnimatedReveal className="space-y-4">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Excel with XYNAPSE SYSTEMS
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {featuresList.map((feature, index) => (
              <AnimatedReveal key={feature} delay={index * 70}>
                <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                  {feature}
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </AnimatedReveal>

        <AnimatedReveal variant="right">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60"
          >
            
            {successMsg && (
              <div className="rounded-lg bg-green-100 border border-green-300 px-4 py-2 text-sm font-medium text-green-700">
                {successMsg}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                Full name
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 outline-none w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="Your name"
                  required
                />
              </label>

              <label className="text-sm">
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full outline-none rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="name@example.com"
                  required
                />
              </label>

              <label className="text-sm">
                Mobile number
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="mt-1 w-full outline-none rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="98765 43210"
                  required
                />
              </label>

              <label className="text-sm sm:col-span-2">
                Message
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 w-full outline-none rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  rows={4}
                  placeholder="Share your query"
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {loading ? "Submitting..." : "Request Call Back"}
            </button>
          </form>
        </AnimatedReveal>
      </section>
    </>
  );
};

export default EnquiryForm;
