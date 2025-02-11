/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'sonsie-one': ['"Sonsie One"', 'serif'], // Add Sonsie One font
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.sonsie-one-regular': {
          fontFamily: '"Sonsie One", serif', // Apply Sonsie One font
          fontWeight: '400', // Regular weight
          fontStyle: 'normal', // Normal style
        },
      });
    },
  ],
}