import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext"; // 1. 引入全局状态
import { UserCircle, Mail, Crown, Zap, LogOut, CreditCard } from "lucide-react"; // 引入图标

export default function UserDashboard() {
  // 2. 直接从 Context 获取 user 和 usage
  const { user, usage, logout } = useUser();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h1>

      {/* 顶部：个人信息卡片 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 flex items-center gap-6">
        {/* 头像占位符 */}
        <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <span className="text-3xl font-bold">
            {user.email?.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          My account
            {usage.isPro && (
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 border border-yellow-200">
                <Crown size={12} fill="currentColor" /> PRO Member
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <Mail size={16} />
            <span>{user.email}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            User ID: {user._id}
          </p>
        </div>

        <button 
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>

      {/* 中间：订阅与用量卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 左卡：当前计划 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <CreditCard size={18} />
              <span className="font-medium text-sm">Current subscription plan</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {usage.isPro ? "PRO Professional" : "Free Starter"}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              {usage.isPro 
                ? "You have unlocked all advanced features and enjoy unlimited OCR。" 
                : "It is currently a free plan, with a limited recognition quota available each month。"}
            </p>
          </div>

          {!usage.isPro && (
            <div className="mt-6">
              <Link 
                to="/upgrade"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                <Zap size={18} /> Upgrade to PRO
              </Link>
            </div>
          )}
        </div>

        {/* 右卡：用量统计 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <Zap size={18} />
            <span className="font-medium text-sm">The usage of OCR quota</span>
          </div>

          {/* 进度条展示 */}
          <div className="mb-2 flex justify-between items-end">
            <span className="text-4xl font-extrabold text-blue-600">
              {usage.loading ? "..." : usage.remaining}
            </span>
            <span className="text-gray-400 text-sm mb-1">
            Remaining/total quota {usage.ocrLimit}
            </span>
          </div>

          {/* 进度条 UI */}
          {!usage.isPro && (
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4 overflow-hidden">
               {/* 计算进度百分比 */}
               <div 
                 className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                 style={{ 
                   width: usage.loading 
                    ? "0%" 
                    : `${Math.min(100, (usage.remaining / usage.ocrLimit) * 100)}%` 
                 }}
               ></div>
            </div>
          )}

          {usage.isPro ? (
            <p className="text-green-600 text-sm font-medium bg-green-50 p-2 rounded">
              🎉 You have unlimited usage rights. Enjoy using it to your heart's content!
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Each time the intelligent analysis is used, one credit limit will be deducted.
              <br/>Once the credit limit is exhausted, no new recognition can be made.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}