import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Sidebar() {
  const { user, usage, logout } = useUser();

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-5 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">My SaaS</h1>

      <nav className="flex flex-col gap-3">
        <Link to="/" className="hover:text-blue-300">Dashboard</Link>
        <Link to="/tasks" className="hover:text-blue-300">Tasks</Link>
        <Link to="/ocr" className="hover:text-blue-300">OCR</Link>

        {!user && (
          <>
            <Link to="/login" className="hover:text-green-300">Login</Link>
            <Link to="/register" className="hover:text-green-300">Register</Link>
          </>
        )}

        {/* 添加 Pro 升级页面入口 */}
        {user && <Link to="/pro" className="hover:text-yellow-300">Upgrade to Pro ⭐</Link>}
      </nav>

      {user && (
        <div className="mt-6 p-3 bg-gray-700 rounded-lg text-sm">
          <p className="font-semibold">Logged in:</p>
          <p className="text-blue-300">{user.email}</p>

          <p className="mt-2">
            OCR Left:{" "}
            <span className="text-yellow-300">{usage?.ocrCount}</span>
          </p>

          <p>
            Status:{" "}
            <span className="text-green-300">
              {usage?.isPro ? "Pro User" : "Free User"}
            </span>
          </p>

          {!user.isPro && (
                      <a
              href="https://shing.lemonsqueezy.com/buy/9e100b27-****-****-****-fb9455439ab1"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 bg-yellow-500 px-3 py-1 rounded text-black font-semibold hover:bg-yellow-400"
            >
              Upgrade to Pro
            </a>
          )}


          <button
            onClick={logout}
            className="mt-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
