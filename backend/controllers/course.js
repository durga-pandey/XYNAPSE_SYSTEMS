import mongoose from "mongoose";
import Course from "../models/course/courseModal.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { courseValidationSchema } from "../utils/validateCourse.js";
import fs from "fs";
import path from "path";

export const createCourse = CatchAsyncError(async (req, res, next) => {
  const body = { ...req.body };

  if (body.aboutCourse && typeof body.aboutCourse === "string") {
    try {
      body.aboutCourse = JSON.parse(body.aboutCourse);
    } catch {
      body.aboutCourse = [body.aboutCourse];
    }
  }

  if (body.tags && typeof body.tags === "string") {
    try {
      body.tags = JSON.parse(body.tags);
    } catch {
      body.tags = [body.tags];
    }
  }

  if (
    body.parentCourse &&
    !mongoose.Types.ObjectId.isValid(body.parentCourse)
  ) {
    return next(new ErrorHandler("Invalid parentCourse ID", 400));
  }

  const { error, value } = courseValidationSchema.validate(body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return next(
      new ErrorHandler(error.details.map((d) => d.message).join(", "), 400),
    );
  }

  let courseData = value;
  let uploadedFiles = [];

  try {
    if (req.files?.thumbnail?.[0]?.path) {
      const tempThumbnailPath = req.files.thumbnail[0].path;
      uploadedFiles.push(tempThumbnailPath);

      const result = await cloudinary.uploader.upload(tempThumbnailPath, {
        folder: "courses/thumbnails",
        use_filename: true,
        unique_filename: false,
      });

      courseData.thumbnail = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    }

    if (req.files?.logo?.[0]?.path) {
      const tempLogoPath = req.files.logo[0].path;
      uploadedFiles.push(tempLogoPath);

      const result = await cloudinary.uploader.upload(tempLogoPath, {
        folder: "courses/logos",
        use_filename: true,
        unique_filename: false,
      });

      courseData.logo = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    }

    if (!req.user || !req.user._id) {
      return next(new ErrorHandler("Instructor information missing", 400));
    }
    courseData.instructor = req.user._id;
    courseData.moderationStatus = "pending";

    if (body.parentCourse) {
      courseData.parentCourse = body.parentCourse;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const course = await Course.create([courseData], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course[0],
    });
  } catch (err) {
    return next(
      new ErrorHandler(err.message || "Failed to create course", 500),
    );
  } finally {
    for (const path of uploadedFiles) {
      fs.promises
        .unlink(path)
        .catch((e) => console.error("Failed to delete temp file", e.message));
    }
  }
});

export const updateCourse = CatchAsyncError(async (req, res, next) => {
  const courseId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return next(new ErrorHandler("Invalid course ID", 400));
  }

  let body = { ...req.body };
  let uploadedFiles = [];

  try {
    if (body.aboutCourse !== undefined) {
      if (typeof body.aboutCourse === "string") {
        try {
          body.aboutCourse = JSON.parse(body.aboutCourse);
        } catch {
          body.aboutCourse = [body.aboutCourse];
        }
      } else if (!Array.isArray(body.aboutCourse)) {
        return next(
          new ErrorHandler("aboutCourse must be an array or JSON string", 400),
        );
      }
    }

    if (body.tags !== undefined) {
      if (typeof body.tags === "string") {
        try {
          body.tags = JSON.parse(body.tags);
        } catch {
          body.tags = [body.tags];
        }
      } else if (!Array.isArray(body.tags)) {
        return next(
          new ErrorHandler("tags must be an array or JSON string", 400),
        );
      }
    }

    if (body.parentCourse !== undefined) {
      if (
        body.parentCourse &&
        !mongoose.Types.ObjectId.isValid(body.parentCourse)
      ) {
        return next(new ErrorHandler("Invalid parentCourse ID", 400));
      }
    }

    const { error, value } = courseValidationSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(
        new ErrorHandler(error.details.map((d) => d.message).join(", "), 400),
      );
    }

    let updatedData = value;

    if (req.files?.thumbnail?.[0]?.path) {
      const tempThumbnailPath = req.files.thumbnail[0].path;
      uploadedFiles.push(tempThumbnailPath);

      const result = await cloudinary.uploader.upload(tempThumbnailPath, {
        folder: "courses/thumbnails",
        use_filename: true,
        unique_filename: false,
      });

      updatedData.thumbnail = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    }

    if (req.files?.logo?.[0]?.path) {
      const tempLogoPath = req.files.logo[0].path;
      uploadedFiles.push(tempLogoPath);

      const result = await cloudinary.uploader.upload(tempLogoPath, {
        folder: "courses/logos",
        use_filename: true,
        unique_filename: false,
      });

      updatedData.logo = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    }

    if (!req.user || !req.user._id) {
      return next(new ErrorHandler("Instructor information missing", 400));
    }
    updatedData.instructor = req.user._id;

    if (body.parentCourse !== undefined) {
      updatedData.parentCourse = body.parentCourse || null;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const course = await Course.findOneAndUpdate(
      { _id: courseId, isDeleted: false },
      updatedData,
      { new: true, runValidators: true, session },
    );

    if (!course) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("Course not found or deleted", 404));
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (err) {
    return next(
      new ErrorHandler(err.message || "Failed to update course", 500),
    );
  } finally {
    for (const path of uploadedFiles) {
      fs.promises
        .unlink(path)
        .catch((e) => console.error("Failed to delete temp file:", e.message));
    }
  }
});

export const getAllCourses = CatchAsyncError(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    tags,
    isFree,
    isFeatured,
    visibility,
    moderationStatus,
    sortBy = "createdAt",
    order = "desc",
    minPrice,
    maxPrice,
  } = req.query;

  const filter = { isDeleted: false };

  if (category) filter.category = category;
  if (tags) filter.tags = { $in: tags.split(",").map((tag) => tag.trim()) };
  if (isFree !== undefined)
    filter.isFree = isFree === "true" || isFree === true;
  if (isFeatured !== undefined)
    filter.isFeatured = isFeatured === "true" || isFeatured === true;
  if (visibility) filter.visibility = visibility;
  if (moderationStatus) filter.moderationStatus = moderationStatus;
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined && minPrice !== "" && !isNaN(Number(minPrice))) {
      filter.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined && maxPrice !== "" && !isNaN(Number(maxPrice))) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  if (search) filter.$text = { $search: search };

  const sortOrder = order === "asc" ? 1 : -1;
  const sort = { [sortBy]: sortOrder };

  const skip = (Number(page) - 1) * Number(limit);

  const [total, courses] = await Promise.all([
    Course.countDocuments(filter),
    Course.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("instructor", "name email"),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
    data: courses,
  });
});

export const getCourseById = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid course ID", 400));
  }

  const course = await Course.findOne({ _id: id, isDeleted: false }).populate(
    "instructor",
    "name email",
  );

  if (!course) {
    return next(new ErrorHandler("Course not found or deleted", 404));
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

export const deleteCourse = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid course ID", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const course = await Course.findOne({ _id: id, isDeleted: false }).session(
      session,
    );

    if (!course) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("Course not found or already deleted", 404));
    }
    course.isDeleted = true;
    await course.save({ session });
    if (course.thumbnail?.public_id) {
      try {
        await cloudinary.uploader.destroy(course.thumbnail.public_id);
      } catch (err) {
        console.error(
          "Failed to delete thumbnail from Cloudinary:",
          err.message,
        );
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: null,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(new ErrorHandler(err.message, 500));
  }
});

export const togglePublishCourse = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { publish } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid course ID", 400));
  }
  if (typeof publish !== "boolean") {
    return next(new ErrorHandler("publish must be boolean", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const course = await Course.findOne({ _id: id, isDeleted: false }).session(
      session,
    );

    if (!course) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("Course not found or deleted", 404));
    }

    course.visibility = publish ? "public" : "private";
    if (publish && !course.publishedAt) course.publishedAt = new Date();

    await course.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: `Course ${publish ? "published" : "unpublished"} successfully`,
      data: course,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(
      new ErrorHandler(err.message || "Failed to update course", 500),
    );
  }
});

export const toggleFeatureCourse = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { feature } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid course ID", 400));
  }
  if (typeof feature !== "boolean") {
    return next(new ErrorHandler("feature must be boolean", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const course = await Course.findOne({ _id: id, isDeleted: false }).session(
      session,
    );

    if (!course) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("Course not found or deleted", 404));
    }

    course.isFeatured = feature;

    await course.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: `Course ${feature ? "featured" : "unfeatured"} successfully`,
      data: course,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(
      new ErrorHandler(err.message || "Failed to update course", 500),
    );
  }
});

export const moderateCourse = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid course ID", 400));
  }

  if (!["approve", "reject"].includes(action)) {
    return next(
      new ErrorHandler("action must be either 'approve' or 'reject'", 400),
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const course = await Course.findOne({ _id: id, isDeleted: false }).session(
      session,
    );

    if (!course) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("Course not found or deleted", 404));
    }

    course.moderationStatus = action === "approve" ? "approved" : "rejected";

    await course.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: `Course has been ${course.moderationStatus}`,
      data: course,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(
      new ErrorHandler(err.message || "Failed to moderate course", 500),
    );
  }
});

export const uploadCourseThumbnail = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid course ID", 400));
  }

  if (!req.files?.thumbnail && !req.files?.logo) {
    return next(new ErrorHandler("Thumbnail or Logo file is required", 400));
  }

  const tempFiles = [];
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const course = await Course.findOne({ _id: id, isDeleted: false }).session(
      session,
    );

    if (!course) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("Course not found or deleted", 404));
    }

    if (req.files?.thumbnail) {
      const thumbPath = req.files.thumbnail[0].path;
      tempFiles.push(thumbPath);

      // delete old thumbnail
      if (course.thumbnail?.public_id) {
        try {
          await cloudinary.uploader.destroy(course.thumbnail.public_id);
        } catch (err) {
          console.error("Failed to delete old thumbnail:", err.message);
        }
      }

      const result = await cloudinary.uploader.upload(thumbPath, {
        folder: "courses/thumbnails",
        use_filename: true,
        unique_filename: false,
      });

      course.thumbnail = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    }

    if (req.files?.logo) {
      const logoPath = req.files.logo[0].path;
      tempFiles.push(logoPath);

      if (course.logo?.public_id) {
        try {
          await cloudinary.uploader.destroy(course.logo.public_id);
        } catch (err) {
          console.error("Failed to delete old logo:", err.message);
        }
      }

      const result = await cloudinary.uploader.upload(logoPath, {
        folder: "courses/logos",
        use_filename: true,
        unique_filename: false,
      });

      course.logo = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    }

    await course.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Media uploaded successfully",
      data: course,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(new ErrorHandler(err.message || "Failed to upload media", 500));
  } finally {
    for (const path of tempFiles) {
      fs.promises
        .unlink(path)
        .catch((e) => console.error("Temp file delete failed:", e.message));
    }
  }
});

export const updateCourseSEO = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { metaTitle, metaDescription, ogImage } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid course ID", 400));
  }

  if (!metaTitle && !metaDescription && !ogImage) {
    return next(new ErrorHandler("At least one SEO field is required", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const course = await Course.findOne({ _id: id, isDeleted: false }).session(
      session,
    );

    if (!course) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("Course not found or deleted", 404));
    }

    if (metaTitle) course.seo.metaTitle = metaTitle;
    if (metaDescription) course.seo.metaDescription = metaDescription;
    if (ogImage) course.seo.ogImage = ogImage;

    await course.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "SEO meta info updated successfully",
      data: course,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(
      new ErrorHandler(err.message || "Failed to update SEO info", 500),
    );
  }
});

const deleteLocalFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting local file:", err);
    });
  }
};

export const uploadSyllabus = CatchAsyncError(async (req, res, next) => {
  const { courseId } = req.params;
  const file = req.files?.syllabus?.[0] || req.file;

  if (!file) {
    return next(new ErrorHandler("Please upload a PDF file", 400));
  }

  let course = await Course.findById(courseId);
  if (!course) {
    deleteLocalFile(file.path);
    return next(new ErrorHandler("Course not found", 404));
  }

  try {
    if (course.syllabus?.public_id) {
      await cloudinary.uploader.destroy(course.syllabus.public_id, {
        resource_type: "raw",
      });
    }

    const myCloud = await cloudinary.uploader.upload(file.path, {
      folder: "xynapse/syllabus",
      resource_type: "raw",
    });

    course.syllabus = {
      public_id: myCloud.public_id,
      secure_url: myCloud.secure_url,
    };

    await course.save();

    res.status(200).json({
      success: true,
      message: "Syllabus uploaded successfully",
      syllabus: course.syllabus,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  } finally {
    deleteLocalFile(file.path);
  }
});

export const deleteSyllabus = CatchAsyncError(async (req, res, next) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);

  if (!course) return next(new ErrorHandler("Course not found", 404));

  if (course.syllabus?.public_id) {
    await cloudinary.uploader.destroy(course.syllabus.public_id, {
      resource_type: "raw",
    });

    course.syllabus = undefined;
    await course.save();
  }

  res.status(200).json({
    success: true,
    message: "Syllabus deleted successfully",
  });
});

export const getAllSyllabuses = CatchAsyncError(async (req, res, next) => {
  const courses = await Course.find({
    "syllabus.secure_url": { $exists: true },
  }).select("title syllabus");

  res.status(200).json({
    success: true,
    courses,
  });
});
