/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx,css}",
    ],
    theme: {
      extend: {
        colors: {
          'blue-deep': '#1e3a8a',
          'gold': '#ffd700',
          'red-casino': '#dc2626',
          'black-ebano': '#111827'
        }
      },
    },
    plugins: [],
  }