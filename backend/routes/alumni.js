import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createAlumni,
  deleteAlumni,
  getAllAlumni,
  getAlumniById,
  hardDeleteAlumni,
  restoreAlumni,
  toggleAlumniActiveStatus,
  updateAlumni,
} from "../controllers/alumni.js";
import { multerMiddleware } from "../utils/multerConfig.js";

const alumniRouter = express.Router();

alumniRouter.post(
  "/create",
  isAuthenticated,
  multerMiddleware([{ name: "images", maxCount: 1 }]),
  createAlumni
);

alumniRouter.get("/all", getAllAlumni);

alumniRouter.put(
  "/update/:id",
  isAuthenticated,
  multerMiddleware([{ name: "images", maxCount: 1 }]),
  updateAlumni
);

alumniRouter.get("/:id", isAuthenticated, getAlumniById);

alumniRouter.patch("/soft-delete/:id", isAuthenticated, deleteAlumni);

alumniRouter.patch("/restore/:id", isAuthenticated, restoreAlumni);

alumniRouter.patch("/toggle/:id", isAuthenticated, toggleAlumniActiveStatus);

alumniRouter.delete("/hard-delete/:id", isAuthenticated, hardDeleteAlumni);

export default alumniRouter;
