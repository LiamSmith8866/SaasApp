import Usage from "../models/Usage.js";

export const checkOCRLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let usage = await Usage.findOne({ userId });

    if (!usage) {
      return res.status(404).json({ message: "Usage record not found" });
    }

    // 如果是 Pro → 无限次数
    if (usage.isPro) {
      return next();
    }

    // ======= 自动恢复每日额度 =======
    const now = new Date();
    const lastReset = new Date(usage.lastReset);

    const ONE_DAY = 24 * 60 * 60 * 1000;

    if (now - lastReset >= ONE_DAY) {
      // 超过 24 小时 → 自动恢复
      usage.ocrCount = 10; // 默认每日额度
      usage.lastReset = now;
      await usage.save();
    }

    // ======= 扣除当天额度 =======
    if (usage.ocrCount <= 0) {
      return res.status(400).json({
        message: "Today's free slots have been used up. Please upgrade to PRO",
      });
    }

    usage.ocrCount -= 1;
    await usage.save();

    next();

  } catch (err) {
    console.error("checkOCRLimit error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
