import CourseForm from "../models/course/courseFormModal.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "./CatchAsyncError.js";

export const requirePaidCourse = CatchAsyncError(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new ErrorHandler("Unauthorized access", 401));
  }

  const paidCourse = await CourseForm.findOne({
    studentId: userId,
    status: "paid",
    isDeleted: false,
  }).select("_id status");

  if (!paidCourse) {
    return next(
      new ErrorHandler(
        "You have not paid for this course yet, So You are not allowed to access this section.",
        403
      )
    );
  }

  req.paidCourse = paidCourse;

  next();
});
