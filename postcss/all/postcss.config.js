const path = require('path');
module.exports = {
  map: false,
  // onelineコメント利用する場合
  parser: 'postcss-scss',
  plugins: [
      require('postcss-mixins')({
        // mixinファイルをファイル名で指定する場合
        // mixinsFiles: path.join(__dirname, 'css/input/mixins/mixin'),
        // mixinファイルをディレクトリで指定する場合
        mixinsDir: path.join(__dirname, 'css/input/mixins')
      }),
      // gridを利用しない場合
      require('postcss-cssnext')({
        // browsers: [
        //   'ie >= 11',
        //   'android >= 4.2'
        // ]
        // ワーニング出力をやめる
        warnForDuplicates:false
      }),
      // grid使う場合
      require("autoprefixer")({
        browsers: [
          'last 2 versions'
        ],
        grid:true
      }),
      require('precss')(),
      require('stylefmt')(),
      require('postcss-discard-empty')({})
  ]
};
