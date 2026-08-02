import mongoose from "mongoose";

const authSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      index: true,
    },

    refreshTokenHash: {
      type: String,
      required: true,
    },

    deviceName: { type: String, trim: true, default: "Unknown Device" },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },

    isActive: { type: Boolean, default: true },
    lastAccessedAt: { type: Date, default: Date.now },

    expiresAt: { type: Date, required: true }, 
  },
  { timestamps: true }
);

authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AuthSession = mongoose.model("AuthSession", authSessionSchema);
export default AuthSession;
