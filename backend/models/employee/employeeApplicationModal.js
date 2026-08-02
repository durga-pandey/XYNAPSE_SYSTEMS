import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  city: String,
  state: String,
  country: String,
  zipCode: String,
});

const employeeApplicationSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "male",
    },

    dob: { type: Date },

    positionApplied: { type: String, required: true },
    department: { type: String, required: true },

    resumeUrl: { type: String },
    attachments: [
      {
        fileUrl: String,
        fileType: String,
      },
    ],

    experience: { type: String },
    qualifications: { type: String },

    message: { type: String },

    applicationSource: {
      type: String,
      enum: ["website", "referral", "walk-in", "linkedin", "naukri", "other"],
      default: "website",
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "shortlisted", "selected", "rejected"],
      default: "pending",
    },

    reviewNotes: { type: String },

    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },

    address: addressSchema,

    appliedDate: {
      type: Date,
      default: Date.now,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

employeeApplicationSchema.index({ isDeleted: 1, status: 1 });

const EmployeeApplication = mongoose.model(
  "EmployeeApplication",
  employeeApplicationSchema
);

export default EmployeeApplication;
