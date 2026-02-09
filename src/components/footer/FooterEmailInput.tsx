"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FooterEmailInput() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full flex flex-col items-center mb-8">
      <span className="mb-4 text-lg font-semibold text-white">
        Subscribe to our newsletter
      </span>

      <div className="relative flex items-center">
        {/* Animated Input */}
        <motion.input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          initial={{ width: 200 }}
          animate={{ width: focused || email ? 300 : 200 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Send Button */}
        <AnimatePresence>
          {(focused || email) && (
            <motion.button
              type="submit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute right-0 px-4 duration-300 py-2 rounded-r-lg bg-black-500 text-white font-semibold hover:bg-gray-600"
            >
              Send
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
