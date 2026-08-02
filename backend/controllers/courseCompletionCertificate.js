import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import Certificate from "../models/course/courseCompletionCertificateModal.js";
import CourseForm from "../models/course/courseFormModal.js";
import ErrorHandler from "../utils/ErrorHandler.js";

import path from "path";
import fs from "fs";
import ejs from "ejs";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

export const issueCertificate = CatchAsyncError(async (req, res, next) => {
  const { courseId, studentName, courseTitle, grade, duration } = req.body;

  if (!courseId) return next(new ErrorHandler("Course ID is required", 400));
  if (!studentName)
    return next(new ErrorHandler("Student Name is required", 400));
  if (!courseTitle)
    return next(new ErrorHandler("Course Title is required", 400));
  if (!grade || !["A", "B", "C"].includes(grade))
    return next(new ErrorHandler("Valid Grade (A, B, or C) is required", 400));
  if (!duration) return next(new ErrorHandler("Duration is required", 400));

  const form = await CourseForm.findOne({
    courseId: courseId,
    name: studentName,
  });

  if (!form) {
    return next(
      new ErrorHandler("No enrollment found for this student and course", 404),
    );
  }

  if (form.status !== "paid") {
    return next(
      new ErrorHandler("Certificate can only be issued for PAID status", 403),
    );
  }

  const existingCert = await Certificate.findOne({
    courseId: courseId,
    "metadata.studentName": studentName,
  });

  if (existingCert) {
    return next(
      new ErrorHandler("Certificate already issued for this student", 400),
    );
  }

  const certificate = await Certificate.create({
    certificateId: `CERT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
    courseId,
    metadata: {
      studentName,
      courseTitle,
      grade,
      duration,
    },
  });

  res.status(201).json({
    success: true,
    message: "Certificate issued successfully",
    certificate,
  });
});

export const updateCertificate = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { studentId, courseId, metadata } = req.body;

  let certificate = await Certificate.findById(id);
  if (!certificate) return next(new ErrorHandler("Certificate not found", 404));

  if (studentId || courseId) {
    return next(
      new ErrorHandler("Student ID and Course ID cannot be updated", 400),
    );
  }

  if (metadata) {
    if (metadata.grade && !["A", "B", "C"].includes(metadata.grade)) {
      return next(
        new ErrorHandler("Valid Grade (A, B, or C) is required", 400),
      );
    }

    certificate.metadata = { ...certificate.metadata, ...metadata };
  }

  await certificate.save();

  res.status(200).json({
    success: true,
    message: "Certificate updated successfully",
    certificate,
  });
});

export const getSingleCertificate = CatchAsyncError(async (req, res, next) => {
  const certificate = await Certificate.findById(req.params.id).populate(
    "courseId",
    "title",
  );

  if (!certificate) {
    return next(new ErrorHandler("Certificate not found", 404));
  }

  res.status(200).json({
    success: true,
    certificate,
  });
});

export const getAllCertificates = CatchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const certificates = await Certificate.find()
    .populate("courseId", "title")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Certificate.countDocuments();

  res.status(200).json({
    success: true,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    certificates,
  });
});

export const softDeleteCertificate = CatchAsyncError(async (req, res, next) => {
  const certificate = await Certificate.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true },
  );

  if (!certificate) return next(new ErrorHandler("Certificate not found", 404));

  res.status(200).json({
    success: true,
    message: "Certificate moved to trash",
  });
});

export const hardDeleteCertificate = CatchAsyncError(async (req, res, next) => {
  const certificate = await Certificate.findByIdAndDelete(req.params.id);

  if (!certificate) return next(new ErrorHandler("Certificate not found", 404));

  res.status(200).json({
    success: true,
    message: "Certificate permanently deleted from database",
  });
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const downloadCertificate = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const certificate = await Certificate.findById(id).populate("courseId");
  if (!certificate) {
    return next(new ErrorHandler("Certificate not found", 404));
  }

  const logoPath = path.join(__dirname, "../images/Logo.png");
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");
  const logoSrc = `data:image/png;base64,${logoBase64}`;

  const templatePath = path.join(
    __dirname,
    "../mails/certificate-template.ejs",
  );

  const html = await ejs.renderFile(templatePath, {
    certificate,
    logoSrc,
    issueDate: certificate.metadata.issueDate.toDateString(),
  });

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    landscape: true,
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
    scale: 0.85,
    pageRanges: "1",
  });

  await browser.close();

  // 6. Response bhej do
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=Certificate_${certificate.certificateId}.pdf`,
    "Content-Length": pdfBuffer.length,
  });

  res.send(pdfBuffer);
});
