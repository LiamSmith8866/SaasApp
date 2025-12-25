import express from "express";
import cors from "cors";
import multer from "multer";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());

// 捕获文件上传
const upload = multer({ storage: multer.memoryStorage() });

// 🔐 Supabase JWT 验证
const SUPABASE_JWT_SECRET = "SzH8e4D58X8Ohlf+RIDvw34xSwVdyJU18kl/ZcmGZfS+mqF2aioAjO0w9hI5Rw4I+J7hz/sQdDE0F5dlaDKLhw=="; // 下一步教你怎么找

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    console.error("JWT verification failed", e);
    return res.status(401).json({ error: "Invalid token" });
  }
}

// OCR 接口（用户必须登录）
app.post("/ocr", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const userId = req.user.sub;

    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // 上传到 OCR API
    const formData = new FormData();
    formData.append("file", new Blob([file.buffer]), file.originalname);
    formData.append("apikey", "helloworld");
    formData.append("language", "eng");

    const apiRes = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: formData,
    });

    const result = await apiRes.json();

    const parsedText =
      result?.ParsedResults?.[0]?.ParsedText || "Text not recognized";

    res.json({
      userId,
      text: parsedText,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OCR failed" });
  }
});

// 运行后端服务
app.listen(3001, () => {
  console.log("Backend running http://localhost:3001");
});
