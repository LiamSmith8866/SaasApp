// backend/src/routes/mockProRoutes.js
console.log("🔥🔥🔥 mockProRoutes.js REALLY LOADED!");

import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js"; // 1️⃣ 注释掉引用
import Usage from "../models/Usage.js";

console.log("mockProRoutes loaded!");

const router = express.Router();

// 临时测试
router.get("/test", (req, res) => {
  res.json({ ok: true });
});

// 2️⃣ 去掉 authMiddleware 参数
router.post("/upgrade", async (req, res) => {
  try {
    // 3️⃣ 修改 userId 获取方式
    // 原来是: const userId = req.user.id;
    // 现在改为: 优先从 Postman 的 Body 里取，取不到就报错
    const userId = req.body.userId; 

    if (!userId) {
      return res.status(400).json({ 
        message: "In the test mode, please provide the userId in the Postman Body",
        example: { userId: "Your MongoDB user ID string" }
      });
    }

    const usage = await Usage.findOne({ userId });
    
    // 如果找不到记录，自动创建一个（方便测试）
    if (!usage) {
       // return res.status(404).json({ message: "Usage record not found" });
       // 💡 改进：如果没有 Usage 记录，我们帮他造一个，防止 404 卡住
       console.log("Usage was not found. It is being created automatically...");
       /* 
       const newUsage = await Usage.create({ 
           userId: userId, 
           isPro: true, 
           ocrLimit: -1 
       });
       return res.json({ message: "Created new Usage and Upgraded!", data: newUsage });
       */
       return res.status(404).json({ message: "The Usage record corresponding to this userId was not found in the database. Please check if the ID is correct" });
    }

    // 更新逻辑
    usage.isPro = true;
    usage.ocrLimit = -1; // 设置为无限
    await usage.save();

    return res.json({ 
        success: true,
        message: "User successfully upgraded to PRO (mock)",
        data: { userId, isPro: true, ocrLimit: "Unlimited" }
    });

  } catch (error) {
    console.error("Mock upgrade error:", error);
    return res.status(500).json({ message: "Mock upgrade failed", error: error.message });
  }
});

export default router;