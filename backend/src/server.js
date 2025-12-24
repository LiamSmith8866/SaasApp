// src/server.js (最终纯净版 - 请确保粘贴前文件是空的)
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
//import paymentRoutes from "./routes/paymentRoutes.js";


import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const PORT = 5001; 

app.use(
  cors({
    origin: true,      // ✅ 关键：自动反射请求源 (Reflect Request Origin)
    credentials: true, // ✅ 关键：允许带 Cookie
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 1. 核心修改：CORS 配置
app.use(
  cors({
    origin: "http://localhost:5173", // ⚠️ 必须写死前端的完整地址，不能写 *
    credentials: true,               // ⚠️ 关键：允许携带 Cookie/Token
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ... 其他代码 (bodyParser, routes 等) 保持不变 ...
// 1. 中间件
/*app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);*/

//app.use("/api/webhook/lemonsqueezy", bodyParser.raw({ type: "application/json" }));
app.use(express.json());
app.use(cookieParser());

// 日志
app.use((req, res, next) => {
  console.log(`🔥 [${new Date().toLocaleTimeString()}] Request: ${req.method} ${req.path}`);
  next();
});

// 2. 路由
app.post("/test-ping", (req, res) => res.json({ msg: "Server OK on 5001" }));

app.use("/api/auth", authRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/ls", lsRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/usage", usageRoutes);
//app.use("/api/payment", paymentRoutes);

app.use("/api/tasks", taskRoutes);
// 3. 启动
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connection successful");
    // 只有连上数据库才启动监听
    app.listen(PORT, () => {
      console.log(`🚀 The full functionality of the backend has been activated: http://127.0.0.1:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB error:", err));