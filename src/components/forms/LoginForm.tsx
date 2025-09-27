"use client";

import React, { useState } from "react";
import GoogleButton from "../forms/GoogleButton";
 

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Updated to Next.js API route
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("Logged in successfully!");
      // Optionally redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      alert(data.error || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Next.js Google OAuth route
    window.location.href = "/api/auth/google";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 rounded-lg bg-white/80 text-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 rounded-lg bg-white/80 text-black"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-transparent text-white p-3 rounded-lg border hover:bg-gray-50 hover:text-black duration-200 transition"
      >
        Login
      </button>
      <div className="w-full text-center">OR</div>
      <GoogleButton></GoogleButton>
    </form>
  );
};
