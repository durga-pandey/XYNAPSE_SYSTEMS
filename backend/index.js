import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import morgan from "morgan";
import http from "http";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middlewares/error.js";
import authRouter from "./routes/auth.js";
import courseRouter from "./routes/course.js";
import courseFormRouter from "./routes/courseForm.js";
import galleryRouter from "./routes/gallery.js";
import interviewQuestionRouter from "./routes/interviewQuestion.js";
import alumniRouter from "./routes/alumni.js";
import talentPoolRouter from "./routes/talentPool.js";
import internshipRouter from "./routes/internship.js";
import invoiceRouter from "./routes/invoices.js";
import salarySlipRouter from "./routes/salarySlip.js";
import employeeApplicationRouter from "./routes/employeeApplication.js";
import jobMelaRouter from "./routes/jobMela.js";
import getTouchRouter from "./routes/getTouch.js";
import collegeProgramRouter from "./routes/collegeProgram.js";
import reviewRouter from "./routes/review.js";
import courseCertificateRouter from "./routes/courseCompletionCertificate.js";

dotenv.config();

const app = express();
const server = http.createServer(app);


const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API WORKING",
  });
});

app.set("trust proxy", true);

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: "Content-Type, Authorization, Origin, Accept",
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));

app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/courseForm", courseFormRouter); 
app.use("/api/v1/gallery", galleryRouter); 
app.use("/api/v1/interview", interviewQuestionRouter); 
app.use("/api/v1/alumni", alumniRouter);
app.use("/api/v1/talentPool", talentPoolRouter);
app.use("/api/v1/internship", internshipRouter);
app.use("/api/v1/invoice", invoiceRouter);
app.use("/api/v1/salary-slip", salarySlipRouter);
app.use("/api/v1/employee", employeeApplicationRouter);
app.use("/api/v1/jobMela", jobMelaRouter);
app.use("/api/v1/getTouch", getTouchRouter);
app.use("/api/v1/collegeProgram", collegeProgramRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/certificate", courseCertificateRouter);

app.use(ErrorMiddleware);

// app.all("*", (req, res, next) => {
//   const err = new Error(`Route ${req.originalUrl} not found`);
//   err.statusCode = 404;
//   next(err);
// });

if (process.env.NODE_ENV !== "test") {
  //   initSocket(server);

  server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
    connectDB();
  });
}

export default app;
