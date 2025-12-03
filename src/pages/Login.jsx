import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, register } = useUser();
  const nav = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        nav("/");
      } else {
        alert(res.error);
      }
    } else {
      const res = await register(email, password);
      if (res.success) {
        alert("Register success! Now login.");
        setIsLogin(true);
      } else {
        alert(res.error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white shadow p-6 rounded w-[340px]" onSubmit={submit}>
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          className="text-center mt-3 text-blue-600 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "No account? Register" : "Have an account? Login"}
        </p>
      </form>
    </div>
  );
}
