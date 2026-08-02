import axiosInstance from "../utils/axiosInstance";

class CourseFormService {
  handleResponse(response) {
    return response.data;
  }

  handleError(error) {
    throw error;
  }

  async submitCourseForm(payload) {
    try {
      const response = await axiosInstance.post("/courseForm/create-form", payload);
      return response?.data || null;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAllCourseForms(params = {}) {
    try {
      const response = await axiosInstance.get("/courseForm/all-form", { params });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async searchCourseForms(keyword, params = {}) {
    try {
      const response = await axiosInstance.get("/courseForm/search-form", {
        params: { ...params, keyword }
      });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get recent course forms (admin)
  async getRecentCourseForms(params = {}) {
    try {
      const response = await axiosInstance.get("/courseForm/recent-form", { params });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get a single course form by ID (admin)
  async getCourseFormById(formId) {
    try {
      const response = await axiosInstance.get(`/courseForm/form/${formId}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update a course form (admin)
  async updateCourseForm(formId, payload) {
    try {
      const response = await axiosInstance.patch(`/courseForm/update-form/${formId}`, payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Delete a course form (admin)
  async deleteCourseForm(formId) {
    try {
      const response = await axiosInstance.patch(`/courseForm/delete/${formId}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get forms by course ID (admin)
  async getFormsByCourseId(courseId, params = {}) {
    try {
      const response = await axiosInstance.get(`/courseForm/course/${courseId}`, { params });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Assign instructor to a course form (admin)
  async assignInstructor(formId, instructorId) {
    try {
      const response = await axiosInstance.patch(`/courseForm/assign/${formId}`, { instructorId });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }
}

const courseFormService = new CourseFormService();
export default courseFormService;