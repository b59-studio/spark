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
          dark: '#1A1130',
          /* Rust — secondary accent */
          sage: '#C8856A',
          /* Sky blue — links & cool accents */
          blue: '#6A9BAD',
          red: '#E88F5A',
          purple: '#4B3272',
          background: '#EDD9B0',
        },
      },
    },
  },
  plugins: [],
}