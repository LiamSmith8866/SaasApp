import React, { createContext, useContext, useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5000";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [usage, setUsage] = useState({ ocrCount: 0, isPro: false });
  const [loading, setLoading] = useState(true);

  /** -------------------------
   * 获取完整用户信息 + 使用次数
   * ------------------------- */
  const fetchFullUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: "include",
      });

      const data = await res.json();
      if (!data.user) {
        setUser(null);
        setUsage({ ocrCount: 0, isPro: false });
        return;
      }

      // 获取 OCR 次数
      const usageRes = await fetch(`${API_BASE_URL}/api/usage/me`, {
        credentials: "include",
      });

      const usageData = await usageRes.json();

      setUser(data.user);
      setUsage({
        ocrCount: usageData.ocrCount ?? 0,
        isPro: usageData.isPro ?? false,
      });

    } catch (err) {
      console.error("Fetch user error:", err);
      setUser(null);
    }
  };

  /** -------------------------
   * 页面初始化加载
   * ------------------------- */
  useEffect(() => {
    const init = async () => {
      await fetchFullUser();
      setLoading(false);
    };
    init();
  }, []);

  /** -------------------------
   * 注册
   * ------------------------- */
  const register = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message };

      await fetchFullUser();
      return { success: true };
    } catch (err) {
      return { success: false, message: "Server error" };
    }
  };

  /** -------------------------
   * 登录
   * ------------------------- */
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message };

      await fetchFullUser();
      return { success: true };

    } catch (err) {
      return { success: false, message: "Server error" };
    }
  };

  /** -------------------------
   * 扣减 OCR 次数
   * ------------------------- */
  const decreaseUsage = async () => {
    const res = await fetch(`${API_BASE_URL}/api/usage/decrease`, {
      method: "POST",
      credentials: "include",
    });

    await fetchFullUser(); // 立即刷新次数
  };

  /** -------------------------
   * 登出
   * ------------------------- */
  const logout = async () => {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    setUsage({ ocrCount: 0, isPro: false });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        usage,
        loading,
        register,
        login,
        logout,
        decreaseUsage,
        fetchFullUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
