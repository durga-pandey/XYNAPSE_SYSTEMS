import axiosInstance from "../utils/axiosInstance";

class JobMelaService {
  handleResponse(response) {
    return response.data;
  }

  handleError(error) {
    throw error;
  }

  // Create a new job posting
  async createJobFair(payload) {
    try {
      const response = await axiosInstance.post("/jobMela/create", payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get all job postings with filters
  async getAllJobFairs(params = {}) {
    try {
      const response = await axiosInstance.get("/jobMela/all-job-admin", { params });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get a single job posting by ID
  async getJobFairById(id) {
    try {
      const response = await axiosInstance.get(`/jobMela/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update a job posting
  async updateJobFair(id, payload) {
    try {
      const response = await axiosInstance.put(`/jobMela/update/${id}`, payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update job posting status
  async updateJobFairStatus(id, payload) {
    try {
      const response = await axiosInstance.patch(`/jobMela/status/${id}`, payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Soft delete a job posting
  async deleteJobFair(id) {
    try {
      const response = await axiosInstance.patch(`/jobMela/soft-delete/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }
}

const jobMelaService = new JobMelaService();
export default jobMelaService;