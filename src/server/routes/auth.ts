import {
  completeRegistration,
  forgotPassword,
  getProfile,
  login,
  logout,
  register,
  resetPassword,
  sendVerificationCode,
  verifyEmail,
} from "../controllers/auth";
import { protect } from "../middleware/auth";
import type { RequestHandler } from "express";
import express from "express";

const router = express.Router();

// 基本认证路由
router.post("/register", register as RequestHandler);
router.post("/complete-registration", completeRegistration as RequestHandler);
router.post("/login", login as RequestHandler);
router.post("/logout", logout as RequestHandler);
router.get("/profile", protect as RequestHandler, getProfile as RequestHandler);

// 邮箱验证路由
router.post("/send-verification-code", sendVerificationCode as RequestHandler);
router.post("/verify-email", verifyEmail as RequestHandler);

// 密码重置路由
router.post("/forgot-password", forgotPassword as RequestHandler);
router.post("/reset-password", resetPassword as RequestHandler);

export default router;
