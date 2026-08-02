import crypto from "crypto";
import bcrypt from "bcrypt";
import Otp from "../models/auth/otpModal.js";

const OTP_LENGTH = 6;
const OTP_EXPIRE_MINUTES = 5; 
const OTP_SALT_ROUNDS = 12;

export class OTPService {

  static generateOtp(length = OTP_LENGTH) {
    return crypto.randomInt(0, 10 ** length).toString().padStart(length, "0");
  }

  static async createOtp(userId, type, metadata = {}) {
    const otp = OTPService.generateOtp();
    const hashedOtp = await bcrypt.hash(otp, OTP_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000);

    const otpDoc = await Otp.create({
      userId,
      type,
      otp: hashedOtp,
      isHashed: true,
      expiresAt,
      metadata,
    });

    return { otp, otpId: otpDoc._id }; 
  }

  static async resendOtp(userId, type, metadata = {}) {
    const lastOtp = await Otp.findOne({ userId, type }).sort({ createdAt: -1 });

    if (lastOtp && !lastOtp.used && lastOtp.expiresAt > new Date()) {
      lastOtp.used = true;
      await lastOtp.save();
    }

    return OTPService.createOtp(userId, type, metadata);
  }

  static async verifyOtp(otpId, plainOtp) {
    const otpDoc = await Otp.findById(otpId);
    if (!otpDoc) return { success: false, reason: "OTP not found" };
    if (otpDoc.used) return { success: false, reason: "OTP already used" };
    if (otpDoc.expiresAt < new Date()) return { success: false, reason: "OTP expired" };

    const isMatch = await bcrypt.compare(plainOtp, otpDoc.otp);
    if (!isMatch) return { success: false, reason: "Invalid OTP" };

    otpDoc.used = true;
    await otpDoc.save();

    return { success: true, userId: otpDoc.userId, type: otpDoc.type };
  }

  static async generate2FAChallenge(user) {
    return OTPService.createOtp(user._id, "twofa_challenge", { twofa: true });
  }

  static async verify2FAChallenge(otpId, otp) {
    return OTPService.verifyOtp(otpId, otp);
  }
}
