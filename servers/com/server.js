/*
 .com　メニューリポジトリで使うserver.js
 Usage: npm i -g browser-sync connect-ssi path fs
*/
const browserSync = require("browser-sync").create()
const connectSSI = require("connect-ssi")
const path = require("path")
const fs = require("fs")
const htdocs_locale_www = "D:/development/workspace/locale_www/htdocs_locale_www"

browserSync.init({
  server: {
    baseDir: ['../','../../'],
    routes: {
      "/element/": htdocs_locale_www + "/element/",
    }
  },
  // 監視するファイルと監視しないファイル
  files: ["../../**/*.css", "**/*.html","../../**/*.js","!**/_dev/*"],
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
  rewriteRules: [
    {
      match: /<!--#include virtual="(.+?)" -->/g,
      fn(req, res, match, filename) {

        let includeFilePath = path.join(__dirname, '../'+filename)

        if(filename.match(/^\/(.*?)\//)[0] === "/_include/"){
          includeFilePath = path.join(htdocs_locale_www + "/_cdg/", filename)
        }

        if (fs.existsSync(includeFilePath)) {
            return fs.readFileSync(includeFilePath)
        } else {
            return `<span style="color: red">\`${includeFilePath}\` could not be found</span>`
        }

      }
    }
  ],

})