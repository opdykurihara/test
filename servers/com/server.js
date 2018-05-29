// Usage: npm i -g browser-sync connectSSI
const browserSync = require("browser-sync").create()
const connectSSI = require("connect-ssi")

browserSync.init({
  server: {
    baseDir: [__dirname, "../"],
    routes: {
      "/element/":  "D:/development/workspace/locale_www/htdocs_locale_www/element/",
    },
    middleware: [
      connectSSI({
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