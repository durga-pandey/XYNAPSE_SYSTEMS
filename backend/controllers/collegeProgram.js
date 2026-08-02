import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import CollegeApplication from "../models/collegeProgram/collegeProgramModal.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendMail } from "../utils/sendMail.js";

export const submitCollegeApplication = CatchAsyncError(
  async (req, res, next) => {
    const {
      programType,
      collegeName,
      institutionType,
      contactPerson,
      designation,
      email,
      phone,
      message,
    } = req.body;

    const allowedPrograms = [
      "College Partners",
      "Classroom Trainings",
      "College Connect Program",
    ];


    if (!programType || !allowedPrograms.includes(programType)) {
      return next(new ErrorHandler("Invalid or missing program type", 400));
    }

    if (!collegeName || collegeName.trim().length < 3) {
      return next(new ErrorHandler("College name is required", 400));
    }

    if (
      institutionType &&
      !["College", "University", "Institute", "Other"].includes(institutionType)
    ) {
      return next(new ErrorHandler("Invalid institution type", 400));
    }

    if (!contactPerson || contactPerson.trim().length < 3) {
      return next(new ErrorHandler("Contact person name is required", 400));
    }

    if (designation && designation.length > 150) {
      return next(new ErrorHandler("Designation is too long", 400));
    }

    if (!email) {
      return next(new ErrorHandler("Official email is required", 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new ErrorHandler("Invalid email address", 400));
    }

    if (!phone || phone.trim().length < 8) {
      return next(new ErrorHandler("Valid phone number is required", 400));
    }

    if (message && message.length > 2000) {
      return next(new ErrorHandler("Message exceeds maximum length", 400));
    }


    const application = await CollegeApplication.create({
      programType,
      collegeName: collegeName.trim(),
      institutionType: institutionType || "College",
      contactPerson: contactPerson.trim(),
      designation,
      email: email.toLowerCase(),
      phone: phone.trim(),
      message,
      source: "Website",
      status: "New",
      createdByIP: req.ip,
      userAgent: req.headers["user-agent"],
    });


    try {
      await sendMail({
        email: process.env.ADMIN_MAIL, 
        subject: `New College Application - ${programType}`,
        template: "collegeApplication.ejs",
        data: {
          programType,
          collegeName,
          institutionType: institutionType || "College",
          contactPerson,
          designation,
          email,
          phone,
          message,
          applicationId: application._id,
          submittedAt: application.createdAt,
        },
      });
    } catch (err) {
      return next(
        new ErrorHandler(
          "Application saved but failed to send email notification",
          500
        )
      );
    }


    res.status(201).json({
      success: true,
      message: "College application submitted successfully",
      data: {
        applicationId: application._id,
        programType: application.programType,
        status: application.status,
        createdAt: application.createdAt,
      },
    });
  }
);

export const getAllCollegeApplications = CatchAsyncError(
  async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { programType, status, search } = req.query;

    const filter = {};

    if (programType) {
      filter.programType = programType;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { collegeName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { contactPerson: { $regex: search, $options: "i" } },
      ];
    }

    const totalApplications = await CollegeApplication.countDocuments(filter);

    const applications = await CollegeApplication.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-notes")
      .populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      total: totalApplications,
      page,
      limit,
      totalPages: Math.ceil(totalApplications / limit),
      data: applications,
    });
  }
);

export const getSingleCollegeApplication = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      return next(
        new ErrorHandler("Application ID is required", 400)
      );
    }

    const application = await CollegeApplication.findById(id)
      .populate("assignedTo", "name email")
      .populate("notes.addedBy", "name email");

    if (!application) {
      return next(
        new ErrorHandler("College application not found", 404)
      );
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  }
);

export const updateCollegeApplicationStatus = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    const { status, note } = req.body;

    const allowedStatuses = [
      "New",
      "Contacted",
      "Qualified",
      "Converted",
      "Rejected",
    ];

    if (!id) {
      return next(
        new ErrorHandler("Application ID is required", 400)
      );
    }

    if (!status || !allowedStatuses.includes(status)) {
      return next(
        new ErrorHandler("Invalid or missing application status", 400)
      );
    }

    const application = await CollegeApplication.findById(id);

    if (!application) {
      return next(
        new ErrorHandler("College application not found", 404)
      );
    }

    if (application.status === status) {
      return next(
        new ErrorHandler(
          `Application is already marked as ${status}`,
          400
        )
      );
    }

    application.status = status;

    if (note && note.trim().length > 0) {
      application.notes.push({
        note: note.trim(),
        addedBy: req.user?._id || null, 
      });
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: {
        applicationId: application._id,
        status: application.status,
        updatedAt: application.updatedAt,
      },
    });
  }
);

export const softDeleteCollegeApplication = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    const application = await CollegeApplication.findById(id);

    if (!application) {
      return next(new ErrorHandler("Application not found", 404));
    }

    if (application.isDeleted) {
      return next(new ErrorHandler("Application already deleted", 400));
    }

    application.isDeleted = true;
    application.deletedAt = new Date();
    application.deletedBy = req.user?._id || null; 
    await application.save();

    res.status(200).json({
      success: true,
      message: "Application soft-deleted successfully",
      data: {
        applicationId: application._id,
        isDeleted: application.isDeleted,
        deletedAt: application.deletedAt,
      },
    });
  }
);

export const restoreCollegeApplication = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    const application = await CollegeApplication.findById(id);

    if (!application) {
      return next(new ErrorHandler("Application not found", 404));
    }

    if (!application.isDeleted) {
      return next(new ErrorHandler("Application is not deleted", 400));
    }

    application.isDeleted = false;
    application.deletedAt = null;
    application.deletedBy = null;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Application restored successfully",
      data: {
        applicationId: application._id,
        isDeleted: application.isDeleted,
      },
    });
  }
);

export const hardDeleteCollegeApplication = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    const application = await CollegeApplication.findById(id);

    if (!application) {
      return next(new ErrorHandler("Application not found", 404));
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: "Application permanently deleted",
      data: {
        applicationId: id,
      },
    });
  }
);