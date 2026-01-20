"use client";

import React, { useState } from "react";
import { PasswordStrength } from "./PasswordStrength";
import GoogleButton from "../forms/GoogleButton";
import { useRouter } from "next/navigation";

export const SignupForm = () => {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords do not match");

    setSubmitting(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Signup successful! Redirecting to home...");
        router.push("/home"); // redirect right after signup
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during signup");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
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
        disabled={submitting}
        className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-50 duration-200 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Signing up..." : "Sign Up"}
      </button>

      <div className="w-full text-center">OR</div>

      <GoogleButton />
    </form>
  );
};
