/*
 .com　locale_www_commonリポジトリで使うserver.js
 Usage: npm i -g browser-sync ssi-encode
*/
const browserSync = require("browser-sync").create()
const ssiEncode = require("ssi-encode")

browserSync.init({
  server: {
    baseDir: [__dirname, "../"],
    middleware: [
      ssiEncode({
        baseDir: __dirname,
        ext: ".html"
      })
    ]
  },
  // 監視するファイルと監視しないファイル
  files: ["../**/*.css", "**/*.html", "../**/*.js", "!**/_dev/*"],
  notify: false,
  // 立ち上げ時のバスを指定したい場合
  // startPath: "/flights/",
  // httpsで確認したい場合
  // https: true,
  // 自動でブラウザを立ち上げたくない場合
  // open: false,
  // 指定したポートで立ち上げたい場合
  // port: 8888,
  // ブラウザを指定して立ち上げたい場合 ※Edgeだけうまく起動しない模様
  // browser: ["chrome","iexplore", "firefox", "microsoft-edge://"],
})