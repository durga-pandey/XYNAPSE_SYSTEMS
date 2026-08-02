import axiosInstance from "../utils/axiosInstance";

class AuthService {
  handleResponse(response) {
    return response.data;
  }

  handleError(error) {
    throw error;
  }

  async register(userData) {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async activateUser(activationData) {
    try {
      const response = await axiosInstance.post(
        "/auth/activate-user",
        activationData
      );
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(credentials) {
    const { identifier, email, password, deviceName, ...rest } = credentials;
    const payload = {
      identifier: identifier || email,
      password,
      deviceName,
      ...rest,
    };

    try {
      const response = await axiosInstance.post("/auth/login", payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async logout() {
    try {
      const response = await axiosInstance.post("/auth/logout");
      localStorage.removeItem("user");
      return this.handleResponse(response);
    } catch (error) {
      localStorage.removeItem("user");
      this.handleError(error);
    }
  }

  async getCurrentUser() {
    try {
      const response = await axiosInstance.get("/auth/me");
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAllUsers() {
    try {
      const response = await axiosInstance.get("/auth/all-users");
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async refreshToken() {
    try {
      const response = await axiosInstance.post("/auth/refresh");
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendForgotPasswordOtp(payload) {
    try {
      const response = await axiosInstance.post("/auth/forgot/send", payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async verifyForgotPasswordOtp(payload) {
    try {
      const response = await axiosInstance.post("/auth/forgot/verify", payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async resetPassword(resetData) {
    try {
      const response = await axiosInstance.post(
        "/auth/password/reset",
        resetData
      );
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async changePassword(passwordData) {
    try {
      const response = await axiosInstance.patch(
        "/auth/change-password",
        passwordData
      );
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateProfile(updateData) {
    try {
      const isFormData = updateData instanceof FormData;
      const response = await axiosInstance.patch(
        "/auth/update-profile",
        updateData,
        isFormData
          ? {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          : undefined
      );
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }
}

const authService = new AuthService();
export default authService;
