import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { CheckCircle, Zap } from "lucide-react";

const Upgrade = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  // 1. 动态加载 FastSpring 脚本
  useEffect(() => {
    if (document.getElementById("fsc-api")) return; // 防止重复加载

    const script = document.createElement("script");
    script.id = "fsc-api";
    script.src = "https://d1f8f9xcsvx3ha.cloudfront.net/sbl/0.8.5/fastspring-builder.min.js";
    script.type = "text/javascript";
    
    // ⚠️ 替换成你的 Storefront 路径
    // 如果是测试环境，域名通常包含 .test.onfastspring.com
    script.setAttribute("data-storefront", "technologyocr.test.onfastspring.com/popup-technology-ocr-pro-monthly"); 
    
    // 可选：定义回调函数
    script.setAttribute("data-popup-closed", "onFSPopupClosed"); 

    document.head.appendChild(script);

    // 定义全局回调防止报错
    window.onFSPopupClosed = () => {
        console.log("The payment window has closed");
        setLoading(false);
    };
  }, []);

  const handleCheckout = () => {
    if (!user) return alert("Please log in first");
    setLoading(true);

    if (!window.fastspring) {
        alert("The payment component is loading. Please try again later...");
        setLoading(false);
        return;
    }

    try {
      // 2. 核心逻辑：把 UserID 注入到 FastSpring 的 Tags 里
      // 这样 Webhook 回调时，我们才知道是谁付的钱
      window.fastspring.builder.reset(); // 清除之前的状态
      
      // 添加产品 (替换 'pro-monthly' 为你的 Product Path)
      window.fastspring.builder.add('technology-ocr-pro'); 

      // 注入 userId 作为 tag
      window.fastspring.builder.tag('userId', user._id);

      // 打开支付弹窗
      window.fastspring.builder.checkout();

    } catch (error) {
      console.error(error);
      alert("Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Upgrade to PRO</h1>
        <p className="text-lg text-gray-500">Unlock unlimited productivity and automate workflows。</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          FASTSPRING SECURE
        </div>
        
        <div className="flex items-baseline mb-6">
          <span className="text-5xl font-extrabold text-gray-900">$9.9</span>
          <span className="text-gray-500 ml-2">/ 月</span>
        </div>

        <ul className="space-y-4 mb-8">
          <li className="flex items-center gap-3 text-gray-700">
            <CheckCircle className="text-green-500" size={20} />
            <span>Unlimited OCR recognition</span>
          </li>
          <li className="flex items-center gap-3 text-gray-700">
            <CheckCircle className="text-green-500" size={20} />
            <span>Priority support for Visa/PayPal</span>
          </li>
        </ul>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition flex items-center justify-center gap-2"
        >
          {loading ? "Loading..." : <><Zap size={20} /> Upgrade now</>}
        </button>
      </div>
    </div>
  );
};

export default Upgrade;