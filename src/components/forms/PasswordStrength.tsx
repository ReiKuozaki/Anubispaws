"use client";

import React, { useEffect, useState } from "react";

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setStrength(score);
  }, [password]);

  const getColor = () => {
    switch (strength) {
      case 0: return "bg-gray-300";
      case 1: return "bg-red-500";
      case 2: return "bg-yellow-400";
      case 3: return "bg-blue-400";
      case 4: return "bg-green-500";
      default: return "bg-gray-300";
    }
  };

  return (
    <div className="w-full h-2 bg-gray-200 rounded mt-1">
      <div className={`h-2 rounded ${getColor()}`} style={{ width: `${(strength / 4) * 100}%` }} />
    </div>
  );
};
