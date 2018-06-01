# .com用server.jsの使い方
※ node,npmはあらかじめインストール済みとします。  
※ locale_www_commonリポジトリの場合は[/common/server.js](https://github.com/opdykurihara/labs/tree/master/servers/com/common/)を利用してください。  

## 1) server.jsを所定の場所に配置する。  

### locale_www_commonリポジトリ以外の場合  
[リポジトリ名]/htdocs_locale_www/_cdg/[メニュー名]/直下  
例）locale_www_flightsの場合、下記のようになります。
```
locale_www_flights
      |
      +---htdocs_locale_www
         |
         +---element
         |
         \---_cdg
             |
             \---flights
                 |
                 +---server.js <-- ★ここに配置
                 |
                 \---templates
                 .
                 .
```

### locale_www_commonリポジトリの場合  
※common用server.jsを利用してください。  
locale_www_common/htdocs_locale_www/_cdg/直下
```
locale_www_common
      |
      +---htdocs_locale_www
         |
         +---element
         |
         \---_cdg
             |
             +---server.js <-- ★ここに配置
             |
             \---flights
                 |
                 \---templates
                 .
                 .
```


## 2) ターミナルを起動して、npmモジュールをグローバルインストールする。 

※すでにインストール済みであれば飛ばしてください。
```
$ npm i -g browser-sync connect-ssi path fs
```
* ローカルにインストールしたい場合
```
$ npm init --yes
$ npm i --save-dev browser-sync connect-ssi path fs
```

## 3) ターミナルでserver.jsを置いた場所に移動してサーバーを立ち上げる。
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
上記の場合は http://localhost:3000/ で確認できます。  
css、HTML、jsを修正すると自動でブラウザがリロードされます。

## 4) サーバーを止めたい場合  
起動中のターミナルに移動して「Ctrl + c」してください。

