/*
 cdg_tourリポジトリで使うserver.js
 Usage: npm i -g browser-sync connect-ssi
*/
const browserSync = require("browser-sync").create()
const fs = require("fs")

browserSync.init({
  server: {
    baseDir: ".",
  },
  // 監視するファイルと監視しないファイル
  files: [ "**/*.css", "**/*.html", "**/*.js", "!**/_private/*", "!**/_dev/*"],
  notify: false,
  // 立ち上げ時のバスを指定したい場合
  // startPath: "/j_special/summer/",
  // httpsで確認したい場合
  // https: true,
  // 自動でブラウザを立ち上げたくない場合
  // open: false,
  // 指定したポートで立ち上げたい場合
  // port: 8888,
  // ブラウザを指定して立ち上げたい場合 ※Edgeだけうまく起動しない模様
  // browser: ["chrome","iexplore", "firefox", "microsoft-edge://"],
  // 特集ページの作業をするとき一時的にjsとcssを追加してページ確認するための記述
  rewriteRules: [
    {
      match: "<!-- ページ固有のCSSを読み込み -->",
      replace: '<meta name="viewport" content="width=device-width">\n<script src="/element/shared/lib/jquery/core/jquery-1.11.3.min.js"></script>\n<script src="/element/shared/script/rwd/shared.rwd.min.js" charset="utf-8"></script>\n<link rel="stylesheet" href="/element/shared/css/master/master.min.css">\n'
    }
  ],
})