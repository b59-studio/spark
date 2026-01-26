/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'b59': {
          dark: '#2C3439',
          gray: '#4A5568',
          light: '#FFFFFF',
          blue: '#0066FF',
          red: '#C14C3C',
          alert: '#FF6B35',
        },
      },
    },
  },
  plugins: [],
}