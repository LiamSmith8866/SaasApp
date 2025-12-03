import React from "react";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">Welcome Back 👋</h2>
        <p className="text-gray-600">
          This is your dashboard. Use the sidebar to navigate through your tools.
        </p>
      </div>
    </div>
  );
}
