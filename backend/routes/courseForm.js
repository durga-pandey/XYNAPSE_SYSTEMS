import express from "express";
import { isAuthenticated, optionalAuth, requireRole } from "../middlewares/auth.js";
import {
  assignInstructor,
  deleteCourseForm,
  getAllCourseForms,
  getFormsByCourseId,
  getRecentCourseForms,
  getSingleCourseForm,
  searchCourseForms,
  submitCourseForm,
  updateCourseForm,
} from "../controllers/courseForm.js";

const courseFormRouter = express.Router();


// done
courseFormRouter.post("/create-form",optionalAuth, submitCourseForm);


courseFormRouter.get("/all-form", getAllCourseForms);

// for admin
courseFormRouter.get("/search-form", isAuthenticated, searchCourseForms);

courseFormRouter.get("/recent-form", isAuthenticated, getRecentCourseForms);

courseFormRouter.patch("/update-form/:id", isAuthenticated, updateCourseForm);

courseFormRouter.get("/form/:id", isAuthenticated, getSingleCourseForm);

courseFormRouter.patch("/delete/:id", isAuthenticated, deleteCourseForm);

courseFormRouter.get("/course/:courseId", isAuthenticated, getFormsByCourseId);

courseFormRouter.patch(
  "/assign/:id",
  isAuthenticated,
  requireRole("admin"),
  assignInstructor
);

export default courseFormRouter;
