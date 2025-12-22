// src/routes/lsRoutes.js
import express from "express";

// 引入 webhook 处理逻辑 (保留你原本的引用)
// 注意：请确保同目录下确实有 lsWebhook.js 这个文件
import lsWebhook from "./lsWebhook.js";

const router = express.Router();

// ==========================================
// 路由定义
// ==========================================

// 1. 挂载 Webhook
// 在 server.js 里，这个文件被挂载到了 /api/ls
// 所以下面这行代码会让 webhook 的最终访问路径变成:
// POST /api/ls/webhook
router.use("/webhook", lsWebhook);

// 2. (可选) 添加一个测试接口，验证 ls 路由通了
router.get("/test", (req, res) => {
  res.json({ message: "Lemon Squeezy Routes are working!" });
});

export default router;