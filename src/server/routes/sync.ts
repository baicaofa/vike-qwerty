import { syncData } from "../controllers/syncController";
import { protect, requireEmailVerified } from "../middleware/auth";
import type { RequestHandler } from "express";
import express from "express";

const router = express.Router();

// Sync endpoint - protected route that requires authentication
router.post("/sync", protect, requireEmailVerified, syncData as RequestHandler);

export default router;
