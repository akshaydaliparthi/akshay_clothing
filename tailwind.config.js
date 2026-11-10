/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        akshay: {
          charcoal: '#36454F',
          silver: '#C9CED6',
          signalRed: '#E63946',
          jetBlack: '#0A0A0B',
          amethyst: '#6B3FA0',
          electricCyan: '#00E5FF',
        },
      },
    },
  },
  plugins: [],
};
