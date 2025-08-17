/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rwandaBlue: '#1c4587',
      rwandaGreen: '#009688',
        green:{
          100:'#23945b',
          200:'#2b8055',
        },
        blue: {
          100: '#6fd0d7',
          200: '#2b21f3',
          dark: '#0e0e3c',

        },
        black:{
          100: '#131315',
        }
      }
    },
  },
  plugins: [],
};