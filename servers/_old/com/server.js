/*
 .comリポジトリで使うserver.js
 Usage: npm i -g browser-sync ssi-encode
*/
const browserSync = require("browser-sync").create()
const ssiEncode = require("ssi-encode")
const htdocs_locale_www = "D:/development/workspace/locale_www/htdocs_locale_www"

browserSync.init({

  server: {
    baseDir: ["../", "../../"],
    routes: {
      "/element/": htdocs_locale_www + "/element/",
    },
    middleware: [
      ssiEncode({
        baseDir: "../",
        ext: ".html",
        routes:{
          "/_include/": htdocs_locale_www + "/_cdg/"
        }
      })
    ]
  },
  files: ["../**/*.css", "**/*.html","../**/*.js","!**/_dev/*"],
  startPath: "/flights/",
  // https: true,
  open: false,
  // port: 8888,
  // browser: "default",
  // ※Edgeだけうまく起動しないですが一応
  // browser: ["chrome","iexplore", "firefox", "microsoft-edge://"],
  notify: false
})