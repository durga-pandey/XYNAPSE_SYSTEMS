import mongoose from "mongoose";
import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import JobMela from "../models/jobMela/jobMelaModal.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const createJobFair = CatchAsyncError(async (req, res, next) => {
  const {
    title,
    companyName,
    jobLink,
    jobType,
    location,
    salary,
    description,
    applicationDeadline,
  } = req.body;

  if (!title) return next(new ErrorHandler("Job title is required", 400));
  if (!companyName)
    return next(new ErrorHandler("Company name is required", 400));
  if (!jobLink) return next(new ErrorHandler("Job link is required", 400));
  if (!jobType) return next(new ErrorHandler("Job type is required", 400));
  if (!location) return next(new ErrorHandler("Location is required", 400));
  if (!description)
    return next(new ErrorHandler("Job description is required", 400));
  if (!applicationDeadline)
    return next(new ErrorHandler("Application deadline is required", 400));

  const existingJob = await JobMela.findOne({
    title,
    companyName,
    applicationDeadline,
  });
  if (existingJob)
    return next(
      new ErrorHandler(
        "Job posting already exists for this company and title",
        400
      )
    );

  const jobFair = await JobMela.create({
    title,
    companyName,
    jobLink,
    jobType,
    location,
    salary: salary
      ? mongoose.Types.Decimal128.fromString(salary.toString())
      : null,
    description,
    applicationDeadline: new Date(applicationDeadline),
  });

  res.status(201).json({
    success: true,
    message: "Job Posting Created !!",
    jobFair,
  });
});

export const getSingleJobFair = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const job = await JobMela.findOne({ _id: id, isDeleted: false });
  if (!job) return next(new ErrorHandler("Job posting not found", 404));

  res.status(200).json({
    success: true,
    job,
  });
});

export const getAllJobFairs = CatchAsyncError(async (req, res, next) => {
  const { status, jobType, companyName, startDate, endDate } = req.query;

  const filter = { isDeleted: false };

  if (status) filter.status = status;
  if (jobType) filter.jobType = jobType;
  if (companyName) filter.companyName = { $regex: companyName, $options: "i" };

  if (startDate || endDate) {
    filter.applicationDeadline = {};
    if (startDate) filter.applicationDeadline.$gte = new Date(startDate);
    if (endDate) filter.applicationDeadline.$lte = new Date(endDate);
  }

  const jobs = await JobMela.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: jobs.length,
    jobs,
  });
});

export const updateJobFair = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const allowedFields = [
    "title",
    "description",
    "jobType",
    "salary",
    "location",
    "companyName",
    "link",
    "status",
    "applicationDeadline",
  ];

  const updateData = {};

  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) updateData[key] = req.body[key];
  });

  if (Object.keys(updateData).length === 0) {
    return next(new ErrorHandler("No valid fields provided for update", 400));
  }

  const updatedJob = await JobMela.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedJob)
    return next(new ErrorHandler("Job posting not found", 404));

  res.status(200).json({
    success: true,
    message: "Job posting updated successfully",
    updatedJob,
  });
});

export const updateJobFairStatus = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["active", "closed"];

  if (!status)
    return next(new ErrorHandler("Status is required", 400));

  if (!validStatuses.includes(status)) {
    return next(
      new ErrorHandler(
        `Invalid status. Allowed: ${validStatuses.join(", ")}`,
        400
      )
    );
  }

  const updatedJob = await JobMela.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { status },
    { new: true, runValidators: true }
  );

  if (!updatedJob)
    return next(new ErrorHandler("Job posting not found", 404));

  res.status(200).json({
    success: true,
    message: "Job posting status updated successfully",
    updatedJob,
  });
});

export const deleteJobFair = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const job = await JobMela.findOne({ _id: id, isDeleted: false });

  if (!job) {
    return next(new ErrorHandler("Job posting not found", 404));
  }

  job.isDeleted = true;
  job.deletedAt = new Date();

  await job.save();

  res.status(200).json({
    success: true,
    message: "Job posting soft deleted successfully",
  });
});


