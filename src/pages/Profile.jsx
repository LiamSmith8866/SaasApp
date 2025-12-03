async function buy(variantId) {
    const res = await fetch("http://localhost:5000/api/ls/create-checkout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId })
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // 跳转至 Lemon Squeezy 收银台
    } else {
      alert("创建结账失败");
      console.error(data);
    }
  }
  