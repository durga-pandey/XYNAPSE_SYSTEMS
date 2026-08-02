import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import Auth from "../models/auth/authModal.js";
import Invoice from "../models/invoices/invoiceModal.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendMail } from "../utils/sendMail.js";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import fs from "fs";
import puppeteer from "puppeteer";
import mongoose from "mongoose";
import CourseForm from "../models/course/courseFormModal.js";
import Course from "../models/course/courseModal.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createInvoice = CatchAsyncError(async (req, res, next) => {
  const { studentId, courses, paymentMode, discount, taxes, notes } = req.body;

  if (!studentId) return next(new ErrorHandler("Student ID is required", 400));
  if (!courses || !Array.isArray(courses) || courses.length === 0)
    return next(new ErrorHandler("Courses array is required", 400));
  if (!paymentMode)
    return next(new ErrorHandler("Payment Mode is required", 400));

  const student = await Auth.findById(studentId);
  if (!student) return next(new ErrorHandler("Student not found", 404));

  const coursesData = [];

  for (const c of courses) {
    if (!c.courseId) return next(new ErrorHandler("Course ID is required", 400));
    if (!c.instructorId) return next(new ErrorHandler("Instructor ID is required", 400));

    const courseForm = await CourseForm.findOne({
      studentId,
      courseId: c.courseId,
      isDeleted: false,
    });

    if (!courseForm)
      return next(new ErrorHandler(`Course form not found for student and course ${c.courseId}`, 404));

    if (courseForm.status !== "paid")
      return next(new ErrorHandler(`Invoice cannot be created. Status for course ${c.courseId} is not Paid`, 400));

    const course = await Course.findById(c.courseId);
    if (!course) return next(new ErrorHandler(`Course not found: ${c.courseId}`, 404));

    const totalPrice = course.price;
    const paidAmount = parseFloat(c.paidAmount || 0);
    const dueAmount = totalPrice - paidAmount;

    const installments = c.installments && Array.isArray(c.installments)
      ? c.installments.map(inst => ({
          amount: mongoose.Types.Decimal128.fromString(inst.amount.toString()),
          status: inst.status || "pending",
          paidDate: inst.paidDate || (inst.status === "paid" ? new Date() : null),
        }))
      : [
          { amount: mongoose.Types.Decimal128.fromString(paidAmount.toString()), status: "paid", paidDate: new Date() },
        ];

    if (dueAmount > 0 && (!c.installments || c.installments.length === 0)) {
      installments.push({ amount: mongoose.Types.Decimal128.fromString(dueAmount.toString()), status: "pending" });
    }

    coursesData.push({
      courseId: c.courseId,
      instructorId: c.instructorId,
      amount: mongoose.Types.Decimal128.fromString(totalPrice.toString()),
      paidAmount: mongoose.Types.Decimal128.fromString(paidAmount.toString()),
      dueAmount: mongoose.Types.Decimal128.fromString(dueAmount.toString()),
      installments,
    });
  }

  const invoice = await Invoice.create({
    studentId,
    courses: coursesData,
    paymentMode,
    discount: mongoose.Types.Decimal128.fromString((discount || 0).toString()),
    taxes: {
      cgst: mongoose.Types.Decimal128.fromString((taxes?.cgst || 0).toString()),
      sgst: mongoose.Types.Decimal128.fromString((taxes?.sgst || 0).toString()),
      igst: mongoose.Types.Decimal128.fromString((taxes?.igst || 0).toString()),
      otherTaxes: mongoose.Types.Decimal128.fromString((taxes?.otherTaxes || 0).toString()),
    },
    notes: notes || "",
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Invoice created successfully",
    invoice,
  });
});

export const updateInvoice = CatchAsyncError(async (req, res, next) => {
  const { invoiceId } = req.params;
  const updateData = req.body;

  const invoice = await Invoice.findById(invoiceId);
  if (!invoice || invoice.isDeleted) {
    return next(new ErrorHandler("Invoice not found", 404));
  }

  if (invoice.paymentStatus === "paid") {
    const restrictedFields = ["courses", "totalAmount"];
    for (let field of restrictedFields) {
      if (field in updateData) {
        return next(
          new ErrorHandler(`Cannot update ${field} for a paid invoice`, 400)
        );
      }
    }
  }

  const allowedFields = ["notes", "paymentMode", "paymentStatus", "updatedBy"];
  allowedFields.forEach((key) => {
    if (key in updateData) invoice[key] = updateData[key];
  });

  if (updateData.courses && invoice.paymentStatus !== "paid") {
    invoice.courses = updateData.courses.map((c) => ({
      courseId: c.courseId,
      instructorId: c.instructorId,
      courseFee: mongoose.Types.Decimal128.fromString(c.courseFee.toString()),
      discount: mongoose.Types.Decimal128.fromString(
        (c.discount || 0).toString()
      ),
      taxes: {
        cgst: mongoose.Types.Decimal128.fromString(
          (c.taxes?.cgst || 0).toString()
        ),
        sgst: mongoose.Types.Decimal128.fromString(
          (c.taxes?.sgst || 0).toString()
        ),
        igst: mongoose.Types.Decimal128.fromString(
          (c.taxes?.igst || 0).toString()
        ),
        otherTaxes: mongoose.Types.Decimal128.fromString(
          (c.taxes?.otherTaxes || 0).toString()
        ),
      },
    }));

    let total = 0;
    invoice.courses.forEach((c) => {
      const fee = parseFloat(c.courseFee.toString()) || 0;
      const discount = parseFloat(c.discount.toString()) || 0;
      const cgst = parseFloat(c.taxes.cgst.toString()) || 0;
      const sgst = parseFloat(c.taxes.sgst.toString()) || 0;
      const igst = parseFloat(c.taxes.igst.toString()) || 0;
      const otherTaxes = parseFloat(c.taxes.otherTaxes.toString()) || 0;

      total += fee - discount + cgst + sgst + igst + otherTaxes;
    });

    invoice.totalAmount = mongoose.Types.Decimal128.fromString(
      total.toFixed(2)
    );
  }

  await invoice.save();

  res.status(200).json({
    success: true,
    message: "Invoice updated successfully",
    invoice,
  });
});

export const getAllInvoices = CatchAsyncError(async (req, res, next) => {
  const { studentId, courseId, paymentStatus, page = 1, limit = 20 } = req.query;

  const filter = { isDeleted: false };
  if (studentId) filter.studentId = studentId;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (courseId) filter["courses.courseId"] = courseId;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const invoices = await Invoice.find(filter)
    .populate("studentId", "name email")
    .populate({ path: "courses.courseId", select: "title price" }) 
    .populate({ path: "courses.instructorId", select: "name email" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  const total = await Invoice.countDocuments(filter);

  res.status(200).json({
    success: true,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    invoices,
  });
});

export const getSingleInvoice = CatchAsyncError(async (req, res, next) => {
  const { invoiceId } = req.params;

  let invoice = await Invoice.findById(invoiceId)
    .populate("studentId", "name email mobile bio")
    .lean();

  if (!invoice || invoice.isDeleted) {
    return next(new ErrorHandler("Invoice not found", 404));
  }

  const populatedCourses = await Promise.all(
    invoice.courses.map(async (c) => {
      const course = await Course.findById(c.courseId).select("title price");
      const instructor = await Auth.findById(c.instructorId).select(
        "name email"
      );
      return { ...c, course, instructor };
    })
  );

  invoice = { ...invoice, courses: populatedCourses };

  res.status(200).json({
    success: true,
    invoice, 
  });
});

export const getMyInvoices = CatchAsyncError(async (req, res, next) => {
  const authId = req.user._id;

  let invoices = await Invoice.find({
    isDeleted: false,
    $or: [{ studentId: authId }, { "courses.instructorId": authId }],
  })
    .populate("studentId", "name email mobile bio")
    .lean()
    .sort({ createdAt: -1 });

  invoices = await Promise.all(
    invoices.map(async (inv) => {
      const populatedCourses = await Promise.all(
        inv.courses.map(async (c) => {
          const course = await Course.findById(c.courseId).select("title price");
          const instructor = await Auth.findById(c.instructorId).select(
            "name email"
          );
          return { ...c, course, instructor };
        })
      );
      return { ...inv, courses: populatedCourses };
    })
  );

  res.status(200).json({
    success: true,
    message: "Invoices fetched successfully",
    total: invoices.length,
    data: invoices, 
  });
});

export const deleteInvoice = CatchAsyncError(async (req, res, next) => {
  const { invoiceId } = req.params;

  const invoice = await Invoice.findById(invoiceId);
  if (!invoice || invoice.isDeleted) {
    return next(new ErrorHandler("Invoice not found", 404));
  }

  if (invoice.paymentStatus === "paid") {
    return next(new ErrorHandler("Cannot delete a paid invoice", 400));
  }

  invoice.isDeleted = true;
  invoice.deletedAt = new Date();

  await invoice.save();

  res.status(200).json({
    success: true,
    message: "Invoice soft-deleted successfully",
  });
});

export const updatePaymentStatus = CatchAsyncError(async (req, res, next) => {
  const { invoiceId } = req.params;
  const { paymentStatus } = req.body;

  if (!paymentStatus) {
    return next(new ErrorHandler("Payment status is required", 400));
  }

  const validStatuses = ["pending", "paid", "cancelled"];
  if (!validStatuses.includes(paymentStatus)) {
    return next(
      new ErrorHandler(
        `Payment status must be one of: ${validStatuses.join(", ")}`,
        400
      )
    );
  }

  const invoice = await Invoice.findById(invoiceId);
  if (!invoice || invoice.isDeleted) {
    return next(new ErrorHandler("Invoice not found", 404));
  }

  invoice.paymentStatus = paymentStatus;
  await invoice.save();

  res.status(200).json({
    success: true,
    message: `Payment status updated to ${paymentStatus}`,
    invoice,
  });
});

export const searchInvoices = CatchAsyncError(async (req, res, next) => {
  const {
    studentName,
    courseName,
    invoiceNumber,
    paymentStatus,
    page = 1,
    limit = 20,
  } = req.query;

  const filter = { isDeleted: false };

  if (studentName) filter.studentName = { $regex: studentName, $options: "i" };
  if (courseName) filter.courseName = { $regex: courseName, $options: "i" };
  if (invoiceNumber) filter.invoiceNumber = invoiceNumber;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const invoices = await Invoice.find(filter)
    .populate("studentId", "name email")
    .populate("instructorId", "name email")
    .populate("courseId", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Invoice.countDocuments(filter);

  res.status(200).json({
    success: true,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    invoices,
  });
});

export const downloadInvoicePDF = CatchAsyncError(async (req, res, next) => {
  const { invoiceId } = req.params;

  if (!invoiceId.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new ErrorHandler("Invalid Invoice ID", 400));
  }

  let invoice = await Invoice.findById(invoiceId)
    .populate("studentId", "name email bio mobile")
    .lean();

  if (!invoice || invoice.isDeleted) {
    return next(new ErrorHandler("Invoice not found", 404));
  }

  const populatedCourses = await Promise.all(
    invoice.courses.map(async (c) => {
      const course = await Course.findById(c.courseId).select("title price");
      const instructor = await Auth.findById(c.instructorId).select("name email");
      return { ...c, course, instructor };
    })
  );

  invoice = { ...invoice, courses: populatedCourses };

  const logoPath = path.join(__dirname, "../images/Logo.png");
  const logoData = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  const templatePath = path.join(__dirname, "../mails/invoiceEmail.ejs");

  const html = await ejs.renderFile(templatePath, {
    invoice,
    student: invoice.studentId,
    logoBase64,
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
    "Content-Disposition": `attachment; filename=invoice_${invoice.invoiceNumber}.pdf`,
    "Content-Length": pdfBuffer.length,
  });

  res.send(pdfBuffer);
});
