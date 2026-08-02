import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true },

    thumbnail: {
      public_id: { type: String },
      secure_url: { type: String },
    },

    logo: {
      public_id: { type: String },
      secure_url: { type: String },
    },

    syllabus: {
      public_id: { type: String },
      secure_url: { type: String },
    },

    isFree: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    aboutCourse: [{ type: String, trim: true }],

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    publishedAt: { type: Date },
    isFeatured: { type: Boolean, default: false },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },

    category: { type: String, trim: true },
    tags: [{ type: String, index: true }],

    seo: {
      metaTitle: { type: String, trim: true, maxlength: 60 },
      metaDescription: { type: String, trim: true, maxlength: 160 },
      ogImage: { type: String },
    },

    parentCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    isDeleted: { type: Boolean, default: false },

    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  {
    timestamps: true,
    versionKey: "version",
  },
);

courseSchema.index({ title: "text", description: "text" });

courseSchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: false });
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
