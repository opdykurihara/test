module.exports = {
  map: false,
  plugins: [
      require('postcss-cssnext')({
        // browsers: [
        //   'ie >= 11',
        //   'android >= 4.2'
        // ]
        warnForDuplicates:false
      }),
      require("autoprefixer")({
        browsers: [
          'ie >= 11',
          'android >= 4.2'
        ],
        grid:true
      }),
      require('stylefmt')(),
      require('postcss-discard-empty')({})
  ]
};
