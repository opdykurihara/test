# locale_www_cdg用server.jsの使い方（cdg専用）
※ node,npmはあらかじめインストール済みとします。  

## 1) server.jsを所定の場所に配置する。  
/htdocs_locale_cdg/_cdg/直下  
```
locale_www_cdg
      |
      +---htdocs_locale_ssl
      |   |
      |   +---element
      |   |
      |   +---element_sp
      |
      +---htdocs_locale_www
      |   |
      |   +---element
      |   |
      |   +---element_sp
      |
      +---_cdg
          |
          +---server.js <-- ★ここに配置
          |
          +---common
          |
          +---hotel
          |
          +---flights
              |
              +---templates
              |   |
              |   +---index
              |       |
              |       +---index.html
              .
              .
              .
```

## 2) ターミナルを起動して、npmモジュールをグローバルインストールする。 

※すでにインストール済みであれば飛ばしてください。
```
$ npm i -g browser-sync ssi-encode
```
* ローカルにインストールしたい場合
```
$ npm init --yes
$ npm i --save-dev browser-sync ssi-encode
```

## 3) ターミナルでserver.jsを置いた場所に移動してサーバーを立ち上げる。
* 通常サイトの場合
```
$ node server.js
```
* フォームSSLページ確認の場合は[ssl]の引数を付けて起動する  
※htdocs_locale_ssl配下のelementを読み込むようになります。
```
$ node server.js ssl
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

