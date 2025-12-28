import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
export default function Sidebar() {
  const { user, logout, fetchFullUser } = useUser();
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-5 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Technology OCR</h1>
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
        {user && <Link to="/upgrade" className="hover:text-yellow-300">Upgrade to Pro ⭐</Link>}
      </nav>
      {user && (
       <div className="mt-6 p-3 bg-gray-700 rounded-lg text-sm">
        <p className="font-semibold">Logged in:</p>
         <p className="text-blue-300">{user.email}</p>
      <p className="mt-2">
         Status:{" "}
         <span className={user.isPro ? "text-green-300" : "text-yellow-300"}>
          {user.isPro ? "Pro User" : "Free User"}
         </span>
       </p>
       {!user.isPro && (
          <link
          to="/upgrade" 
          className="block mt-2 bg-purple-500 px-3 py-1 text-center rounded hover:bg-purple-600 transition"
          >
            Upgrade to Pro
          </link>
        )}

        {!user.isPro && (
          <p className="mt-2">
            OCR Left: <span className="text-yellow-300">{user.ocrCount}</span>
          </p>
        )}
        <button
            onClick={() => fetchFullUser()}
            className="mt-2 bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
          >
            Refresh Status
       </button>

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
