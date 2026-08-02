import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Award, Loader2, Download } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

import Select from "react-select";
import toast from "react-hot-toast";

const initialState = {
  courseId: "",
  studentName: "",
  courseTitle: "",
  grade: "A",
  duration: "",
};

const CourseCompletion = () => {
  const [certs, setCerts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [courseOptions, setCourseOptions] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const coursesRes = await axiosInstance.get("/course/all-courses");

        if (coursesRes) {
          setCourseOptions(
            coursesRes.data.data.map((c) => ({ value: c._id, label: c.title })),
          );
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchLists();
  }, []);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/certificate/all");

      const certificates = response?.data?.certificates || [];

      setCerts(certificates);
    } catch (error) {
      const message = error?.response?.data?.message;
      console.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.courseId || !formData.grade) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isEdit) {
        response = await axiosInstance.put(`/certificate/update/${activeId}`, {
          metadata: {
            studentName: formData.studentName,
            courseTitle: formData.courseTitle,
            grade: formData.grade,
            duration: formData.duration,
          },
        });
      } else {
        response = await axiosInstance.post("/certificate/issue", formData);
      }

      toast.success(response.data.message || "Operation successful!");

      setIsOpen(false);
      setFormData(initialState);
      await fetchCerts();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      console.error("Submission Error:", err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (id) => {
    const { data } = await axiosInstance.get(`/certificate/${id}`);
    const { metadata } = data.certificate;
    setFormData({
      ...metadata,
      courseId: data.certificate.courseId,
    });
    setActiveId(id);
    setIsEdit(true);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure? This action cannot be undone.",
    );

    if (!isConfirmed) return;

    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        `/certificate/hard-delete/${id}`,
      );

      toast.success(
        response.data.message || "Certificate deleted successfully!",
      );

      await fetchCerts();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete certificate.";
      console.error("Delete Error:", err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateId) => {
    try {
      const response = await axiosInstance.get(
        `/certificate/download-certificate/${certificateId}`,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute("download", `Certificate_${certificateId}.pdf`);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download fail ho gaya bhsdike:", error);
      toast.error("Error !!");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Certificates</h2>
        <button
          onClick={() => {
            setIsEdit(false);
            setFormData({});
            setIsOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Issue New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certs?.map((c) => (
          <div
            key={c._id}
            className="bg-white p-6 rounded-2xl shadow-sm border"
          >
            <h3 className="font-bold text-lg">{c.metadata.studentName}</h3>
            <p className="text-sm text-gray-500">{c.metadata.courseTitle}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEditClick(c._id)}
                className="p-2 bg-blue-50 text-blue-600 rounded"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(c._id)}
                className="p-2 bg-red-50 text-red-600 rounded"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => handleDownload(c._id)}
                className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition ml-auto"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[400px] bg-white shadow-2xl flex flex-col p-6 animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Award className="text-indigo-600" />{" "}
                {isEdit ? "Update Certificate" : "Issue Certificate"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-100 p-1 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 flex-1"
            >
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">
                  Course
                </label>
                <Select
                  classNamePrefix="react-select"
                  isDisabled={isEdit}
                  options={courseOptions}
                  value={
                    courseOptions.find((o) => o.value === formData?.courseId) ||
                    null
                  }
                  onChange={(opt) =>
                    setFormData({
                      ...formData,
                      courseId: opt.value,
                      courseTitle: opt.label,
                    })
                  }
                  placeholder="Select course..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 outline-none transition"
                  placeholder="Student Name"
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                />
                <select
                  className="border-2 border-gray-200 p-3 rounded-lg outline-none"
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData({ ...formData, grade: e.target.value })
                  }
                >
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                </select>
              </div>

              <input
                className="border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 outline-none"
                placeholder="Course Title"
                value={formData.courseTitle}
                onChange={(e) =>
                  setFormData({ ...formData, courseTitle: e.target.value })
                }
              />
              <input
                className="border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 outline-none"
                placeholder="Duration (e.g. 4 weeks)"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />

              <button
                disabled={loading}
                className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg transition flex justify-center items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : isEdit ? (
                  "Update Certificate"
                ) : (
                  "Issue Certificate"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCompletion;
