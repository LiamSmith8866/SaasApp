import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import axios from "axios"; // 记得 npm install axios

const router = express.Router();

// 创建支付会话 (Checkout)
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    // 调用 Lemon Squeezy API 生成专属支付链接
    const response = await axios.post(
      "https://api.lemonsqueezy.com/v1/checkouts",
      {
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: userEmail, // 预填用户邮箱
              custom: {
                user_id: userId, // 🔑 关键：把 User ID 传过去，Webhook 回调时会带回来
              },
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: process.env.LEMONSQUEEZY_STORE_ID,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: process.env.LEMONSQUEEZY_VARIANT_ID,
              },
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
          "Content-Type": "application/vnd.api+json",
        },
      }
    );

    // 返回支付链接给前端
    const checkoutUrl = response.data.data.attributes.url;
    res.json({ url: checkoutUrl });

  } catch (error) {
    console.error("Payment Error:", error.response?.data || error.message);
    res.status(500).json({ message: "The payment link cannot be created" });
  }
});

export default router;