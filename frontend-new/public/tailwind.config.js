/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "green-20": "#e0eedb",
        "secondary-500": "#556B2F",
      },
      content: {
        homebackground: "url('./homebackground.png')",
        abstractwaves: "url('./AbstractWaves.png')",
        sparkles: "url('./Sparkles.png')",
        circles: "url('./Circles.png')",
      },

    },
  },
  plugins: [],
}

