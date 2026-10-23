/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070D18',
          900: '#0B1528',
          850: '#0F1E38',
          800: '#152A4A',
          700: '#1E3B66',
          600: '#2A518B',
        },
        medblue: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#BAE0FF',
          500: '#0284C7',
          600: '#0369A1',
          700: '#075985',
        },
        tealaccent: {
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft-card': '0 4px 20px -2px rgba(11, 21, 40, 0.06), 0 2px 6px -1px rgba(11, 21, 40, 0.04)',
        'elevated': '0 10px 30px -4px rgba(11, 21, 40, 0.12), 0 4px 10px -2px rgba(11, 21, 40, 0.06)',
      },
    },
  },
  plugins: [],
}
