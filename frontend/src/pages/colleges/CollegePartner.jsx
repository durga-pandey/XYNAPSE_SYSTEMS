import { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import SEO from "../../components/SEO";

const CollegePartner = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const programTitle =
    location.state?.program ||
    searchParams.get("program") ||
    "College Partners";

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
        title="Our College Partners | Xynapse Systems"
        description="Discover the colleges partnered with Xynapse Systems for training programs, workshops, and career development initiatives."
        canonical="https://xynapsesystems.com/college/partners"
        image="https://xynapsesystems.com/images/Logo.png"
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-600 to-indigo-700">
          <div className="mx-auto max-w-7xl px-6 py-16 text-white">
            <h1 className="text-3xl md:text-4xl font-extrabold">
              {programTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-sm md:text-base text-sky-100">
              Partner with us to deliver industry-driven education, hands-on
              training, and placement-focused programs for students.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-6 py-14 grid gap-10 lg:grid-cols-3">
          {/* Details */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                College Partnership Program – Overview
              </h2>

              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Our{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  College Partnership Program
                </span>{" "}
                is a long-term institutional collaboration model designed to
                help colleges, universities, and training institutes align their
                academic ecosystem with current industry requirements. We work
                closely with institutions to enhance student employability,
                faculty capability, and placement outcomes.
              </p>

              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Through structured engagement, we bridge the gap between
                theoretical education and real-world application by introducing
                industry-driven curriculum, hands-on training, live projects,
                and career readiness programs directly on campus.
              </p>

              {/* Key Highlights */}
              <div className="mt-6">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Key Partnership Highlights
                </h3>

                <ul className="mt-4 space-y-3 text-sm">
                  {[
                    "MoU-based strategic partnership with colleges & universities",
                    "Industry-aligned curriculum mapped to current job roles",
                    "Hands-on technical training with real-world use cases",
                    "Faculty Development Programs (FDPs) & trainer enablement",
                    "Internships, live projects & experiential learning modules",
                    "Placement readiness training including aptitude & soft skills",
                    "Career guidance, mock interviews & industry mentorship",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-slate-700 dark:text-slate-300"
                    >
                      <span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Who Is This For */}
              <div className="mt-8">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Who Should Partner With Us?
                </h3>

                <ul className="mt-4 space-y-3 text-sm">
                  {[
                    "Engineering colleges & technical institutions",
                    "Universities offering professional or skill-based programs",
                    "Management & commerce colleges",
                    "Polytechnic & diploma institutes",
                    "Colleges aiming to improve placement & industry exposure",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-slate-700 dark:text-slate-300"
                    >
                      <span className="mt-2 h-2 w-2 rounded-full bg-indigo-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Value Proposition */}
              <div className="mt-8 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/60">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Value Delivered to Institutions
                </h3>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  By partnering with us, institutions gain access to industry
                  expertise, structured training frameworks, and continuous
                  academic support that directly impacts student outcomes,
                  institutional branding, and placement performance.
                </p>
              </div>
            </div>
          </div>

          {/* Apply Form */}
          <div>
            <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-900">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Apply for Partnership
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

export default CollegePartner;
