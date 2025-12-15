import express from "express";
import crypto from "crypto";
import Usage from "../models/Usage.js";

const router = express.Router();
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const secret = process.env.LS_WEBHOOK_SECRET;
  const signature = req.headers["x-lemonsqueezy-signature"];
  const computed = crypto.createHmac("sha256", secret).update(req.body).digest("hex");
  if (!signature || computed !== signature) return res.status(400).send("invalid signature");

  const event = JSON.parse(req.body.toString());
  const type = event?.event?.type || event?.type || "";
  const metadata = event?.data?.attributes?.metadata || {};

  try {
    if (type === "checkout.completed" || type === "purchase.created" || type === "checkout.success") {
      const userId = metadata.userId;
      if (userId) await Usage.findOneAndUpdate({ userId }, { isPro: true });
    } else if (type === "subscription.cancelled") {
      const userId = metadata.userId;
      if (userId) await Usage.findOneAndUpdate({ userId }, { isPro: false });
    }
  } catch (err) {
    console.error(err);
  }
  res.json({ received: true });
});
export default router;
