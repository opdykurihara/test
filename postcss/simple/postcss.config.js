module.exports = {
  map: false,
  plugins: [
      require('postcss-cssnext')({
        // gridを利用しない場合はこちらのbrowsers設定でAutoprefixerを利用できる
        // その場合、Autopprefixerのインストールは不要
        // browsers: [
        //   'ie >= 11',
        //   'android >= 4.2'
        // ]
        // ワーニング出力をやめる
        warnForDuplicates:false
      }),
      // grid使う場合はAutoprifixer単体の設定でgrid:trueとする必要がある
      require("autoprefixer")({
        browsers: [
          'last 2 versions',
          'ie >= 11',
          'android >= 4.2'
        ],
        grid:true
      }),
      // 生成するCSSのフォーマットを整形したい場合
      // require('stylefmt')(),
      // ネストを利用したときに生成されてしまう空スタイルを削除したい場合
      require('postcss-discard-empty')({})
  ]
};
