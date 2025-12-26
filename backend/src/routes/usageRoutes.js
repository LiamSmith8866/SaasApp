import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Usage from "../models/Usage.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let usage = await Usage.findOne({ userId });

    // 1. 初始化
    if (!usage) {
      usage = await Usage.create({ 
        userId, 
        ocrCount: 0, 
        ocrLimit: 6, 
        isPro: false 
      });
    }

    // 2. 自动修补脏数据
    let needSave = false;
    if (usage.ocrCount === undefined || usage.ocrCount === null) {
        usage.ocrCount = 0;
        needSave = true;
    }
    if (usage.ocrLimit === undefined || usage.ocrLimit === null) {
        usage.ocrLimit = usage.isPro ? -1 : 6;
        needSave = true;
    }
    if (needSave) await usage.save();

    // 3. 计算展示逻辑
    let remainingDisplay;
    const limitDisplay = usage.ocrLimit === -1 ? "Unlimited" : usage.ocrLimit;

    if (usage.ocrLimit === -1) {
        remainingDisplay = "∞"; 
    } else {
        const limit = Number(usage.ocrLimit);
        const count = Number(usage.ocrCount);
        remainingDisplay = Math.max(0, limit - count).toString();
    }

    // 4. ✅✅✅ 关键修复：正确计算日期
    let nextBillingDate = null; // 先定义在外面

    if (usage.isPro) {
        if (usage.proSince) {
            const date = new Date(usage.proSince);
            date.setMonth(date.getMonth() + 1); 
            nextBillingDate = date.toISOString().split('T')[0];
        } else {
            // 如果是老 Pro 用户没有记录时间，默认显示当前时间
            nextBillingDate = new Date().toISOString().split('T')[0]; 
        }
    }

    res.json({
      ocrCount: usage.ocrCount,
      ocrLimit: limitDisplay,
      remaining: remainingDisplay,
      isPro: usage.isPro,
      nextBillingDate: nextBillingDate // ✅ 现在这里肯定能读取到了
    });

  } catch (error) {
    console.error("Usage Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;