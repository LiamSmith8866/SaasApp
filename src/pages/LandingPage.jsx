// src/pages/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

const LandingPage = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <nav className="flex justify-between items-center p-6 border-b">
        <div className="text-2xl font-bold text-blue-600">SaaS App</div>
        <div className="space-x-4">
          {user ? (
            // 如果已登录，显示进入控制台
            <Link 
              to="/dashboard" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Enter the console
            </Link>
          ) : (
            // 如果未登录，显示登录/注册
            <>
              <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-blue-600">
              Log in
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Free registration
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero 区域 */}
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
        <h1 className="text-5xl font-bold mb-6">Let work efficiency soar</h1>
        <p className="text-xl text-gray-500 mb-8 max-w-2xl">
        A one-stop SaaS platform integrating OCR, task management, and AI analysis. Start right now and unleash your productivity.
        </p>
        
        {!user && (
          <Link 
            to="/register" 
            className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            Try it for free now
          </Link>
        )}
      </div>
    </div>
  );
};

export default LandingPage;