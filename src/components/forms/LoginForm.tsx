"use client";

import React, { useState } from "react";
import GoogleButton from "../forms/GoogleButton";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/Context/UserContext";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) throw new Error(data?.error || "Login failed");
      if (!data?.token) throw new Error("No token returned");

      localStorage.setItem("token", data.token);
      
      await refreshUser(); // ✅ Update user context immediately

      alert("Login successful!");
      router.push("/");
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 rounded-lg bg-white/80 text-black"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 rounded-lg bg-white/80 text-black"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-transparent text-white p-3 rounded-lg border hover:bg-gray-50 hover:text-black duration-200 transition"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <div className="w-full text-center">OR</div>
      <GoogleButton />
    </form>
  );
};