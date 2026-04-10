/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0066FF", light: "#E6F4FE" },
        background: "#F8FAFC",
        surface: "#FFFFFF",
        foreground: "#1A1A2E",
        muted: "#64748B",
        border: "#E2E8F0",
        error: "#EF4444",
      },
      fontFamily: {
        lx: ["Lexend_400Regular"],
        "lx-light": ["Lexend_300Light"],
        "lx-md": ["Lexend_500Medium"],
        "lx-semi": ["Lexend_600SemiBold"],
        "lx-bold": ["Lexend_700Bold"],
      },
      borderRadius: {
        app: "20px",
      },
    },
  },
  plugins: [],
};
