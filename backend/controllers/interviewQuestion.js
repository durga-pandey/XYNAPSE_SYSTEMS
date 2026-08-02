import mongoose from "mongoose";
import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Course from "../models/course/courseModal.js";
import InterviewQuestionAnswer from "../models/Interview-Question/interviewQuestionModal.js";

export const createInterviewQuestion = CatchAsyncError(async (req, res, next) => {
  const { courseId, question, answer } = req.body;

  if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
    return next(new ErrorHandler("Valid courseId is required", 400));
  }

  if (!question || question.trim() === "") {
    return next(new ErrorHandler("Question field is required", 400));
  }

  if (!answer || (Array.isArray(answer) && answer.length === 0) || (typeof answer === "string" && answer.trim() === "")) {
    return next(new ErrorHandler("Answer field is required", 400));
  }

  let answersArray = [];
  if (typeof answer === "string") {
    answersArray = [answer.trim()];
  } else if (Array.isArray(answer)) {
    answersArray = answer.map(a => a.trim()).filter(a => a.length > 0);
    if (answersArray.length === 0) {
      return next(new ErrorHandler("Answer array cannot be empty", 400));
    }
  } else {
    return next(new ErrorHandler("Answer must be a string or array of strings", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const course = await Course.findOne({ _id: courseId, isDeleted: false }).session(session);
    if (!course) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("Course not found or deleted", 404));
    }

    const newQA = await InterviewQuestionAnswer.create(
      [{
        courseId: course._id,
        question: question.trim(),
        answer: answersArray,
        isActive: true,
        isDeleted: false,
      }],
      { session } 
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Interview question created successfully",
      data: newQA[0], 
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(new ErrorHandler(err.message || "Failed to create interview question", 500));
  }
});

export const updateInterviewQuestion = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { courseId, question, answer } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid question ID", 400));
  }

  if (courseId && !mongoose.Types.ObjectId.isValid(courseId)) {
    return next(new ErrorHandler("Invalid courseId", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const qa = await InterviewQuestionAnswer.findOne({ _id: id, isDeleted: false }).session(session);
    if (!qa) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("Interview question not found", 404));
    }

    if (courseId) {
      const course = await Course.findOne({ _id: courseId, isDeleted: false }).session(session);
      if (!course) {
        await session.abortTransaction();
        session.endSession();
        return next(new ErrorHandler("Course not found", 404));
      }
      qa.courseId = courseId;
    }

    if (question) qa.question = question.trim();

    if (answer) {
      if (!Array.isArray(answer) || answer.length === 0) {
        return next(new ErrorHandler("Answer must be a non-empty array of strings", 400));
      }
      qa.answer = answer.map(a => a.trim());
    }

    await qa.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Interview question updated successfully",
      data: qa,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(new ErrorHandler(err.message, 500));
  }
});

export const getInterviewQuestionById = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid question ID", 400));
    }

    const qa = await InterviewQuestionAnswer.findOne({
      _id: id,
      isDeleted: false,
    })
      .populate("courseId", "title description")
      .lean();

    if (!qa) {
      return next(new ErrorHandler("Interview question not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Interview question fetched successfully",
      data: qa,
    });
  }
);

export const listInterviewQuestions = CatchAsyncError(
  async (req, res, next) => {
    let { page = 1, limit = 10, courseId, search } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = { isDeleted: false };
    if (courseId && mongoose.Types.ObjectId.isValid(courseId)) {
      filter.courseId = courseId;
    }

    if (search) {
      filter.$or = [
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
      ];
    }

    const total = await InterviewQuestionAnswer.countDocuments(filter);

    const questions = await InterviewQuestionAnswer.find(filter)
      .populate("courseId", "title description")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      message: "Interview questions fetched successfully",
      total,
      page,
      limit,
      data: questions,
    });
  }
);

export const toggleInterviewQuestionStatus = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid question ID", 400));
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const qa = await InterviewQuestionAnswer.findOne({
        _id: id,
        isDeleted: false,
      }).session(session);

      if (!qa) {
        await session.abortTransaction();
        session.endSession();
        return next(new ErrorHandler("Interview question not found", 404));
      }

      qa.isActive = !qa.isActive;
      await qa.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        message: `Interview question has been ${
          qa.isActive ? "activated" : "deactivated"
        }`,
        data: qa,
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return next(
        new ErrorHandler(err.message || "Failed to toggle status", 500)
      );
    }
  }
);

export const deleteInterviewQuestion = CatchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid question ID", 400));
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const qa = await InterviewQuestionAnswer.findOne({
        _id: id,
        isDeleted: false,
      }).session(session);

      if (!qa) {
        await session.abortTransaction();
        session.endSession();
        return next(new ErrorHandler("Interview question not found", 404));
      }

      qa.isDeleted = true;
      await qa.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        message: "Interview question soft deleted successfully",
        data: qa,
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
