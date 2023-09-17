import { type Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shake: {
          "0%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(5px) rotateZ(2deg)" },
          "50%": { transform: "translateX(-5px) rotateZ(0deg)" },
          "75%": { transform: "translateX(5px) rotateZ(-2deg)" },
          "100%": { transform: "translateX(0)" },
        },
        poke: {
          "0%": { transform: "scale(1.0) rotateZ(0deg)" },
          "50%": { transform: "scale(1.20) rotateZ(0deg)" },
          "100%": { transform: "scale(1.0) rotateZ(0deg)" },
        },
        wiggle: {
          "0%": { transform: "translateX(0px)", opacity: "0.7" },
          "33%": { transform: "translateX(20px) scale(1.05)", opacity: "0.4" },
          "66%": { transform: "translateX(-20px) scale(1.1)", opacity: "0.6" },
          "100%": { transform: "translateX(0px)", opacity: "0.7" },
        },
      },
      animation: {
        poke: "poke 350ms ease-out 350ms",
        shake: "shake 200ms ease-out",
        wiggle: "wiggle 800ms linear infinite",
      },
      screens: {
        lg: "1000px",
      },
    },
  },
  plugins: [],
} satisfies Config;
