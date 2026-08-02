import mongoose from "mongoose";

const jobMelaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    companyName: { type: String, required: true },
    jobLink: { type: String, required: true },
    location: { type: String },
    salaryRange: { type: String },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Other"],
      default: "Full-time",
    },
    applicationDeadline: { type: Date },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

jobMelaSchema.index({ isDeleted: 1, status: 1, applicationDeadline: 1 });

const JobMela = mongoose.model("JobMela", jobMelaSchema);

export default JobMela;
