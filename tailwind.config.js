/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: { 950: "#05050A", 900: "#0D0D1A", 800: "#141428", 700: "#1E1E38" },
        gold: { DEFAULT: "#E8B84B", light: "#F5D07A", dark: "#B8892A" },
        scarlet: { DEFAULT: "#E83B3B", light: "#FF6B6B" },
        jade: { DEFAULT: "#00C896", light: "#4DDFB8" },
        azure: { DEFAULT: "#3B82F6", light: "#60A5FA" },
        pearl: { DEFAULT: "#F0EDE8", muted: "#B8B4AE" },
      },
      animation: {
        "ticker": "ticker 30s linear infinite",
        "fade-up": "fadeUp 0.6s ease forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        ticker: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        fadeUp: { "0%": { opacity: 0, transform: "translateY(20px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        pulseGlow: { "0%,100%": { boxShadow: "0 0 20px rgba(232,184,75,0.3)" }, "50%": { boxShadow: "0 0 40px rgba(232,184,75,0.6)" } },
      },
    },
  },
  plugins: [],
};
