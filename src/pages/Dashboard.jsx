// src/pages/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ScanText, CheckSquare, Zap, Crown } from "lucide-react";
import { useUser } from "../context/UserContext"; // 引入全局状态

export default function Dashboard() {
  // ✅ 获取全局 usage，而不是本地 stats
  const { usage } = useUser();
  const getNextBillingDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1); // 下个月
    return date.toISOString().split('T')[0]; // 格式化为 YYYY-MM-DD
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* 欢迎语 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
        Good morning! Start an efficient day 🚀
        </h1>
        <p className="text-gray-500 mt-1">
        Here is an overview of all your workflows.
        </p>
      </div>

      {/* 数据卡片区 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* 卡片 1: OCR 用量 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">The remaining number of OCR operations</p>
              {/* ⚠️ 注意这里：我们要用 usage.remaining，不能再用 stats 了 */}
              <h3 className="text-4xl font-extrabold text-blue-600 mt-2">
                {usage.loading ? "..." : usage.remaining}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <ScanText size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {usage.isPro ? (
              <span className="text-green-600 flex items-center gap-1 font-medium">
                <Crown size={14} /> Unlimited enjoyment of Pro privileges
              </span>
            ) : (
              // ⚠️ 这里也改成 usage.ocrLimit
              <span>Total quota: {usage.ocrLimit || 6} times per month</span>
            )}
          </div>
        </div>

        {/* 卡片 2: 任务状态 (静态示例) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">To-do tasks</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">twelve</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <CheckSquare size={24} />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
          Three high-priority tasks
          </p>
        </div>

        {/* 卡片 3: 会员状态 */}
        <div className={`p-6 rounded-xl shadow-sm border 
          ${usage.isPro ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white" : "bg-white border-gray-100"}`}>
          
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm font-medium ${usage.isPro ? "text-gray-300" : "text-gray-500"}`}>
              Current plan
              </p>
              <h3 className={`text-3xl font-bold mt-2 ${usage.isPro ? "text-white" : "text-gray-900"}`}>
                {usage.isPro ? "PRO Plan" : "Free Plan"}
              </h3>
            </div>
            <div className={`p-3 rounded-lg ${usage.isPro ? "bg-white/10 text-yellow-400" : "bg-orange-50 text-orange-500"}`}>
              <Zap size={24} />
            </div>
          </div>
          
          <div className="mt-4">
             {usage.isPro ? (
               <p className="text-sm text-gray-400">
               Next deduction: {usage.nextBillingDate || "Unknown"}
               </p>
             ) : (
               <Link to="/upgrade" className="text-sm font-bold text-blue-600 hover:underline">
                 Upgrade to unlock more &rarr;
               </Link>
             )}
          </div>
        </div>
      </div>

      {/* 快捷入口区 */}
      <h2 className="text-lg font-bold text-gray-800 mb-4">Quick operation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/ocr" className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition group">
           <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
             <ScanText />
           </div>
           <div>
             <h4 className="font-bold text-gray-800">Create a new OCR recognition</h4>
             <p className="text-sm text-gray-500">Upload the image extraction task</p>
           </div>
        </Link>
        
        <Link to="/tasks" className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition group">
           <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition">
             <CheckSquare />
           </div>
           <div>
             <h4 className="font-bold text-gray-800">Check out my tasks</h4>
             <p className="text-sm text-gray-500">Manage today's to-do list</p>
           </div>
        </Link>
      </div>
    </div>
  );
}