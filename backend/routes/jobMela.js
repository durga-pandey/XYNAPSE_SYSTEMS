import express from "express";
import { isAuthenticated, requireRole } from "../middlewares/auth.js";
import {
  createJobFair,
  deleteJobFair,
  getAllJobFairs,
  getSingleJobFair,
  updateJobFair,
  updateJobFairStatus,
} from "../controllers/jobMela.js";
import { requirePaidCourse } from "../middlewares/requiredPaidCourse.js";

const jobMelaRouter = express.Router();

jobMelaRouter.post(
  "/create",
  isAuthenticated,
  requireRole("admin"),
  createJobFair
);

jobMelaRouter.get(
  "/all-job-admin",
  isAuthenticated,
  requireRole("admin"),
  getAllJobFairs
);

jobMelaRouter.get(
  "/all-job",
  isAuthenticated,
  requirePaidCourse,
  getAllJobFairs
);

jobMelaRouter.put(
  "/update/:id",
  isAuthenticated,
  requireRole("admin"),
  updateJobFair
);

jobMelaRouter.get(
  "/:id",
  isAuthenticated,
  requireRole("admin"),
  getSingleJobFair
);

jobMelaRouter.patch(
  "/status/:id",
  isAuthenticated,
  requireRole("admin"),
  updateJobFairStatus
);

jobMelaRouter.patch(
  "/soft-delete/:id",
  isAuthenticated,
  requireRole("admin"),
  deleteJobFair
);

export default jobMelaRouter;
