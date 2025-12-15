import crypto from "crypto";
import Usage from "../models/Usage.js";
import User from "../models/User.js";

export const handleLemonWebhook = async (req, res) => {
  try {
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    const signature = req.headers["x-signature"] || "";
    const rawBody = req.body; // Buffer

    // 1. HMAC SHA256 Verify
    const hash = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // 2. Parse JSON now (raw was used for verify)
    const event = JSON.parse(rawBody.toString());

    const eventType = event.meta.event_name;
    const email = event.data.attributes.user_email;

    console.log("Webhook received:", eventType, email);

    if (!email) return res.json({ message: "No email in webhook" });

    // 找对应用户
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found" });

    // 找到 usage 数据
    let usage = await Usage.findOne({ userId: user._id });
    if (!usage) return res.json({ message: "Usage record missing" });

    // ---- Event: order_created → 变成 Pro ----
    if (eventType === "order_created") {
      usage.isPro = true;
      await usage.save();
      return res.json({ message: "User upgraded to Pro" });
    }

    // ---- Event: order_refunded → 降级 ----
    if (eventType === "order_refunded") {
      usage.isPro = false;
      usage.ocrCount = 10; // 降级后最多 10 次
      await usage.save();
      return res.json({ message: "User downgraded to Free" });
    }

    return res.json({ message: "Webhook handled" });

  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ message: "Webhook failed", error: err.message });
  }
};
