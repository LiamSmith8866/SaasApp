// src/server.js (最终修复版)
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

// 引入所有路由
import authRoutes from "./routes/authRoutes.js";
import ocrRoutes from "./routes/ocrRoutes.js";
import lsRoutes from "./routes/lsRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import usageRoutes from "./routes/usageRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const PORT = 5001; 

// ==========================================
// 1. CORS 配置 (只留这一份！核弹模式)
// ==========================================
app.use(
  cors({
    origin: true,      // ✅ 关键：自动允许当前请求的来源 (无论是 localhost 还是 vercel)
    credentials: true, // ✅ 关键：允许带 Cookie
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ==========================================
// 2. 解析器配置
// ==========================================
// Webhook 必须在 JSON 解析前 (如果有特定 Raw Body 需求)
// app.use("/api/webhook/lemonsqueezy", bodyParser.raw({ type: "application/json" }));

app.use(express.json());
app.use(cookieParser());

// 日志
app.use((req, res, next) => {
  console.log(`🔥 [${new Date().toLocaleTimeString()}] Request: ${req.method} ${req.path}`);
  next();
});

// ==========================================
// 3. 路由挂载
// ==========================================
app.post("/test-ping", (req, res) => res.json({ msg: "Server OK on 5001" }));

app.use("/api/auth", authRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/ls", lsRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/tasks", taskRoutes);

// ==========================================
// 4. 启动数据库与服务
// ==========================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connection successful");
    app.listen(PORT, () => {
      console.log(`🚀 Server running: http://127.0.0.1:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB error:", err));