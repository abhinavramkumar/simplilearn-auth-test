const autoprefixer = require('autoprefixer');
const tailwind = require('tailwindcss');

const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./public/**/*.html', './build/**/*.html', './src/**/*.js'],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
  plugins: [
    tailwind('./tailwind.config.js'),
    autoprefixer,
  ],
};
