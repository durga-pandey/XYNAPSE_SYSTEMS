import mongoose from "mongoose";

const ebookSchema = new mongoose.Schema(
  {
    fileUrl: {
      public_id: { type: String },
      secure_url: { type: String },
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true, versionKey: "version" }
);

const Ebook = mongoose.model("Ebook", ebookSchema);
export default Ebook;
