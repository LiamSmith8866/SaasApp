import Usage from "../models/Usage.js";

export const checkOCRLimit = async (req, res, next) => {
  const userId = req.user.id;

  const usage = await Usage.findOne({ userId });

  // 自动重置每天限制
  const now = new Date();
  const last = new Date(usage.lastReset);

  const isNewDay = now.getDate() !== last.getDate();

  if (isNewDay) {
    usage.ocrCount = 10; // 重置 10 次
    usage.lastReset = now;
    await usage.save();
  }

  // 如果是 Pro 用户，直接无限使用
  if (usage.isPro) return next();

  // 免费用户数量不足
  if (usage.ocrCount <= 0) {
    return res.status(403).json({
      message: "Daily OCR limit reached. Upgrade to Pro to unlock unlimited usage."
    });
  }

  // 如果还有次数 → 减掉一次
  usage.ocrCount -= 1;
  await usage.save();

  next();
};
