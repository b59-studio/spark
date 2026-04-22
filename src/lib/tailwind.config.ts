/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        spark: {
          dark: '#1E1E1E',
          sage: '#5A8A4A',
          light: '#F4F2ED',
          blue: '#53AEB2',
          red: '#D65D5D',
          purple: '#645F9F',
        },
      },
    },
  },
  plugins: [],
}