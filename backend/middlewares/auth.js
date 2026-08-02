import Auth from "../models/auth/authModal.js";
import AuthSession from "../models/auth/authSessionModal.js";
import { TokenService } from "../services/tokenService.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "./CatchAsyncError.js";

export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return next(new ErrorHandler("Access token not provided", 401));
  }

  const decoded = TokenService.verifyAccessToken(token);
  if (!decoded) {
    return next(new ErrorHandler("Invalid or expired access token", 401));
  }

  const user = await Auth.findById(decoded._id);
  if (!user || !user.isActive || user.isBlock) {
    return next(new ErrorHandler("User not active or blocked", 403));
  }

  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return next(new ErrorHandler("Session ID not found", 401));
  }

  const session = await AuthSession.findById(sessionId);
  if (!session || !session.isActive) {
    return next(new ErrorHandler("Session expired or invalid", 401));
  }

  req.user = user;
  req.session = session;

  next();
});

export const optionalAuth = CatchAsyncError(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    req.user = null;
    req.session = null;
    return next();
  }

  let decoded;
  try {
    decoded = TokenService.verifyAccessToken(token);
  } catch (err) {
    req.user = null;
    req.session = null;
    return next();
  }

  if (!decoded) {
    req.user = null;
    req.session = null;
    return next();
  }

  const user = await Auth.findById(decoded._id);
  if (!user || !user.isActive || user.isBlock) {
    req.user = null;
    req.session = null;
    return next();
  }

  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    req.user = null;
    req.session = null;
    return next();
  }

  const session = await AuthSession.findById(sessionId);
  if (!session || !session.isActive) {
    req.user = null;
    req.session = null;
    return next();
  }

  req.user = user;
  req.session = session;

  next();
});

export const requireRole = (...roles) =>
  CatchAsyncError(async (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler("Access Denied !!", 403));
    }

    if (["instructor", "admin"].includes(req.user.role)) {
      if (req.user.roleStatus === "pending") {
        return next(
          new ErrorHandler(
            "Your account is not verified yet. Wait 1-2 days.",
            403
          )
        );
      }
      if (req.user.roleStatus === "rejected") {
        return next(
          new ErrorHandler(
            "Your account has been rejected. Contact support.",
            403
          )
        );
      }
    }

    if (!req.user.isActive || req.user.isBlock) {
      return next(new ErrorHandler("User is blocked or inactive", 403));
    }

    if (req.session && !req.session.isActive) {
      return next(new ErrorHandler("Session expired or invalid", 401));
    }

    next();
  });
