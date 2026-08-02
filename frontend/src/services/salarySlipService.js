import axiosInstance from "../utils/axiosInstance";

class SalarySlipService {
  handleResponse(response) {
    return response.data;
  }

  handleError(error) {
    throw error;
  }

  // Create a new salary slip
  async createSalarySlip(payload) {
    try {
      const response = await axiosInstance.post("/salary-slip/create", payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get all salary slips with pagination and filters
  async getAllSalarySlips(params = {}) {
    try {
      const response = await axiosInstance.get("/salary-slip/all-salary-slip", { params });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get a single salary slip by ID
  async getSalarySlipById(id) {
    try {
      const response = await axiosInstance.get(`/salary-slip/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get salary slips by employee
  async getSalarySlipsByEmployee(authId) {
    try {
      const response = await axiosInstance.get(`/salary-slip/instructor/${authId}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update a salary slip
  async updateSalarySlip(id, payload) {
    try {
      const response = await axiosInstance.put(`/salary-slip/update/${id}`, payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add salary history
  async addSalaryHistory(id, payload) {
    try {
      const response = await axiosInstance.patch(`/salary-slip/salary-history/${id}`, payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update salary slip status
  async updateSalarySlipStatus(id, payload) {
    try {
      const response = await axiosInstance.patch(`/salary-slip/status/${id}`, payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Soft delete a salary slip
  async deleteSalarySlip(id) {
    try {
      const response = await axiosInstance.patch(`/salary-slip/soft-delete/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Download salary slip PDF
  async downloadSalarySlip(id) {
    try {
      const response = await axiosInstance.get(`/salary-slip/download/${id}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

const salarySlipService = new SalarySlipService();
export default salarySlipService;