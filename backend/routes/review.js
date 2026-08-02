import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addCourseReview,
  addReviewReply,
  deleteReview,
  getCourseReviews,
  updateReview,
} from "../controllers/review.js";

const reviewRouter = express.Router();

reviewRouter.post("/create/:courseId", isAuthenticated, addCourseReview);

reviewRouter.get("/all-review/:courseId", isAuthenticated, getCourseReviews);

reviewRouter.post("/reply/:reviewId", isAuthenticated, addReviewReply);

reviewRouter.patch("/update/:reviewId", isAuthenticated, updateReview);

reviewRouter.patch("/soft-delete/:reviewId", isAuthenticated, deleteReview);

export default reviewRouter;
