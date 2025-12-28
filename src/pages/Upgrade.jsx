import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { CheckCircle, Zap, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 1. 引入跳转钩子

const Upgrade = () => {
  const { user, usage, fetchUsage } = useUser();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // 2. 新增支付成功状态
  const navigate = useNavigate(); // 初始化跳转

  // 如果用户已经是 Pro，直接显示已拥有状态 (防止重复购买)
  useEffect(() => {
    if (usage.isPro && !paymentSuccess) {
        // 可选：如果是 Pro，直接踢回 Dashboard
        // navigate("/dashboard");
    }
  }, [usage.isPro, navigate, paymentSuccess]);

  useEffect(() => {
    if (document.getElementById("fsc-api")) return;

    const script = document.createElement("script");
    script.id = "fsc-api";
    script.src = "https://d1f8f9xcsvx3ha.cloudfront.net/sbl/0.8.5/fastspring-builder.min.js";
    script.type = "text/javascript";
    
    // ⚠️ 记得把这里换成你的正式 Storefront URL (去掉 .test 如果已上线)
    script.setAttribute("data-storefront", "technologyocr.test.onfastspring.com/popup-technology-ocr-pro-monthly"); 
    script.setAttribute("data-popup-closed", "onFSPopupClosed"); 

    document.head.appendChild(script);

    // ✅ 核心修改：支付回调逻辑
    window.onFSPopupClosed = (orderReference) => {
        if (orderReference) {
           
            
            // 1. 立即改变 UI 状态 (隐藏价格卡片，显示成功动画)
            setPaymentSuccess(true);
            setLoading(true);

            // 2. 刷新全局用户状态
            fetchUsage();

            // 3. 延迟跳转 (给用户 3 秒钟看完“成功”提示)
            setTimeout(() => {
                navigate("/dashboard"); // 跳转回仪表盘
            }, 3000);
            
        } else {
            setLoading(false);
            console.log("Closed for unpaid payment");
        }
    };

    return () => {
        delete window.onFSPopupClosed;
    };
  }, [fetchUsage, navigate]);

  const handleCheckout = () => {
    if (!user) return alert("Please log in first");
    setLoading(true);

    if (!window.fastspring) {
        alert("Payment system loading...");
        setLoading(false);
        return;
    }

    try {
      window.fastspring.builder.reset();
      window.fastspring.builder.add('technology-ocr-pro'); // 你的产品 Path
      window.fastspring.builder.tag('userId', user._id);
      window.fastspring.builder.promo('TEST'); // 上线记得删掉这行！
      window.fastspring.builder.checkout();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Upgrade to PRO</h1>
        <p className="text-lg text-gray-500">Unlock unlimited productivity and automate workflows.</p>
      </div>

      {/* ✅ 这里的逻辑变了：如果支付成功，显示成功卡片；否则显示价格卡片 */}
      {paymentSuccess ? (
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-12 max-w-md w-full text-center animate-fade-in-up">
          <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 mb-6">Welcome to PRO. Redirecting to your dashboard...</p>
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-blue-600" />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 max-w-md w-full relative overflow-hidden">
          {/* 原来的价格卡片内容... */}
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            FASTSPRING SECURE
          </div>
          
          <div className="flex items-baseline mb-6">
            <span className="text-5xl font-extrabold text-gray-900">$9.9</span>
            <span className="text-gray-500 ml-2">/ month</span>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="text-green-500" size={20} />
              <span>Unlimited OCR recognition</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700">
              <CheckCircle className="text-green-500" size={20} />
              <span>Priority support</span>
            </li>
          </ul>
          {/* Beta 优惠码提示 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-sm text-yellow-800 flex flex-col gap-1">
          <p className="font-bold flex items-center gap-2">
            🎁 Beta Tester Exclusive
          </p>
          <p>
            Enter coupon code <span className="font-mono bg-yellow-200 px-1 rounded font-bold text-black">TEST</span> at checkout to get this plan for <span className="font-bold">$0.00</span>!
          </p>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition flex items-center justify-center gap-2"
          >
            {loading ? (
               "Processing..."
            ) : (
               <>
                 <Zap size={20} /> Upgrade Now
               </>
            )}
          </button>
        </div>
      )}
      <footer className="site-footer">
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <span> · </span>
          <a href="/terms">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default Upgrade;