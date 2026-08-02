import { useLocation, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useState } from "react";
import SEO from "../../components/SEO";

const CollegeConnect = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const programTitle =
    location.state?.program ||
    searchParams.get("program") ||
    "College Connect Program";

  const [formData, setFormData] = useState({
    programType: programTitle,
    collegeName: "",
    contactPerson: "",
    designation: "",
    email: "",
    phone: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axiosInstance.post(
        "/collegeProgram/create",
        formData,
      );

      if (data.success) {
        setSuccessMessage(
          data.message || "Application submitted successfully!",
        );

        setFormData({
          programType: programTitle,
          collegeName: "",
          contactPerson: "",
          designation: "",
          email: "",
          phone: "",
          message: "",
        });
      }

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setSuccessMessage("");
      alert(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    }
  };

  return (
    <>
      <SEO
        key={location.pathname}
        title="College Connect | Xynapse Systems"
        description="Connect with Xynapse Systems for college collaboration, workshops, internships, and career-oriented programs."
        canonical="https://xynapsesystems.com/college/connect"
        image="https://xynapsesystems.com/images/Logo.png"
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <section className="bg-gradient-to-br from-emerald-600 to-teal-600">
          <div className="mx-auto max-w-7xl px-6 py-16 text-white">
            <h1 className="text-3xl md:text-4xl font-extrabold">
              {programTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-sm md:text-base text-emerald-100">
              A strategic collaboration model that connects colleges directly
              with industry professionals to build future-ready talent through
              structured on-campus programs.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="mx-auto max-w-7xl px-6 py-14 grid gap-10 lg:grid-cols-3">
          {/* Left Content */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                College Connect Program – Overview
              </h2>

              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                The{" "}
                <span className="font-semibold">College Connect Program</span>{" "}
                is designed to build a strong, long-term partnership between
                educational institutions and industry. This program ensures that
                students receive continuous, semester-wise industry exposure
                directly on campus.
              </p>

              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Through dedicated trainers, customized learning paths, and live
                projects, colleges can transform their students into
                industry-ready professionals while maintaining academic
                excellence.
              </p>

              {/* Key Features */}
              <div className="mt-6">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Key Program Features
                </h3>

                <ul className="mt-4 space-y-3 text-sm">
                  {[
                    "Dedicated industry trainers assigned to the college",
                    "On-campus semester-based training programs",
                    "Customized curriculum aligned with industry needs",
                    "Workshops, bootcamps & expert sessions",
                    "Live industry projects & real-time case studies",
                    "Internship & apprenticeship opportunities",
                    "Placement readiness & career mentoring",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-slate-700 dark:text-slate-300"
                    >
                      <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Who Benefits */}
              <div className="mt-8">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Who Benefits from College Connect?
                </h3>

                <ul className="mt-4 space-y-3 text-sm">
                  {[
                    "Engineering & management colleges",
                    "Universities seeking long-term industry integration",
                    "Students looking for continuous skill development",
                    "Training & placement departments",
                    "Institutions aiming for better placement outcomes",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-slate-700 dark:text-slate-300"
                    >
                      <span className="mt-2 h-2 w-2 rounded-full bg-teal-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Value Proposition */}
              <div className="mt-8 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/60">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Program Value Proposition
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  Colleges gain a structured, scalable, and measurable training
                  ecosystem that improves student employability, strengthens
                  industry collaboration, and enhances institutional branding.
                </p>
              </div>
            </div>
          </div>

          {/* Apply Form */}
          <div>
            <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-900">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Apply for College Connect
              </h3>

              {successMessage && (
                <div className="w-full bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded-md text-sm mt-4">
                  {successMessage}
                </div>
              )}

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                {/* Program Type */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Program Type
                  </label>
                  <select
                    name="programType"
                    value={formData.programType}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-sky-500
            dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="College Partners">College Partners</option>
                    <option value="Classroom Trainings">
                      Classroom Trainings
                    </option>
                    <option value="College Connect Program">
                      College Connect Program
                    </option>
                  </select>
                </div>

                {/* College Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    College / Institution Name
                  </label>
                  <input
                    type="text"
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleChange}
                    required
                    placeholder="Enter college name"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-sky-500
            dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                {/* Institution Type */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Institution Type
                  </label>
                  <select
                    name="institutionType"
                    value={formData.institutionType}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-sky-500
            dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="College">College</option>
                    <option value="University">University</option>
                    <option value="Institute">Institute</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Contact Person */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                    placeholder="Full name"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-sky-500
            dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Designation (optional)"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-sky-500
            dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Official Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@college.edu"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-sky-500
            dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 XXXXX XXXXX"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-sky-500
            dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Tell us about your requirement"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-sky-500
            dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-black py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CollegeConnect;
