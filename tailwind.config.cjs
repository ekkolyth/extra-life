/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#5D41DE',
        'black': '#0E0E10',
        'el-dark-blue': '#1D4C6C',
        'el-light-blue': '#47C2E2',
        'purple-bar-1': '#6B4BFF',
        'purple-bar-2': '#5D41DE'
      }
    }
  },
  plugins: [require('daisyui'), require('@tailwindcss/forms')]
}
