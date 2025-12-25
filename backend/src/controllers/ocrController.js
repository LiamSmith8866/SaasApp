import fs from "fs";
import OpenAI from "openai";
import User from "../models/User.js";
import Usage from "../models/Usage.js";

export const runOCR = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 1. 检查额度
    const usage = await Usage.findOne({ userId });
    if (!usage) return res.status(403).json({ message: "No usage record found" });
    if (usage.ocrLimit !== -1 && usage.ocrCount >= usage.ocrLimit) {
      return res.status(403).json({ message: "Limit reached, please upgrade to Pro", needUpgrade: true });
    }

    // 2. 图片处理
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    // 3. 阿里云 Qwen-VL 配置
    const openai = new OpenAI({
      apiKey: process.env.DASHSCOPE_API_KEY, 
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1", 
    });

   

    // ===========================
    // 🧠 Prompt 优化：强制提取任务，即使内容很少
    // ===========================
    const completion = await openai.chat.completions.create({
      model: "qwen-vl-max", 
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `You are an efficient office assistant. Please analyze the content of this image.
              Extract key information and strictly output a standard JSON string. 
              Do not include markdown code blocks. Do not output any conversational text.

              The output format must be:
              {
                "summary": "A brief summary of the image content (in English)",
                "tasks": [
                  { 
                    "title": "Task content (in English)", 
                    "date": "Extracted date or deadline (leave empty if none)", 
                    "priority": "High/Medium/Low" 
                  }
                ]
              }

              CRITICAL RULES:
              1. If the image contains handwriting, scribble, or just a single word (e.g., "Success"), YOU MUST treat it as a task title.
              2. DO NOT return an empty tasks array. Always generate at least one task based on the visual content.
              3. If the text is messy, try your best to guess the meaning.` 
            },
            {
              type: "image_url",
              image_url: { url: dataUrl },
            },
          ],
        },
      ],
      max_tokens: 1500,
    });

    let resultText = completion.choices[0].message.content;
    
    // 🔍 调试日志：看看 AI 到底返回了什么
   

    // 数据清洗
    resultText = resultText.replace(/```json|```/g, "").trim();

    let parsedData;
    try {
        parsedData = JSON.parse(resultText);
        
        // 🛡️ 容错：如果 AI 还是返回了空数组，我们手动塞一个进去
        if (!parsedData.tasks || parsedData.tasks.length === 0) {
            parsedData.tasks = [{
                title: parsedData.summary || "Review uploaded image content",
                date: "",
                priority: "Medium"
            }];
        }

    } catch (e) {
        console.error("JSON Parse Fail:", e);
        // 兜底数据
        parsedData = { 
            summary: "Content recognized as text", 
            tasks: [{ title: resultText.substring(0, 50), date: "", priority: "Medium" }] 
        };
    }

    // 删除临时文件
    try { fs.unlinkSync(imagePath); } catch(e) {}

    // 4. 扣费
    if (usage.ocrLimit !== -1) {
      usage.ocrCount += 1;
      await usage.save();
    }

    res.json({
      success: true,
      data: parsedData,
      left: usage.ocrLimit === -1 ? "Unlimited" : (usage.ocrLimit - usage.ocrCount),
      message: "Analysis successful"
    });

  } catch (err) {
    console.error("OCR Error:", err);
    if (req.file && req.file.path) try { fs.unlinkSync(req.file.path); } catch(e) {}
    res.status(500).json({ message: "Analysis failed: " + err.message });
  }
};