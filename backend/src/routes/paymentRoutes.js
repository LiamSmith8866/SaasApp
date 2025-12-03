import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 前端调用 → 获取 Lemon Squeezy Checkout URL
router.get("/create-checkout", authMiddleware, async (req, res) => {
  try {
    const payload = {
      data: {
        type: "checkouts",
        attributes: {
          custom: {
            userId: req.user.id,
          },
          product_options: {
            redirect_url: "http://localhost:5173/upgrade-success",
          }
        },
        relationships: {
          store: { data: { type: "stores", id: process.env.LS_STORE_ID } },
          variant: { data: { type: "variants", id: process.env.LS_VARIANT_ID } }
        }
      }
    };

    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LS_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    const url = json?.data?.attributes?.url;

    if (!url) {
      return res.status(500).json({ message: "Failed to generate checkout link" });
    }

    res.json({ url });

  } catch (err) {
    res.status(500).json({ message: "Checkout error", error: err.message });
  }
});

export default router;
