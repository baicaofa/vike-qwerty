import {
  getAllFeedback,
  getPublicFeedback,
  replyToFeedback,
  replyToFeedbackAsUser,
  submitFeedback,
  updateFeedbackStatus,
  voteFeedback,
} from "../controllers/feedback";
import { isAdmin, optionalAuth, protect } from "../middleware/auth";
import express from "express";
import type { RequestHandler } from "express";

const router = express.Router();

// 提交反馈 - 无需登录也可提交
router.post("/", submitFeedback as RequestHandler);

// 获取公共反馈列表 - 所有人可访问，已登录用户通过 Cookie 识别
router.get("/public", optionalAuth, getPublicFeedback as RequestHandler);

// 获取所有反馈 - 需要管理员权限
router.get("/", protect, isAdmin, getAllFeedback as RequestHandler);

// 更新反馈状态 - 需要管理员权限
router.patch("/:id", protect, isAdmin, updateFeedbackStatus as RequestHandler);

// 投票功能 - 完全开放，使用设备ID识别用户
router.post("/:id/vote", voteFeedback as RequestHandler);

// 管理员回复反馈 - 需要管理员权限
router.post("/:id/reply", protect, isAdmin, replyToFeedback as RequestHandler);

// 用户回复反馈 - 需要登录
router.post(
  "/:id/user-reply",
  protect,
  replyToFeedbackAsUser as RequestHandler
);

// 添加测试路由 - 直接在路由器中定义
router.get("/direct-test", (req, res) => {
  res.json({
    success: true,
    message: "Direct test route in feedback router works!",
    data: [],
  });
});

export default router;
