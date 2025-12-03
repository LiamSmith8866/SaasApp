import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import { jsPDF } from "jspdf";
import { useUser } from "../context/UserContext";

export default function OCR() {
  const { user } = useUser();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // 选择图片
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 显示预览
    setPreview(URL.createObjectURL(file));

    // 压缩，提升速度
    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
    });

    setImage(compressed);
  };

  // OCR 识别
  const runOCR = async () => {
    if (!image) {
      alert("请先上传图片");
      return;
    }

    if (user && !user.isPro && user.ocrCount <= 0) {
      alert("今天的免费次数已用完，请升级到 Pro");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://localhost:5000/api/ocr/parse", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      setResult(data.text || "");

      // 扣除次数
      if (user && !user.isPro) {
        await fetch("http://localhost:5000/api/usage/decrease", {
          method: "POST",
          credentials: "include",
        });
      }
    } catch (err) {
      console.error(err);
      alert("OCR 失败，请检查服务器");
    }

    setLoading(false);
  };

  // 复制文本
  const copyText = () => {
    navigator.clipboard.writeText(result);
    alert("已复制到剪贴板");
  };

  // 下载为 TXT
  const downloadTxt = () => {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ocr-result.txt";
    a.click();
  };

  // 下载 PDF
  const downloadPDF = () => {
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(result, 180);
    pdf.text(lines, 15, 15);
    pdf.save("ocr-result.pdf");
  };

  // 清空
  const clearAll = () => {
    setImage(null);
    setPreview(null);
    setResult("");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">OCR Text Extraction</h1>

      <div className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="border p-2 rounded"
        />

        {preview && (
          <img
            src={preview}
            className="max-h-64 object-contain rounded shadow"
            alt="preview"
          />
        )}

        <button
          onClick={runOCR}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Processing..." : "Run OCR"}
        </button>

        {loading && (
          <div className="text-center text-gray-500">正在识别，请稍候...</div>
        )}

        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">识别结果</h2>

            <textarea
              className="w-full h-60 border p-3 rounded bg-gray-50"
              value={result}
              readOnly
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={copyText}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Copy
              </button>

              <button
                onClick={downloadTxt}
                className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
              >
                TXT
              </button>

              <button
                onClick={downloadPDF}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                PDF
              </button>

              <button
                onClick={clearAll}
                className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-400"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
