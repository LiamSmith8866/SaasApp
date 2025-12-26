import express from "express";
import Usage from "../models/Usage.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/fastspring", async (req, res) => {
  try {
    
    // 1. 打印收到的完整数据 (用于调试)
    const events = req.body.events; 

    if (!events || !Array.isArray(events)) {
       
        return res.status(200).send("No events");
    }

    for (const event of events) {

      // 只要是订单完成，或者是订阅激活
      if (event.type === "order.completed" || event.type === "subscription.activated") {
        const data = event.data;
        
        // 尝试获取 userId
        const userId = data.tags?.userId;

        if (userId) {
          
          // 更新数据库
          await Usage.findOneAndUpdate(
            { userId },
            { isPro: true, ocrLimit: -1 , proSince: new Date() }
          );
          await User.findByIdAndUpdate(userId, { isPro: true });
          
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