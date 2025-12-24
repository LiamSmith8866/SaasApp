// backend/src/models/Usage.js
import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 确保一个用户只有一个 Usage 记录
    },
    // 已使用次数
    ocrCount: {
      type: Number,
      default: 0, // 👈 必须有默认值
    },
    // 总额度 (6 代表免费版，-1 代表无限)
    ocrLimit: {
      type: Number,
      default: 6, // 👈 必须有默认值
    },
    // 是否是 Pro
    isPro: {
      type: Boolean,
      default: false,
    },
    // ✅ 新增：记录成为 Pro 的时间
    proSince: { type: Date }, 
  },
  { timestamps: true }
);

export default mongoose.model("Usage", usageSchema);