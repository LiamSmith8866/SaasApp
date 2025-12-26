// src/context/UserContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { API_URL } from "../config"; // 引入配置

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // 1. 用户身份状态
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 2. ✅ 新增：用量状态 (Usage State)
  // 专门用来存储 OCR 剩余次数和 Pro 状态
  const [usage, setUsage] = useState({
    remaining: "-",
    ocrLimit: "-",
    isPro: false,
    loading: true
  });
 

  // fetch(`${API_URL}/api/tasks`, ...) // 使用变量拼接
  // 3. ✅ 新增：获取用量的函数 (Dashboard 和 OCR 页面都要用)
  const fetchUsage = useCallback(async () => {
    try {
      // 这里的 loading 不影响全局 loading，只影响数字显示
      setUsage(prev => ({ ...prev, loading: true }));
      
      const res = await fetch(`${API_URL}/api/usage/me`, { 
        credentials: "include" // 必须带 Cookie
      });
      
      if (res.ok) {
        const data = await res.json();
        setUsage({ ...data, loading: false });
      }else {
        // ✅ 新增：如果后端报错 (比如 500)，也要停止 loading
        console.error("Failed:", res.status);
        setUsage(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error("Failed to fetch usage:", error);
      setUsage(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // 4. 初始检查登录状态
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, { 
          credentials: "include" 
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          // 如果登录成功，顺便去拉取一下用量数据
          fetchUsage();
        }
      } catch (error) {
        console.log("Not logged in");
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [fetchUsage]);

  // 当 user 变化时（比如刚登录），也确保拉取一次用量
  useEffect(() => {
    if (user) {
      fetchUsage();
    }
  }, [user, fetchUsage]);

  // --- 登录逻辑 ---
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: "Network error" };
    }
  };

  // --- 注册逻辑 ---
  const register = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, message: "Network error" };
    }
  };

  // --- 退出逻辑 ---
  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { 
        method: 'POST', 
        credentials: 'include' 
      });
      setUser(null);
      // 退出时清空用量数据
      setUsage({ remaining: "-", ocrLimit: "-", isPro: false, loading: true });
    } catch (err) {
      console.error(err);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    // ✅ 把 usage 和 fetchUsage 暴露给所有组件使用
    usage,
    fetchUsage,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};