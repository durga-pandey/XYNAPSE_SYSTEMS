/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", "[data-theme='dark']"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      "custom-md": "1080px", 
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        baloo: ['"Baloo 2"', "cursive"],
        tiro: ['"Tiro Devanagari Hindi"', "serif"],
        noto: ['"Noto Sans Devanagari"', "sans-serif"],
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-scale": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        // --- Naya Animation for Text Reveal ---
        reveal: {
          "0%": { opacity: "0", transform: "translateY(15px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "color-shift": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        }
      },
      animation: {
        scroll: "scroll 30s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-scale": "pulse-scale 2s ease-in-out infinite",
        // --- Inka use React Component me hoga ---
        "text-reveal": "reveal 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards",
        "gradient-text": "color-shift 6s ease infinite",
      },
    },
  },
  plugins: [],
};