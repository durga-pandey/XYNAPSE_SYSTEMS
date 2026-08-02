import mongoose from "mongoose";
import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import Course from "../models/course/courseModal.js";
import Review from "../models/review/reviewModal.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const addCourseReview = CatchAsyncError(async (req, res, next) => {
  const { courseId } = req.params;
  const userId = req.user._id;
  const { rating, content } = req.body;

  if (!rating || !content) {
    return next(
      new ErrorHandler("Rating and review content are required", 400)
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const course = await Course.findById(courseId).session(session);
    if (!course) {
      await session.abortTransaction();
      return next(new ErrorHandler("Course not found", 404));
    }

    const alreadyReviewed = await Review.findOne({
      user: userId,
      course: courseId,
      parentReview: null,
    }).session(session);

    if (alreadyReviewed) {
      await session.abortTransaction();
      return next(
        new ErrorHandler("You have already reviewed this course", 409)
      );
    }

    const review = await Review.create(
      [
        {
          user: userId,
          course: courseId,
          rating,
          content,
          parentReview: null,
          level: 0,
        },
      ],
      { session }
    );

    const totalRatings = (course.ratingsCount || 0) + 1;
    const avgRating =
      ((course.averageRating || 0) * (totalRatings - 1) + rating) /
      totalRatings;

    course.ratingsCount = totalRatings;
    course.averageRating = Number(avgRating.toFixed(1));

    await course.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Review added successfully !!",
      data: review[0],
    });
  } catch (error) {
    await session.abortTransaction();
    return next(error);
  } finally {
    session.endSession();
  }
});

export const addReviewReply = CatchAsyncError(async (req, res, next) => {
  const { reviewId } = req.params;
  const userId = req.user._id;
  const { content } = req.body;

  if (!content) {
    return next(new ErrorHandler("Reply content is required", 400));
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const parentReview = await Review.findById(reviewId).session(session);
    if (!parentReview || parentReview.isDeleted) {
      await session.abortTransaction();
      return next(new ErrorHandler("Review not found", 404));
    }

    if (parentReview.level !== 0) {
      await session.abortTransaction();
      return next(new ErrorHandler("Replies allowed only on main reviews", 400));
    }

    const reply = await Review.create(
      [
        {
          user: userId,
          course: parentReview.course,
          content,
          parentReview: parentReview._id,
          level: 1,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Reply added successfully",
      data: reply[0],
    });
  } catch (err) {
    await session.abortTransaction();
    return next(err);
  } finally {
    session.endSession();
  }
});

export const getCourseReviews = CatchAsyncError(async (req, res, next) => {
  const { courseId } = req.params;

  const reviews = await Review.find({
    course: courseId,
    parentReview: null,
    isDeleted: false,
    isApproved: true,
  })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .lean();

  const reviewIds = reviews.map(r => r._id);

  const replies = await Review.find({
    parentReview: { $in: reviewIds },
    isDeleted: false,
    isApproved: true,
  })
    .populate("user", "name avatar")
    .sort({ createdAt: 1 })
    .lean();

  const replyMap = {};
  replies.forEach(reply => {
    const parentId = reply.parentReview.toString();
    if (!replyMap[parentId]) replyMap[parentId] = [];
    replyMap[parentId].push(reply);
  });

  const finalData = reviews.map(review => ({
    ...review,
    replies: replyMap[review._id.toString()] || [],
  }));

  res.status(200).json({
    success: true,
    count: finalData.length,
    data: finalData,
  });
});

export const updateReview = CatchAsyncError(async (req, res, next) => {
  const { reviewId } = req.params;
  const userId = req.user._id;
  const { content, rating } = req.body;

  const review = await Review.findById(reviewId);
  if (!review || review.isDeleted) {
    return next(new ErrorHandler("Review not found", 404));
  }

  if (review.user.toString() !== userId.toString()) {
    return next(new ErrorHandler("Unauthorized", 403));
  }

  if (review.level === 1 && rating) {
    return next(new ErrorHandler("Replies cannot have rating", 400));
  }

  if (content) review.content = content;
  if (rating && review.level === 0) review.rating = rating;

  await review.save();

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: review,
  });
});

export const deleteReview = CatchAsyncError(async (req, res, next) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  const review = await Review.findById(reviewId);
  if (!review || review.isDeleted) {
    return next(new ErrorHandler("Review not found", 404));
  }

  if (review.user.toString() !== userId.toString()) {
    return next(new ErrorHandler("Unauthorized", 403));
  }

  review.isDeleted = true;
  await review.save();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});


