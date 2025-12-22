// src/layout/Layout.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { 
  LayoutDashboard, 
  ScanText, 
  CheckSquare, 
  LogOut, 
  Crown, 
  UserCircle 
} from "lucide-react"; // 引入漂亮的图标

export default function Layout({ children }) {
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // 侧边栏菜单配置
  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Tasks", path: "/tasks", icon: <CheckSquare size={20} /> },
    { label: "OCR recognition", path: "/ocr", icon: <ScanText size={20} /> },
    { label: "Account Settings", path: "/account", icon: <UserCircle size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* === 左侧侧边栏 Sidebar === */}
      <aside className="w-64 bg-white border-r flex flex-col shadow-sm">
        {/* Logo 区 */}
        <div className="h-16 flex items-center px-6 border-b">
          <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            My SaaS
          </span>
        </div>

        {/* 菜单区 */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                  ${isActive 
                    ? "bg-blue-50 text-blue-600 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 底部 Pro 广告区 */}
        {!user?.isPro && (
          <div className="p-4 m-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl text-white">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={16} className="text-yellow-400" />
              <span className="font-bold text-sm">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-gray-300 mb-3">Unlock unlimited OCR and advanced features。</p>
            <Link 
              to="/upgrade"
              className="block text-center py-2 bg-white text-gray-900 text-xs font-bold rounded hover:bg-gray-100 transition"
            >
              Upgrade now
            </Link>
          </div>
        )}

        {/* 底部退出按钮 */}
        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-gray-600 hover:text-red-600 transition"
          >
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* === 右侧主内容区 === */}
      <main className="flex-1 overflow-y-auto">
        {/* 顶部简单的 Header (显示用户信息) */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-gray-700">
            {menuItems.find(i => i.path === location.pathname)?.label || "Workbench"}
          </h2>
          <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500">
                  {user?.isPro ? "PRO Member" : "Free user"}
                </p>
             </div>
             <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
               {user?.email?.charAt(0).toUpperCase()}
             </div>
          </div>
        </header>

        {/* 页面内容注入点 */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
