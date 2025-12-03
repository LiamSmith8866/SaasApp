import React from "react";
import { useUser } from "../context/UserContext";

const UserDashboard = () => {
  const { user } = useUser();

  if (!user) return <div className="p-6">请先登录。</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Account Overview</h1>

      <div className="p-4 bg-white shadow rounded">
        <p className="text-lg">
          <b>Email:</b> {user.email}
        </p>

        <p className="text-lg">
          <b>Membership:</b>{" "}
          {user.isPro ? (
            <span className="text-green-600 font-bold">PRO 会员</span>
          ) : (
            <span className="text-gray-600">免费用户</span>
          )}
        </p>

        {!user.isPro && (
          <p className="text-lg">
            <b>今日剩余 OCR 次数:</b> {user.ocrCount ?? 0}
          </p>
        )}
      </div>

      {!user.isPro && (
        <button
          onClick={async () => {
            const res = await fetch("http://localhost:5000/api/payment/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: user.id }),
            });

            const data = await res.json();
            window.location.href = data.url;
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          升级至 PRO
        </button>
      )}
    </div>
  );
};

export default UserDashboard;
