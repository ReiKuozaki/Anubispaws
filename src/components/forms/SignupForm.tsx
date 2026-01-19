"use client";

import React, { useState } from "react";
import { PasswordStrength } from "./PasswordStrength";
import GoogleButton from "../forms/GoogleButton";

export const SignupForm = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [step, setStep] = useState(1);

  // 👇 new state for verification
  const [code, setCode] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords do not match");

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setStep(2); // move to verification step
    } else {
      alert(data.error || "Signup failed");
    }
  };

  // 👇 new verify function
  const handleVerify = async () => {
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Email verified! You can now log in.");
      // maybe redirect to login page
    } else {
      alert(data.error || "Invalid or expired code");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return step === 1 ? (
    // Step 1: Signup
    <form onSubmit={handleSignup} className="space-y-4">
      <input
        type="text"
        placeholder="Nickname"
        className="w-full p-3 border rounded-lg"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 border rounded-lg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 border rounded-lg"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <PasswordStrength password={password} />
      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full p-3 border rounded-lg"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-50 duration-200 hover:text-black"
      >
        Sign Up
      </button>
      <div className="w-full text-center">OR</div>
      <GoogleButton />
    </form>
  ) : (
    // Step 2: Verification
    <div className="space-y-4">
      
    </div>
  );
};
