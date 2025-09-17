"use client";

import React, { useState } from "react";
import { PasswordStrength } from "./PasswordStrength";

export const SignupForm = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState(1);

  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords do not match");

    const res = await fetch("http://localhost/anubispaws/api/signup.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, email, password }),
    });
    const data = await res.json();
    if (data.success) setStep(2);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost/anubispaws/api/verify-email.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: verificationCode }),
    });
    const data = await res.json();
    if (data.success) alert("Email verified! You can login now");
  };

  return step === 1 ? (
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
      <button type="submit" className="w-full bg-black text-white p-3 rounded-lg">
        Sign Up
      </button>
      <div className="w-full text-center">OR</div>
      <button
  type="button"
  onClick={() => window.location.href = "http://localhost/anubispaws/api/google-login.php"}
  className="w-full flex items-center justify-center gap-2 border p-3 rounded-lg hover:bg-gray-100 transition"
>
  <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
  Continue with Google
</button>

    </form>
  ) : (
    <form onSubmit={handleVerify} className="space-y-4">
      <p className="text-center text-gray-700">
        Email verification sent to {email}
      </p>
      <input
        type="text"
        placeholder="Enter code"
        className="w-full p-3 border rounded-lg"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        required
      />
      <button type="submit" className="w-full bg-black text-white p-3 rounded-lg">
        Verify Email
      </button>
    </form>
  );
};
