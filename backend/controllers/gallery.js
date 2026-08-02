import mongoose from "mongoose";
import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import Gallery from "../models/gallery/galleryModal.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import fs from "fs";

export const createGalleryItem = CatchAsyncError(async (req, res, next) => {
  if (!req.files?.image || !req.files.image[0]?.path) {
    console.error("Image file missing in request!");
    return next(new ErrorHandler("Image file is required", 400));
  }

  const { title, description } = req.body;
  let filePath = req.files.image[0].path;

  try {
    console.log("Uploading image to Cloudinary...");
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "gallery",
      use_filename: true,
      unique_filename: false,
    });

    const newGallery = await Gallery.create({
      title: title?.trim() || "",
      description: description?.trim() || "",
      image: {
        public_id: result.public_id,
        secure_url: result.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      message: "Gallery item created successfully",
      data: newGallery,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  } finally {
    fs.promises
      .unlink(filePath)
      .then(() => console.log("Temp file deleted"))
      .catch((e) => console.error("Temp file delete failed:", e.message));
  }
});

export const updateGalleryItem = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid gallery ID", 400));
  }

  const { title, description } = req.body;
  const tempFiles = [];

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const gallery = await Gallery.findOne({
      _id: id,
      isDeleted: false,
    }).session(session);

    if (!gallery) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("Gallery item not found", 404));
    }

    if (title) gallery.title = title.trim();
    if (description) gallery.description = description.trim();

    if (req.files?.image && req.files.image[0]?.path) {
      const imagePath = req.files.image[0].path;
      tempFiles.push(imagePath);

      if (gallery.image?.public_id) {
        try {
          await cloudinary.uploader.destroy(gallery.image.public_id);
        } catch (err) {
          console.error("Failed to delete old image:", err.message);
        }
      }

      const result = await cloudinary.uploader.upload(imagePath, {
        folder: "gallery",
        use_filename: true,
        unique_filename: false,
      });

      gallery.image = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    }

    await gallery.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      data: gallery,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(
      new ErrorHandler(err.message || "Failed to update gallery item", 500)
    );
  } finally {
    for (const path of tempFiles) {
      fs.promises
        .unlink(path)
        .then(() => console.log("Temp file deleted:", path))
        .catch((e) => console.error("Temp file delete failed:", e.message));
    }
  }
});

export const getGalleryItem = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid gallery ID", 400));
  }

  const gallery = await Gallery.findOne({ _id: id, isDeleted: false });

  if (!gallery) {
    return next(new ErrorHandler("Gallery item not found", 404));
  }

  res.status(200).json({
    success: true,
    data: gallery,
  });
});

export const listGalleryItems = CatchAsyncError(async (req, res, next) => {
  let { page = 1, limit = 10, search, isActive } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const filter = { isDeleted: false };
  if (isActive !== undefined) filter.isActive = isActive === "true";

  if (search) {
    filter.$text = { $search: search };
  }

  const totalItems = await Gallery.countDocuments(filter);

  const items = await Gallery.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    totalItems,
    page,
    totalPages: Math.ceil(totalItems / limit),
    data: items,
  });
});

export const toggleGalleryStatus = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid gallery ID", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const gallery = await Gallery.findOne({
      _id: id,
      isDeleted: false,
    }).session(session);

    if (!gallery) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("Gallery item not found", 404));
    }

    gallery.isActive = !gallery.isActive;
    await gallery.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: `Gallery item has been ${
        gallery.isActive ? "activated" : "deactivated"
      }`,
      data: gallery,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(
      new ErrorHandler(err.message || "Failed to toggle status", 500)
    );
  }
});

export const deleteGalleryItem = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid gallery ID", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const gallery = await Gallery.findOne({
      _id: id,
      isDeleted: false,
    }).session(session);

    if (!gallery) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("Gallery item not found", 404));
    }

    gallery.isDeleted = true;
    await gallery.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully (soft delete)",
      data: gallery,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(
      new ErrorHandler(err.message || "Failed to delete gallery item", 500)
    );
  }
});

export const hardDeleteGalleryItem = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid gallery ID", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const gallery = await Gallery.findById(id).session(session);

    if (!gallery) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("Gallery item not found", 404));
    }

    if (gallery.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(gallery.image.public_id);
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", err.message);
      }
    }

    await Gallery.deleteOne({ _id: id }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Gallery item permanently deleted successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(new ErrorHandler(err.message, 500));
  }
});

export const searchGalleryItems = CatchAsyncError(async (req, res, next) => {
  const { q, page = 1, limit = 10 } = req.query;

  if (!q || q.trim() === "") {
    return next(
      new ErrorHandler("Search query parameter 'q' is required", 400)
    );
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const items = await Gallery.find({
      $text: { $search: q },
      isDeleted: false,
    })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Gallery.countDocuments({
      $text: { $search: q },
      isDeleted: false,
    });

    res.status(200).json({
      success: true,
      message: `Found ${items.length} gallery item(s) matching '${q}'`,
      data: items,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
