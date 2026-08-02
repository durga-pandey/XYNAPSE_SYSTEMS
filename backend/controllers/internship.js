import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import InternshipApplication from "../models/Internship/internshipModal.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { fileURLToPath } from "url";
import path from "path";
import ejs from "ejs";
import puppeteer from "puppeteer";
import fs from "fs";
import dotenv from "dotenv";
import { sendMail } from "../utils/sendMail.js";
import { sendStatusMail } from "../utils/sendStatusMail.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createInternshipApplication = CatchAsyncError(
  async (req, res, next) => {
    const {
      name,
      email,
      phone,
      courseId,
      year,
      department,
      linkedin,
      portfolio,
    } = req.body;

    let resumeData = {};
    let application;

    try {
      if (!name) return next(new ErrorHandler("Name is required", 400));
      if (!email) return next(new ErrorHandler("Email is required", 400));
      if (!phone)
        return next(new ErrorHandler("Phone number is required", 400));
      if (!courseId)
        return next(new ErrorHandler("Course ID is required", 400));
      if (!year) return next(new ErrorHandler("Year is required", 400));
      if (!department)
        return next(new ErrorHandler("Department is required", 400));

      if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        return next(new ErrorHandler("Invalid email format", 400));
      }

      if (phone && !/^\d{7,15}$/.test(phone.replace(/[\s\-]/g, ""))) {
        return next(new ErrorHandler("Invalid phone number", 400));
      }

      const resumeFile = req.files?.resumeUrl?.[0];
      if (resumeFile) {
        const result = await cloudinary.uploader.upload(resumeFile.path, {
          folder: "internships/resumes",
          resource_type: "auto",
        });
        resumeData = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };
      }

      application = await InternshipApplication.create({
        name,
        email,
        phone,
        resumeUrl: resumeData,
        courseId,
        year,
        department,
        linkedin,
        portfolio,
        studentId: req.user?._id,
      });

      res.status(201).json({
        success: true,
        message: "Internship Application Submitted !!",
        application,
      });
    } catch (error) {
      return next(error);
    } finally {
      const resumeFile = req.files?.resumeUrl?.[0];
      if (resumeFile && fs.existsSync(resumeFile.path)) {
        fs.unlinkSync(resumeFile.path);
      }

      if (application) {
        try {
          await sendMail({
            email: process.env.ADMIN_MAIL,
            subject: "New Internship Application Received",
            template: "internship-mail.ejs",
            data: { application },
          });
          console.log("Admin notified via email");
        } catch (mailError) {
          console.error("Error sending admin notification:", mailError);
        }
      }
    }
  },
);

export const getAllInternshipApplications = CatchAsyncError(
  async (req, res, next) => {
    let {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
      courseId,
      year,
      status,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (year) filter.year = year;
    if (status) filter.status = status;

    const sortOrder = order.toLowerCase() === "asc" ? 1 : -1;

    const totalApplications =
      await InternshipApplication.countDocuments(filter);

    const applications = await InternshipApplication.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("courseId", "name");

    res.status(200).json({
      success: true,
      totalApplications,
      page,
      totalPages: Math.ceil(totalApplications / limit),
      applications,
    });
  },
);

export const getSingleInternshipApplication = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorHandler("Invalid Application ID", 400));
    }

    const application = await InternshipApplication.findById(id).populate(
      "courseId",
      "name",
    );

    if (!application) {
      return next(new ErrorHandler("Internship application not found", 404));
    }

    res.status(200).json({
      success: true,
      application,
    });
  },
);

export const getMyInternshipApplications = CatchAsyncError(
  async (req, res, next) => {
    const userId = req.user?._id?.toString();

    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorHandler("Invalid User ID", 400));
    }

    const applications = await InternshipApplication.find({ studentId: userId })
      .populate("courseId", "name title")
      .sort({ createdAt: -1 });

    if (!applications || applications.length === 0) {
      return next(
        new ErrorHandler("No internship applications found for this user", 404),
      );
    }

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  },
);

export const updateInternshipApplicationStatus = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorHandler("Invalid Application ID", 400));
    }

    const allowedStatuses = [
      "pending",
      "reviewed",
      "selected",
      "offer_letter_issued",
      "internship_ongoing",
      "certificate_ready",
      "completed",
      "rejected",
    ];

    if (!status || !allowedStatuses.includes(status.toLowerCase())) {
      return next(
        new ErrorHandler(
          `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
          400,
        ),
      );
    }

    const application = await InternshipApplication.findById(id);
    if (!application) {
      return next(new ErrorHandler("Internship application not found", 404));
    }

    application.status = status.toLowerCase();
    application.statusUpdatedAt = new Date();
    await application.save();

    try {
      await sendStatusMail(application);
    } catch (error) {
      console.error(error);
    }

    res.status(200).json({
      success: true,
      message: `Application status updated to '${status}'`,
      application,
    });
  },
);

export const deleteInternshipApplication = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorHandler("Invalid Application ID", 400));
    }

    const application = await InternshipApplication.findById(id);
    if (!application) {
      return next(new ErrorHandler("Internship application not found", 404));
    }

    application.isDeleted = true;
    application.deletedAt = new Date();
    await application.save();

    if (application.resumeUrl && application.resumeUrl.public_id) {
      await cloudinary.uploader.destroy(application.resumeUrl.public_id, {
        resource_type: "raw",
      });
    }

    res.status(200).json({
      success: true,
      message: "Internship application soft-deleted successfully",
    });
  },
);

export const toggleInternshipApplicationActive = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorHandler("Invalid Application ID", 400));
    }

    if (typeof isActive !== "boolean") {
      return next(new ErrorHandler("isActive must be boolean", 400));
    }

    const application = await InternshipApplication.findById(id);
    if (!application) {
      return next(new ErrorHandler("Internship application not found", 404));
    }

    application.isActive = isActive;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Internship application ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      application,
    });
  },
);

export const hardDeleteInternshipApplication = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorHandler("Invalid Application ID", 400));
    }

    const application = await InternshipApplication.findById(id);
    if (!application) {
      return next(new ErrorHandler("Internship application not found", 404));
    }

    if (application.resumeUrl?.public_id) {
      try {
        await cloudinary.uploader.destroy(application.resumeUrl.public_id, {
          resource_type: "auto",
        });
      } catch (err) {
        console.error("Failed to delete resume from Cloudinary:", err);
      }
    }

    await InternshipApplication.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Internship application permanently deleted",
    });
  },
);

export const generateOfferLetter = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { offerLetterData } = req.body;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new ErrorHandler("Invalid Application ID", 400));
  }

  if (!offerLetterData || Object.keys(offerLetterData).length === 0) {
    return next(new ErrorHandler("Offer letter data is required", 400));
  }

  const application = await InternshipApplication.findById(id);
  if (!application) {
    return next(new ErrorHandler("Internship application not found", 404));
  }

  application.offerLetterData = {
    ...application.offerLetterData?.toObject(),
    ...offerLetterData,
  };

  await application.save({ runValidators: true });

  res.status(200).json({
    success: true,
    message: "Offer letter data updated successfully",
    offerLetterData: application.offerLetterData,
  });
});

export const updateExperiencePoints = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    const experiencePoints = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorHandler("Invalid Application ID", 400));
    }

    const application = await InternshipApplication.findById(id);
    if (!application) {
      return next(new ErrorHandler("Internship application not found", 404));
    }

    application.experiencePoints = {
      ...application.experiencePoints.toObject(),
      ...experiencePoints,
    };

    await application.save();

    res.status(200).json({
      success: true,
      message: "Experience points updated successfully",
      experiencePoints: application.experiencePoints,
    });
  },
);

export const updateCertificateData = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const {
    startDate,
    endDate,
    domain,
    location,
    signatoryName,
    signatoryDesignation,
  } = req.body;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new ErrorHandler("Invalid Application ID", 400));
  }

  const application = await InternshipApplication.findById(id);
  if (!application) {
    return next(new ErrorHandler("Internship application not found", 404));
  }

  application.certificateData = {
    startDate: startDate || application.certificateData.startDate,
    endDate: endDate || application.certificateData.endDate,
    domain: domain || application.certificateData.domain,
    location: location || application.certificateData.location,
    signatoryName: signatoryName || application.certificateData.signatoryName,
    signatoryDesignation:
      signatoryDesignation || application.certificateData.signatoryDesignation,
  };

  await application.save();

  res.status(200).json({
    success: true,
    message: "Certificate data updated successfully",
    certificateData: application.certificateData,
  });
});

export const downloadOfferLetter = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new ErrorHandler("Invalid Application ID", 400));
  }

  const application = await InternshipApplication.findById(id).select(
    "name department year offerLetterData",
  );

  if (!application) {
    return next(new ErrorHandler("Internship application not found", 404));
  }

  const logoPath = path.join(__dirname, "../images/Logo.png");
  const logoData = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  const templatePath = path.join(__dirname, "../mails/offer-letter.ejs");

  const html = await ejs.renderFile(templatePath, {
    application,
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
    "Content-Disposition": `attachment; filename=offer_letter_${application._id}.pdf`,
    "Content-Length": pdfBuffer.length,
  });

  res.send(pdfBuffer);
});

export const downloadExperienceLetter = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ErrorHandler("Invalid Application ID", 400));
    }

    const application = await InternshipApplication.findById(id).select(
      "name department year experiencePoints",
    );

    if (!application) {
      return next(new ErrorHandler("Internship application not found", 404));
    }

    const logoPath = path.join(__dirname, "../images/Logo.png");
    const logoData = fs.readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

    const templatePath = path.join(__dirname, "../mails/experience-letter.ejs");

    const html = await ejs.renderFile(templatePath, {
      application,
      logoBase64,
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=experience_letter_${application._id}.pdf`,
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  },
);

export const downloadCertificate = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new ErrorHandler("Invalid Application ID", 400));
  }

  const application = await InternshipApplication.findById(id).select(
    "name department year certificateData",
  );

  if (!application) {
    return next(new ErrorHandler("Internship application not found", 404));
  }

  const logoPath = path.join(__dirname, "../images/Logo.png");
  const logoData = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  const templatePath = path.join(__dirname, "../mails/certificate.ejs");

  const html = await ejs.renderFile(templatePath, {
    name: application.name,
    department: application.department,
    certificateData: application.certificateData || {},
    logoBase64,
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    width: "950px",
    height: "780px",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    displayHeaderFooter: false,
    omitBackground: false,
  });

  await browser.close();

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=certificate_${application._id}.pdf`,
    "Content-Length": pdfBuffer.length,
  });

  res.send(pdfBuffer);
});
