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
      require('postcss-cssnext')({
        // gridを利用しない場合はこちらのbrowsers設定でAutoprefixerを利用できる
        // その場合、Autopprefixerのインストールは不要
        // browsers: [
        //   'last 2 versions',
        //   'ie >= 11',
        //   'android >= 4.2'
        // ]
        // ワーニング出力をやめる
        warnForDuplicates:false
      }),
      // grid使う場合はAutoprifixer単体の設定でgrid:trueとする必要がある
      require('autoprefixer')({
        browsers: [
          'last 2 versions',
          'ie >= 11',
          'android >= 4.2'
        ],
        grid:true
      }),
      // @import,@extendを利用したい場合
      require('precss')(),
      // 生成するCSSのフォーマットを整形したい場合
      require('stylefmt')(),
      // ネストを利用したときに生成されてしまう空スタイルを削除したい場合
      require('postcss-discard-empty')({})
  ]
};
