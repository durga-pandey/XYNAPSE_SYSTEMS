import axiosInstance from "../utils/axiosInstance";

class CourseService {
  handleResponse(response) {
    return response.data;
  }

  handleError(error) {
    throw error;
  }

  async getAllCourses(params = {}) {
    try {
      const response = await axiosInstance.get("/course/all-courses", { params });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getTopCourses(limit = 4) {
    try {
      // Prefer featured courses first, fallback to latest
      const params = {
        page: 1,
        limit,
        isFeatured: true,
        sortBy: "createdAt",
        order: "desc",
      };

      const resp = await this.getAllCourses(params);
      if (resp && resp.data && resp.data.length > 0) return resp.data;

      // fallback: fetch latest courses
      const fallback = await this.getAllCourses({ page: 1, limit, sortBy: "createdAt", order: "desc" });
      return fallback?.data || [];
    } catch (error) {
      this.handleError(error);
    }
  }

  async getCourseById(courseId) {
    try {
      const response = await axiosInstance.get(`/course/${courseId}`);
      // Controller returns { data: course }
      return response?.data?.data || null;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Admin Course Management Methods
  async createCourse(formData) {
    try {
      const response = await axiosInstance.post("/course/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateCourse(courseId, formData) {
    try {
      const response = await axiosInstance.put(`/course/${courseId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteCourse(courseId) {
    try {
      const response = await axiosInstance.patch(`/course/delete/${courseId}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async togglePublishCourse(courseId, publish) {
    try {
      const response = await axiosInstance.patch(`/course/publish/${courseId}`, { publish });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async toggleFeatureCourse(courseId, feature) {
    try {
      const response = await axiosInstance.patch(`/course/feature/${courseId}`, { feature });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async moderateCourse(courseId, action) {
    try {
      const response = await axiosInstance.patch(`/course/moderate/${courseId}`, { action });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async uploadCourseMedia(courseId, formData) {
    try {
      const response = await axiosInstance.patch(`/course/thumbnail/${courseId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateCourseSEO(courseId, seoData) {
    try {
      const response = await axiosInstance.patch(`/course/seo/${courseId}`, seoData);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }


  
}

const courseService = new CourseService();
export default courseService;