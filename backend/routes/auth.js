import express from "express";
import {
  activateUser,
  changePassword,
  getAllUsers,
  getDashboardStats,
  getMe,
  hardDeleteUser,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  resetPassword,
  sendForgotPasswordOtp,
  sendVerificationRequest,
  toggleIsActive,
  toggleIsBlock,
  toggleIsDeleted,
  updateProfile,
  updateUserRole,
  verifyForgotPasswordOtp,
  verifyUserAccount,
} from "../controllers/auth.js";
import { isAuthenticated, requireRole } from "../middlewares/auth.js";
import { multerMiddleware } from "../utils/multerConfig.js";

const authRouter = express.Router();

// regarding signup
authRouter.post("/register", registerUser);

authRouter.post("/activate-user", activateUser);

// regarding login, logout and refresh
authRouter.post("/login", loginUser);

authRouter.post("/logout", isAuthenticated, logoutUser);

authRouter.post("/refresh", refreshToken);

// regarding forgot password
authRouter.post("/forgot/send", sendForgotPasswordOtp);

authRouter.post("/forgot/verify", verifyForgotPasswordOtp);

authRouter.post("/password/reset", resetPassword);

// regarding profile
authRouter.get("/me", isAuthenticated, getMe);

authRouter.get(
  "/all-users",
  isAuthenticated,
  requireRole("admin"),
  getAllUsers,
);

authRouter.get(
  "/all-users",
  isAuthenticated,
  requireRole("admin"),
  getAllUsers,
);

authRouter.get(
  "/stats",
  isAuthenticated,
  requireRole("admin"),
  getDashboardStats,
);

authRouter.patch("/change-password", isAuthenticated, changePassword);

authRouter.patch(
  "/update-profile",
  isAuthenticated,
  multerMiddleware([{ name: "avatar", maxCount: 1 }]),
  updateProfile,
);

// ADMIN ROUTES

// regarding instructor/admin verification

authRouter.post("/send-verification", isAuthenticated, sendVerificationRequest);

authRouter.patch(
  "/role/:id",
  isAuthenticated,
  requireRole("admin"),
  updateUserRole,
);

authRouter.patch(
  "/toggle/:id",
  isAuthenticated,
  requireRole("admin"),
  toggleIsActive,
);

authRouter.patch(
  "/block/:id",
  isAuthenticated,
  requireRole("admin"),
  toggleIsBlock,
);

authRouter.patch(
  "/soft-delete/:id",
  isAuthenticated,
  requireRole("admin"),
  toggleIsDeleted,
);

authRouter.delete(
  "/hard-delete/:id",
  isAuthenticated,
  requireRole("admin"),
  hardDeleteUser,
);

authRouter.patch(
  "/accept-verification/:userId",
  isAuthenticated,
  requireRole("admin"),
  verifyUserAccount,
);

export default authRouter;
