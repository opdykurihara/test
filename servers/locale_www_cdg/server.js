/*
 locale_www_cdgリポジトリで使うserver.js
 Usage: npm i -g browser-sync ssi-encode
 Usage: node server.js
 ※SSL表示確認の場合（htdocs_locale_ssl配下のelementを読み込むようになります）
 Usage: node server.js ssl
*/
const browserSync = require("browser-sync").create();
const ssiEncode = require("ssi-encode");

let css = "../htdocs_locale_www/";

if(process.argv.length > 4) {
  console.log('引数が多すぎです');
  return;
}

if(process.argv.length > 2) {
  if(process.argv[2] !== 'ssl'){
    console.log('引数が誤っています');
    return;
  }else{
    css = "../htdocs_locale_ssl/";
    console.log('SSLページを表示します');
  }
}

browserSync.init({
  server: {
    baseDir: [__dirname, css],
    middleware: [
      ssiEncode({
        baseDir: __dirname,
        ext: ".html"
      })
    ]
  },
  files: ["../**/*.css", "**/*.html","../**/*.js","!**/_dev/*"],
  notify: false,
  // 立ち上げ時のバスを指定したい場合
  startPath: "/flights/templates/index/index_1.html",
  // httpsで確認したい場合
  // https: true,
  // 自動でブラウザを立ち上げたくない場合
  // open: false,
  // 指定したポートで立ち上げたい場合
  // port: 8888,
  // ブラウザを指定して立ち上げたい場合 ※Edgeだけうまく起動しない模様
  // browser: ["chrome","iexplore", "firefox", "microsoft-edge://"],
});