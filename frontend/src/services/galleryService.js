import axiosInstance from "../utils/axiosInstance";

class GalleryService {
  async listGallery(params = {}) {
    try {
      const response = await axiosInstance.get("/gallery/all-gallery", { params });
      return response?.data || null;
    } catch (error) {
      throw error;
    }
  }
}

const galleryService = new GalleryService();
export default galleryService;
