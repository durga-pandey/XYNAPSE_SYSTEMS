import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "email_verification",
        "mobile_verification",
        "password_reset",
        "twofa_challenge",
      ],
      required: true,
    },

    otp: { type: String, required: true },
    isHashed: { type: Boolean, default: false },

    attempts: { type: Number, default: 0 },
    used: { type: Boolean, default: false },
    metadata: { type: Object, default: {} },

    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model("Otp", otpSchema);
export default Otp
