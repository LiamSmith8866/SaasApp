// backend/src/routes/usageRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Usage from "../models/Usage.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let usage = await Usage.findOne({ userId });

    // 1. 如果完全没记录 -> 创建新记录
    if (!usage) {
      console.log("Creating new usage record for user...");
      usage = await Usage.create({ 
        userId, 
        ocrCount: 0, 
        ocrLimit: 6, 
        isPro: false 
      });
    }

    // 2. 【关键修复】如果记录存在，但字段是 undefined/null (导致 NaN 的原因) -> 自动修补
    let needSave = false;
    
    if (usage.ocrCount === undefined || usage.ocrCount === null) {
        usage.ocrCount = 0;
        needSave = true;
    }
    
    if (usage.ocrLimit === undefined || usage.ocrLimit === null) {
        // 如果是 Pro 但没有 limit，设为 -1；否则设为 6
        usage.ocrLimit = usage.isPro ? -1 : 6;
        needSave = true;
    }

    if (needSave) {
        await usage.save();
        console.log("Fixed dirty usage data.");
    }

    // 3. 计算展示逻辑
    let remainingDisplay;
    const limitDisplay = usage.ocrLimit === -1 ? "Unlimited" : usage.ocrLimit;

    if (usage.ocrLimit === -1) {
        remainingDisplay = "∞"; 
    } else {
        // 确保进行数字计算
        const limit = Number(usage.ocrLimit);
        const count = Number(usage.ocrCount);
        remainingDisplay = Math.max(0, limit - count).toString();
    }

    res.json({
      ocrCount: usage.ocrCount,
      ocrLimit: limitDisplay, // 返回给前端显示总额度
      remaining: remainingDisplay,
      isPro: usage.isPro
    });

  } catch (error) {
    console.error("Usage Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;