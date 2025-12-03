import express from "express";
import { runOCR } from "../controllers/ocrController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkOCRLimit } from "../middleware/checkUsage.js";

const router = express.Router();

// 必须：用户已登录 → 通过 authMiddleware
// 然后：检查并扣额度 → checkOCRLimit
router.post("/run", authMiddleware, checkOCRLimit, runOCR);

export default router;
