const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Heavitas Regular', ...defaultTheme.fontFamily.sans]
      },
      fontSize: {
        '10xl': '16rem'
      },
      colors: {
        'primary': '#5D41DE',
        'black': '#0E0E10',
        'el-dark-blue': '#1D4C6C',
        'el-light-blue': '#47C2E2',
        'purple-bar-1': '#6B4BFF',
        'purple-bar-2': '#5D41DE'
      },
      backgroundImage: {
        'grid-pattern': "url('/assets/img/grid-pattern.png')",
        'purple-overlay': "url('/assets/img/purple-overlay.png')"
      }
    }
  },
  plugins: [require('daisyui'), require('@tailwindcss/forms')]
}
