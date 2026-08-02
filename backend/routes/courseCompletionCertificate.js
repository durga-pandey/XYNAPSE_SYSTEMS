import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  downloadCertificate,
  getAllCertificates,
  getSingleCertificate,
  hardDeleteCertificate,
  issueCertificate,
  softDeleteCertificate,
  updateCertificate,
} from "../controllers/courseCompletionCertificate.js";

const courseCertificateRouter = express.Router();

courseCertificateRouter.post("/issue", isAuthenticated, issueCertificate);
courseCertificateRouter.get("/all", isAuthenticated, getAllCertificates);
courseCertificateRouter.get("/:id", isAuthenticated, getSingleCertificate);
courseCertificateRouter.put("/update/:id", isAuthenticated, updateCertificate);
courseCertificateRouter.patch(
  "/soft-delete/:id",
  isAuthenticated,
  softDeleteCertificate,
);
courseCertificateRouter.delete(
  "/hard-delete/:id",
  isAuthenticated,
  hardDeleteCertificate,
);

courseCertificateRouter.get(
  "/download-certificate/:id",
  isAuthenticated,
  downloadCertificate,
);

export default courseCertificateRouter;
