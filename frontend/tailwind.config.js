/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        night: {
          900: "#0b0f1a",
          800: "#121826",
          700: "#1b2233"
        }
      }
    }
  },
  plugins: []
};
