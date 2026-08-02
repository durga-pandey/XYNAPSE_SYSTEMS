import axiosInstance from "../utils/axiosInstance";

class InvoiceService {
  handleResponse(response) {
    return response.data;
  }

  handleError(error) {
    throw error;
  }

  // Create a new invoice
  async createInvoice(payload) {
    try {
      const response = await axiosInstance.post("/invoice/create", payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get all invoices with pagination and filters
  async getAllInvoices(params = {}) {
    try {
      const response = await axiosInstance.get("/invoice/all-invoices", { params });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Search invoices with filters
  async searchInvoices(params = {}) {
    try {
      const response = await axiosInstance.get("/invoice/search-invoices", { params });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get a single invoice by ID
  async getInvoiceById(invoiceId) {
    try {
      const response = await axiosInstance.get(`/invoice/${invoiceId}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update an invoice
  async updateInvoice(invoiceId, payload) {
    try {
      const response = await axiosInstance.put(`/invoice/update/${invoiceId}`, payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update payment status
  async updatePaymentStatus(invoiceId, payload) {
    try {
      const response = await axiosInstance.patch(`/invoice/update-payment-status/${invoiceId}`, payload);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Soft delete an invoice
  async deleteInvoice(invoiceId) {
    try {
      const response = await axiosInstance.patch(`/invoice/soft-delete/${invoiceId}`);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Download invoice PDF
  async downloadInvoicePDF(invoiceId) {
    try {
      const response = await axiosInstance.get(`/invoice/download/${invoiceId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

const invoiceService = new InvoiceService();
export default invoiceService;