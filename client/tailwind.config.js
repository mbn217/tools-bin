/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          50: '#fafbfd',
          100: '#f1f4f9',
          200: '#e4e8f0',
          300: '#cdd3e0',
          400: '#a3adc4',
          500: '#7a86a1',
          600: '#5e6882',
          700: '#464e65',
          800: '#2f354a',
          900: '#1c2033',
          950: '#0f1119',
        },
        accent: {
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
    },
  },
  plugins: [],
};
