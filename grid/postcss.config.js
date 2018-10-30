module.exports = {
  map: false,
  plugins: [
    require('postcss-import')(),
    require('postcss-cssnext')({
      // browsers: [
      //   'last 2 versions',
      //   'ie >= 10'
      // ],
      // grid:true
    }),
    require("autoprefixer")({
      browsers: [
        'ie >= 11',
        'android >= 4.2'
      ],
      grid:true
    }),
    require('stylefmt')(),
    require('postcss-discard-empty')({}),
  ]
};
