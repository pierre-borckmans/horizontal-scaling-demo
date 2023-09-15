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
      },
      animation: {
        poke: "poke 350ms ease-out 650ms",
        shake: "shake 200ms ease-out",
      },
      screens: {
        lg: "1000px",
      },
    },
  },
  plugins: [],
} satisfies Config;
