/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: '#800020',
        gold: '#D4AF37',
        midnight: '#191970',
      },
    },
  },
  plugins: [],
}
