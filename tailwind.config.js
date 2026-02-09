/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/app/**/*.{js,ts,jsx,tsx}",
  "./src/components/**/*.{js,ts,jsx,tsx}",
];

export const theme = {
  extend: {
    keyframes: {
      rainbow: {
        "0%": { backgroundPosition: "0% 50%" },
        "100%": { backgroundPosition: "200% 50%" },
      },
      hexPulse: {
        "0%, 100%": { opacity: "0.85" },
        "50%": { opacity: "1" },
      },
    },
    animation: {
      rainbow: "rainbow var(--speed, 2s) linear infinite",
      hexPulse: "hexPulse 6s ease-in-out infinite", // NEW
    },
  },
};

export const plugins = [];
