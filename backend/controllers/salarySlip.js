import mongoose from "mongoose";
import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import SalarySlip from "../models/salary-slip/salarySlipModal.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import path from "path";
import ejs from "ejs";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createSalarySlip = CatchAsyncError(async (req, res, next) => {
  const {
    authId,
    designation,
    department,
    salary,
    contactNumber,
    bankDetails,
    address,
    notes,
  } = req.body;

  if (!authId) return next(new ErrorHandler("authId is required", 400));
  if (!designation) return next(new ErrorHandler("Designation is required", 400));
  if (!salary) return next(new ErrorHandler("Salary is required", 400));
  if (!contactNumber) return next(new ErrorHandler("Contact number is required", 400));
  if (!bankDetails || !bankDetails.accountNumber || !bankDetails.bankName || !bankDetails.ifscCode)
    return next(new ErrorHandler("Complete bank details are required", 400));
  if (!address || !address.line1 || !address.city || !address.state || !address.country || !address.zipCode)
    return next(new ErrorHandler("Complete address is required", 400));

  const existingSlip = await SalarySlip.findOne({ authId });
  if (existingSlip) return next(new ErrorHandler("Salary slip already exists for this employee", 400));

  const salarySlip = new SalarySlip({
    authId,
    designation,
    department,
    salary: mongoose.Types.Decimal128.fromString(salary.toString()),
    contactNumber,
    bankDetails,
    address,
    notes,
  });

  await salarySlip.save();

  await salarySlip.populate("authId", "name email");

  res.status(201).json({
    success: true,
    message: "Salary slip created successfully",
    salarySlip,
  });
});

export const getSalarySlipById = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler("Invalid salary slip ID", 400));

  const salarySlip = await SalarySlip.findById(id).populate("authId", "name email");

  if (!salarySlip) return next(new ErrorHandler("Salary slip not found", 404));

  res.status(200).json({
    success: true,
    salarySlip,
  });
});

export const getSalarySlipsByEmployee = CatchAsyncError(async (req, res, next) => {
  const { authId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(authId))
    return next(new ErrorHandler("Invalid employee ID", 400));

  const salarySlips = await SalarySlip.find({ authId }).populate("authId", "name email");

  if (!salarySlips || salarySlips.length === 0)
    return next(new ErrorHandler("No salary slips found for this employee", 404));

  res.status(200).json({
    success: true,
    count: salarySlips.length,
    salarySlips,
  });
});

export const getAllSalarySlips = CatchAsyncError(async (req, res, next) => {
  let { status, department, startDate, endDate, page, limit } = req.query;

  const query = {};

  if (status) query.status = status;
  if (department) query.department = department;
  if (startDate || endDate) query.createdAt = {};
  if (startDate) query.createdAt.$gte = new Date(startDate);
  if (endDate) query.createdAt.$lte = new Date(endDate);

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;
  const skip = (page - 1) * limit;

  const total = await SalarySlip.countDocuments(query);
  const salarySlips = await SalarySlip.find(query)
    .populate("authId", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    total,
    page,
    limit,
    salarySlips,
  });
});

export const updateSalarySlip = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { salary, bankDetails, status, notes, contactNumber, designation, department } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler("Invalid salary slip ID", 400));

  const salarySlip = await SalarySlip.findById(id);
  if (!salarySlip) return next(new ErrorHandler("Salary slip not found", 404));

  if (salary !== undefined) salarySlip.salary = mongoose.Types.Decimal128.fromString(salary.toString());
  if (bankDetails) salarySlip.bankDetails = bankDetails;
  if (status) salarySlip.status = status;
  if (notes !== undefined) salarySlip.notes = notes;
  if (contactNumber) salarySlip.contactNumber = contactNumber;
  if (designation) salarySlip.designation = designation;
  if (department) salarySlip.department = department;

  await salarySlip.save();

  res.status(200).json({
    success: true,
    message: "Salary slip updated successfully",
    salarySlip,
  });
});

export const addSalaryHistory = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { month, salary, paidOn, paymentMethod, notes } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler("Invalid salary slip ID", 400));

  if (!month) return next(new ErrorHandler("Month is required", 400));
  if (!salary) return next(new ErrorHandler("Salary amount is required", 400));
  if (!paidOn) return next(new ErrorHandler("Paid date is required", 400));

  const salarySlip = await SalarySlip.findById(id);
  if (!salarySlip) return next(new ErrorHandler("Salary slip not found", 404));

  salarySlip.salaryHistory.push({
    month,
    salary: mongoose.Types.Decimal128.fromString(salary.toString()),
    paidOn: new Date(paidOn),
    paymentMethod: paymentMethod || "Bank Transfer",
    notes: notes || "",
  });

  await salarySlip.save();

  res.status(200).json({
    success: true,
    message: "Salary history added successfully",
    salarySlip,
  });
});

export const softDeleteSalarySlip = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler("Invalid salary slip ID", 400));

  const salarySlip = await SalarySlip.findById(id);
  if (!salarySlip) return next(new ErrorHandler("Salary slip not found", 404));

  salarySlip.isDeleted = true;
  await salarySlip.save();

  res.status(200).json({
    success: true,
    message: "Salary slip soft-deleted successfully",
  });
});

export const updateSalarySlipStatus = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler("Invalid salary slip ID", 400));

  const validStatuses = ["active", "onLeave", "resigned", "terminated"];
  if (!status || !validStatuses.includes(status))
    return next(new ErrorHandler(`Status must be one of: ${validStatuses.join(", ")}`, 400));

  const salarySlip = await SalarySlip.findById(id);
  if (!salarySlip) return next(new ErrorHandler("Salary slip not found", 404));

  salarySlip.status = status;
  await salarySlip.save();

  res.status(200).json({
    success: true,
    message: "Salary slip status updated successfully",
    salarySlip,
  });
});

export const downloadSalarySlip = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new ErrorHandler("Invalid Salary Slip ID", 400));
  }

  const salarySlip = await SalarySlip.findById(id).populate("authId", "name email");
  if (!salarySlip) {
    return next(new ErrorHandler("Salary Slip not found", 404));
  }

  const templatePath = path.join(__dirname, "../mails/salarySlip.ejs");

  const html = await ejs.renderFile(templatePath, {
    salarySlip,
    employee: salarySlip.authId,
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
  });

  await browser.close();

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=salarySlip_${salarySlip.employeeCode}.pdf`,
    "Content-Length": pdfBuffer.length,
  });

  res.send(pdfBuffer);
});