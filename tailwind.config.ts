import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          900: "#0D241B",
          DEFAULT: "#173F30",
          800: "#173F30",
          700: "#225341",
          600: "#2F6B55",
          500: "#3D8269",
        },
        moss: {
          DEFAULT: "#527B57",
          600: "#446848",
          700: "#36533A",
          400: "#6B9870",
          300: "#8DB492",
        },
        sage: {
          DEFAULT: "#A7B99A",
          light: "#C5D3BC",
          dark: "#849876",
          muted: "#97A78C",
        },
        parchment: {
          DEFAULT: "#F5EBD5",
          light: "#FDF8ED",
          dark: "#E8D9B8",
          subtle: "#FAF4E8",
        },
        lantern: {
          DEFAULT: "#F2BE64",
          amber: "#F2BE64",
          glow: "#FFD485",
          warm: "#DF9F3E",
          deep: "#B8751E",
        },
        ink: {
          DEFAULT: "#26372C",
          dark: "#1A261E",
          soft: "#3A4F41",
          muted: "#5A7363",
        },
      },
      fontFamily: {
        serif: ["Cinzel", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      boxShadow: {
        parchment: "0 4px 20px -2px rgba(38, 55, 44, 0.12), 0 2px 6px -1px rgba(38, 55, 44, 0.08)",
        lantern: "0 0 25px -4px rgba(242, 190, 100, 0.35)",
        forest: "0 10px 30px -5px rgba(13, 36, 27, 0.4)",
      },
      animation: {
        "float-gentle": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.4s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
