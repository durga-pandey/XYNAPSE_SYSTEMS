import express from "express";
import { isAuthenticated, requireRole } from "../middlewares/auth.js";
import {
  addSalaryHistory,
  createSalarySlip,
  downloadSalarySlip,
  getAllSalarySlips,
  getSalarySlipById,
  getSalarySlipsByEmployee,
  softDeleteSalarySlip,
  updateSalarySlip,
  updateSalarySlipStatus,
} from "../controllers/salarySlip.js";

const salarySlipRouter = express.Router();

salarySlipRouter.post(
  "/create",
  isAuthenticated,
  requireRole("admin"),
  createSalarySlip
);

salarySlipRouter.get(
  "/all-salary-slip",
  isAuthenticated,
  requireRole("admin"),
  getAllSalarySlips
);

salarySlipRouter.get(
  "/all-salary-slip",
  isAuthenticated,
  getAllSalarySlips
);


salarySlipRouter.put(
  "/update/:id",
  isAuthenticated,
  requireRole("admin"),
  updateSalarySlip
);

salarySlipRouter.get(
  "/:id",
  isAuthenticated,
  requireRole("admin"),
  getSalarySlipById
);

salarySlipRouter.get(
  "/instructor/:id",
  isAuthenticated,
  requireRole("admin"),
  getSalarySlipsByEmployee
);

salarySlipRouter.patch(
  "/salary-history/:id",
  isAuthenticated,
  requireRole("admin"),
  addSalaryHistory
);

salarySlipRouter.patch(
  "/soft-delete/:id",
  isAuthenticated,
  requireRole("admin"),
  softDeleteSalarySlip
);

salarySlipRouter.patch(
  "/status/:id",
  isAuthenticated,
  requireRole("admin"),
  updateSalarySlipStatus
);

salarySlipRouter.get(
  "/download/:id",
  //   isAuthenticated,
  //   requireRole("admin"),
  downloadSalarySlip
);

export default salarySlipRouter;
