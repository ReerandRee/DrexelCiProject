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
        "gray-20": "#e0eedb",
        "gray-50": "#D3D3D3",
        "gray-100": "#C0C0C0",
        "gray-500": "#808080",
        "primary-100": "#20B2AA",
        "primary-300": "#008B8B",
        "primary-500": "#008080",
        "secondary-400": "#808000",
        "secondary-500": "#556B2F",
        "white":"white"
      },
      backgroundImage: (theme) => ({
        "gradient-yellowred":
          "linear-gradient(90deg, #F5FFFA 0%, #F0FFFF 100%)",
        
      }),
      fontFamily: {
        dmsans: ["DM Sans", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      content: {
        
      },
    },
    screens: {
      xs: "480px",
      sm: "768px",
      md: "1060px",
    },
  },
  plugins: [],
}

