/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0C10',
        primary: '#00E5FF',
        secondary: '#FF007A',
        accent: '#7000FF',
        glass: {
          DEFAULT: 'rgba(25, 28, 38, 0.7)',
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      backdropBlur: {
        'glass': '12px',
      }
    },
  },
  plugins: [],
}
