import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const { login, register } = useUser();
  const nav = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(location.pathname !== "/register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    nav(isLogin ? "/register" : "/login", { replace: true });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        console.log("Trying to log in...");
        const res = await login(email, password);
        console.log("Login result:", res); // 👇 看控制台打印什么

        // 只要 success 为 true，或者后端没返回 success 但没报错，都视为成功
        if (res.success) {
          console.log("Jump to the dashboard...");
          nav("/dashboard");
        } else {
          setError(res.message || "Login failed");
        }
      } else {
        const res = await register(email, password);
        if (res.success) {
          alert("Registration successful! Please log in.");
          setIsLogin(true);
          nav("/login");
        } else {
          setError(res.message || "Registration failed");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please check if the backend is started");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form className="bg-white shadow-lg p-8 rounded-lg w-[380px]" onSubmit={submit}>
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? "Welcome back" : "Create an account"}
        </h1>

        {/* 错误提示框 */}
        {error && (
          <div className="bg-red-50 text-red-600 p-2 text-sm rounded mb-4 border border-red-200 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
             <label className="block text-gray-700 text-sm font-bold mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className={`w-full mt-6 text-white py-2 rounded-lg font-semibold transition duration-200
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          {loading ? "Processing..." : (isLogin ? "Log in" : "Register")}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {isLogin ? "No account yet?" : "Already have an account?"}
            <span 
              className="text-blue-600 cursor-pointer ml-1 hover:underline font-bold"
              onClick={toggleMode}
            >
              {isLogin ? "Free registration" : "Log in now"}
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}