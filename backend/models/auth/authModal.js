import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },
    bio: {
      type: String,
      lowercase: true,
      trim: true,
      maxlength: 500,
    },

    mobile: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },
    socialLinks: {
      facebook: { type: String, trim: true },
      instagram: { type: String, trim: true },
      twitter: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
    },

    signupSource: {
      type: String,
      enum: ["email", "mobile", "google"],
      default: "email",
    },

    avatar: {
      public_id: { type: String, default: null },
      secure_url: { type: String, default: null },
    },

    passwordHash: { type: String },
    passwordHashVersion: { type: Number, default: 1 },
    passwordChangedAt: { type: Date },

    passwordHistory: [
      {
        hash: String,
        version: Number,
        changedAt: Date,
      },
    ],

    failedLoginAttempts: { type: Number, default: 0 },
    lastFailedLoginAt: { type: Date },

    role: {
      type: String,
      enum: ["student", "admin", "instructor"],
      default: "student",
    },

    roleStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    instructorRequestDate: { type: Date },

    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },

    isTwofaEnabled: { type: Boolean, default: false },
    twofaSecret: String,
    isBlock: { type: Boolean, default: false },
    blockedAt: { type: Date },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    isActive: { type: Boolean, default: true },
    deactivatedAt: { type: Date },

    lastLoginAt: { type: Date },

    oauth: {
      google: {
        id: String,
        email: String,
        picture: String,
      },
    },
  },
  { timestamps: true }
);

const Auth = mongoose.model("Auth", authSchema);
export default Auth;
