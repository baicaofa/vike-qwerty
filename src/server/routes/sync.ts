import { syncData } from "../controllers/syncController";
import { protect } from "../middleware/auth";
import express from "express";

const router = express.Router();

// Sync endpoint - protected route that requires authentication
router.post("/", protect, syncData);

export default router;
