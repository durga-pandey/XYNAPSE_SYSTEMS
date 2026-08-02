import axiosInstance from "../utils/axiosInstance";

class AlumniService {
  handleResponse(response) {
    return response.data;
  }

  handleError(error) {
    throw error;
  }

  
  async getAll(params = {}) {
    try {
      const resp = await axiosInstance.get("/alumni/all", { params });
      return this.handleResponse(resp);
    } catch (err) {
      this.handleError(err);
    }
  }

  async getById(id) {
    try {
      const resp = await axiosInstance.get(`/alumni/${id}`);
      return this.handleResponse(resp);
    } catch (err) {
      this.handleError(err);
    }
  }

  async create(payload, options = {}) {
    try {
      // payload may be FormData when uploading files
      const resp = await axiosInstance.post("/alumni/create", payload, options);
      return this.handleResponse(resp);
    } catch (err) {
      this.handleError(err);
    }
  }

  async update(id, payload, options = {}) {
    try {
      const resp = await axiosInstance.put(`/alumni/${id}`, payload, options);
      return this.handleResponse(resp);
    } catch (err) {
      this.handleError(err);
    }
  }

  async remove(id) {
    try {
      const resp = await axiosInstance.delete(`/alumni/${id}`);
      return this.handleResponse(resp);
    } catch (err) {
      this.handleError(err);
    }
  }
}

const alumniService = new AlumniService();
export default alumniService;