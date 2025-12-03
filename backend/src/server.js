import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import ocrRoutes from "./routes/ocrRoutes.js";
import lsRoutes from "./routes/lsRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import usageRoutes from "./routes/usageRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

// ===== CORS（必须）=====
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/ls", lsRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/payment", paymentRoutes);

// ===== MongoDB =====
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ===== Server Start =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
