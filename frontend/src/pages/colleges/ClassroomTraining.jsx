import { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import SEO from "../../components/SEO";

const ClassroomTraining = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const programTitle =
    location.state?.program ||
    searchParams.get("program") ||
    "Classroom Trainings";

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
        title="Classroom Training | Xynapse Systems"
        description="Join our classroom-based training programs for hands-on learning and real-world skill development at Xynapse Systems."
        canonical="https://xynapsesystems.com/college/training"
        image="https://xynapsesystems.com/images/Logo.png"
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Hero */}
        <section className="bg-gradient-to-br from-indigo-600 to-purple-700">
          <div className="mx-auto max-w-7xl px-6 py-16 text-white">
            <h1 className="text-3xl md:text-4xl font-extrabold">
              {programTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-sm md:text-base text-indigo-100">
              Industry-focused classroom training programs designed to deliver
              hands-on learning, real-time projects, and job-ready skills.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="mx-auto max-w-7xl px-6 py-14 grid gap-10 lg:grid-cols-3">
          {/* Left Content */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Classroom Training Program – Overview
              </h2>

              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Our{" "}
                <span className="font-semibold">
                  Classroom Training Program
                </span>{" "}
                focuses on delivering structured, instructor-led learning
                experiences through in-person or hybrid classrooms. These
                programs are designed to help students and professionals gain
                deep conceptual understanding along with strong practical
                exposure.
              </p>

              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Training sessions are conducted by industry experts and aligned
                with real-world job roles, ensuring learners are prepared for
                interviews, internships, and on-the-job challenges.
              </p>

              {/* Highlights */}
              <div className="mt-6">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Key Training Highlights
                </h3>

                <ul className="mt-4 space-y-3 text-sm">
                  {[
                    "Instructor-led in-person classroom sessions",
                    "Hands-on practical labs & guided exercises",
                    "Real-time industry projects & case studies",
                    "Beginner to advanced level structured modules",
                    "Weekly assessments & performance tracking",
                    "Certification-oriented training programs",
                    "Small batch size for personalized attention",
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

              {/* Who is it for */}
              <div className="mt-8">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Who Is This Training For?
                </h3>

                <ul className="mt-4 space-y-3 text-sm">
                  {[
                    "College & university students",
                    "Final-year students preparing for placements",
                    "Working professionals upskilling their careers",
                    "Beginners entering technical domains",
                    "Institutes seeking classroom-based training",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-slate-700 dark:text-slate-300"
                    >
                      <span className="mt-2 h-2 w-2 rounded-full bg-purple-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Value */}
              <div className="mt-8 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/60">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Value Delivered
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  Learners gain job-ready technical skills, practical
                  confidence, and industry exposure through hands-on training
                  and real-world project experience.
                </p>
              </div>
            </div>
          </div>

          {/* Apply Form */}
          <div>
            <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-900">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Apply for Classroom Training
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

export default ClassroomTraining;
