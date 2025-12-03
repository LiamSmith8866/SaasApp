import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // 验证 JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 去数据库查找用户
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 在 req 对象中注入用户信息，后续所有路由可用
    req.user = {
      id: user._id.toString(),
      email: user.email,
    };

    next();

  } catch (err) {
    return res.status(401).json({ message: "Auth failed", error: err.message });
  }
}
