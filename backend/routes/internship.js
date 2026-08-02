import express from "express";
import { isAuthenticated, optionalAuth } from "../middlewares/auth.js";
import {
  createInternshipApplication,
  deleteInternshipApplication,
  downloadCertificate,
  downloadExperienceLetter,
  downloadOfferLetter,
  generateOfferLetter,
  getAllInternshipApplications,
  getMyInternshipApplications,
  getSingleInternshipApplication,
  hardDeleteInternshipApplication,
  toggleInternshipApplicationActive,
  updateCertificateData,
  updateExperiencePoints,
  updateInternshipApplicationStatus,
} from "../controllers/internship.js";
import { multerMiddleware } from "../utils/multerConfig.js";

const internshipRouter = express.Router();

internshipRouter.post(
  "/create",
  optionalAuth,
  multerMiddleware([{ name: "resumeUrl", maxCount: 1 }]),
  createInternshipApplication
);

internshipRouter.get("/all", getAllInternshipApplications);

internshipRouter.get(
  "/my-internships",
  isAuthenticated,
  getMyInternshipApplications
);

internshipRouter.get("/:id", isAuthenticated, getSingleInternshipApplication);

internshipRouter.patch(
  "/status/:id",
  isAuthenticated,
  updateInternshipApplicationStatus
);

internshipRouter.patch(
  "/soft-delete/:id",
  isAuthenticated,
  deleteInternshipApplication
);

internshipRouter.delete(
  "/hard-delete/:id",
  isAuthenticated,
  hardDeleteInternshipApplication
);

internshipRouter.patch(
  "/toggle/:id",
  isAuthenticated,
  toggleInternshipApplicationActive
);

//integrated
internshipRouter.patch("/offer-letter/:id", generateOfferLetter);

//integrated
internshipRouter.patch("/experience-point/:id", updateExperiencePoints);

//integrated
internshipRouter.patch("/certificate/:id", updateCertificateData);

//integrated
internshipRouter.get("/download-offer-letter/:id", downloadOfferLetter);
//integrated
internshipRouter.get(
  "/download-experience-letter/:id",
  downloadExperienceLetter
);
//integrated
internshipRouter.get("/download-certificate/:id", downloadCertificate);

export default internshipRouter;
