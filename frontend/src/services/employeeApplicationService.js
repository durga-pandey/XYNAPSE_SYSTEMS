import axiosInstance from "../utils/axiosInstance";

class EmployeeApplicationService {
  handleResponse(response) {
    return response.data;
  }

  handleError(error) {
    throw error;
  }

  // Get all employee applications with filters
  async getAllEmployeeApplications(params = {}) {
    try {
      const response = await axiosInstance.get("/employee/all-employee", { params });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get a single employee application by ID
  async getEmployeeApplicationById(id) {
    try {
      const response = await axiosInstance.get(`/employee/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update employee application status
  async updateEmployeeApplicationStatus(id, payload) {
    try {
      const response = await axiosInstance.patch(`/employee/status/${id}`, payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Soft delete an employee application
  async deleteEmployeeApplication(id) {
    try {
      const response = await axiosInstance.patch(`/employee/soft-delete/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }
}

const employeeApplicationService = new EmployeeApplicationService();
export default employeeApplicationService;