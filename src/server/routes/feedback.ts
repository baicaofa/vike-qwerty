import {
  getAllFeedback,
  getPublicFeedback,
  replyToFeedback,
  submitFeedback,
  updateFeedbackStatus,
  voteFeedback,
} from "../controllers/feedback";
import { isAdmin, protect } from "../middleware/auth";
import express from "express";
import type { RequestHandler } from "express";

const router = express.Router();

// 提交反馈 - 无需登录也可提交
router.post("/", submitFeedback as RequestHandler);
console.log("Registered route: POST /api/feedback");

// 获取公共反馈列表 - 所有人可访问
router.get("/public", getPublicFeedback as RequestHandler);
console.log("Registered route: GET /api/feedback/public");

// 获取所有反馈 - 需要管理员权限
router.get("/", protect, isAdmin, getAllFeedback as RequestHandler);
console.log("Registered route: GET /api/feedback");

// 更新反馈状态 - 需要管理员权限
router.patch("/:id", protect, isAdmin, updateFeedbackStatus as RequestHandler);
console.log("Registered route: PATCH /api/feedback/:id");

// 投票功能 - 完全开放，使用设备ID识别用户
router.post("/:id/vote", voteFeedback as RequestHandler);
console.log("Registered route: POST /api/feedback/:id/vote");

// 管理员回复反馈 - 需要管理员权限
router.post("/:id/reply", protect, isAdmin, replyToFeedback as RequestHandler);
console.log("Registered route: POST /api/feedback/:id/reply");

// 添加测试路由 - 直接在路由器中定义
router.get("/direct-test", (req, res) => {
  res.json({
    success: true,
    message: "Direct test route in feedback router works!",
    data: [],
  });
});
console.log("Registered route: GET /api/feedback/direct-test");

export default router;
