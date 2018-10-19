/*
 www_cdgリポジトリで使うserver.js
 Usage: npm i -g browser-sync ssi-encode
 Usage: node server.js
*/
const browserSync = require("browser-sync").create();
const ssiEncode = require("ssi-encode");
const htdocs_www = "D:/development/workspace/www/"

let css = "../htdocs_www/";
browserSync.init({
  server: {
    baseDir: [__dirname, css],
    middleware: [
      ssiEncode({
        baseDir: __dirname,
        ext: ".html",
        routes:{
          "/_include/": htdocs_www + "/_cdg/"
        }
      })
    ]
  },
  files: ["../**/*.css", "**/*.html","../**/*.js","!**/_dev/*"],
  notify: false,
  // 立ち上げ時のバスを指定したい場合
  // startPath: "/j_optional/templates/index/index.html",
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
    },
    {
      match: /<\?php echo \$FW_ENV\[\'url\'\]\[\'WWW\'\]; \?>/g,
      replace: "https://www.tour.ne.jp/"
    },
    {
      match: /<\?php echo \$FW_ENV\[\'site\'\]\[\'NAME\'\]; \?>/g,
      replace: "トラベルコ"
    },
  ],
});