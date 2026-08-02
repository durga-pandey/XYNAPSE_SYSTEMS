import express from "express";
import { isAuthenticated, requireRole } from "../middlewares/auth.js";
import {
  createEmployeeApplication,
  getAllEmployeeApplications,
  getEmployeeApplicationById,
  softDeleteEmployeeApplication,
  updateEmployeeApplicationStatus,
} from "../controllers/employeeApplication.js";
import { multerMiddleware } from "../utils/multerConfig.js";

const employeeApplicationRouter = express.Router();

employeeApplicationRouter.post(
  "/create",
  multerMiddleware([
    { name: "resumeUrl", maxCount: 1 },
    { name: "attachments", maxCount: 3 },
  ]),
  createEmployeeApplication
);

employeeApplicationRouter.get(
  "/all-employee",
  isAuthenticated,
  requireRole("admin"),
  getAllEmployeeApplications
);

employeeApplicationRouter.get(
  "/:id",
  isAuthenticated,
  requireRole("admin"),
  getEmployeeApplicationById
);

employeeApplicationRouter.patch(
  "/status/:id",
  isAuthenticated,
  requireRole("admin"),
  updateEmployeeApplicationStatus
);

employeeApplicationRouter.patch(
  "/soft-delete/:id",
  isAuthenticated,
  requireRole("admin"),
  softDeleteEmployeeApplication
);

export default employeeApplicationRouter;
