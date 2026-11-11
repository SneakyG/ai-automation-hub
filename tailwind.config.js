/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#070b16',
          900: '#0b1120',
          800: '#111a2e',
          700: '#1a2540',
        },
      },
    },
  },
  plugins: [],
};
