import express from "express";
import { runOCR } from "../controllers/ocrController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkOCRLimit } from "../middleware/checkUsage.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

// 核心：
// 1. 先验证登录 (authMiddleware)
// 2. 再处理文件上传 (upload.single)
// 3. 最后跑 OCR 逻辑 (runOCR)
router.post("/scan", authMiddleware, upload.single("image"), runOCR);

export default router;



