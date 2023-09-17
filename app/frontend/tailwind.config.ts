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
        left: {
          "0%": {
            transform: "translateX(0) rotateY(180deg) rotateZ(5deg)",
            opacity: "1",
            scale: "1",
          },
          "10%": {
            transform: "translateX(50%) rotateY(180deg) rotateZ(15deg)",
            opacity: "0.9",
            scale: "1.2",
          },
          "20%": {
            transform: "translateX(100%) rotateY(180deg) rotateZ(5deg)",
            opacity: "0.9",
            scale: "1",
          },
          "30%": {
            transform: "translateX(150%) rotateY(180deg) rotateZ(15deg)",
            opacity: "0.8",
            scale: "1.2",
          },
          "40%": {
            transform: "translateX(200%) rotateY(180deg) rotateZ(5deg)",
            opacity: "0.8",
            scale: "1",
          },
          "50%": {
            transform: "translateX(250%) rotateY(180deg) rotateZ(15deg)",
            opacity: "0.7",
            scale: "1.2",
          },
          "60%": {
            transform: "translateX(300%) rotateY(180deg) rotateZ(5deg)",
            opacity: "0.7",
            scale: "1",
          },
          "70%": {
            transform: "translateX(350%) rotateY(180deg) rotateZ(15deg)",
            opacity: "0.6",
            scale: "1.2",
          },
          "80%": {
            transform: "translateX(400%) rotateY(180deg) rotateZ(5deg)",
            opacity: "0.5",
            scale: "1",
          },
          "90%": {
            transform: "translateX(450%) rotateY(180deg) rotateZ(15deg)",
            opacity: "0.4",
            scale: "1.2",
          },
          "100%": {
            transform: "translateX(500%) rotateY(180deg) rotateZ(5deg)",
            opacity: "0.3",
            scale: "1",
          },
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
        left: "left 800ms ease-out",
      },
      screens: {
        lg: "1000px",
      },
    },
  },
  plugins: [],
} satisfies Config;
