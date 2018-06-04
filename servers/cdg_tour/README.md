# cdg_tour用server.jsの使い方
※ node,npmはあらかじめインストール済みとします。  
※ 特集ページのHTML中に「\<!-- ページ固有のCSSを読み込み --\>」の記述があった場合
ローカル作業用のコードに書き換わるようにしているので、ローカル作業用のコードは削除して作業可能です。

```
<!-- ページ固有のCSSを読み込み -->
　↓書き換わる
<meta name="viewport" content="width=device-width">
<script src="/element/shared/lib/jquery/core/jquery-1.11.3.min.js"></script>
<script src="/element/shared/script/rwd/shared.rwd.min.js" charset="utf-8"></script>
<link rel="stylesheet" href="/element/shared/css/master/master.min.css">
```

## 1) server.jsをcdg_tourリポジトリ直下に配置する。  

```
cdg_tour
   |
   +---server.js <-- ★ここに配置
   |
   +---element
   |
   +---element_sp
   |
   +---[メニュー名]
           .
           .
```

## 2) ターミナルを起動して、npmモジュールをグローバルインストールする。

※すでにインストール済みであれば飛ばしてください。
```
$ npm i -g browser-sync connect-ssi fs path jschardet iconvLite
```
* ローカルにインストールしたい場合
```
$ npm init --yes
$ npm i --save-dev browser-sync connect-ssi fs path jschardet iconvLite
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
