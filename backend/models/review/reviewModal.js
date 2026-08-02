import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    parentReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: null,
      index: true,
    },

    level: {
      type: Number,
      default: 0,
      enum: [0, 1],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: true,
    },

    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index(
  { user: 1, course: 1 },
  { unique: true, partialFilterExpression: { parentReview: null } }
);

reviewSchema.index({ course: 1, parentReview: 1 });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
