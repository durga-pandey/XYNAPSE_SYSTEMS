import mongoose from "mongoose";
import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import AuditLog from "../models/auth/auditLogModal.js";
import Auth from "../models/auth/authModal.js";
import AuthSession from "../models/auth/authSessionModal.js";
import { OTPService } from "../services/otpService.js";
import { PasswordService } from "../services/passwordService.js";
import { TokenService } from "../services/tokenService.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendMail } from "../utils/sendMail.js";
import bcrypt from "bcrypt";
import fs from "fs/promises";
import InternshipApplication from "../models/Internship/internshipModal.js";
import CourseForm from "../models/course/courseFormModal.js";
import Course from "../models/course/courseModal.js";
import EmployeeApplication from "../models/employee/employeeApplicationModal.js";
import Invoice from "../models/invoices/invoiceModal.js";

export const registerUser = CatchAsyncError(async (req, res, next) => {
  const { name, email, mobile, bio, password, confirmPassword, role } =
    req.body;

  if (!name) return next(new ErrorHandler("Name is required", 400));
  if (!email && !mobile)
    return next(new ErrorHandler("Either email or mobile is required", 400));
  if (!password) return next(new ErrorHandler("Password is required", 400));
  if (!confirmPassword)
    return next(new ErrorHandler("Confirm password is required", 400));
  if (password !== confirmPassword)
    return next(
      new ErrorHandler("Password and confirm password do not match", 400),
    );

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return next(new ErrorHandler("Invalid email format", 400));
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;
  if (!passwordRegex.test(password)) {
    return next(
      new ErrorHandler(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
        400,
      ),
    );
  }

  const existingUser = await Auth.findOne({ $or: [{ email }, { mobile }] });
  if (existingUser)
    return next(
      new ErrorHandler("User with this email or mobile already exists", 409),
    );

  const { hash, version } = await PasswordService.hashPassword(password);

  const userRole =
    role && ["student", "instructor", "admin"].includes(role)
      ? role
      : "student";

  const user = await Auth.create({
    name,
    email,
    mobile,
    bio,
    role: userRole,
    passwordHash: hash,
    passwordHashVersion: version,
    passwordChangedAt: new Date(),
    passwordHistory: [{ hash, version, changedAt: new Date() }],
    emailVerified: false,
    phoneVerified: false,
  });

  let otpInfo = null;
  let activationCode = null;

  if (email) {
    otpInfo = await OTPService.createOtp(user._id, "email_verification");
    activationCode = otpInfo.otp;

    await sendMail({
      email,
      subject: "Activate Your Account",
      template: "activation-mail.ejs",
      data: {
        name: user.name,
        activationCode,
      },
    });
  }

  await AuditLog.create({
    userId: user._id,
    eventType: "REGISTER",
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"] || "",
    metadata: { signupSource: "email" },
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully. Please verify your email.",
    userId: user._id,
    otpId: otpInfo ? otpInfo.otpId : null,
  });
});

export const activateUser = CatchAsyncError(async (req, res, next) => {
  const { otpId, otp } = req.body;

  if (!otpId || !otp) {
    return next(new ErrorHandler("OTP ID and OTP are required", 400));
  }

  const verificationResult = await OTPService.verifyOtp(otpId, otp);
  if (
    !verificationResult.success ||
    verificationResult.type !== "email_verification"
  ) {
    return next(
      new ErrorHandler(verificationResult.reason || "Invalid OTP type", 400),
    );
  }

  const user = await Auth.findById(verificationResult.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  user.emailVerified = true;
  await user.save();

  await AuditLog.create({
    userId: user._id,
    eventType: "OTP_VERIFIED",
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"] || "",
    metadata: { otpType: "email_verification" },
  });

  res.status(200).json({
    success: true,
    message: "Email verified successfully. You can now login.",
    userId: user._id,
  });
});

export const resendUserOtp = CatchAsyncError(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return next(new ErrorHandler("userId is required", 400));

  const { otp, otpId } = await OTPService.resendOtp(
    userId,
    "email_verification",
  );

  const user = await Auth.findById(userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.email) {
    await sendMail({
      email: user.email,
      subject: "Verify Your Email",
      template: "verifyEmail.ejs",
      data: { name: user.name, otp },
    });
  }

  res.status(200).json({
    success: true,
    message: "Email OTP resent successfully",
    otpId,
  });
});

export const loginUser = CatchAsyncError(async (req, res, next) => {
  const { identifier, password, deviceName } = req.body;

  if (!identifier)
    return next(new ErrorHandler("Email or mobile is required", 400));
  if (!password) return next(new ErrorHandler("Password is required", 400));

  const query = identifier.includes("@")
    ? { email: identifier }
    : { mobile: identifier };
  const user = await Auth.findOne(query);
  if (!user || user.isDeleted)
    return next(new ErrorHandler("Invalid credentials", 401));
  if (user.isBlock) return next(new ErrorHandler("User is blocked", 403));
  if (!user.isActive) return next(new ErrorHandler("User is deactivated", 403));

  const isPasswordValid = await PasswordService.verifyPassword(password, user);
  if (!isPasswordValid) {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    user.lastFailedLoginAt = new Date();
    await user.save();
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  await PasswordService.rehashIfNeeded(user, password);

  if (!user.emailVerified && !user.phoneVerified) {
    return next(
      new ErrorHandler("Please verify your email or mobile before login", 403),
    );
  }

  let verificationMessage = null;
  if (["instructor", "admin"].includes(user.role)) {
    if (user.roleStatus === "pending") {
      verificationMessage =
        "Your account is not verified yet. It will take 1–2 days.";
    } else if (user.roleStatus === "rejected") {
      return next(
        new ErrorHandler(
          "Your instructor/admin request is rejected. Contact support.",
          403,
        ),
      );
    }
  }

  const currentDeviceName = deviceName || "Unknown Device";

  if (user.isTwofaEnabled) {
    const otpInfo = await OTPService.generate2FAChallenge(user);
    const tempToken = TokenService.generateAccessToken(user);

    await AuditLog.create({
      userId: user._id,
      eventType: "2FA_REQUIRED",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"] || "",
      metadata: { deviceName: currentDeviceName },
    });

    return res.status(200).json({
      success: true,
      message: "2FA required. Enter OTP to continue login.",
      tempToken,
      otpId: otpInfo.otpId,
      deviceName: currentDeviceName,
      verificationMessage,
    });
  }

  const { refreshToken, sessionId } = await TokenService.generateRefreshToken(
    user,
    {
      deviceName: currentDeviceName,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"] || "",
    },
  );
  const accessToken = TokenService.generateAccessToken(user);

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  user.failedLoginAttempts = 0;
  user.lastLoginAt = new Date();
  await user.save();

  try {
    const updatedApplications = await InternshipApplication.updateMany(
      { email: user.email, studentId: null },
      { $set: { studentId: user._id } },
    );

    if (updatedApplications.modifiedCount > 0) {
      console.log(
        `Updated ${updatedApplications.modifiedCount} internship application(s) with studentId ${user._id}`,
      );
    }
  } catch (err) {
    console.error("Error updating internship applications:", err);
  }

  try {
    const updatedCourseForms = await CourseForm.updateMany(
      {
        email: user.email,
        studentId: null,
      },
      {
        $set: {
          studentId: user._id,
          appliedAsGuest: false,
          guestLinkedAt: new Date(),
        },
      },
    );

    if (updatedCourseForms.modifiedCount > 0) {
      console.log(
        `Updated ${updatedCourseForms.modifiedCount} course form(s) with studentId ${user._id}`,
      );
    }
  } catch (err) {
    console.error("Error updating course forms:", err);
  }

  await AuditLog.create({
    userId: user._id,
    eventType: "LOGIN",
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"] || "",
    metadata: { deviceName: currentDeviceName, sessionId },
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    userId: user._id,
    sessionId,
    deviceName: currentDeviceName,
    verificationMessage,
  });
});

export const logoutUser = CatchAsyncError(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return next(new ErrorHandler("No refresh token provided", 400));

  const sessions = await AuthSession.find({ isActive: true });
  let session = null;
  for (const s of sessions) {
    const match = await bcrypt.compare(refreshToken, s.refreshTokenHash);
    if (match) {
      session = s;
      break;
    }
  }

  if (!session)
    return next(
      new ErrorHandler("Session not found or already invalidated", 400),
    );

  await TokenService.revokeSession(session._id);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("sessionId");

  await AuditLog.create({
    userId: session.userId,
    eventType: "LOGOUT",
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"] || "",
    metadata: { sessionId: session._id },
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const refreshToken = CatchAsyncError(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new ErrorHandler("No refresh token provided", 400));
  }

  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return next(new ErrorHandler("No session ID provided", 400));
  }

  const session = await AuthSession.findById(sessionId);
  if (!session || !session.isActive) {
    return next(
      new ErrorHandler("Invalid or expired refresh token/session", 401),
    );
  }

  const verifyResult = await TokenService.verifyRefreshToken(
    refreshToken,
    sessionId,
  );
  if (!verifyResult) {
    await TokenService.revokeSession(sessionId);

    await AuditLog.create({
      userId: session.userId,
      eventType: "REFRESH_TOKEN_INVALID",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"] || "",
      metadata: { sessionId },
    });

    return next(new ErrorHandler("Invalid refresh token", 401));
  }

  const user = await Auth.findById(session.userId);
  if (!user || !user.isActive || user.isBlock) {
    await TokenService.revokeSession(sessionId);
    return next(new ErrorHandler("User not active or blocked", 403));
  }

  const newAccessToken = TokenService.generateAccessToken(user);

  const { refreshToken: newRefreshToken, sessionId: newSessionId } =
    await TokenService.generateRefreshToken(user, {
      deviceName: session.deviceName,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
    });

  await TokenService.revokeSession(sessionId);

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("sessionId", newSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  await AuditLog.create({
    userId: user._id,
    eventType: "REFRESH_TOKEN_SUCCESS",
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"] || "",
    metadata: { oldSessionId: sessionId, newSessionId },
  });

  res.status(200).json({
    success: true,
    message: "Tokens refreshed successfully",
    userId: user._id,
    sessionId: newSessionId,
  });
});

export const sendForgotPasswordOtp = CatchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) throw new ErrorHandler("Email is required", 400);

  const user = await Auth.findOne({
    email: email.toLowerCase(),
    isDeleted: false,
  });
  if (!user) throw new ErrorHandler("User not found", 404);

  const { otpId, otp } = await OTPService.createOtp(user._id, "password_reset");

  await sendMail({
    email: user.email,
    subject: "Password Reset OTP",
    template: "forgot-password.ejs",
    data: { name: user.name || "User", otp },
  });

  await AuditLog.create({
    userId: user._id,
    eventType: "OTP_SENT",
    metadata: { type: "password_reset" },
  });

  res.status(200).json({ message: "OTP sent successfully", otpId });
});

export const verifyForgotPasswordOtp = CatchAsyncError(
  async (req, res, next) => {
    const { otpId, otp } = req.body;
    if (!otpId || !otp)
      throw new ErrorHandler("OTP ID and OTP are required", 400);

    const otpResult = await OTPService.verifyOtp(otpId, otp);
    if (!otpResult.success)
      throw new ErrorHandler(otpResult.reason || "Invalid OTP", 400);

    if (otpResult.type !== "password_reset") {
      throw new ErrorHandler("OTP type mismatch", 400);
    }

    const user = await Auth.findById(otpResult.userId);
    if (!user || user.isDeleted) throw new ErrorHandler("User not found", 404);

    const resetToken = TokenService.generatePasswordResetToken(user._id);

    await AuditLog.create({
      userId: user._id,
      eventType: "OTP_VERIFIED",
      metadata: { type: "password_reset" },
    });

    res.status(200).json({ message: "OTP verified successfully", resetToken });
  },
);

export const resetPassword = CatchAsyncError(async (req, res, next) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword)
    throw new ErrorHandler("Reset token and new password are required", 400);

  const tokenPayload = TokenService.verifyPasswordResetToken(resetToken);
  if (!tokenPayload)
    throw new ErrorHandler("Invalid or expired reset token", 400);

  const user = await Auth.findById(tokenPayload.userId);
  if (!user || user.isDeleted) throw new ErrorHandler("User not found", 404);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new ErrorHandler(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      400,
    );
  }

  const isReused = await PasswordService.isPasswordReused(newPassword, user);
  if (isReused) throw new ErrorHandler("Cannot reuse previous passwords", 400);

  const { hash, version } = await PasswordService.hashPassword(newPassword);
  user.passwordHash = hash;
  user.passwordHashVersion = version;
  user.passwordChangedAt = new Date();

  user.passwordHistory.push({ hash, version, changedAt: new Date() });
  if (user.passwordHistory.length > 5) user.passwordHistory.shift();

  await user.save();

  await TokenService.revokeAllSessions(user._id);

  await sendMail({
    email: user.email,
    subject: "Your password has been reset",
    template: "passwordResetNotification.ejs",
    data: {
      name: user.name || "User",
      time: new Date().toLocaleString(),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    },
  });

  await AuditLog.create({
    userId: user._id,
    eventType: "PASSWORD_CHANGE",
    metadata: {
      reason: "password_reset",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    },
  });

  res
    .status(200)
    .json({ message: "Password reset successfully. All sessions revoked." });
});

export const getMe = CatchAsyncError(async (req, res, next) => {
  const user = req.user;

  await AuditLog.create({
    userId: user._id,
    eventType: "FETCH_ME",
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"] || "",
    metadata: { sessionId: req.session?._id },
  });

  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    bio: user.bio,
    socialLinks: user.socialLinks,
    role: user.role,
    roleStatus: user.roleStatus,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    isTwofaEnabled: user.isTwofaEnabled,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    user: safeUser,
  });
});

export const getAllUsers = CatchAsyncError(async (req, res, next) => {
  const admin = req.user;

  if (admin.role !== "admin") {
    return next(new ErrorHandler("Access denied", 403));
  }

  // Audit log
  await AuditLog.create({
    userId: admin._id,
    eventType: "FETCH_ALL_USERS",
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"] || "",
    metadata: { action: "admin_fetch_all_users" },
  });

  const {
    search = "",
    role,
    roleStatus,
    isTwofaEnabled,
    emailVerified,
    phoneVerified,
    page = 1,
    limit = 20,
  } = req.query;

  const filters = { isDeleted: false };

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { mobile: { $regex: search, $options: "i" } },
    ];
  }

  if (role) filters.role = role;
  if (roleStatus) filters.roleStatus = roleStatus;
  if (isTwofaEnabled !== undefined)
    filters.isTwofaEnabled = isTwofaEnabled === "true";
  if (emailVerified !== undefined)
    filters.emailVerified = emailVerified === "true";
  if (phoneVerified !== undefined)
    filters.phoneVerified = phoneVerified === "true";

  const skip = (Number(page) - 1) * Number(limit);

  const total = await Auth.countDocuments(filters);

  const users = await Auth.find(filters)
    .select(
      "_id name email mobile bio socialLinks role roleStatus emailVerified phoneVerified isTwofaEnabled isActive isBlock lastLoginAt createdAt updatedAt",
    )

    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    total,
    page: Number(page),
    limit: Number(limit),
    data: users,
  });
});

export const changePassword = CatchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("New password & confirm password must match", 400),
    );
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;

  if (!passwordRegex.test(newPassword)) {
    return next(
      new ErrorHandler(
        "Password must include upper, lower, number, special char & be at least 8 chars",
        400,
      ),
    );
  }

  const user = await Auth.findById(req.user._id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  const isOldValid = await PasswordService.verifyPassword(oldPassword, {
    passwordHash: user.passwordHash,
    passwordHashVersion: user.passwordHashVersion,
  });

  if (!isOldValid) {
    return next(new ErrorHandler("Old password is incorrect", 401));
  }

  const isReused = await PasswordService.isPasswordReused(newPassword, user);
  if (isReused) {
    return next(new ErrorHandler("Cannot reuse last 3 passwords", 400));
  }

  const { hash, version } = await PasswordService.hashPassword(newPassword);

  user.passwordHistory.push({
    hash: user.passwordHash,
    version: user.passwordHashVersion,
    changedAt: new Date(),
  });

  if (user.passwordHistory.length > 5) user.passwordHistory.shift();

  user.passwordHash = hash;
  user.passwordHashVersion = version;
  user.passwordChangedAt = new Date();

  await user.save();

  await TokenService.revokeAllSessions(user._id);

  await sendMail({
    email: user.email,
    subject: "Your password has been changed",
    template: "passwordResetNotification.ejs",
    data: {
      name: user.name || "User",
      time: new Date().toLocaleString(),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    },
  });

  await AuditLog.create({
    userId: user._id,
    eventType: "PASSWORD_CHANGE",
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    metadata: { reason: "manual_change" },
  });

  return res.status(200).json({
    success: true,
    message: "Password updated successfully. All sessions revoked.",
  });
});

export const updateProfile = CatchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  let localFilePath = req.files?.avatar?.[0]?.path || null;

  try {
    const { name, bio, mobile } = req.body;

    let socialLinksObj = {};
    if (req.body.socialLinks) {
      try {
        socialLinksObj =
          typeof req.body.socialLinks === "string"
            ? JSON.parse(req.body.socialLinks)
            : req.body.socialLinks;
      } catch (e) {
        throw new ErrorHandler("Invalid socialLinks format", 400);
      }
    }

    if (req.body.email) {
      throw new ErrorHandler("Email cannot be updated", 400);
    }

    const user = await Auth.findById(userId);
    if (!user) throw new ErrorHandler("User not found", 404);

    if (name) user.name = name.trim();
    if (bio) user.bio = bio.trim();
    if (mobile) user.mobile = mobile.trim();
    if (Object.keys(socialLinksObj).length > 0) {
      user.socialLinks = {
        ...user.socialLinks,
        ...socialLinksObj,
      };
    }

    if (localFilePath) {
      if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      const uploadRes = await cloudinary.uploader.upload(localFilePath, {
        folder: "avatars",
        crop: "fill",
      });

      user.avatar = {
        public_id: uploadRes.public_id,
        secure_url: uploadRes.secure_url,
      };
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        bio: user.bio,
        avatar: user.avatar,
        socialLinks: user.socialLinks,
        role: user.role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        isTwofaEnabled: user.isTwofaEnabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    return next(err);
  } finally {
    if (localFilePath) {
      try {
        await fs.unlink(localFilePath);
      } catch (e) {
        console.error("Failed to remove local upload file:", e.message);
      }
    }
  }
});

export const sendVerificationRequest = CatchAsyncError(
  async (req, res, next) => {
    const user = req.user;

    if (!["instructor", "admin"].includes(user.role)) {
      return next(
        new ErrorHandler(
          "Only instructor/admin can send verification request",
          403,
        ),
      );
    }

    if (user.roleStatus === "approved") {
      return next(new ErrorHandler("Your account is already verified", 400));
    }

    user.instructorRequestDate = new Date();
    user.roleStatus = "pending";
    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Verification request submitted successfully. Admin will review your account within 1-2 days.",
      data: {
        userId: user._id,
        roleStatus: user.roleStatus,
        instructorRequestDate: user.instructorRequestDate,
      },
    });
  },
);

export const verifyUserAccount = CatchAsyncError(async (req, res, next) => {
  const { userId } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ErrorHandler("Invalid user ID", 400));
  }

  if (!["approved", "rejected"].includes(status)) {
    return next(
      new ErrorHandler("Status must be 'approved' or 'rejected'", 400),
    );
  }

  const user = await Auth.findById(userId);
  if (!user || user.isDeleted) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (!["instructor", "admin"].includes(user.role)) {
    return next(
      new ErrorHandler("Only instructor/admin accounts can be verified", 400),
    );
  }

  user.roleStatus = status;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User account ${status} successfully`,
    data: { userId: user._id, roleStatus: user.roleStatus },
  });
});

export const updateUserRole = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !["student", "admin", "instructor"].includes(role)) {
    return next(new ErrorHandler("Invalid role provided", 400));
  }

  const user = await Auth.findById(id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  user.role = role;
  await user.save();

  res.status(200).json({ success: true, message: "Role updated", user });
});

export const toggleIsDeleted = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await Auth.findById(id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  user.isDeleted = !user.isDeleted;
  user.deletedAt = user.isDeleted ? new Date() : null;
  await user.save();

  res.status(200).json({ success: true, message: "isDeleted toggled", user });
});

export const toggleIsActive = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await Auth.findById(id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  user.isActive = !user.isActive;
  user.deactivatedAt = user.isActive ? null : new Date();
  await user.save();

  res.status(200).json({ success: true, message: "isActive toggled", user });
});

export const toggleIsBlock = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await Auth.findById(id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  user.isBlock = !user.isBlock;
  user.blockedAt = user.isBlock ? new Date() : null;
  await user.save();

  res.status(200).json({ success: true, message: "isBlock toggled", user });
});

export const hardDeleteUser = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await Auth.findById(id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  await Auth.findByIdAndDelete(id);

  res.status(200).json({ success: true, message: "User permanently deleted" });
});

export const getDashboardStats = CatchAsyncError(async (req, res, next) => {
  const [
    totalUsers,
    totalCourses,
    totalInternships,
    totalEmployees,
    revenueResult,
  ] = await Promise.all([
    Auth.countDocuments({ isDeleted: false }),

    Course.countDocuments({ isDeleted: false }),

    InternshipApplication.countDocuments({ isDeleted: false }),

    EmployeeApplication.countDocuments({ isDeleted: false }),

    Invoice.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$paidAmount" },
        },
      },
    ]),
  ]);

  const totalRevenue =
    revenueResult.length > 0
      ? parseFloat(revenueResult[0].totalRevenue.toString())
      : 0;

  if (
    totalUsers === null ||
    totalCourses === null ||
    totalInternships === null ||
    totalEmployees === null
  ) {
    return next(new ErrorHandler("Failed to fetch dashboard stats", 500));
  }

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalCourses,
      totalInternships,
      totalEmployees,
      totalRevenue,
    },
  });
});
