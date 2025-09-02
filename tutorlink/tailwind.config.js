/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f8ff",
          100: "#eaf0ff",
          200: "#d6e1ff",
          300: "#b5c8ff",
          400: "#8da8ff",
          500: "#6a88ff",
          600: "#556df2",
          700: "#4456c4",
          800: "#3947a1",
          900: "#313d84",
        },
      },
      boxShadow: {
        soft: "0 8px 24px rgba(16,24,40,.08)",
      },
    },
  },
  plugins: [],
};
