import express from "express";
import Usage from "../models/Usage.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/fastspring", async (req, res) => {
  try {
    console.log("⚡️ Received a FastSpring Webhook request!");
    
    // 1. 打印收到的完整数据 (用于调试)
    // console.log("Headers:", JSON.stringify(req.headers, null, 2));
    // console.log("Body:", JSON.stringify(req.body, null, 2));

    const events = req.body.events; 

    if (!events || !Array.isArray(events)) {
        //console.log("⚠️ 没有检测到 events 数组");
        return res.status(200).send("No events");
    }

    for (const event of events) {
      console.log(`Handle event types: ${event.type}`);

      // 只要是订单完成，或者是订阅激活
      if (event.type === "order.completed" || event.type === "subscription.activated") {
        const data = event.data;
        
        // 尝试获取 userId
        const userId = data.tags?.userId;

        if (userId) {
          console.log(`✅ Found UserID: ${userId},Under upgrade...`);
          
          // 更新数据库
          await Usage.findOneAndUpdate(
            { userId },
            { isPro: true, ocrLimit: -1 , proSince: new Date() }
          );
          await User.findByIdAndUpdate(userId, { isPro: true });
          
          console.log(`🎉 User ${userId} Upgrade successful！`);
        } else {
            console.error("error");
        }
      }
    }

    res.status(200).send("OK");

  } catch (err) {
    console.error("❌ Webhook Processing error:", err.message);
    // 即使出错也返回 200，防止 FastSpring 重试导致死循环
    res.status(200).send("Error logged");
  }
});

export default router;