/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#4F46E5", // Indigo-600 for buttons and highlights
        secondary: "#9333EA", // Purple-600 for accents
        accent: "#14B8A6", // Teal-500 for alerts or success messages
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in-out",
        fadeInSlow: "fadeIn 2s ease-in-out",
        slideInUp: "slideInUp 1s ease-in-out",
        pulseSlow: "pulseSlow 2s infinite",
        rotate: "rotate 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideInUp: {
          from: { transform: "translateY(50px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        pulseSlow: {
          "0%, 100%": { opacity: 0.8 },
          "50%": { opacity: 1 },
        },
        rotate: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
