module.exports = {
  plugins: [
    require('postcss-mixins'),
    require('postcss-import')(),
    require('postcss-nesting'),
    require('autoprefixer'),
    require('postcss-preset-env'),
  ],
}; 