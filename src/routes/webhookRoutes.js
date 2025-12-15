import express from "express";
import crypto from "crypto";
import Usage from "../models/Usage.js";
import User from "../models/User.js"; // 如果需要在 User 表也记录

const router = express.Router();

// Lemon Squeezy Webhook
// 注意：这个路由不需要 authMiddleware，因为是 LS 服务器调用的
router.post("/lemonsqueezy", async (req, res) => {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    const hmac = crypto.createHmac("sha256", secret);
    
    // req.body 在这里必须是 raw buffer (我们在 server.js 里配置过 bodyParser.raw)
    const digest = Buffer.from(hmac.update(req.body).digest("hex"), "utf8");
    const signature = Buffer.from(req.get("X-Signature") || "", "utf8");

    // 1. 验证签名 (安全性检查)
    if (!crypto.timingSafeEqual(digest, signature)) {
      console.error("Webhook signature mismatch!");
      return res.status(400).send("Invalid signature");
    }

    // 2. 解析数据
    const payload = JSON.parse(req.body.toString());
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data; // 这里面有 user_id

    console.log(`Received a Webhook event: ${eventName}`);

    // 3. 处理订单成功事件
    if (eventName === "order_created" || eventName === "subscription_created") {
      const userId = customData?.user_id;

      if (userId) {
        console.log(`Upgrading Pro for user ${userId} ...`);
        
        // 更新 Usage 表
        await Usage.findOneAndUpdate(
          { userId },
          { 
            isPro: true,
            ocrLimit: -1 // 无限次数
          }
        );

        // (可选) 更新 User 表
        await User.findByIdAndUpdate(userId, { isPro: true });
        
        console.log("The user has successfully upgraded.！💰");
      }
    }

    // 4. (高级) 处理退款或订阅取消
    if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
       const userId = customData?.user_id;
       if (userId) {
         console.log(`User ${userId} subscription has expired and has been downgraded to the free version`);
         await Usage.findOneAndUpdate(
           { userId }, 
           { isPro: false, ocrLimit: 6 } // 恢复限制
         );
       }
    }

    res.status(200).send("Webhook received");

  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).send("Webhook Error");
  }
});

export default router;