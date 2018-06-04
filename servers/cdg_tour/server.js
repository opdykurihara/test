/*
 cdg_tourリポジトリで使うserver.js
 Usage: npm i -g browser-sync connect-ssi fs path jschardet iconvLite
*/
const browserSync = require("browser-sync").create()
const connectSSI = require("connect-ssi")

const fs = require('fs')
const path = require('path')
const jschardet = require('jschardet')
const iconvLite = require('iconv-lite')

browserSync.init({
  server: {
    baseDir: ".",
    middleware: [
      function (req, res, next) {
        if (/\.html$/.test(req.url) || req.url.slice(-1) === '/') {
          let absPath='';
          if(req.url.slice(-1) === '/'){
            absPath = path.join(__dirname, req.url, 'index.html' );
          }else{
            absPath = path.join(__dirname, req.url);
          }

          let data = fs.readFileSync(absPath);
          // 文字コード判定
          const charset = jschardet.detect(data);

          if(charset.encoding == 'SHIFT-JIS') {
            data = iconvLite.decode(new Buffer.from(data, 'binary'), "Shift_JIS");
            res.setHeader("Content-Type", "text/html; charset=UTF-8");
            res.end(data);
          }else if(charset.encoding == 'EUC-JP') {
            data = iconvLite.decode(new Buffer.from(data, 'binary'), "EUC_JP");
            res.setHeader("Content-Type", "text/html; charset=UTF-8");
            res.end(data);
          } else {
            // shift-jis/EUC_JP以外
            next();
          }
        } else {
          next();
        }
      },
      // connectSSI({
      //   baseDir: __dirname,
      //   ext: ".html"
      // }),
    ]
  },
  // 監視するファイルと監視しないファイル
  files: [ "**/*.css", "**/*.html", "**/*.js", "!**/_private/*", "!**/_dev/*"],
  notify: false,
  // 立ち上げ時のバスを指定したい場合
  // startPath: "/j_special/summer/",
  // httpsで確認したい場合
  // https: true,
  // 自動でブラウザを立ち上げたくない場合
  open: false,
  // 指定したポートで立ち上げたい場合
  // port: 8888,
  // ブラウザを指定して立ち上げたい場合 ※Edgeだけうまく起動しない模様
  // browser: ["chrome","iexplore", "firefox", "microsoft-edge://"],
  // 特集ページの作業をするとき一時的にjsとcssを追加してページ確認するための記述
  rewriteRules: [
    {
      match: /<!--#include virtual="(.+?)" -->/g,
      fn(req, res, match, filename) {

        let includeFilePath = path.join(__dirname, filename)

        if (fs.existsSync(includeFilePath)) {
          let data = fs.readFileSync(includeFilePath);
          // 文字コード判定
          const charset = jschardet.detect(data);

          if(charset.encoding == 'SHIFT-JIS') {
            // shift-jisなら文字コード変換
            data = iconvLite.decode(new Buffer.from(data, 'binary'), "Shift_JIS");
          }else if(charset.encoding == 'EUC-JP') {
            // euc-jpなら文字コード変換
            data = iconvLite.decode(new Buffer.from(data, 'binary'), "EUC_JP");
          }
          return data;
          // return fs.readFileSync(includeFilePath)
        } else {
          return `<span style="color: red">\`${includeFilePath}\` could not be found</span>`
        }

      }
    },

    {
      match: "<!-- ページ固有のCSSを読み込み -->",
      replace: '<meta name="viewport" content="width=device-width">\n<script src="/element/shared/lib/jquery/core/jquery-1.11.3.min.js"></script>\n<script src="/element/shared/script/rwd/shared.rwd.min.js" charset="utf-8"></script>\n<link rel="stylesheet" href="/element/shared/css/master/master.min.css">\n'
    }
  ],
})
