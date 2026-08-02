import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import Alumni from "../models/alumni/alumniModal.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import fs from "fs";

export const createAlumni = CatchAsyncError(async (req, res, next) => {
  const { name, certificateName, tags } = req.body;

  if (!name || !certificateName) {
    return next(new ErrorHandler("Name & CertificateName are required", 400));
  }

  const files = req.files
    ? Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat()
    : req.file
    ? [req.file]
    : [];

  if (files.length === 0) {
    return next(new ErrorHandler("At least one image is required", 400));
  }

  const uploadedImages = [];

  try {
    for (const file of files) {
      if (!file.path) continue;
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "alumni",
      });
      uploadedImages.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
        alt_text: file.originalname,
      });
    }

    let normalizedTags = [];
    if (tags) {
      if (typeof tags === "string") {
        normalizedTags = tags.split(",").map((t) => t.trim());
      } else if (Array.isArray(tags)) {
        normalizedTags = tags.map((t) => t.trim());
      }
    }

    const alumni = await Alumni.create({
      name,
      certificateName,
      images: uploadedImages,
      tags: normalizedTags,
      createdBy: req.user?._id || null,
    });

    res.status(201).json({
      success: true,
      data: alumni,
    });
  } catch (error) {
    for (const img of uploadedImages) {
      await cloudinary.uploader.destroy(img.public_id);
    }
    return next(new ErrorHandler(error.message, 500));
  } finally {
    for (const file of files) {
      if (file.path) {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Failed to cleanup local file:", file.path);
        });
      }
    }
  }
});

export const updateAlumni = CatchAsyncError(async (req, res, next) => {
  const alumniId = req.params.id;
  const { name, certificateName, tags } = req.body;

  const alumni = await Alumni.findById(alumniId);
  if (!alumni || alumni.isDeleted) {
    return next(new ErrorHandler("Alumni not found", 404));
  }

  const files = req.files
    ? Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat()
    : req.file
    ? [req.file]
    : [];

  const uploadedImages = [];

  try {
    for (const file of files) {
      if (!file.path) continue;
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "alumni",
      });
      uploadedImages.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
        alt_text: file.originalname,
      });
    }

    if (uploadedImages.length > 0) {
      alumni.images = [...alumni.images, ...uploadedImages];
    }
    if (name) alumni.name = name;
    if (certificateName) alumni.certificateName = certificateName;

    if (tags) {
      if (typeof tags === "string") {
        alumni.tags = tags.split(",").map((t) => t.trim());
      } else if (Array.isArray(tags)) {
        alumni.tags = tags.map((t) => t.trim());
      }
    }

    alumni.updatedBy = req.user?._id || null;
    await alumni.save();

    res.status(200).json({
      success: true,
      data: alumni,
    });
  } catch (error) {
    for (const img of uploadedImages) {
      await cloudinary.uploader.destroy(img.public_id);
    }
    return next(
      new ErrorHandler(error.message || "Failed to update alumni", 500)
    );
  } finally {
    for (const file of files) {
      if (file.path) {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Failed to cleanup local file:", file.path);
        });
      }
    }
  }
});

export const getAlumniById = CatchAsyncError(async (req, res, next) => {
  const alumniId = req.params.id;

  const alumni = await Alumni.findById(alumniId)
    .where({ isDeleted: false })
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!alumni) {
    return next(new ErrorHandler("Alumni not found", 404));
  }

  res.status(200).json({
    success: true,
    data: alumni,
  });
});

export const getAllAlumni = CatchAsyncError(async (req, res, next) => {
  let {
    page = 1,
    limit = 10,
    name,
    certificateName,
    tags,
    sortBy,
    sortOrder,
  } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const filter = { isDeleted: false };

  if (name) filter.name = { $regex: name, $options: "i" };
  if (certificateName)
    filter.certificateName = { $regex: certificateName, $options: "i" };
  if (tags) {
    const tagsArray =
      typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags;
    filter.tags = { $in: tagsArray };
  }

  const sort = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;
  } else {
    sort.createdAt = -1;
  }

  const total = await Alumni.countDocuments(filter);
  const alumni = await Alumni.find(filter)
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    total,
    page,
    limit,
    data: alumni,
  });
});

export const deleteAlumni = CatchAsyncError(async (req, res, next) => {
  const alumniId = req.params.id;

  const alumni = await Alumni.findById(alumniId);
  if (!alumni || alumni.isDeleted) {
    return next(new ErrorHandler("Alumni not found or already deleted", 404));
  }

  alumni.isDeleted = true;
  alumni.isActive = false;
  alumni.updatedBy = req.user?._id || null;
  await alumni.save();

  res.status(200).json({
    success: true,
    message: "Alumni soft deleted successfully",
  });
});

export const restoreAlumni = CatchAsyncError(async (req, res, next) => {
  const alumniId = req.params.id;

  const alumni = await Alumni.findById(alumniId);
  if (!alumni || !alumni.isDeleted) {
    return next(new ErrorHandler("Alumni not found or not deleted", 404));
  }

  alumni.isDeleted = false;
  alumni.isActive = true;
  alumni.updatedBy = req.user?._id || null;
  await alumni.save();

  res.status(200).json({
    success: true,
    message: "Alumni restored successfully",
    data: alumni,
  });
});

export const toggleAlumniActiveStatus = CatchAsyncError(
  async (req, res, next) => {
    const alumniId = req.params.id;

    const alumni = await Alumni.findById(alumniId);
    if (!alumni || alumni.isDeleted) {
      return next(new ErrorHandler("Alumni not found or deleted", 404));
    }

    alumni.isActive = !alumni.isActive;
    alumni.updatedBy = req.user?._id || null;
    await alumni.save();

    res.status(200).json({
      success: true,
      message: `Alumni is now ${alumni.isActive ? "active" : "inactive"}`,
      data: { id: alumni._id, isActive: alumni.isActive },
    });
  }
);

export const hardDeleteAlumni = CatchAsyncError(async (req, res, next) => {
  const alumniId = req.params.id;

  const alumni = await Alumni.findById(alumniId);
  if (!alumni) {
    return next(new ErrorHandler("Alumni not found", 404));
  }

  try {
    for (const img of alumni.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await Alumni.findByIdAndDelete(alumniId);

    res.status(200).json({
      success: true,
      message: "Alumni and all associated images permanently deleted",
    });
  } catch (error) {
    return next(
      new ErrorHandler(error.message || "Failed to hard delete alumni", 500)
    );
  }
});
