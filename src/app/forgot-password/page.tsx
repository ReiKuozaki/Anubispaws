"use client";

import { useState } from "react";
import { LightRays } from "@/components/ui/light-rays"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("📧 Password reset link sent to your email.");
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      


      {/* 🔹 Foreground Content */}
      <div className="flex min-h-screen items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-md p-6 rounded-xl w-full max-w-md space-y-4"
        >
          <h1 className="text-2xl font-bold text-center">Forgot Password</h1>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded bg-white/80 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="w-full py-3 rounded hover:bg-red-600 hover:text-white duration-300 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {message && (
            <p className="text-center text-sm text-gray-300">{message}</p>
          )}
        </form>
      </div>
      <LightRays />
    </div>
  );
}
