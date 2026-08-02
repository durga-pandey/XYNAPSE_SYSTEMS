import mongoose from "mongoose";

const talentPoolSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^\+?[0-9]{7,15}$/, "Please provide a valid mobile number"],
    },
    companyName: {
      type: String,
      trim: true,
      default: "",
    },
    designation: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Contacted", "Hired"],
      default: "Pending",
      trim: true,
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
  },
  { timestamps: true }
);

talentPoolSchema.index({ fullName: 1 });
talentPoolSchema.index({ email: 1 });
talentPoolSchema.index({ companyName: 1 });
talentPoolSchema.index({ tags: 1 });

const TalentPool = mongoose.model("TalentPool", talentPoolSchema);
export default TalentPool;
