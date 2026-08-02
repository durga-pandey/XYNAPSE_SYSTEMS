import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      index: true,
    },

    eventType: {
      type: String,
      required: true,
      enum: [
        "REGISTER",
        "LOGIN",
        "LOGOUT",
        "PASSWORD_CHANGE",
        "PROFILE_UPDATE",
        "ROLE_UPDATE",
        "FETCH_ALL_USERS",
        "OTP_SENT",
        "FETCH_ME",
        "OTP_VERIFIED",
        "REFRESH_TOKEN_SUCCESS",
        "REFRESH_TOKEN_INVALID",
        "2FA_ENABLED",
        "2FA_DISABLED",
      ],
    },

    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },

    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
