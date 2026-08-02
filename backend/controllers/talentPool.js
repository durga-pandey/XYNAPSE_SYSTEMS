import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import TalentPool from "../models/talentPool/talentPoolModal.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const createTalentPool = CatchAsyncError(async (req, res, next) => {
  const { fullName, email, mobileNumber, companyName, designation } = req.body;

  if (!fullName || fullName.trim().length < 2) {
    return next(
      new ErrorHandler(
        "Full Name is required and must be at least 2 characters",
        400
      )
    );
  }

  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorHandler("Please provide a valid email address", 400));
  }

  if (!mobileNumber) {
    return next(new ErrorHandler("Mobile Number is required", 400));
  }

  const mobileRegex = /^\+?[0-9]{7,15}$/;
  if (!mobileRegex.test(mobileNumber)) {
    return next(new ErrorHandler("Please provide a valid mobile number", 400));
  }

  const existing = await TalentPool.findOne({
    email: email.trim().toLowerCase(),
  });
  if (existing) {
    return next(new ErrorHandler("Talent with this email already exists", 400));
  }

  const talent = await TalentPool.create({
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    mobileNumber: mobileNumber.trim(),
    companyName: companyName?.trim() || "",
    designation: designation?.trim() || "",
    createdBy: req.user?._id || null,
  });

  res.status(201).json({
    success: true,
    data: talent,
  });
});

export const updateTalentStatus = CatchAsyncError(async (req, res, next) => {
  const talentId = req.params.id;
  const { status } = req.body;

  if (!talentId) {
    return next(new ErrorHandler("Talent ID is required", 400));
  }
  if (!status) {
    return next(new ErrorHandler("Status is required", 400));
  }

  const validStatuses = ["Pending", "Reviewed", "Contacted", "Hired"];
  if (!validStatuses.includes(status)) {
    return next(
      new ErrorHandler(
        `Status must be one of: ${validStatuses.join(", ")}`,
        400
      )
    );
  }

  const talent = await TalentPool.findById(talentId);
  if (!talent || talent.isDeleted) {
    return next(new ErrorHandler("Talent not found", 404));
  }

  talent.status = status;
  talent.updatedBy = req.user?._id || null;
  await talent.save();

  res.status(200).json({
    success: true,
    message: `Talent status updated to "${status}"`,
    data: talent,
  });
});

export const getAllTalentPool = CatchAsyncError(async (req, res, next) => {
  let { page, limit, search, status, sortBy, sortOrder } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { isDeleted: false };
  if (search) {
    filter.fullName = { $regex: search, $options: "i" };
  }
  if (status) {
    filter.status = status;
  }

  const sort = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;
  } else {
    sort.createdAt = -1;
  }

  const total = await TalentPool.countDocuments(filter);
  const talents = await TalentPool.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: talents,
  });
});

export const getSingleTalentPool = CatchAsyncError(async (req, res, next) => {
  const talentId = req.params.id;

  if (!talentId) {
    return next(new ErrorHandler("Talent ID is required", 400));
  }

  const talent = await TalentPool.findById(talentId)
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!talent || talent.isDeleted) {
    return next(new ErrorHandler("Talent not found", 404));
  }

  res.status(200).json({
    success: true,
    data: talent,
  });
});

export const softDeleteTalentPool = CatchAsyncError(async (req, res, next) => {
  const talentId = req.params.id;

  if (!talentId) {
    return next(new ErrorHandler("Talent ID is required", 400));
  }

  const talent = await TalentPool.findById(talentId);
  if (!talent || talent.isDeleted) {
    return next(new ErrorHandler("Talent not found or already deleted", 404));
  }

  talent.isDeleted = true;
  talent.updatedBy = req.user?._id || null;
  await talent.save();

  res.status(200).json({
    success: true,
    message: "Talent has been soft deleted",
  });
});

export const restoreTalentPool = CatchAsyncError(async (req, res, next) => {
  const talentId = req.params.id;

  if (!talentId) {
    return next(new ErrorHandler("Talent ID is required", 400));
  }

  const talent = await TalentPool.findById(talentId);
  if (!talent || !talent.isDeleted) {
    return next(new ErrorHandler("Talent not found or not deleted", 404));
  }

  talent.isDeleted = false;
  talent.updatedBy = req.user?._id || null;
  await talent.save();

  res.status(200).json({
    success: true,
    message: "Talent has been restored",
  });
});

export const toggleActiveTalentPool = CatchAsyncError(
  async (req, res, next) => {
    const talentId = req.params.id;

    if (!talentId) {
      return next(new ErrorHandler("Talent ID is required", 400));
    }

    const talent = await TalentPool.findById(talentId);
    if (!talent || talent.isDeleted) {
      return next(new ErrorHandler("Talent not found", 404));
    }

    talent.isActive = !talent.isActive;
    talent.updatedBy = req.user?._id || null;
    await talent.save();

    res.status(200).json({
      success: true,
      message: `Talent is now ${talent.isActive ? "Active" : "Inactive"}`,
      data: { isActive: talent.isActive },
    });
  }
);

export const hardDeleteTalentPool = CatchAsyncError(async (req, res, next) => {
  const talentId = req.params.id;

  if (!talentId) {
    return next(new ErrorHandler("Talent ID is required", 400));
  }

  const talent = await TalentPool.findById(talentId);
  if (!talent) {
    return next(new ErrorHandler("Talent not found", 404));
  }

  await TalentPool.findByIdAndDelete(talentId);

  res.status(200).json({
    success: true,
    message: "Talent has been permanently deleted",
  });
});

