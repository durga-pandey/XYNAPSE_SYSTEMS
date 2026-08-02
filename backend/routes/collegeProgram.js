import express from "express";
import { optionalAuth } from "../middlewares/auth.js";
import {
  getAllCollegeApplications,
  hardDeleteCollegeApplication,
  restoreCollegeApplication,
  softDeleteCollegeApplication,
  submitCollegeApplication,
  updateCollegeApplicationStatus,
} from "../controllers/collegeProgram.js";

const collegeProgramRouter = express.Router();

collegeProgramRouter.post("/create", optionalAuth, submitCollegeApplication);

collegeProgramRouter.get(
  "/all-application",
  optionalAuth,
  getAllCollegeApplications
);

collegeProgramRouter.get("/:id", optionalAuth, getAllCollegeApplications);

collegeProgramRouter.patch(
  "/status/:id",
  optionalAuth,
  updateCollegeApplicationStatus
);

collegeProgramRouter.patch(
  "/soft-delete/:id",
  optionalAuth,
  softDeleteCollegeApplication
);

collegeProgramRouter.patch(
  "/restore/:id",
  optionalAuth,
  restoreCollegeApplication
);

collegeProgramRouter.delete(
  "/hard-delete/:id",
  optionalAuth,
  hardDeleteCollegeApplication
);

export default collegeProgramRouter;
