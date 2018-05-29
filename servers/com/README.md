# .com用server.jsの使い方
※ node,npmはあらかじめインストール済みとします。

1) server.jsを_cdg直下に配置する。
.comだと下記のようになります。
```
locale_www_[メニュー名]
      |
      +---htdocs_locale_www
         |
         +---element
         |
         \---_cdg
             +---server.js <-- ★ここに配置
             |
             \---flights
                 |
                 \---templates
                 .
                 .
```

2) ターミナルを起動して、npmモジュールをグローバルインストールする。

※すでにインストール済みであれば飛ばしてください。
```
$ npm i -g browser-sync connectSSI
```
※ローカルにインストールしたい場合
```
$ npm init --yes
$ npm i --save-dev browser-sync connectSSI
```

3) ターミナルでserver.jsを置いた場所に移動してサーバーを立ち上げる。
```
$ node server.js
```
【例】サーバーを立ち上げた後のターミナルの様子。
```
[Browsersync] Access URLs:
 -----------------------------------------------
        Local: http://localhost:3000/
    External: http://192.168.1.34:3000/
 -----------------------------------------------
          UI: http://localhost:3001
 UI External: http://192.168.1.34:3001
 -----------------------------------------------
[Browsersync] Serving files from: ../
[Browsersync] Watching files...
```
上記の場合はhttp://localhost:3000/で確認できる。

css、HTML、jsを修正すると自動でブラウザがリロードされる。

4) サーバーを止めたい場合

起動中のターミナルに移動して「Ctrl + c」する。

