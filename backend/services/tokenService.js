import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import AuthSession from "../models/auth/authSessionModal.js";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";
const PASSWORD_RESET_SECRET =
  process.env.PASSWORD_RESET_SECRET || ACCESS_TOKEN_SECRET;
const PASSWORD_RESET_TOKEN_EXPIRY =
  process.env.PASSWORD_RESET_TOKEN_EXPIRY || "10m";
const REFRESH_TOKEN_SALT_ROUNDS = 12;

export class TokenService {
  static generateAccessToken(user) {
    const payload = {
      _id: user._id,
      role: user.role,
      email: user.email,
    };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  }

  static async generateRefreshToken(
    user,
    { deviceName, ipAddress, userAgent }
  ) {
    const refreshToken = jwt.sign({ _id: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    const hashedToken = await bcrypt.hash(
      refreshToken,
      REFRESH_TOKEN_SALT_ROUNDS
    );

    const expiresAt = new Date(
      Date.now() + parseDuration(REFRESH_TOKEN_EXPIRY)
    );

    const session = await AuthSession.create({
      userId: user._id,
      refreshTokenHash: hashedToken,
      deviceName,
      ipAddress,
      userAgent,
      expiresAt,
    });

    return { refreshToken, sessionId: session._id };
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
      return null;
    }
  }

  static async verifyRefreshToken(token, sessionId) {
    try {
      const session = await AuthSession.findById(sessionId);
      if (!session || !session.isActive) return null;

      const isMatch = await bcrypt.compare(token, session.refreshTokenHash);
      if (!isMatch) return null;

      const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
      return { session, payload };
    } catch (err) {
      return null;
    }
  }

  static async revokeSession(sessionId) {
    await AuthSession.findByIdAndUpdate(sessionId, { isActive: false });
  }

  static async revokeAllSessions(userId) {
    await AuthSession.updateMany({ userId }, { isActive: false });
  }

  static generatePasswordResetToken(userId) {
    return jwt.sign({ userId }, PASSWORD_RESET_SECRET, {
      expiresIn: PASSWORD_RESET_TOKEN_EXPIRY,
    });
  }

  static verifyPasswordResetToken(token) {
    try {
      return jwt.verify(token, PASSWORD_RESET_SECRET);
    } catch (error) {
      return null;
    }
  }
}

function parseDuration(duration) {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error("Invalid duration format");
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error("Invalid duration unit");
  }
}
