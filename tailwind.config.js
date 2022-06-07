module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: '#1a1a1a',
          900: '#000000'
        },
        green: {
          50: '#2afd6c',
          100: '#31fe6d',
          200: '#28a745',
          300: '#1a2d14',
        },
        blue: {
          DEFAULT: '#007bff',
          700: 'rgb(29 78 216)',
        },
        red: {
          DEFAULT: '#dc3545',
          700: 'rgb(153 27 27)',
        }
      },
      borderRadius: {
        DEFAULT: '0.75rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
