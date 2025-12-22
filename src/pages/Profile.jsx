import { API_URL } from "../config"; // 引入配置
async function buy(variantId) {
    const res = await fetch(`${API_URL}/api/ls/create-checkout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId })
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // 跳转至 Lemon Squeezy 收银台
    } else {
      alert("Failed to create the checkout");
      console.error(data);
    }
  }
  