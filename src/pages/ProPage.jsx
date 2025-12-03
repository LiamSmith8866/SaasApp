import React from "react";
import { useUser } from "../context/UserContext";

export default function ProPage() {
  const { user } = useUser();

  // 你的 Lemon Squeezy 购买链接
  const LEMON_CHECKOUT_URL = "https://YOUR-LEMON-LINK.com"; // 替换为真实链接

  const handleUpgrade = () => {
    window.location.href = LEMON_CHECKOUT_URL;
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Upgrade to Pro</h1>
      <p className="text-lg text-gray-600 mb-6">
        Hello <strong>{user?.email}</strong>, unlock all PRO features today!
      </p>

      <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">✨ Pro Features</h2>

        <ul className="mb-6 space-y-3 text-gray-700 text-lg">
          <li>⚡ Unlimited OCR conversions</li>
          <li>📄 Export as PDF, TXT, DOCX</li>
          <li>🗂 OCR History Saved Forever</li>
          <li>📤 Upload larger files</li>
          <li>🌍 Multi-language OCR</li>
          <li>🎧 Priority Processing</li>
        </ul>

        <div className="text-center">
          <button
            onClick={handleUpgrade}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white text-xl rounded-xl shadow"
          >
            Upgrade Now – Become PRO 🚀
          </button>
        </div>

        <p className="text-center text-gray-500 mt-4">
          Only <strong>$9.99/month</strong> — cancel anytime.
        </p>
      </div>
    </div>
  );
}
