export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {

      /* FONT SYSTEM */
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },

      /* COLOR SYSTEM (SAAS-GRADE DESIGN SYSTEM) */
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },

        /* BASE UI COLORS */
        background: "#0f172a",
        surface: "#111827",
      },

      /* SHADOW SYSTEM */
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
        glow: "0 0 20px rgba(59,130,246,0.35)",
      },

      /* BORDER RADIUS */
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
      },

      /* ANIMATION SYSTEM */
      animation: {
        fadeIn: "fadeIn 0.2s ease-in-out",
        slideUp: "slideUp 0.3s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },

      /* TRANSITIONS (SAAS FEEL) */
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      /* SPACING SCALE */
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
      },

      /* SCALE EFFECTS (HOVER UI POLISH) */
      scale: {
        102: "1.02",
      },

      /* BACKDROP BLUR (GLASS UI READY) */
      backdropBlur: {
        xs: "2px",
        sm: "4px",
      },
    },
  },

  plugins: [],
};