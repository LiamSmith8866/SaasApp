import Usage from "../models/Usage.js";

export const getUsage = async (req, res) => {
  try {
    const userId = req.user.id;

    const usage = await Usage.findOne({ userId });

    if (!usage) {
      return res.status(404).json({ message: "Usage record not found" });
    }

    res.json({
      ocrCount: usage.ocrCount,
      isPro: usage.isPro,
    });
  } catch (error) {
    console.error("getUsage error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const decreaseUsage = async (req, res) => {
  try {
    const userId = req.user.id;

    const usage = await Usage.findOne({ userId });

    if (!usage) {
      return res.status(404).json({ message: "Usage record not found" });
    }

    // ⭐ Pro 用户不扣次数
    if (usage.isPro) {
      return res.json({
        ocrCount: usage.ocrCount,
        isPro: true,
      });
    }

    // ⭐ 免费用户次数不足
    if (usage.ocrCount <= 0) {
      return res.status(400).json({ message: "No remaining OCR credits" });
    }

    usage.ocrCount -= 1;
    await usage.save();

    res.json({
      ocrCount: usage.ocrCount,
      isPro: usage.isPro,
    });
  } catch (error) {
    console.error("decreaseUsage error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
