# postcss-preset-envで次世代CSSを利用する

※2019.10.10:postcss-cssnextは非推奨となりpostcss-preset-envを利用する方法に変更しました。
[postcss-cssnextについてはこちらに移動しました。](cssnext/README.md)

## [postcss-preset-env](https://preset-env.cssdb.org/)とは
次世代のCSSシンタックスを今のブラウザでも解釈できるようにトランスパイルするpostcssプラグイン。
 * 次世代CSSシンタックスを先取りしつつ現行バージョンのCSSを生成できる。
 * 次世代CSSシンタックスを利用しなくてもしてトランスパイル可能。  
 
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

## チーム内でSassを全メニューで利用することを断念した経緯
* Sassを利用するとフォーマットを自動で整形し、前回のCSSの差分が分からなくなった
* Sassファイルがある事に気づかず、element配下のCSSを修正して最新ファイルがどちらか分からなくなった

## postcss-preset-envを利用することの利点
* フォーマットの整形を利用しなければ既存のCSSのフォーマットに影響を与えずAutoprefixerやネスト機能を利用できる。
* 変数など次世代CSSシンタックスを利用して効率的にCSSを書くことができる。

## postcss-preset-envの弱点
* Sassの代用として利用するためには複数のモジュールのインストールが必要となり、独自シンタックスのcssになってしまう。
→ Sassの代用としたいのであれば素直にsassを使った方が良いと思う

## 利用方法

### 1) 必要なモジュールをインストールする
* 基本のモジュールpostcss、postcss-cli、postcss-preset-env  
`npm i --save-dev postcss postcss-cli postcss-preset-env`

* ネストを利用したときに生成されてしまう空スタイルを削除するモジュール  
`npm i --save-dev postcss-discard-empty`

* 外部cssをimportするためのモジュール  
`npm i --save-dev postcss-import`

* cssを整形するためのモジュール  
`npm i --save-dev stylelint`  
[stylelintの設定についてはこちらを参照](https://stylelint.io/user-guide/configuration)

### package.jsonに設定を追加
```
{
  ...略...

  "browserslist": [
    "android >= 4.2"  <-- ブラウザリストを記述
  ],
  "postcss": {   <-- postcssの設定を記述
    "map": false,
    "plugins": {
      "postcss-import": {},
      "postcss-preset-env": {
        "stage": 0,
        "preserve": false,
        "autoprefixer":{
          "grid": true
        }
      },
      "stylelint": {"fix":true},
      "postcss-discard-empty": {}
    }
  },
  "stylelint": {  <-- スタイル整形の設定を記述
    "rules": {
      "string-quotes": "double",
      "indentation": 0,
      "number-leading-zero": "never",
      "number-no-trailing-zeros": true,
      "declaration-colon-space-after": "never",
      "declaration-empty-line-before": "never",
      "block-opening-brace-space-before": "never",
      "rule-empty-line-before": "never",
      "color-hex-case": "lower",
      "comment-empty-line-before":["always",{
        "except":"first-nested",
        "ignore":"after-comment"
      }],
      "block-no-empty":true
    }
  }
}
```

## postcssファイルをcssに変換するには
`postcss ./css/input/master.css -d ./css/output/ -w --poll true`
* -d で出力するディレクトリを指定
* -w ファイルの変更を監視する
* --poll ファイルの変更をうまく監視できないときがあるのでポーリングはtureにしておく
* --config コンフィグファイルの場所

上記のようにコマンドを毎回打つのは面倒なので、package.jsonのscriptに設定して利用すると便利。
```
{
  ...略...

  "scripts": {
    "master": "postcss ./css/input/master.css -d ./css/output/ -w --poll true"
  }
}
```
`npm run master`

## sassぽく利用する
＄変数、@mixin、@extend、@if、@at-root、@content、inlineコメント(//)を利用できるようにモジュールを追加する。
* postcss-simple-vars
* postcss-mixins
* postcss-extend
* postcss-conditionals
* postcss-atroot
* postcss-strip-inline-comments 

`npm i --save-dev postcss-simple-vars postcss-mixins postcss-extend postcss-conditionals postcss-atroot postcss-strip-inline-comments`

package.jsonのpostcss項目にも追加する。
```
{
  ...略...

  "postcss": {
    "map": false,
    "parser": "postcss-scss",  <-- ※
    "plugins": {
      "postcss-import":{}, 
      "postcss-mixins":{},  <-- ※
      "postcss-extend":{},  <-- ※
      "postcss-simple-vars":{},  <-- ※
      "postcss-atroot":{},  <-- ※
      "postcss-conditionals":{},  <-- ※
      "postcss-preset-env": {
        "stage": 0,
        "preserve": false,
        "autoprefixer":{
          "grid": true
        }
      },
      "postcss-strip-inline-comments":{},  <-- ※
      "postcss-discard-empty": {},
      "stylelint": {"fix":true}
    }
  }
}
```

sassのシンタックスとは微妙に異なるので注意する。  

[例1] 
```
@define-mixin clearfix{ <-- mixinを定義
  &:after{
    content: '';
    display: table;
    clear: both;
  }
}

/* clearfix */
%clearfix{
 @mixin clearfix;　<-- mixinを利用
}

.sample{
  @extend %clearfix;
}
```
[例2] 
```
$lyt-cont:960px;
$bp-full:$bp-pc;

@define-mixin breakpoint $point{  <-- mixinを定義
  @if $point == full{
    @media screen and (max-width:calc($bp-full + 40px)){
      @mixin-content; <-- @content
    }
  }
}

.sample{
  font-size:16px;
  // ====Media Queries====
  @mixin breakpoint tab{
    font-size:13px;
  }
  // ====Media Queries====
}
```
[例3]
```
@if $base-modules{ <-- @if
  .link-blank{
    width: 12px;
    vertical-align: -.04em;

    @at-root{ <-- @at-root
      [class^="btn"]{
        & .link-blank{
          width: 17px;
          vertical-align: -.11em;
        }
      }
    }
  }
}
```

とりあえず使ってみたいという方はsampleでどうぞ。
* [sample](https://github.com/opdykurihara/labs/tree/master/postcss/env/sample/)