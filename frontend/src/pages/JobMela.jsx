import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaBuilding,
  FaLock,
} from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";

const JobMela = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 

  const [status, setStatus] = useState("");
  const [jobType, setJobType] = useState("");
  const [companyName, setCompanyName] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    setErrorMessage(""); // reset
    try {
      const params = {};
      if (status) params.status = status;
      if (jobType) params.jobType = jobType;
      if (companyName) params.companyName = companyName;

      const { data } = await axiosInstance.get("/jobMela/all-job", { params });
      setJobs(data.jobs || []);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setErrorMessage(err.response.data.message || "Access Denied");
      } else {
        console.error("Error fetching jobs:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [status, jobType, companyName]);

  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-rose-300 via-rose-100 to-rose-200 overflow-hidden relative">
        {/* Animated background stripes */}
        <div className="absolute inset-0 animate-pulse-slow">
          <div className="w-full h-full bg-gradient-to-r from-rose-200 via-rose-300 to-rose-200 opacity-20"></div>
        </div>

        <div className="relative z-10">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-12 text-center max-w-md transform transition-transform duration-500 hover:rotate-3 hover:scale-105">
            <div className="relative mb-6">
              <FaLock className="text-6xl text-rose-600 mx-auto animate-bounce rotate-0 transition-transform duration-700 hover:rotate-12" />
              <div className="absolute inset-0 rounded-full bg-rose-200 opacity-30 blur-2xl animate-ping"></div>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-800 mb-4 drop-shadow-lg">
              Access Denied
            </h1>

            <p className="text-gray-700 mb-10 text-sm md:text-base">{errorMessage}</p>

            <Link to={"/"} className="mt-20 px-6 py-2 bg-rose-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-rose-700 transition transform hover:-translate-y-1">
              Go Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Job Mela</h1>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-5 mb-6 flex flex-col md:flex-row md:items-center md:gap-4 gap-3">
          <input
            type="text"
            placeholder="Search by company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm"
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={fetchJobs}
            className="bg-rose-600 text-white rounded-lg text-sm font-semibold px-5 py-2 hover:bg-rose-700 transition"
          >
            Apply Filters
          </button>
        </div>

        {/* Job List */}
        {loading ? (
          <p className="text-gray-500">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500">No jobs found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {job.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <FaBuilding /> {job.companyName}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaBriefcase /> {job.jobType}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="flex flex-col md:items-end justify-center gap-2 mt-3 md:mt-0">
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                    {job.status}
                  </span>

                  <a
                    href={job.jobLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-rose-600 hover:underline"
                  >
                    Apply Now →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMela;
