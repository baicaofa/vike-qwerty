import { register, login, getProfile } from "../controllers/auth";
import { protect } from "../middleware/auth";
import express, { RequestHandler } from "express";

const router = express.Router();

router.post("/register", register as RequestHandler);
router.post("/login", login as RequestHandler);
router.get("/profile", protect as RequestHandler, getProfile as RequestHandler);

export default router;
