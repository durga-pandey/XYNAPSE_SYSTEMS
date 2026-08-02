import mongoose from "mongoose";

const CollegeApplicationSchema = new mongoose.Schema(
  {
    programType: {
      type: String,
      required: true,
      enum: [
        "College Partners",
        "Classroom Trainings",
        "College Connect Program",
      ],
      index: true,
    },

    collegeName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    institutionType: {
      type: String,
      enum: ["College", "University", "Institute", "Other"],
      default: "College",
    },

    contactPerson: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    designation: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    source: {
      type: String,
      default: "Website",
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Converted", "Rejected"],
      default: "New",
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },

    notes: [
      {
        note: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Auth",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    createdByIP: String,
    userAgent: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CollegeApplication = mongoose.model(
  "CollegeApplication",
  CollegeApplicationSchema
);

export default CollegeApplication;
