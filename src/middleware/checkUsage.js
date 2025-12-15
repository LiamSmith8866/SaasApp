import Usage from "../models/Usage.js";

export const checkOCRLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const usage = await Usage.findOne({ userId });

    if (!usage) {
      return res.status(404).json({ message: "Usage record not found" });
    }

    // Pro 用户不扣次数
    if (usage.isPro) return next();

    // 超限
    if (usage.ocrCount <= 0) {
      return res.status(400).json({
        message: "No remaining OCR credits",
      });
    }

    // 扣一次
    usage.ocrCount -= 1;
    await usage.save();

    next();
  } catch (err) {
    res.status(500).json({ message: "OCR limit error", error: err.message });
  }
};
