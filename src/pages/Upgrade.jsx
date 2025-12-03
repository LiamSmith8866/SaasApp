import { useState } from "react";

export default function Upgrade() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    const res = await fetch("/api/payments/create-checkout", {
      credentials: "include",
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Upgrade to PRO</h1>
      
      <button
        disabled={loading}
        onClick={handleUpgrade}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        {loading ? "Loading..." : "Go to Checkout"}
      </button>
    </div>
  );
}
