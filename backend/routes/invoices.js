import express from "express";
import { isAuthenticated, requireRole } from "../middlewares/auth.js";
import {
  createInvoice,
  deleteInvoice,
  downloadInvoicePDF,
  getAllInvoices,
  getMyInvoices,
  getSingleInvoice,
  updateInvoice,
  updatePaymentStatus,
} from "../controllers/invoices.js";

const invoiceRouter = express.Router();

invoiceRouter.post(
  "/create",
  isAuthenticated,
  requireRole("admin"),
  createInvoice
);

invoiceRouter.get(
  "/all-invoices",
  isAuthenticated,
  requireRole("admin"),
  getAllInvoices
);

invoiceRouter.get("/my-invoices", isAuthenticated, getMyInvoices);

invoiceRouter.get(
  "/search-invoices",
  isAuthenticated,
  requireRole("admin"),
  getAllInvoices
);

invoiceRouter.put(
  "/update/:invoiceId",
  isAuthenticated,
  requireRole("admin"),
  updateInvoice
);

invoiceRouter.get(
  "/:invoiceId",
  isAuthenticated,
  requireRole("admin"),
  getSingleInvoice
);

invoiceRouter.patch(
  "/update-payment-status/:invoiceId",
  isAuthenticated,
  requireRole("admin"),
  updatePaymentStatus
);

invoiceRouter.patch(
  "/soft-delete/:invoiceId",
  isAuthenticated,
  requireRole("admin"),
  deleteInvoice
);

invoiceRouter.get("/download/:invoiceId", isAuthenticated, downloadInvoicePDF);

export default invoiceRouter;
