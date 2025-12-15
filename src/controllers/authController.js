// backend/src/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usage from "../models/Usage.js";

// 1. 注册
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    
    // 初始化 Usage (6次免费)
    await Usage.create({
      userId: user._id,
      ocrCount: 0, 
      ocrLimit: 6,
      isPro: false
    });

    res.status(201).json({ 
      success: true, 
      message: "Register success", 
      userId: user._id 
    });
    
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// 2. 登录 (核心修改)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false, message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // 生产环境改为 true
      sameSite: "lax",
    });

    // ✅ 修复点：必须返回 user 对象，前端 Context 才能 setUser
    res.json({ 
      success: true, 
      message: "Login success", 
      user: {
        _id: user._id,
        email: user.email,
        isPro: user.isPro
      },
      token // 可选，因为已经种了 cookie，但返回给前端备用也好
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// 3. 获取当前用户 (核心修改)
export const getUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ success: false, user: null });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ 修复点：去数据库查最新数据 (否则拿不到 isPro 状态)
    // 注意：这里变成了 async/await
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
       return res.json({ success: false, user: null });
    }

    res.json({ 
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        isPro: user.isPro
      }
    });
  } catch (err) {
    res.json({ success: false, user: null });
  }
};

// 4. 退出
export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
};