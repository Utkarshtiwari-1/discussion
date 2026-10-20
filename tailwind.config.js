/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f1f2ff',
          100: '#e2e4ff',
          200: '#c8ccff',
          300: '#a8adff',
          400: '#858bed',
          500: '#6d73dd',
          600: '#585fc7',
          700: '#484eaa',
          800: '#3b4188',
          900: '#30366b',
        },
      },
      boxShadow: {
        card: '0 8px 24px -14px rgb(35 40 77 / 0.16), 0 2px 6px rgb(35 40 77 / 0.04)',
        lift: '0 24px 60px -24px rgb(35 40 77 / 0.24)',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'pop-in': {
          from: { opacity: 0, transform: 'translateY(8px) scale(0.98)' },
          to: { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.15s ease-out',
        'pop-in': 'pop-in 0.2s ease-out',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
