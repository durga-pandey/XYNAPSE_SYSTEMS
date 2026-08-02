import axiosInstance from "../utils/axiosInstance";

class InterviewQuestionService {
  handleResponse(response) {
    return response.data;
  }

  handleError(error) {
    throw error;
  }

  // Create a new interview question
  async createInterviewQuestion(payload) {
    try {
      const response = await axiosInstance.post("/interview/create", payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get all interview questions with pagination and filters
  async getAllInterviewQuestions(params = {}) {
    try {
      const response = await axiosInstance.get("/interview/all-admin", { params });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get a single interview question by ID
  async getInterviewQuestionById(id) {
    try {
      const response = await axiosInstance.get(`/interview/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update an interview question
  async updateInterviewQuestion(id, payload) {
    try {
      const response = await axiosInstance.put(`/interview/update/${id}`, payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Toggle interview question active status
  async toggleInterviewQuestionStatus(id) {
    try {
      const response = await axiosInstance.patch(`/interview/toggle/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Soft delete an interview question
  async deleteInterviewQuestion(id) {
    try {
      const response = await axiosInstance.patch(`/interview/soft-delete/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }
}

const interviewQuestionService = new InterviewQuestionService();
export default interviewQuestionService;