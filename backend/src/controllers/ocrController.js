export const runOCR = async (req, res) => {
    try {
      // 你未来可以在这里接入真实 OCR API（百度 / 火山 / OpenAI / AWS）
      res.json({
        text: "This is a demo OCR result.",
        message: "OCR success"
      });
  
    } catch (err) {
      res.status(500).json({ message: "OCR failed", error: err.message });
    }
  };
  