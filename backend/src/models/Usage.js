import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // 当前周期剩余次数
    ocrCount: { type: Number, default: 10 }, // 免费用户每天默认 10 次
  
    // 用户是否是 Pro
    isPro: { type: Boolean, default: false },

    // 上次重置的日期
    lastReset: { type: Date, default: Date.now }
  }
);

export default mongoose.model("Usage", usageSchema);

