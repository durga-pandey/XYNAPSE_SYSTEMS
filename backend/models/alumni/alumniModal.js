import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    public_id: { type: String, required: true, trim: true },
    secure_url: { type: String, required: true, trim: true },
    alt_text: { type: String, default: "" },
    uploaded_at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const alumniSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Alumni name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    certificateName: {
      type: String,
      required: [true, "Certificate name is required"],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    // batchYear: { type: Number, min: 1900, max: 2100 },
    // course: { type: String, trim: true, default: "" },
    images: {
      type: [imageSchema],
      validate: [
        (val) => val.length > 0,
        "At least one image must be uploaded",
      ],
    },
    tags: { type: [String], default: [] },
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
  {
    timestamps: true,
  }
);

alumniSchema.index({ name: 1 });
alumniSchema.index({ certificateName: 1 });
alumniSchema.index({ batchYear: 1 });
alumniSchema.index({ tags: 1 });

const Alumni = mongoose.model("Alumni", alumniSchema);
export default Alumni;
