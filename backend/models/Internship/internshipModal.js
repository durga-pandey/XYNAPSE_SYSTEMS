import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    public_id: { type: String, trim: true },
    secure_url: { type: String, trim: true },
  },
  { _id: false }
);

const ExperienceLetterSchema = new mongoose.Schema(
  {
    date: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    responsibilities: { type: [String], default: [] },
    signatoryName: { type: String, default: "" },
    signatoryDesignation: { type: String, default: "" },
  },
  { _id: false }
);

const InternshipApplicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\d{10}$/, "Phone must be a valid 10 digit number"],
    },

    resumeUrl: { type: ResumeSchema, default: {} },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    year: {
      type: String,
      required: true,
      enum: ["1st", "2nd", "3rd", "4th", "Other"],
      default: "Other",
    },

    department: { type: String, required: true, trim: true, maxlength: 100 },

    experiencePoints: { type: ExperienceLetterSchema, default: {} },

    offerLetterData: {
      date: { type: String, default: "" },
      startDate: { type: String, default: "" },
      endDate: { type: String, default: "" },
      duration: { type: String, default: "" },
      location: { type: String, default: "" },
      reportingManager: { type: String, default: "" },
      stipend: { type: String, default: "" },
      workingHours: { type: String, default: "" },
      responsibilities: { type: [String], default: [] },
      completionBenefits: { type: [String], default: [] },
      notes: { type: [String], default: [] },
      signatoryName: { type: String, default: "" },
      signatoryDesignation: { type: String, default: "" },
      ctc: { type: String, default: "" },
      monthlySalary: { type: String, default: "" },
      acceptanceDeadline: { type: String, default: "" },
    },

    certificateData: {
      startDate: { type: String, default: "" },
      endDate: { type: String, default: "" },
      domain: { type: String, default: "" },      
      location: { type: String, default: "" },
      signatoryName: { type: String, default: "" },
      signatoryDesignation: { type: String, default: "" },
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
      match: [
        /^https?:\/\/(www\.)?linkedin\.com\/.*$/i,
        "LinkedIn URL is invalid",
      ],
    },

    portfolio: { type: String, trim: true, default: "" },

    status: {
      type: String,
      enum: [
        "pending",
        "reviewed",
        "selected",
        "offer_letter_issued",
        "internship_ongoing",
        "certificate_ready",
        "completed",
        "rejected",
      ],
      default: "pending",
      index: true,
    },

    offerLetterUrl: {
      type: ResumeSchema,
      default: {},
    },

    certificateUrl: {
      type: ResumeSchema,
      default: {},
    },

    experienceLetterUrl: {
      type: ResumeSchema,
      default: {},
    },

    statusUpdatedAt: { type: Date, default: Date.now },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },

    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
  }
);

InternshipApplicationSchema.index({ email: 1, courseId: 1 }, { unique: false });
InternshipApplicationSchema.index({ createdAt: -1 });

const InternshipApplication = mongoose.model(
  "InternshipApplication",
  InternshipApplicationSchema
);

export default InternshipApplication;
