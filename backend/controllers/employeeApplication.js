import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import EmployeeApplication from "../models/employee/employeeApplicationModal.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import fs from "fs";
import { sendMail } from "../utils/sendMail.js";
import mongoose from "mongoose";

export const createEmployeeApplication = CatchAsyncError(
  async (req, res, next) => {
    let uploadedResume = null;
    const uploadedAttachments = [];

    try {
      const {
        name,
        email,
        phone,
        gender,
        dob,
        positionApplied,
        department,
        experience,
        qualifications,
        message,
        applicationSource,
        address,
      } = req.body;

      if (!name) return next(new ErrorHandler("Name is required", 400));
      if (!email) return next(new ErrorHandler("Email is required", 400));
      if (!phone)
        return next(new ErrorHandler("Phone number is required", 400));
      if (!positionApplied)
        return next(new ErrorHandler("Position applied is required", 400));
      if (!department)
        return next(new ErrorHandler("Department is required", 400));

      if (req.files && req.files.resumeUrl) {
        const file = req.files.resumeUrl[0];
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "employee_applications/resumes",
        });
        uploadedResume = result.secure_url;
      }

      if (
        req.files &&
        req.files.attachments &&
        req.files.attachments.length > 0
      ) {
        for (const file of req.files.attachments) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "employee_applications/attachments",
          });
          uploadedAttachments.push({
            fileUrl: result.secure_url,
            fileType: file.mimetype,
          });
        }
      }

      const application = await EmployeeApplication.create({
        name,
        email,
        phone,
        gender,
        dob,
        positionApplied,
        department,
        resumeUrl: uploadedResume,
        attachments: uploadedAttachments,
        experience,
        qualifications,
        message,
        applicationSource,
        address,
      });

      await sendMail({
        email: process.env.ADMIN_MAIL || "hr@xynapse.com",
        subject: `New Employee Application: ${name}`,
        template: "employeeApplicationMail.ejs",
        data: { application },
      });

      res.status(201).json({
        success: true,
        message:
          "Employee application submitted successfully and admin notified",
        application,
      });
    } catch (error) {
      return next(
        new ErrorHandler(error.message || "Failed to submit application", 500)
      );
    } finally {
      if (req.files) {
        Object.keys(req.files).forEach((key) => {
          req.files[key].forEach((file) => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          });
        });
      }
    }
  }
);

export const getEmployeeApplicationById = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid Employee Application ID", 400));
    }

    const application = await EmployeeApplication.findById(id).populate(
      "authId",
      "name email"
    );

    if (!application || application.isDeleted) {
      return next(new ErrorHandler("Employee Application not found", 404));
    }

    res.status(200).json({
      success: true,
      application,
    });
  }
);

export const getAllEmployeeApplications = CatchAsyncError(
  async (req, res, next) => {
    const { status, department, startDate, endDate } = req.query;

    const filter = { isDeleted: false };

    if (status) filter.status = status;
    if (department) filter.department = department;
    if (startDate || endDate) filter.appliedDate = {};
    if (startDate) filter.appliedDate.$gte = new Date(startDate);
    if (endDate) filter.appliedDate.$lte = new Date(endDate);

    const applications = await EmployeeApplication.find(filter)
      .sort({ appliedDate: -1 })
      .populate("authId", "name email");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  }
);

export const updateEmployeeApplicationStatus = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid Employee Application ID", 400));
    }

    const allowedStatuses = [
      "pending",
      "reviewed",
      "shortlisted",
      "selected",
      "rejected",
    ];
    if (!status || !allowedStatuses.includes(status)) {
      return next(
        new ErrorHandler(
          `Status is required and must be one of: ${allowedStatuses.join(
            ", "
          )}`,
          400
        )
      );
    }

    const application = await EmployeeApplication.findById(id);
    if (!application || application.isDeleted) {
      return next(new ErrorHandler("Employee Application not found", 404));
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Employee application status updated to '${status}'`,
      application,
    });
  }
);

export const softDeleteEmployeeApplication = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid Employee Application ID", 400));
    }

    const application = await EmployeeApplication.findById(id);
    if (!application || application.isDeleted) {
      return next(
        new ErrorHandler(
          "Employee Application not found or already deleted",
          404
        )
      );
    }

    application.isDeleted = true;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Employee application soft deleted successfully",
      application,
    });
  }
);
