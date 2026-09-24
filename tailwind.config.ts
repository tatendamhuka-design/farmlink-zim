import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        card: "0 4px 12px rgba(0,0,0,0.06)",
        lifted: "0 8px 24px rgba(0,0,0,0.08)",
        // Premium glow shadows
        glow: "0 0 0 1px rgba(22, 163, 74, 0.08), 0 8px 24px -6px rgba(22, 163, 74, 0.15), 0 2px 6px -2px rgba(0,0,0,0.06)",
        "glow-hover":
          "0 0 0 1px rgba(22, 163, 74, 0.15), 0 18px 40px -8px rgba(22, 163, 74, 0.28), 0 6px 14px -4px rgba(0,0,0,0.08)",
        "glow-amber":
          "0 0 0 1px rgba(245, 158, 11, 0.1), 0 8px 24px -6px rgba(245, 158, 11, 0.25), 0 2px 6px -2px rgba(0,0,0,0.06)",
        "glow-amber-hover":
          "0 0 0 1px rgba(245, 158, 11, 0.18), 0 18px 40px -8px rgba(245, 158, 11, 0.35), 0 6px 14px -4px rgba(0,0,0,0.08)",
        inner: "inset 0 1px 0 rgba(255,255,255,0.6)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      backgroundImage: {
        "brand-radial":
          "radial-gradient(60% 80% at 50% 0%, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0) 100%)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.9) 100%)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow:
              "0 0 0 1px rgba(22, 163, 74, 0.08), 0 8px 24px -6px rgba(22, 163, 74, 0.15)",
          },
          "50%": {
            boxShadow:
              "0 0 0 1px rgba(22, 163, 74, 0.15), 0 12px 32px -6px rgba(22, 163, 74, 0.3)",
          },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;