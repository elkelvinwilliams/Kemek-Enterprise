/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        navy:  '#0A1A30',
        deep:  '#061122',
        ink:   '#0C1F38',
        gold:  '#C8A24B',
        cream: '#F8F6F1',
        stone: '#ECE9E2',
        slate: '#5E6B7A',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['Jost', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
