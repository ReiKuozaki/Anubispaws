// src/app/auth/GoogleButton.tsx
"use client";

import React from "react";

interface GoogleButtonProps {
  onClick: () => void;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
    >
      <img src="/images/google-icon.png" alt="Google" className="w-5 h-5"/>
      Continue with Google
    </button>
  );
};
