import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usage from "../models/Usage.js";


export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    await Usage.create({
      userId: user._id,
      ocrCount: 10,  // 免费用户每天 10 次
      isPro: false
    });
    res.status(201).json({ message: "Register success", userId: user._id });
    
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // 若部署到线上改为 true
      sameSite: "lax",
    });

    res.json({ message: "Login success", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getUser = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ user: null });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.json({ user: null });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
