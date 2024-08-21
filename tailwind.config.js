/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'tablet': '775px',

      'laptop': '1075px',

      'phone': '550px',
      'desktop': '1250px',
    },
    extend: {},
  },
  plugins: [],
}