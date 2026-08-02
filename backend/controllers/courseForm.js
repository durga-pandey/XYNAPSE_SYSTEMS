import { isObjectIdOrHexString } from "mongoose";
import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import CourseForm from "../models/course/courseFormModal.js";
import ApiFeatures from "../services/apiService.js";
import { sendMail } from "../utils/sendMail.js";
import Auth from "../models/auth/authModal.js";
import { PasswordService } from "../services/passwordService.js";
import crypto from "crypto";

export const submitCourseForm = CatchAsyncError(async (req, res, next) => {
  const { name, email, mobile, city, country, courseId } = req.body;

  if (!name) return next(new ErrorHandler("Name field is required.", 400));
  if (!email) return next(new ErrorHandler("Email field is required.", 400));
  if (!mobile) return next(new ErrorHandler("Mobile number is required.", 400));
  if (!country) return next(new ErrorHandler("Country field is required.", 400));
  if (!courseId) return next(new ErrorHandler("Course ID is required to submit the form.", 400));

  if (!isObjectIdOrHexString(courseId)) {
    return next(new ErrorHandler("Invalid Course ID format.", 400));
  }

  const studentId = req.user?._id || null;

  const duplicateQuery = {
    courseId,
    isDeleted: false,
    ...(studentId ? { studentId } : { email }),
  };

  const existingForm = await CourseForm.findOne(duplicateQuery);

  if (existingForm && existingForm.status !== "rejected") {
    return next(
      new ErrorHandler(
        `You have already applied for this course. Current status: ${existingForm.status}.`,
        409
      )
    );
  }

  const newForm = await CourseForm.create({
    name,
    email,
    mobile,
    city,
    country,
    courseId,
    studentId,
    appliedAsGuest: !studentId,
  });

  const populatedForm = await CourseForm.findById(newForm._id)
    .populate("courseId", "title syllabus") 
    .lean();

  const syllabusDownloadUrl = populatedForm.courseId?.syllabus?.secure_url || null;

  res.status(201).json({
    success: true,
    message: "Course form submitted successfully! Status: Pending.",
    data: populatedForm,
    downloadUrl: syllabusDownloadUrl, 
  });

  try {
    await sendMail({
      email: process.env.ADMIN_MAIL,
      subject: "New Course Form Submission",
      template: "course-form-mail.ejs",
      data: {
        form: populatedForm,
      },
    });
  } catch (err) {
    console.error("Error sending admin mail:", err);
  }
});

export const getAllCourseForms = CatchAsyncError(async (req, res, next) => {
  const limit = 5;
  const page = Number(req.query.page) || 1;

  const skip = (page - 1) * limit;

  const totalCount = await CourseForm.countDocuments({ isDeleted: false });
  const totalPages = Math.ceil(totalCount / limit);

  const forms = await CourseForm.find({ isDeleted: false })
    .populate("courseId", "title price")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: forms.length,
    totalCount,
    currentPage: page,
    totalPages,
    data: forms,
  });
});

export const getSingleCourseForm = CatchAsyncError(async (req, res, next) => {
  const formId = req.params.id;

  if (!isObjectIdOrHexString(formId)) {
    return next(new ErrorHandler("Invalid Form ID format.", 400));
  }

  const form = await CourseForm.findById(formId).populate(
    "courseId",
    "title price"
  );

  if (!form) {
    return next(
      new ErrorHandler(`Course Form not found with ID: ${formId}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Course form fetched successfully.",
    data: form,
  });
});

export const updateCourseForm = CatchAsyncError(async (req, res, next) => {
  const formId = req.params.id;
  const { status, adminNotes } = req.body;

  if (!isObjectIdOrHexString(formId)) {
    return next(new ErrorHandler("Invalid Form ID format.", 400));
  }

  const updateData = {};

  const validStatuses = [
    "pending",
    "verified",
    "assigned",
    "ongoing",
    "completed",
    "paid",
    "rejected",
  ];

  if (status) {
    if (!validStatuses.includes(status)) {
      return next(
        new ErrorHandler(
          `Invalid status value: ${status}. Must be one of: ${validStatuses.join(
            ", "
          )}`,
          400
        )
      );
    }
    updateData.status = status;
  }

  if (adminNotes !== undefined) {
    updateData.adminNotes = adminNotes;
  }

  if (Object.keys(updateData).length === 0) {
    return next(
      new ErrorHandler(
        "No valid update fields (status or adminNotes) provided.",
        400
      )
    );
  }

  const updatedForm = await CourseForm.findByIdAndUpdate(formId, updateData, {
    new: true,
    runValidators: true,
  }).populate("courseId", "name price");

  if (!updatedForm) {
    return next(
      new ErrorHandler(`Course Form not found with ID: ${formId}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Course form updated successfully.",
    data: updatedForm,
  });
});

export const deleteCourseForm = CatchAsyncError(async (req, res, next) => {
  const formId = req.params.id;

  if (!isObjectIdOrHexString(formId)) {
    return next(new ErrorHandler("Invalid Form ID format.", 400));
  }
  const deletedForm = await CourseForm.findByIdAndUpdate(
    formId,
    { isDeleted: true },
    { new: true }
  );

  if (!deletedForm) {
    return next(
      new ErrorHandler(`Course Form not found with ID: ${formId}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Course form successfully soft-deleted.",
    data: { _id: deletedForm._id, isDeleted: deletedForm.isDeleted },
  });
});

export const getFormsByCourseId = CatchAsyncError(async (req, res, next) => {
  const courseId = req.params.courseId;

  if (!isObjectIdOrHexString(courseId)) {
    return next(new ErrorHandler("Invalid Course ID format.", 400));
  }

  let baseQuery = CourseForm.find({ courseId: courseId });

  const countFeatures = new ApiFeatures(baseQuery.clone(), req.query)
    .search()
    .filter();
  const totalCount = await countFeatures.query.countDocuments();

  const features = new ApiFeatures(
    baseQuery.populate("courseId", "title price"),
    req.query
  )
    .search()
    .filter()
    .sort()
    .paginate();

  const forms = await features.query;

  const resultPerPage = Number(req.query.limit) || 10;
  const currentPage = Number(req.query.page) || 1;
  const totalPages = Math.ceil(totalCount / resultPerPage);

  res.status(200).json({
    success: true,
    count: forms.length,
    totalCount,
    currentPage,
    totalPages,
    message: `Course forms fetched successfully for course ID: ${courseId}.`,
    data: forms,
  });
});

export const searchCourseForms = CatchAsyncError(async (req, res, next) => {
  const keyword = req.query.keyword;

  if (!keyword || keyword.trim() === "") {
    return next(
      new ErrorHandler(
        "Search keyword (name, email, mobile, or city) is required in query parameters.",
        400
      )
    );
  }

  const countFeatures = new ApiFeatures(CourseForm.find(), req.query)
    .search()
    .filter();
  const totalCount = await countFeatures.query.countDocuments();

  const features = new ApiFeatures(
    CourseForm.find().populate("courseId", "title price"),
    req.query
  )
    .search()
    .filter()
    .sort()
    .paginate();

  const forms = await features.query;

  const resultPerPage = Number(req.query.limit) || 10;
  const currentPage = Number(req.query.page) || 1;
  const totalPages = Math.ceil(totalCount / resultPerPage);

  res.status(200).json({
    success: true,
    count: forms.length,
    totalCount,
    currentPage,
    totalPages,
    message: `Search results for keyword '${keyword}' fetched successfully.`,
    data: forms,
  });
});

export const getRecentCourseForms = CatchAsyncError(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const skip = (page - 1) * limit;

  const recentForms = await CourseForm.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate({
      path: "courseId",
      select: "title fees -_id",
    });

  const totalCount = await CourseForm.countDocuments({});

  if (recentForms.length === 0 && page === 1) {
    return res.status(200).json({
      success: true,
      message: "No course forms submitted yet.",
      data: [],
      meta: { totalCount: 0, currentPage: 0, totalPages: 0 },
    });
  }

  res.status(200).json({
    success: true,
    data: recentForms,
    meta: {
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      limit: limit,
    },
  });
});

export const assignInstructor = CatchAsyncError(async (req, res, next) => {
  const { instructorId } = req.body;
  const { id } = req.params;

  if (!instructorId) {
    return next(new ErrorHandler("Instructor ID is required", 400));
  }

  const instructor = await Auth.findOne({
    _id: instructorId,
    role: "instructor",
    isDeleted: false,
    isActive: true,
  });
  if (!instructor) {
    return next(new ErrorHandler("Instructor not found", 404));
  }

  const courseForm = await CourseForm.findById(id);
  if (!courseForm) {
    return next(new ErrorHandler("Course form not found", 404));
  }

  let student = await Auth.findOne({
    email: courseForm.email,
    role: "student",
    isDeleted: false,
    isActive: true,
  });

  if (!student) {
    const tempPassword = crypto.randomBytes(6).toString("hex");
    const { hash, version } = await PasswordService.hashPassword(tempPassword);

    student = await Auth.create({
      name: courseForm.name,
      email: courseForm.email,
      mobile: courseForm.mobile,
      role: "student",
      passwordHash: hash,
      passwordHashVersion: version,
      isActive: true,
    });

    try {
      await sendMail({
        email: student.email,
        subject: "Your Student Account Created",
        template: "temp-password.ejs",
        data: {
          name: student.name,
          tempPassword,
          loginUrl: process.env.FRONTEND_LOGIN_URL,
        },
      });
    } catch (err) {
      console.error("Failed to send temp password email:", err);
    }
  }

  courseForm.instructorId = instructorId;
  courseForm.studentId = student._id;
  courseForm.status = "assigned";

  await courseForm.save();

  res.status(200).json({
    success: true,
    message: `Instructor ${instructor.name} assigned to student ${student.name}.`,
    data: courseForm,
  });
});

export const getInstructorsWithStudents = CatchAsyncError(
  async (req, res, next) => {
    let {
      page = 1,
      limit = 10,
      instructorName,
      instructorEmail,
      studentName,
      studentEmail,
    } = req.query;
    page = Number(page);
    limit = Number(limit);

    const instructorFilter = {
      role: "instructor",
      isDeleted: false,
      isActive: true,
    };
    if (instructorName)
      instructorFilter.name = { $regex: instructorName, $options: "i" };
    if (instructorEmail)
      instructorFilter.email = { $regex: instructorEmail, $options: "i" };

    const totalInstructors = await Auth.countDocuments(instructorFilter);
    const instructors = await Auth.find(instructorFilter)
      .select("_id name email")
      .skip((page - 1) * limit)
      .limit(limit);

    const result = await Promise.all(
      instructors.map(async (inst) => {
        const studentFilter = { instructorId: inst._id };
        if (studentName)
          studentFilter.name = { $regex: studentName, $options: "i" };
        if (studentEmail)
          studentFilter.email = { $regex: studentEmail, $options: "i" };

        const students = await CourseForm.find(studentFilter)
          .populate("courseId", "name price")
          .select("name email courseId status");

        return {
          instructor: inst,
          students: students.map((s) => ({
            _id: s._id,
            name: s.name,
            email: s.email,
            course: s.courseId,
            status: s.status,
          })),
        };
      })
    );

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalInstructors / limit),
      totalInstructors,
      count: result.length,
      data: result,
    });
  }
);
