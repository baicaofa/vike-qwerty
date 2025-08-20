import { syncData } from "../controllers/syncController";
import { appVersionEnforce } from "../middleware/appVersion";
import { protect, requireEmailVerified } from "../middleware/auth";
import type { RequestHandler } from "express";
import express from "express";

const router = express.Router();

// Sync endpoint - protected route that requires authentication and version gate
router.post(
  "/",
  protect,
  requireEmailVerified,
  appVersionEnforce as RequestHandler,
  syncData as RequestHandler
);

export default router;
