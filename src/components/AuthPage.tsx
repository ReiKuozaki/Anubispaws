"use client";

import React, { useState } from "react";
import { LoginForm } from "../app/auth/LoginForm";
import { SignupForm } from "../app/auth/SignupForm";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4 bg-cover bg-center"
      style={{ backgroundImage: 'url("/images/background.png")' }}
    >
      {/* Tabs */}
      <div className="flex gap-4 mb-6 justify-center relative">
        <motion.button
          onClick={() => setIsLogin(true)}
          className="px-6 py-2 rounded-md text-white relative z-10"
          whileTap={{ scale: 0.95 }}
        >
          Login
          {isLogin && (
            <motion.span
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 w-full h-1 bg-white rounded"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>

        <motion.button
          onClick={() => setIsLogin(false)}
          className="px-6 py-2 rounded-md text-white relative z-10"
          whileTap={{ scale: 0.95 }}
        >
          Sign Up
          {!isLogin && (
            <motion.span
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 w-full h-1 bg-white rounded"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      </div>

      {/* Animated form container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="w-full max-w-md p-8 bg-black/70 rounded-xl shadow-lg backdrop-blur-md"
        >
          {isLogin ? <LoginForm /> : <SignupForm />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
