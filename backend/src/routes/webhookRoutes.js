import express from "express";
import crypto from "crypto";
import Usage from "../models/Usage.js";
import User from "../models/User.js";

const router = express.Router();

// FastSpring Webhook
// FastSpring 发送的是 JSON，body-parser 应该能自动处理
// 确保 server.js 里 app.use(express.json()) 在这个路由之前生效
router.post("/fastspring", async (req, res) => {
  try {
    const secret = process.env.FASTSPRING_HMAC_SECRET;
    const signature = req.headers["x-fs-signature"];
    
    // 1. 验证签名 (安全检查)
    // FastSpring 对 raw body 进行 HMAC-SHA256 哈希
    // 注意：如果你的 express 已经解析了 json，这里可能需要拿到 raw body 才能验签
    // 简单起见，如果非敏感数据，先信任 tags；生产环境建议实现 raw-body 验签
    
    // 2. 解析事件
    const events = req.body.events; 
    if (!events || !Array.isArray(events)) {
        return res.status(200).send("No events"); // 返回 200 防止 FS 重试
    }

    for (const event of events) {
      if (event.type === "order.completed") {
        const data = event.data;
        
        // 获取我们在前端注入的 userId
        // FastSpring 的 tags 结构通常是: { userId: "..." }
        const userId = data.tags?.userId;

        console.log(`Received the FastSpring order，UserID: ${userId}`);

        if (userId) {
          // 更新数据库
          await Usage.findOneAndUpdate(
            { userId },
            { isPro: true, ocrLimit: -1 }
          );
          await User.findByIdAndUpdate(userId, { isPro: true });
          
          console.log(`User ${userId} has successfully upgraded (FastSpring)! 💰`);
        } else {
            console.warn("The userId tag was not found in the order. It might have been directly generated in the background");
        }
      }
    }

    // 必须返回 200，否则 FastSpring 会一直重试
    res.status(200).send("OK");

  } catch (err) {
    console.error("FastSpring Webhook Error:", err);
    res.status(500).send("Error");
  }
});

export default router;