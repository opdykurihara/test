# 特集外部確認用HTML生成ツール

## 何のツール？
特集外部確認用HTMLを生成してくれるツールです。
JavaScriptで出来ています。

## 簡単な仕様
特集のHTMLをajaxで読み込み、
外部確認用に加工して出力します。

## 使い方
* 表示したいページのindex.htmlファイルの名前を適当に変更する。
例）index.html → index-a.html
* /build/_modules/special/template/index.htmlをコピーして表示したいディレクトリに配置する。
* 表示したいページのパスを入力する。
例)先ほどindex-a.htmlとした場合はindex-a.htmlとなる
```
const URL = '/w_special/hawaii/index-a.html';
```

## スクリプトを修正したい場合
Webpack4を利用してJavaScriptをbuildしています。

* モジュールセットをインストール
```
$ npm i
```

* webpackのwatchとlite-serverを立ち上げる
```
$ npm run start
```

* /src/main.jsを修正すると/build/_modules/special/script/bundle.jsに生成される。
