# postcss-cssnextのお誘い

* [cssnext](http://cssnext.io/)とは
次世代のCSSシンタックスを今のブラウザでも解釈できるようにトランスパイルするpostcssプラグイン。
次世代のCSSシンタックスを先取りしつつ現行バージョンのCSSを生成できる。
当然、次世代CSSシンタックスを利用しなくてもしてトランスパイル可能。
　* [cssnextで利用可能なシンタックス](http://cssnext.io/features/)
例）
```
:root {
  --mainColor: #f00;
  --fontSize: 1rem;
}
.sample{
  padding:10px;
  font-size: calc(var(--fontSize) * 2);
  & a{
    color: var(--mainColor);
  }
}
```
　↓トランスパイル
```
.sample{
  padding:10px
  font-size: 2rem;
}
.sample a {
  color: #f00;
}
```



* [postcss](https://github.com/postcss/postcss)とは
node.js製のCSSツールを作るためのフレームワーク。

## sassの代用としたいのであれば素直にsassを使った方がいいよ
sassの代用として利用するためには複数のモジュールのインストールが必要となり、
独自シンタックスcssになってしまうため、次世代CSSのシンタックスを先取りしつつ現行バージョンのCSSを生成するという概念から外れてしまう傾向にあります。
sassの代用としたいのであれば素直にsassを利用した方が良いと思います。

## カジュアルに使うときの設定
既存のCSSを修正する場合
* 既存のCSSのフォーマットに影響を与えずにautoprefixerの機能だけ利用したい
* sassのようなnestを利用したい
* 変数など次世代CSSシンタックスを利用して効率的にCSSを書きたい

### 1) 必要なモジュールをインストールする
* 基本のモジュールpostcss、postcss-cli、postcss-cssnext
```
npm i --save postcss postcss-cli postcss-cssnext
```
* cssnextでネストを利用したときに生成されてしまう空スタイルを削除するモジュール
```
npm i --save postcss-discard-empty
```

### 2) postcss.config.jsを作る
postcss-cssnextモジュールにはautoprefixerが内包されているため、
autoprefixer単体のインストールは不要ですが、
gridのautoprefixerを利用したい場合はautoprefixer単体もインストールする必要があります。
※postcss-cssnextに内包されているautoprefixerが古いため

#### gridのautoprefixerを利用しない場合のpostcss.config.js例

```
module.exports = {
  map: false,
  plugins: [
      require('postcss-cssnext')({
        browsers: [
          'ie >= 11',
          'android >= 4.2'
        ]
        warnForDuplicates:false
      }),
      require('postcss-discard-empty')({})
  ]
};
```

#### gridのautoprefixerを利用する場合のpostcss.config.js例
```
npm i --save autoprefixer
```

```
module.exports = {
  map: false,
  plugins: [
      require('postcss-cssnext')({
        warnForDuplicates:false
      }),
      require("autoprefixer")({
        browsers: [
          'ie >= 11',
          'android >= 4.2'
        ],
        grid:true　// <-- ★grid:trueにすることでgridのautoprefixerが利用可能
      }),
      require('postcss-discard-empty')({})
  ]
};
```

#### スタイル整形を加えたい場合のpostcss.config.js例
※既存CSSのフォーマットも含めて整形するので、既存CSSのフォーマットに影響を及ぼしたくない場合は利用しない。
```
npm i --save stylefmt
```
整形したいスタイルフォーマットの設定ファイル（.stylelintrc）を用意して、postcss.config.jsと同じ場所に置く。
* [stylelintrcの設定について](https://stylelint.io/user-guide/configuration/)

```
module.exports = {
  map: false,
  plugins: [
      require('postcss-cssnext')({
        browsers: [
          'ie >= 11',
          'android >= 4.2'
        ]
        warnForDuplicates:false
      }),
      require('stylefmt')(),　// <-- ★追加
      require('postcss-discard-empty')({})
  ]
};
```

## postcssファイルをcssに変換するには
コマンドを打ってもいいし、npm scriptに設定して利用する。

* -d で出力するディレクトリを指定
* -w ファイルの変更を監視する
* --poll ファイルの変更をうまく監視できないときがあるのでポーリングはtureにしておく
* --config コンフィグファイルの場所
```
postcss ./css/input/master.css -d ./css/output/ -w --poll true --config ./postcss.config.j
```


## sassっぽく使いたい場合の設定

### onelineコメントを利用したい場合
※「// コメント」を記述可能だが、「/* コメント */」と出力されるのでsassのように出力されないコメントとして利用はできない。
```
npm i --save postcss-scss
```
```
module.exports = {
  parser: 'postcss-scss',
  plugins: [
    ...
  ]
  ... 
}
```

### mixinを利用したい場合
```
npm i --save postcss-mixins
```
```
module.exports = {
  plugins: [
    require('postcss-mixins')({
      // mixinファイルをファイル名で指定する場合
      // mixinsFiles: path.join(__dirname, 'css/input/mixins/mixin'),
      // mixinファイルをディレクトリで指定する場合
      mixinsDir: path.join(__dirname, 'css/input/mixins')
    })
  ]
}
```
* mixinの記法
```
@define-mixin clearfix{
  &:before,
  &:after {
    content:"";
    display:table;
  }
  &:after {
    clear:both;
  }
}
```

### @import,@extendを利用したい場合
```
npm i --save precss
```
```
module.exports = {
  plugins: [
    require('precss')()
  ]
}
```
```
/* inportは拡張子までを指定する */
@import 'includes/include.css';
%clearfix{
  @mixin clearfix;
}
.search {
  display: grid;
  @extend %clearfix;
}
```

