"use client";

import React, { useState } from "react";
import { LoginForm } from "../../components/forms/LoginForm";
import { SignupForm } from "../../components/forms/SignupForm";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {/* Background Image */}
      <Image
        src="/images/background.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      {/* Overlay Blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Form Container */}
      <motion.div
        className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl p-8 shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab("login")}
            className={`px-4 py-2 rounded-full font-medium transition ${
              activeTab === "login"
                ? "bg-white/70 text-black shadow-lg"
                : "text-white hover:bg-white/20"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`px-4 py-2 rounded-full font-medium transition ${
              activeTab === "signup"
                ? "bg-white/70 text-black shadow-lg"
                : "text-white hover:bg-white/20"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Area with smooth animation */}
        <AnimatePresence mode="wait">
          {activeTab === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SignupForm />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
