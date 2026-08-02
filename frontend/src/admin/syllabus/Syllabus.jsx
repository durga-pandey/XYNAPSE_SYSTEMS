import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Syllabus = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. API Call: Saare courses lana
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axiosInstance.get("/course/all-courses");
        setCourses(data.data);
      } catch (error) {
        console.log(error);
        console.error("Error fetching courses");
      }
    };
    fetchCourses();
  }, []);

  console.log(selectedCourse);

  const uploadHandler = async () => {
    if (!file) {
      return toast.error("Please select a file first!");
    }

    const formData = new FormData();
    formData.append("syllabus", file);

    setIsLoading(true);
    const loadingToast = toast.loading("Uploading syllabus...");

    try {
      await axiosInstance.put(
        `/course/update-syllabus/${selectedCourse}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.dismiss(loadingToast);
      toast.success("Syllabus uploaded successfully!");
      setIsModalOpen(false);

    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToast);

      const errorMessage =
        error.response?.data?.message || "Upload failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Course Syllabus Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <motion.div
            whileHover={{ y: -10 }}
            key={course._id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col justify-between"
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {course.title}
            </h3>
            <button
              onClick={() => {
                setSelectedCourse(course._id);
                setIsModalOpen(true);
              }}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md"
            >
              Update Syllabus
            </button>
          </motion.div>
        ))}
      </div>

      {/* Modern Animated Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4">Upload New Syllabus</h3>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex gap-4">
                <button
                  onClick={uploadHandler}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Syllabus;
