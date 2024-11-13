/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': '#1EA766', 
        'custom-green-dark': '#218955', 
      },
      height: {
        '25': '6.25rem',
      },
      gridTemplateRows: {
        'layout': '64px 1fr 100px',
      }
    },
  },
  plugins: [],
}
