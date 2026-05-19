/** @type {import('tailwindcss').Config} */
export default {

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        sidebar: "var(--sidebar)",
        card: "var(--card)",
        surface: "var(--surface)",
        primary: "var(--primary)",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        text: "var(--text)",
        muted: "var(--muted)",
        border: "var(--border)",
        input: "var(--input)",
        hover: "var(--hover)",
      },
      boxShadow: {
        card: "0 4px 20px rgba(15,23,42,0.06)",
        glow: "0 0 20px rgba(59,130,246,0.08)",
      },
    },
  },

  plugins: [],
}

