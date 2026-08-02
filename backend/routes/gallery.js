import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { multerMiddleware } from "../utils/multerConfig.js";
import {
  createGalleryItem,
  deleteGalleryItem,
  getGalleryItem,
  hardDeleteGalleryItem,
  listGalleryItems,
  searchGalleryItems,
  toggleGalleryStatus,
  updateGalleryItem,
} from "../controllers/gallery.js";

const galleryRouter = express.Router();

galleryRouter.post(
  "/create",
  // isAuthenticated,
  multerMiddleware([{ name: "image", maxCount: 1 }]),
  createGalleryItem
);

galleryRouter.get("/all-gallery",  listGalleryItems);

galleryRouter.get("/search", isAuthenticated, searchGalleryItems);

galleryRouter.put(
  "/update/:id",
  isAuthenticated,
  multerMiddleware([{ name: "image", maxCount: 1 }]),
  updateGalleryItem
);

galleryRouter.get("/:id", isAuthenticated, getGalleryItem);

galleryRouter.patch("/toggle/:id", isAuthenticated, toggleGalleryStatus);

galleryRouter.patch("/soft-delete/:id", isAuthenticated, deleteGalleryItem);

galleryRouter.delete(
  "/hard-delete/:id",
  isAuthenticated,
  hardDeleteGalleryItem
);

export default galleryRouter;
