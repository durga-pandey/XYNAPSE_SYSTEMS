import mongoose from "mongoose";

const getTouchSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
      index: true,
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid mobile number"],
      index: true,
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [5, "Message must be at least 5 characters"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },

    status: {
      type: String,
      enum: ["new", "in_progress", "resolved"],
      default: "new",
      index: true,
    },

    source: {
      type: String,
      enum: ["website", "landing_page", "mobile_app", "admin"],
      default: "website",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

getTouchSchema.index({ createdAt: -1 });
getTouchSchema.index({ email: 1, mobile: 1 });

getTouchSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

getTouchSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.isActive = false;
  this.deletedAt = new Date();
  return this.save();
};

getTouchSchema.methods.markResolved = function () {
  this.status = "resolved";
  return this.save();
};

const GetTouch = mongoose.model("GetTouch", getTouchSchema);

export default GetTouch;
