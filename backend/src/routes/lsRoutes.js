import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./authRoutes.js";
import usageRoutes from "./usageRoutes.js";
import ocrRoutes from "./ocrRoutes.js";
import lsWebhook from "./lsWebhook.js";
import paymentRoutes from "./paymentRoutes.js";

dotenv.config();
const app = express();

// ⚠️ Lemon Squeezy webhook 必须在 express.json() 之前
app.use("/api/ls/webhook", lsWebhook);

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/ocr", ocrRoutes);
//app.use("/api/ls", lsRoutes);
app.use("/api/payments", paymentRoutes);

// Test
app.get("/", (req, res) => {
  res.send("API Server Running...");
});

// Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend running on port " + PORT));

export default app;
