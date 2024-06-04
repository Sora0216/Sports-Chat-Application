/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.handlebars',
    './public/**/*.html',
    './public/**/*.js',
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
