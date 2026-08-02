import express from "express";
import { isAuthenticated, requireRole } from "../middlewares/auth.js";
import {
  createCourse,
  deleteCourse,
  deleteSyllabus,
  getAllCourses,
  getAllSyllabuses,
  getCourseById,
  moderateCourse,
  toggleFeatureCourse,
  togglePublishCourse,
  updateCourse,
  updateCourseSEO,
  uploadCourseThumbnail,
  uploadSyllabus,
} from "../controllers/course.js";
import { multerMiddleware } from "../utils/multerConfig.js";

const courseRouter = express.Router();

courseRouter.post(
  "/create",
  isAuthenticated,
  requireRole("admin"),
  multerMiddleware([
    { name: "thumbnail", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  createCourse
);

courseRouter.get("/all-courses", getAllCourses);

courseRouter.put(
  "/:id",
  isAuthenticated,
  multerMiddleware([
    { name: "thumbnail", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  updateCourse
);

courseRouter.get("/:id", getCourseById);

courseRouter.patch(
  "/delete/:id",
  isAuthenticated,
  requireRole("admin"),
  deleteCourse
);

courseRouter.patch(
  "/publish/:id",
  isAuthenticated,
  requireRole("admin"),
  togglePublishCourse
);

courseRouter.patch(
  "/feature/:id",
  isAuthenticated,
  requireRole("admin"),
  toggleFeatureCourse
);

courseRouter.patch(
  "/moderate/:id",
  isAuthenticated,
  requireRole("admin"),
  moderateCourse
);

courseRouter.patch(
  "/thumbnail/:id",
  isAuthenticated,
  requireRole("admin"),
  multerMiddleware([
    { name: "thumbnail", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  uploadCourseThumbnail
);

courseRouter.patch("/seo/:id", isAuthenticated, updateCourseSEO);

courseRouter.put(
  "/update-syllabus/:courseId",
  isAuthenticated,
  requireRole("admin"),
  multerMiddleware([{ name: "syllabus", maxCount: 1 }]), 
  uploadSyllabus
);

courseRouter.delete(
  "/delete-syllabus/:courseId",
  isAuthenticated,
  requireRole("admin"),
  deleteSyllabus
);

courseRouter.get("/syllabuses", getAllSyllabuses);

export default courseRouter;
