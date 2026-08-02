import mongoose from "mongoose";

const interviewQuestionAnswerSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    answer: [
      {
        type: String,
        trim: true,
        required: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: "version",
  }
);

interviewQuestionAnswerSchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: false });
  }
  next();
});

interviewQuestionAnswerSchema.index({ question: "text", answer: "text" });

const InterviewQuestionAnswer = mongoose.model(
  "InterviewQuestionAnswer",
  interviewQuestionAnswerSchema
);

export default InterviewQuestionAnswer;
