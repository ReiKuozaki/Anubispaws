/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/app/**/*.{js,ts,jsx,tsx}", // all your app files
  "./src/components/**/*.{js,ts,jsx,tsx}", // all components
];

export const theme = {
  extend: {
    keyframes: {
      rainbow: {
        '0%': { backgroundPosition: '0% 50%' },
        '100%': { backgroundPosition: '200% 50%' },
      },
    },
    animation: {
      rainbow: 'rainbow var(--speed, 2s) linear infinite',
    },
  },
};

export const plugins = [];
