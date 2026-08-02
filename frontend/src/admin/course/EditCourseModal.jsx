import React, { useState, useEffect } from "react";
import courseService from "../../services/courseService";
// Removed unused CSS import

const EditCourseModal = ({ isOpen, onClose, course, onCourseUpdated }) => {
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    category: "",
    price: "",
    isFree: false,
    tags: "",
    aboutCourse: "",
    duration: "",
    level: "",
    prerequisites: "",
    parentCourse: "",
  });
  
  const [thumbnail, setThumbnail] = useState(null);
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course && isOpen) {
      setFormData({
        title: course.title || "",
        shortDescription: course.shortDescription || "",
        description: course.description || "",
        category: course.category || "",
        price: course.price || "",
        isFree: course.isFree || false,
        tags: course.tags ? course.tags.join(", ") : "",
        aboutCourse: course.aboutCourse ? course.aboutCourse.join("\n") : "",
        duration: course.duration || "",
        level: course.level || "",
        prerequisites: course.prerequisites ? course.prerequisites.join("\n") : "",
        parentCourse: course.parentCourse || "",
      });
    }
  }, [course, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "thumbnail") {
      setThumbnail(files[0]);
    } else if (name === "logo") {
      setLogo(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        if (key === "tags") {
          const tagsArray = formData[key].split(",").map(tag => tag.trim()).filter(tag => tag);
          formDataToSend.append(key, JSON.stringify(tagsArray));
        } else if (key === "aboutCourse") {
          const aboutArray = formData[key].split("\n").filter(line => line.trim());
          formDataToSend.append(key, JSON.stringify(aboutArray));
        } else if (key === "prerequisites") {
          const prereqArray = formData[key].split("\n").filter(line => line.trim());
          formDataToSend.append(key, JSON.stringify(prereqArray));
        } else if (key === "isFree") {
          formDataToSend.append(key, formData[key]);
        } else if (key === "price") {
          formDataToSend.append(key, formData.isFree ? 0 : formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append files
      if (thumbnail) {
        formDataToSend.append("thumbnail", thumbnail);
      }
      if (logo) {
        formDataToSend.append("logo", logo);
      }
      
      await courseService.updateCourse(course._id, formDataToSend);
      onCourseUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update course:", error);
      alert("Failed to update course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Edit Course
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-2"
                  >
                    <option value="">Select Category</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-development">Mobile Development</option>
                    <option value="data-science">Data Science</option>
                    <option value="ai-ml">AI/ML</option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="cloud-computing">Cloud Computing</option>
                    <option value="devops">DevOps</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    disabled={formData.isFree}
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-2"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFree"
                    checked={formData.isFree}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700 dark:text-slate-300">
                    Free Course
                  </label>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Short Description
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    rows={2}
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-2"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Full Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-2"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    About This Course (one per line)
                  </label>
                  <textarea
                    name="aboutCourse"
                    value={formData.aboutCourse}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g., 8 weeks"
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-2"
                  >
                    <option value="">Select Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Prerequisites (one per line)
                  </label>
                  <textarea
                    name="prerequisites"
                    value={formData.prerequisites}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g., javascript, react, frontend"
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Parent Course
                  </label>
                  <input
                    type="text"
                    name="parentCourse"
                    value={formData.parentCourse}
                    onChange={handleChange}
                    placeholder="Parent Course ID"
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Thumbnail
                  </label>
                  <input
                    type="file"
                    name="thumbnail"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Logo
                  </label>
                  <input
                    type="file"
                    name="logo"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white px-3 py-2"
                  />
                </div>
              </div>
            </form>
          </div>
          
          <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-slate-600 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-500 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourseModal;