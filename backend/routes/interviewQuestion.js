import express from "express";
import { isAuthenticated, requireRole } from "../middlewares/auth.js";
import {
  createInterviewQuestion,
  deleteInterviewQuestion,
  getInterviewQuestionById,
  listInterviewQuestions,
  toggleInterviewQuestionStatus,
  updateInterviewQuestion,
} from "../controllers/interviewQuestion.js";

const interviewQuestionRouter = express.Router();

interviewQuestionRouter.post(
  "/create",
  isAuthenticated,
  createInterviewQuestion
);

interviewQuestionRouter.get("/all", isAuthenticated, listInterviewQuestions);

interviewQuestionRouter.get(
  "/all-admin",
  isAuthenticated,
  requireRole("admin"),
  listInterviewQuestions
);

interviewQuestionRouter.put(
  "/update/:id",
  isAuthenticated,
  updateInterviewQuestion
);

interviewQuestionRouter.get("/:id", isAuthenticated, getInterviewQuestionById);

interviewQuestionRouter.patch(
  "/toggle/:id",
  isAuthenticated,
  toggleInterviewQuestionStatus
);

interviewQuestionRouter.patch(
  "/soft-delete/:id",
  isAuthenticated,
  deleteInterviewQuestion
);

export default interviewQuestionRouter;
