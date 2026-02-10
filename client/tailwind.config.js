/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FACC15', // yellow-400
          dark: '#EAB308',    // yellow-500
          light: '#FEF08A',   // yellow-200
        },
        secondary: {
          DEFAULT: '#1F2937', // gray-800
          dark: '#111827',    // gray-900
          light: '#374151',   // gray-700
        }
      }
    },
  },
  plugins: [],
}
