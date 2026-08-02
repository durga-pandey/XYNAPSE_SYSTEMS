import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    metadata: {
      studentName: { type: String, required: true },
      courseTitle: { type: String, required: true },
      grade: { type: String, enum: ["A", "B", "C"], required: true },
      duration: { type: String, required: true },
      issueDate: { type: Date, default: Date.now },
    },
  },
  { timestamps: true },
);

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
