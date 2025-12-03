import express from "express";
import crypto from "crypto";
import User from "../models/User.js";
import Usage from "../models/Usage.js";

const router = express.Router();

// Lemon Squeezy Webhook 需要 raw body
router.post("/lemonsqueezy", express.raw({ type: "application/json" }), async (req, res) => {
  const signature = req.headers["x-signature"];
  const rawBody = req.body.toString();

  // 验证签名
  const computed = crypto
    .createHmac("sha256", process.env.LS_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (computed !== signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const event = JSON.parse(rawBody);

  try {
    const eventType = event.meta.event_name;
    const userId = event.data.attributes.custom_data?.userId;

    if (!userId) return res.status(400).json({ message: "No user id" });

    // 用户完成支付 → 开通 Pro
    if (eventType === "order_created" || eventType === "subscription_created") {
      await Usage.findOneAndUpdate(
        { userId },
        { isPro: true, ocrCount: 999999 },
        { upsert: true }
      );

      console.log("User upgraded to PRO:", userId);
    }

    // 用户取消订阅
    if (eventType === "subscription_cancelled") {
      await Usage.findOneAndUpdate(
        { userId },
        { isPro: false, ocrCount: 10 }
      );

      console.log("User reverted to FREE:", userId);
    }

    res.json({ message: "Webhook processed" });

  } catch (err) {
    res.status(500).json({ message: "Webhook error", error: err.message });
  }
});

export default router;
