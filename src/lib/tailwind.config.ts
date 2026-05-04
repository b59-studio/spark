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
          bg: '#14081E',
          bone: '#F4DCB6',
          purple: '#2F0951',
          red: '#D93802',
          gold: '#EDC973',
        },
      },
    },
  },
  plugins: [],
}