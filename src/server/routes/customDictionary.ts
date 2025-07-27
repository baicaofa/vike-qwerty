import * as customDictionaryController from "../controllers/customDictionaryController";
import * as customWordController from "../controllers/customWordController";
import { protect, requireEmailVerified } from "../middleware/auth";
import express from "express";
import type { RequestHandler } from "express";

const router = express.Router();

// 应用认证中间件，保护所有路由
router.use(protect as RequestHandler);
router.use(requireEmailVerified as RequestHandler);

// 词库路由
router.get("/", customDictionaryController.getDictionaries as RequestHandler);
router.post("/", customDictionaryController.createDictionary as RequestHandler);
router.get("/:id", customDictionaryController.getDictionary as RequestHandler);
router.put(
  "/:id",
  customDictionaryController.updateDictionary as RequestHandler
);
router.delete(
  "/:id",
  customDictionaryController.deleteDictionary as RequestHandler
);

// 单词路由
router.get("/:dictId/words", customWordController.getWords as RequestHandler);
router.post("/:dictId/words", customWordController.addWords as RequestHandler);
router.put(
  "/:dictId/words/:wordId",
  customWordController.updateWord as RequestHandler
);
router.delete(
  "/:dictId/words/:wordId",
  customWordController.deleteWord as RequestHandler
);

// 预览路由
router.post(
  "/preview-enrichment",
  customWordController.previewEnrichment as RequestHandler
);

// 调试路由
router.post(
  "/debug-enrichment",
  customWordController.debugEnrichment as RequestHandler
);

export default router;
