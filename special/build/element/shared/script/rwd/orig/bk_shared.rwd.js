'use strict';
/**
 * @fileOverview 特集ページ共通JS
 * @version 1.0.5
 * @since 2015/06/19
 * @copyright OpenDoor Inc. http://www.opendoor.co.jp/
 * @license MIT License http://www.opensource.org/licenses/mit-license.php
 */

/**
 * デバッグログ出力の停止
 * (IE系ではconsole系メソッドが用意されていないのでエラーになる。
 *  万が一入っていても問題ないように動作させるため、空メソッドを作って回避)
 **/
if (!('console' in window)) { window.console = {}; window.console.log = function(arg) {}; }

$.special = $.special || {};

$(function() {
  // html要素のclass="static"の削除
  $.special.initRwd();

  // 共通
  $.special.common();

  // メニュー一覧クリック処理
  $.special.toggleMenu();

  // 汎用トグルモジュール
  $.special.collapse();

  // random Ad
  // max: 表示するバナーの数（空にすると全部を表示）
  // split:表示するバナーを分割する数（split[1,2]=バナーを上1つ、下2つ表示する）
  // active:表示するバナーに付けるクラス名（空にするとクラスを付与しない）
  $.special.randomAd();

 //コンテンツ内PC6枠
 $('ul.cmn-bnr-ad-list-02').randomAd();

  // ランダムコンテンツ
  $.special.randomContents();

  // スムーススクロール
  $.special.smoothScroll();

  // ロールオーバー
  $.special.rollover();

  // タブ
  $.special.tabs();

  // slider
  $.special.slideShow();

  // テキストトグル
  $.special.toggleText();

  // トピックパス
  $.topicPathControll.initialize();

  // 固定トップへ戻るボタン
  $.fixedMoveToTop();

  // 問合せフォーム
  $.special.opinionForm();

  $.headerButtons();

  // マップアプリ誘導
  if (typeof $.cookie !== 'undefined') {
    $.special.mapAppInduct();
  }

  // ie8対応_start
  var _userAgent = window.navigator.userAgent.toLowerCase();
  var _appVersion = window.navigator.appVersion.toLowerCase();
  if (_userAgent.indexOf("msie") != -1) {
    if (_appVersion.indexOf("msie 8.") != -1) {
      // カラムレイアウトのIE8調整
      $.special.adjustIE8();
      // IE8グロナビ吹き出し透明箇所でマウスイベントが外れてしまうためのbugfix
      var dp = $('.dropdown-item');
      if(dp.length){
        dp.css('background','url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)');
      }
    }
  }
  // ie8対応_end

  /* バナースライドを実装 */
  $('.cmn-bnr-ad-carousel').slideShow({
      slideType:'AD-A',
      slideRandom:true,
      displayCnt:3,
      slideWrap:'.cmn-bnr-ad-carousel-item',
      naviList:'.cmn-bnr-ad-carousel-nav',
      interval:5000,
      autoplay: false
  });
  //コンテンツ外2枠(スカイスクレイパー)
  $('ul.cmn-bnr-ad-list').randomAd({max:2});

  //SP 最大3個、上1個、下2個表示
  $('ul.cmn-bnr-ad-list-01').randomAd({
    version:'v02',
    appendClass:'.cmn-bnr-ad-carousel',
    split: [1,6]
  });

});// end ready

/**
 * html.staticの削除
 */
$.special.initRwd = function(){
  var _target = document.getElementsByTagName('html')[0];
  var _hasClass = function(el,cls) {
    return el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
  };
  var _removeClass = function(el,cls) {
    if (_hasClass(el,cls)) {
        var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
      el.className=el.className.replace(reg,' ');
    }
  };
  if(_hasClass(_target, 'static')){
    _removeClass(_target, 'static');
  }
};

/*************************
 * 共通関数定義
 *************************/
$.special.common = function(){

  /**
   * addClass/removeClassされたらにaddClassChange/removeClassChangeイベント発火
   */
  $.each(['addClass', 'removeClass'], function(i, methodname){
    var oldmethod = $.fn[ methodname ];
    $.fn[ methodname ] = function(){
      oldmethod.apply(this, arguments);
      // classChangeイベントを発火させる
      this.trigger('classChange');
      return this;
    };
  });

  /**
   * SessionStorage
   */
  this.session = this.session || {};
  this.session = {
    storage: typeof sessionStorage === 'undefined' ? false : sessionStorage,

    STATUS: {
      url: location.href,
      tab: {},
      collapse: {}
    },

    // sessionStorageをセット
    setSessionStorage: function(key) {

      if(!this.storage) return false;
      if (key) {
        try{
          this.storage.setItem(key, JSON.stringify(this.STATUS));
        }catch(err){
          return false;
        }
      }
    },

    // sessionStorageを取得
    getSessionStorage: function(key) {
      if(!this.storage) return false;
      for (var i=0; i < this.storage.length; i++){
        if(this.storage.key(i) === key){
          this.STATUS = JSON.parse(this.storage.getItem(key));
          return this.STATUS;
        }
      }
      return false;
    },

    // sessionStorageを削除
    removeStorage: function(key){
      if(!this.storage) return false;
      this.storage.removeItem(key);
    },

    // sessionStorageからすべて削除
    removeallStorage: function(){
      if(!this.storage) return false;
      this.storage.clear();
    }

  };
};

/**
 * slideShow - jQuery Plug-in -
 @usage:
  $('.cmn-carousel').slideShow({
    autoplay: true,
    interval: 5000
  });
 */
$.special.slideShow = function(){

  $.fn.slideShow = function( settings ) {
    return this.each(function() {
        new $.slideShow( this, settings );
      });
    };
    $.slideShow = function( obj, settings ){
      this.settings = {
        slideType: 'none',
        slideRandom:false,
        displayCnt:1,
        swipe: false,
        autoplay: true,
        interval: 5000,
        active:'active',
        slideWrap: '.cmn-carousel-item-inner',
        naviList:'.cmn-carousel-nav',
        locationList:'.cmn-carousel-location'
      };
      $.extend(this.settings, settings || {} );

      this._obj = $(obj);

      // スライドのタイプ
      this._slideType = this.settings.slideType;

      // スライドを表示させる数
      this._displayCnt = this.settings.displayCnt;

      // スライドを表示させる数
      this._slideRandom = this.settings.slideRandom;

      // スワイプさせるかどうか
      this._swipe = this.settings.swipe;

      // 自動ループ有り無し
      this._autoplay = this.settings.autoplay;

      // 自動ループの場合の間隔（ms）
      this._interval = this.settings.interval;

      // スライドオブジェクトクラスキャッシュ
      this._slide = this.settings.slideWrap;

      // 移動させるオブジェクト
      this._slideWrap = $(this._slide, this._obj).find('ul');

      // スライドオブジェクト
      this._slideList = this._slideWrap.find('li');

      // スライドの数を取得
      this._slideCnt = this._slideList.length;

      // NEXT/PREVナビオブジェクト
      this._navi = $(this.settings.naviList, this._obj);
      this._naviList = this._navi.find('li');

      // ロケーションナビオブジェクト
      this._location = $(this.settings.locationList, this._obj);
      this._locationList = this._location.find('li');

      // アクティブオブジェクトに付与されるクラス
      this._act = this.settings.active;

      // タイマーIDの初期化
      this._timerID = null;

      // 移動中フラグの初期化
      this._moveFlg = false;

      // リサイズ中タイマーの初期化
      this._resizeTimer = false;

      // スライドにマウスが乗っていないかどうかを判定
      this._mouseLeaveFlg = true;

      // アクティブスライドオブジェクト格納用
      this._activeSlide = null;

      // アクティブスライドのindex値格納用
      this._activeSlideIdx = 0;

      // 次のスライドのindex値格納用
      this._targetSlideIdx = 0;

      // 移動する前のmarginLeft値格納用
      this._slideMargin = 0;

      // スライドオブジェクトのmargin格納用
      this._width = 0;

      // 前のスライドとの距離格納用
      this._dist = 1;

      // タッチイベントの有無
      this._supportTouch = 'ontouchend' in document;

      this.init();
   };

  $.slideShow.fn =  $.slideShow.prototype;
  $.slideShow.fn.extend =  $.slideShow.extend = $.extend;

  $.slideShow.fn.extend({
    // 初期化
    init: function() {
      var that = this;

      // スライドの幅を取得
      this.adjustSize.call(this);

      // スライドをrandomにする場合
      if(this._slideRandom){
        // ランダムソート
        this._slideList.sort(function() {
          return Math.random() - Math.random();
        });
        this._slideWrap.empty();
        this._slideWrap.append(that._slideList);
      }

      // ロケーションナビの先頭にactiveクラスを設置
      this._locationList.eq(this._activeSlideIdx).addClass(that._act);

      if(that._slideType === 'none'){
        // defaulバナーの場合
        this._slideWrap.css('width',((this._slideCnt + 2) * 100) +'%');

        // ウィンドウリサイズ毎に、要素の横幅を再取得
        $(window).on('resize', function(){
          that.adjustSize.call(that);
          if(that._resizeTimer !== false){
            // タイマーを止める
            if(that._timerID) clearTimeout(that._timerID);
            // スライドにオンマウスしていることとする
            that._mouseLeaveFlg = false;
            clearTimeout(that._resizeTimer);
          }
          that._resizeTimer = setTimeout(function(){
            // オートプレイの場合はオートプレイを再開
            if(that._slideCnt > 1 && that._autoplay) that.autoPlay.apply(that);
            // スライドにオンマウスしていないこととする
            that._mouseLeaveFlg = true;
          }, 200);
        });
      }

      // ナビボタンクリックイベント
      this._naviList.on('click',
        function(e){

          // スライドが1枚の場合 or アニメーション中 はなにもしない
          if(that._slideCnt <= 1 || that._moveFlg) return false;

          // NEXTボタンクリック
          if($(this).hasClass('cmn-next')){
            that._targetSlideIdx = that._activeSlideIdx + 1;
            that.setAnimation.call(this, that, 'next');
          }
          // PREVボタンクリック
          if($(this).hasClass('cmn-prev')){
            that._targetSlideIdx = that._activeSlideIdx - 1;
            that.setAnimation.call(this, that, 'prev');
          }
          e.preventDefault();
      });

      // ロケーションナビクリックイベント
      this._locationList.on('click',
        function(e){

          // スライドが1枚の場合 or アニメーション中 はなにもしない
          if(that._slideCnt <= 1 || that._moveFlg) return false;

          // 次のスライトindex値
          that._targetSlideIdx = parseInt(that._locationList.index(this));

          // アクティブスライドと次のスライドindex値が同じ場合はなにもしない
          if(that._targetSlideIdx === that._activeSlideIdx) return false;

          if(that._targetSlideIdx > that._activeSlideIdx){
            that.setAnimation.call(this, that, 'next');
          }else{
            that.setAnimation.call(this, that, 'prev');
          }
          e.preventDefault();
      });
      // タッチデバイスの場合、タッチイベントを追加

      if(this._swipe && this._supportTouch){
        this._slideList.on({
          // スワイプ開始
          'touchstart': function(e) {
            // スライドが1枚の場合かアニメーション中の場合はなにもしない
            if(that._slideCnt <= 1 || that._moveFlg) return;

            // タイマーを止める
            if(that._timerID) clearTimeout(that._timerID);

            // タッチ中
            that._mouseLeaveFlg = false;

            // タッチしたx座標
            that._touchX = event.changedTouches[0].pageX;

            that._touchXstart = that._touchX;

            // スワイプ中スライドmarginLeft
            that._slideX = parseInt(that._slideWrap.css('marginLeft'));
          },
          // スワイプ中
          'touchmove': function(e) {
            // スライドが1枚の場合、アニメーション中の場合なにもしない
            if(that._slideType === 'AD-A'){
              if(that._slideCnt <= that._displayCnt) return false;
            }else{
              if(that._slideCnt <= 1 || that._moveFlg) return false;
            }

            // スワイプした距離
            that._slideX = that._slideX - (that._touchX - event.changedTouches[0].pageX );

            // スライドをスワイプさせる
            that._slideWrap.css({marginLeft:that._slideX + 'px'});
            // スワイプ中のx座標
            that._touchX = event.changedTouches[0].pageX;
            // スワイプ中のy座標
            that._touchY = event.changedTouches[0].pageY;

            // 垂直方向から15度以上の方向にフリックした場合のみ、ページのスクロールをキャンセル
            that._moveX = that._touchX - event.changedTouches[0].pageX;
            that._moveY = that._touchY - event.changedTouches[0].pageY;
            that._moveRate = that._moveX / that._moveY;

            if(that._moveRate > Math.tan(15 * Math.PI/180)) {
              e.preventDefault();
            }

          },
          // スワイプ終了
          'touchend': function(e) {
            // スライドが1枚の場合なにもしない
            if(that._slideType === 'AD-A'){
              if(that._slideCnt <= that._displayCnt) return;
            }else{
              if(that._slideCnt <= 1 || that._moveFlg) return;
            }

            that._touchXend = that._touchX;

            // 移動距離
            var _dist = Math.abs(that._touchXstart - that._touchXend);

            // 基準にする移動距離
            var _grid = that._width * 0.3;

            // 移動距離が基準値を超えた場合はスライドを移動させる
            if(_dist > _grid){
              if(that._touchXend < that._touchXstart){
                that._targetSlideIdx = that._activeSlideIdx + 1;
                that.setAnimation.call(this, that, 'next');
              }else{
                that._targetSlideIdx = that._activeSlideIdx - 1;
                that.setAnimation.call(this, that, 'prev');
              }
            }else{
            // 移動距離が基準値を超えなかった場合はスライド位置を元に戻す
              that._slideWrap.animate({marginLeft: that._slideMargin + 'px'},{ duration:500 });
              // タイマーを止める
              if(that._timerID) clearTimeout(that._timerID);
              // オートプレイの場合はオートプレイを再開
              if(that._autoplay) that.autoPlay.apply(that);
            }
            // スライドにオンマウスしていないこととする
            that._mouseLeaveFlg = true;
          },
          // スワイプキャンセル
          'touchcancel': function() {
            // スライド位置を元に戻す
            that._slideWrap.animate({marginLeft: that._slideMargin + 'px'},{ duration:500 });
            // タイマーを止める
            if(that._timerID) clearTimeout(that._timerID);
            // オートプレイの場合はオートプレイを再開
            if(that._autoplay) that.autoPlay.apply(that);
          }
        });
      }

      if(this._slideCnt <= this._displayCnt){
        // スライド枚数が表示枚数以下の場合
        this._navi.hide();
        this._location.hide();
        this._locationList.on('click', function(e){ e.preventDefault(); });
        return false;
      }else{
        // 先頭と最後に表示する枚数分のスライドのcloneを設置
        this._slideList.slice(0,this._displayCnt).clone(true).insertAfter(this._slideList.last());
        this._slideList.removeClass(this._act).eq(this._activeSlideIdx).addClass(this._act);
        this._slideList.slice(-this._displayCnt).clone(true).insertBefore(this._slideList.first());
      }

      this._slideWrap.on({
        'mouseenter':function(){
          // タイマーを止める
          if(that._timerID) clearTimeout(that._timerID);
          // スライドにオンマウスしていることとする
          that._mouseLeaveFlg = false;
        },
        'mouseleave':function(){
          // オートプレイの場合はオートプレイを再開
          if(that._autoplay) that.autoPlay.apply(that);
          // スライドにオンマウスしていないこととする
          that._mouseLeaveFlg = true;
        },
        'keydown':function(e){
          // タイマーを止める
          if(that._timerID) clearTimeout(that._timerID);
          // スライドにオンマウスしていることとする
          that._mouseLeaveFlg = false;
          if(e.keyCode === 13){
            if($(this).find('.active a').length > 0){
              location.href = $(this).find('.active a').attr('href');
            }
            return false;
          }
        }
      });

      // スライドがオンマウスでない場合はオートプレイタイマーをセット
      if(this._mouseLeaveFlg){
        if(this._autoplay) this.autoPlay.call(this);
      }

    },
    adjustSize:function(w){
      var that = this;

      if(that._slideType === 'AD-A'){
        that._width = $(that._slideList).width() + parseInt($(that._slideList).css('padding-right'));
        that._slideMargin = -(that._width * (that._targetSlideIdx + 1) + (that._width * (that._displayCnt - 1)));

        if(that._slideCnt <= that._displayCnt){
          that._slideWrap.css({'marginLeft': '0px'});
        }else{
          that._slideWrap.css({'marginLeft': that._slideMargin + 'px'});
        }

      }else{
        that._width = $(that._slide).width();
        that._slideWrap.children().each(function(){
          $(this).width(that._width);
        });
        if(that._targetSlideIdx === that._slideCnt){
          that._slideMargin = -(that._width);
        }else{
          that._slideMargin = -(that._width * (that._targetSlideIdx+1));
        }

        // スライドが1枚の場合なにもしない
        if(that._slideCnt <= 1) return false;
        that._slideWrap.css({'marginLeft': that._slideMargin + 'px'});
      }

    },
    resetSlide:function(obj){
      // アニメーション終了
      this._moveFlg = false;

      // スライドがオンマウスでない場合はオートプレイを再開
      if(this._mouseLeaveFlg){
        // オートプレイの場合はオートプレイを再開
        if(this._autoplay) this.autoPlay.apply(this);
      }
    },
    setAnimation: function(that, key){

      // アニメーション中にする
      that._moveFlg = true;
      // オートプレイ中の場合はタイマーをクリアしてオートプレイを中断
      if(that._timerID) clearTimeout(that._timerID);

      if(key === 'next'){

        // locationをクリックした際のdist計算
        // アクティブスライドindexがスライド枚数よりも小さい場合
        if(that._activeSlideIdx < that._slideCnt){
          that._dist = that._targetSlideIdx - that._activeSlideIdx;
        }

        // ロケーションナビのindex値がアクティブスライドのindex値と同じ場合はなにもしない
        if(that._targetSlideIdx === that._activeSlideIdx) return false;

        that._slideWrap.animate({marginLeft: (that._slideMargin - (that._width * that._dist)) + 'px'},{
          duration:400,
          complete:function(){

            // アクティブ中のスライドからactiveを削除
            that._slideList.eq(that._activeSlideIdx).removeClass(that._act);

            if(that._targetSlideIdx === that._slideCnt){
              that._slideList.eq(0).addClass(that._act);

              that._slideMargin = -(that._width * that._displayCnt);
              that._slideWrap.css('marginLeft', that._slideMargin + 'px');
              // locationListにactiveクラスを追加
              that._locationList.removeClass(that._act).eq(0).addClass(that._act);
              that._activeSlideIdx = 0;
            }else{
              that._slideList.eq(that._targetSlideIdx).addClass(that._act);
              that._locationList.removeClass(that._act).eq(that._targetSlideIdx).addClass(that._act);
              that._activeSlideIdx = that._targetSlideIdx;
              that._slideMargin = that._slideMargin - (that._width * that._dist);

            }
            // スライドの順番調整
            that.resetSlide(that._slideWrap);
          }
        });

      }else if(key === 'prev'){

        // locationをクリックした際のdist計算
        if( that._activeSlideIdx < that._slideCnt){
          that._dist =  that._activeSlideIdx - that._targetSlideIdx;
        }

        if(that._targetSlideIdx === that._activeSlideIdx) return false;

        that._slideWrap.animate({marginLeft: that._slideMargin + (that._width * that._dist) + 'px'},{
          duration:400,
          complete:function(){

          // アクティブ中のスライドからactiveを削除
          that._slideList.eq(that._activeSlideIdx).removeClass(that._act);

            // 一番最後についた場合（activeをリセットする処理）
            if(that._targetSlideIdx === -1){
              that._slideList.eq(that._slideCnt - 1).addClass(that._act);

              that._slideMargin = -(that._width * (that._slideCnt + (that._displayCnt - 1)));
              that._slideWrap.css('marginLeft', that._slideMargin + 'px');

              // locationListにactiveクラスを追加
              that._locationList.removeClass(that._act).eq(that._slideCnt - 1).addClass(that._act);
              that._activeSlideIdx = that._slideCnt - 1;
            }else{
              that._slideList.eq(that._targetSlideIdx).addClass(that._act);
              that._locationList.removeClass(that._act).eq(that._targetSlideIdx).addClass(that._act);
              that._activeSlideIdx = that._targetSlideIdx;
              that._slideMargin = that._slideMargin + (that._width * that._dist);

            }

            // スライドの順番調整
            that.resetSlide(that._slideWrap);

          }
        });

      }

    },
    // オートプレイメソッド
    autoPlay: function(){
      var that = this;
      this._timerID = setTimeout(function(){

        that._slideMargin = parseInt(that._slideWrap.css('marginLeft'));
        that._targetSlideIdx = that._activeSlideIdx + 1;
        that.setAnimation.call(this, that, 'next');
      },that._interval);
    }
  });
};

/**
 * タブ - jQuery Plug-In -
 */
$.special.tabs = function(){
  $.fn.tabs = function( settings ) {
    return this.each(function() {
      new $.tabs(this, settings );
    });
  };
  $.tabs = function( obj, settings ){
    $.extend(this.settings, settings || {} );

    var that = this;
    // 表示・非表示を切り替えるクラス
    var _act = 'active';
    // アクティブ画像用のクラス
    var _actimg = 'activeimg';
    // 現在地のパス
    var _loc =  location.href;

    this._tab = $(obj);
    this._tabList = this._tab.find('.cmn-tab-list li');
    this._tabHook = this._tabList.find('a');
    this._tabItem = this._tab.find('.cmn-tab-item');
    // tabIndexを文字列にしておく
    this._tabIndex = '' + $('.cmn-tab-container').index(this._tab);

    // activeクラスの付与がない場合は一番最初のタブを初期値とする
    if(this._tabList.filter('.' + _act).length <= 0){
      this._tabList.first().addClass(_act);
    }

    // session確認
    var _hasStorage = $.special.session.storage;

    // session値格納用
    var _sessionVal = $.special.session.getSessionStorage('Status.RWD.' + _loc);

    // sessionStorageに値がある場合その値を初期値とする
    if(_sessionVal){
      for (var i in _sessionVal.tab) {
        if(i === this._tabIndex){
          this._tabList.removeClass(_act).find('a[href = '+_sessionVal.tab[i] + ']').parent('li').addClass(_act);
        }
      }
    }

    this._firstTab = this._tabList.filter('.' + _act).find('a');

    // タブ切り替えメソッド
    this.tabSwap = function(that){

      var _href = $(this).attr('href');

      // 一旦activeクラスを削除
      that._tabList.removeClass(_act).find('img').removeClass(_actimg);

      // クリックしたアイテムのhref値が同じものに対してactiveを付与する（同じタブメニューが上下にある場合を考慮）
      that._tabList.filter(function(){
        return $(this).find('a').attr('href') === _href;
      }).addClass(_act).find('img').addClass(_actimg);

      // クリックしたアイテムにマッチしたタブコンテンツにactiveクラスを付与する
      that._tabItem.removeClass(_act).filter(_href).addClass(_act);


      // sessionStorageへ格納
      if(_hasStorage){
        $.special.session.STATUS.tab[that._tabIndex] = _href;
        $.special.session.setSessionStorage('Status.RWD.' + _loc);
      }

    };

    // クリックイベント
    this._tabHook.off('click').on('click',function(e) {
      that.tabSwap.call($(this),that);
      e.preventDefault();
    });

    this._firstTab.trigger('click');

  };

  // タブセット
  // 基本のタブについては'_a'を付けた画像がactive画像となるようにする
  $('.cmn-tab-container').tabs().find('img').rollover({'suffix':'_a'});
};

/**
 * 折りたたみツール - jQuery Plug-in -
 */
$.special.collapse = function(){

  var _tgl = $( '.cmn-toggle-container' );
  // hookとなるオブジェクト
  var _tglHook = _tgl.find( '.cmn-toggle-btn' );
  // 表示・非表示を切り替えるクラス
  var _act = 'active';
  // ボタンテキストのクラス名
  var _btnTxtClass = '.cmn-toggle-btn-text';
  // デフォルトの閉じるテキスト
  var _tglCloseTxt = '\u9589\u3058\u308b';
  // 任意の閉じるテキストdeta属性[data-closetext=任意のテキスト]
  var _tglCloseData = 'data-closetext';

  // sessionStorageの値を取得
  var _firstTgl;
  var _loc = location.href;
  // session確認
  var _hasStorage = $.special.session.storage;
  // session値格納用
  var _sessionVal = $.special.session.getSessionStorage('Status.RWD.' + _loc);

  if(_sessionVal){
    _tgl.removeClass(_act);
    for (var i in _sessionVal.collapse) {
      if(_sessionVal.collapse[i] === true){
        _tglHook.eq(i).closest(_tgl).addClass(_act);
      }
    }
  }

  // activeクラスを保持しているボタンを最初に開くオブジェクトとしてセットする
  _firstTgl = _tglHook.filter(function(){
    return $(this).closest(_tgl).hasClass(_act);
  });

  // 一旦全てのtoggleからactiveクラスを削除
  _tgl.removeClass( _act );

  // hookがクリックされた時の処理
  var setCollapse = function() {
    if(this._tgl.hasClass(_act)){
      this._tgl.removeClass(_act);
      this._tglBtn.text(this._tglOpenTxt);
      this._tglFlg = false;
    }else{
      this._tgl.addClass(_act);
      this._tglBtn.text(this._tglCloseTxt);
      this._tglFlg = true;
    }

    // sessionStorageに格納
    if(_hasStorage){
      // sessionStorageへ格納
      $.special.session.STATUS.collapse[this._tglIndex] = this._tglFlg;
      $.special.session.setSessionStorage('Status.RWD.' + _loc);
    }

  };

  _tglHook.each(function(){

    var that = $(this);
    this._tgl = that.closest( _tgl );
    // ボタンに表示させるテキストをセット
    this._tglBtn = that.find( _btnTxtClass );
    // [.cmn-toggle-btn-text]の値
    this._tglOpenTxt =  this._tglBtn.text();
    // [data-closetext]属性の値 or 閉じる(default)
    this._tglCloseTxt = this._tglBtn.attr( _tglCloseData ) ? this._hasDataClose : _tglCloseTxt;
    // tglIndexを文字列にしておく
    this._tglIndex = '' + _tglHook.index($(this));
    this._tglFlg = false;

    // ボタンアクションイベント
    that.off().on({'click':function(e){

        setCollapse.call(this);
        e.preventDefault();

      },'keydown':function(e){ // for keybord

        if(e.keyCode === 13){
          setCollapse.call(this);
          e.preventDefault();
        }

      }
    });
  });

  // _firstTgl内のオブジェクトにclickイベントを発火させる
  $( _firstTgl ).each( function(){
    $( this ).trigger( 'click' );
  });
};

/**
 * ランダムバナー - jQuery Plug-In -
 */
$.special.randomAd = function(){
  $.fn.randomAd = (function() {
    var f_sort = function(a, b) {
      if ($(a).hasClass('Area_banner_fixed_top')) {
        return -1;
      } else if ($(b).hasClass('Area_banner_fixed_top')) {
        return 1;
      }
      return Math.random() - Math.random();
    };
    return function(options){
      var def = {
        version: 'v01',
        appendClass: '.cmn-bnr-ad-carousel',
        max: null,
        split: null
      };
      var setting = $.extend(def, options);
      var that = this;

      // 表示する広告枠
      this._version = setting.version;
      this._appendClass= setting.appendClass;
      this._split = setting.split;
      this._max = setting.max;
      this._act = 'active';

      // バナー分割用
      this._start = 0;
      this._end = 0;

      this.each(function(i){
        var o_this = $(this),
          o_obj = o_this.children(),
          i_max = that._max || o_obj.length;
        // ランダムソート
        o_obj.sort(f_sort);

        // オブジェクトを一旦空にする
        o_this.empty();

        // 表示する広告
        that._ad = o_obj.slice(0, i_max);

        // バナーを分割して配置する場合（上部に一つ、下部に2つなど）
        if(that._split !== null){

          if(that._version === 'v01'){
            // startの位置
            // 最初は0次は一つ前のスライド
            that._start = that._start + that._end;
            that._end = that._end + that._split[i];
            that._ad = that._ad.slice(that._start,that._end);
          }else if(that._version === 'v02'){
            // v02の場合
            var val = Math.round( Math.random() * (that._max - 1) );
            $(that._appendClass).filter(function(){
              return $(this).next('.cmn-bnr-ad-list-01').length <= 0
            }).after('<ul class="cmn-bnr-ad-list-01">').next('.cmn-bnr-ad-list-01').append(that._ad.eq(val).clone(true).addClass(that._act));
          }
        }

        // 抽出したバナーにactiveクラスを付与する
        that._ad.addClass(that._act);

        // 一旦空にしたオブジェクトに表示する広告をappendする
        o_this.append(that._ad.clone(true));
      });
      return this;
    };
  }());
};

/**
 * ランダムコンテンツ
 */
$.special.randomContents = function(){
  var _obj = $('.cmn-random');
  if(_obj.length <= 0) return;
    _obj.each(function(){
      var that = $(this).find('.cmn-random-item').sort(function() {
        return Math.random() - Math.random();
      });
      $(this).empty().append(that);
  });
};

/**
 * window size 720px 以下メニュートグル
 */
$.special.toggleMenu = function () {
  // メニュー
  $(".nav-drawer-trigger, .nav-drawer-layer").click((function() {
    var b_init = false;
    var f_is_init = function() {
      return b_init;
    };
    var f_open = function() {
      $("body").toggleClass("nav-drawer-active");
    };
    var f_init = function() {
      $('.str-nav').css({display: ''});
      setTimeout(f_open, 50);
      b_init = true;
    };
    return function() {
      f_is_init() ? f_open() : f_init();
    }
  }()));
};

/**
 * 画像ロールオーバー - jQuery Plug-in -
 */
$.special.rollover = function(){

  $.fn.rollover = function( settings ) {
    return this.each( function() {
      new $.rollover( this, settings );
    });
  };
  $.rollover = function( obj, settings ){
    this.settings = {
      suffix:''
    };
    $.extend( this.settings, settings || {} );

    this._target = $(obj);

    // hover時の画像ファイル末尾につけるsuffix
    this._sufO = '_o';

    // active時の画像ファイル末尾につけるsuffix(指定がなければhover時と同等)
    this._sufA = this.settings.suffix;

    // active時のクラス名
    this._act = 'active';

    // 動的にactive画像を切り替える場合のクラス名
    this._actImg = 'activeimg';

    // hover と active 画像パスの取得と画像プリロード
    this.imgPreload();
    this.init();
  };

  $.rollover.fn = $.rollover.prototype;
  $.rollover.fn.extend = $.rollover.extend = $.extend;

  $.rollover.fn.extend({

    init:function(){

      var that = this;

      this._target.on({
        'classChange':function(){
          var _self = $(this);
          if(_self.hasClass(that._actImg)){
            _self.attr('src', that._srcA);
            // タップは setHoverImg イベントさせない
            _self.off('mouseleave mouseenter');
          }else{
            _self.attr('src', that._src);
            _self.trigger('setHoverImg');
          }
        },

        // hover時のイベント
        'setHoverImg':function(){
          var _self = $(this);
          _self.hover(function(){
              _self.attr('src', that._srcO);
            }, function(){
              _self.attr('src', that._src);
          });
        }
      }).trigger('setHoverImg');

      // 自身または上位に active クラスを持つ img には activeimg クラスを付与する
      if( this._target.hasClass(this._act) || this._target.closest('.'+this._act).length > 0){
        this._target.addClass(this._actImg);
      }

    },
    // hover と active 画像パスの取得と画像プリロード
    imgPreload:function(){

      this._chkO = new RegExp(this._sufO + '\\.\\w+$');
      this._chkA = new RegExp(this._sufA + '\\.\\w+$');
      this._src = this._target.attr('src');

      // 画像パスに suffix がついている場合は取る
      if (this._chkO.test(this._src)){
        this._src = this._src.replace(this._sufO,'');
      }

      // 画像パスに suffix がついている場合は取る
      // (suffixA の指定がある場合も同様)
      if(this._sufA !== ''){
        if (this._chkA.test(this._src)){
          this._src = this._src.replace(this._sufA,'');
        }
      }

      // hover と active の画像パスをセット
      // (suffixA の指定がない場合 hover と active の画像パスは同じ)
      if(this._src !== void 0){

        // 元の画像パスの末尾に _o を付与したものを画像パスとする
        this._srcO = this._src.replace(/\.\w+$/, this._sufO + '$&');
        this._srcA = this._srcO;

        // suffixA の指定がある場合は
        // (元の画像パスの末尾に指定された suffixA の値を付与したものを画像パスとする)
        if(this._sufA !== '') {
          this._srcA = this._src.replace(/\.\w+$/, this._sufA + '$&');
        }
      }
      // 画像プリロード
      $('<img>').attr('src', this._srcO);
      $('<img>').attr('src', this._srcA);

    }
  });
  // 基本のロールオーバープラグイン呼び出し
  $('.cmn-roll img , img.cmn-roll').rollover();
};

/**
 * スムーススクロール
 */
$.special.smoothScroll = function(){
  $('body').on('click', '.cmn-scroll-smooth a,a.cmn-scroll-smooth,#str-footer .nav-top a', function(e){
      // hrefを取得
      var _hash = $(this).attr('href');

      // hrefが#から始まらない場合 or 空の場合は処理しない
      if((!(_hash.match(/^#./))) || (_hash === '')) return;

      // hashと同じIDを持つオブジェクトを取得
      var _target = $(_hash);

      // _targetのoffset.topを取得（_targetがない場合は0をセット）
      var _top = (_target.offset() !== void 0 ) ? _target.offset().top : 0;

      // _targetのoffset.top位置までアニメーションさせる
      $('html, body').animate({'scrollTop':_top},600);

      e.preventDefault();

  });
};

/**
 * IE8のためのカラムレイアウト調整
*/
$.special.adjustIE8 = function(){
  function Column() {}
  /*
  * @prefix : レイアウト調整する親要素のクラス名
  * @target : レイアウト調整する子要素
  */
  Column.prototype.setReset = function(prefix,target){
    var _resetCls = 'cmn-col-reset';
    var _preReg = new RegExp(prefix + '+\\d*');
    var _nthNum = 0;

    // 接頭辞にprefixを持つクラスに対して処理する
    $('[class*='+prefix+']').each(function(i){
      var _self = $(this);
      var _prefix = _self.attr('class').match(_preReg);

      // prefix+数字のパターンでない場合は処理しない
      if(!_prefix) return;

      // prefix+数字の数字の部分だけ抽出
      _nthNum = parseInt(_self.attr('class').match(_preReg)[0].split(prefix)[1]) || 0;

      // 自身の指定子要素を_nthNumでフィルタリングして_resetClsを付与する
      _self.find(target).filter(':nth-child('+_nthNum+'n+1)').addClass(_resetCls);

    });
  };
  var column = new Column();
  column.setReset('cmn-list-col-','li');
  column.setReset('cmn-image-col-','li');
  column.setReset('cmn-col-lyt-','.cmn-col');
};

$.special.toggleText = function() {
  $('.Area_special_toggle_text').each(function() {
    var o_this = $(this),
      o_text_full = o_this.find('.Area_special_toggle_text_full'),
      o_text_intro = o_this.find('.Area_special_toggle_text_intro'),
      s_text_intro = o_text_full.text().replace(/\s/g, '').slice(0, 80);
    o_text_intro.html(s_text_intro);
  });
  $('#str-container').on('click', '.Act_special_toggle_text', function() {
    $(this).parents('.Area_special_toggle_text').addClass('is-active');
  });
};

/**
 * 不具合・ご要望ページへ遷移
 */
$.special.opinionForm = function() {
  // PCビュー用
  $('#Act_opinion_post_pc, .Act_opinion_post_pc').on('click', function() {
    $j.openOpinionForm('form');
    return false;
  });

  // SPビュー用
  $('#Act_opinion_post_sp, .Act_opinion_post_sp').on('click', function() {
    var s_url_send = $j.getSslUrl() + '/opinion/form/';

    // クレームツール起動
    window.open(s_url_send + '?url=' +
      location.protocol + '//' +
      encodeURIComponent(location.host) +
      encodeURIComponent(location.pathname) +
      '&prm=' + encodeURIComponent(location.search) +
      encodeURIComponent(location.hash), 'new');

    return false;
  });
};

/**
 * マップアプリ誘導イベント設定
 */
$.special.mapAppInduct = function() {
	// ヘッダアプリ誘導ボタン閉じる
	$('.Act_app_close').click(function() {
		$.cookie("map_app_hide","1",{path: '/', expires:1});
		$.toggleMappAppInduct();
	});
	// 初期化
	$.toggleMappAppInduct();

};

/**
 * マップアプリ誘導表示切替
 */
$.toggleMappAppInduct = function() {
  if ($.cookie("map_app_hide")) {
    $(".Area_app_induct").hide();
  } else {
    $(".Area_app_induct").show();
  }
};

$.fixedMoveToTop = function() {
  // トップに戻るボタンが無い場合は挿入する
  if (($('#str-container').length > 0 || $('.str-container').length > 0)
    && $('#Act_MovePageTop').length <= 0
    && $('.str-footer').length <= 0) {
    $('body').append('<div class="str-footer"><a href="#top" class="str-footer-nav-top cmn-scroll-smooth" id="Act_MovePageTop">ページトップへ</a></div>');
  }
  // トップに戻るボタン固定
  if ($('#Act_MovePageTop').length > 0 && !/i(Pad|Phone)\sOS\s11.*GSA/.test(navigator.userAgent)) {
    $(window).on('scroll.move_page_top', (function() {
      var i_start_scroll = 0;
      var o_elm_top = $('#Act_MovePageTop');
      var o_static_elm = $('.Area_fixed_to_static').eq(0);
      var f_start_scroll_init = function() {
        i_start_scroll = 0;
      };
      var f_overwrite_timer = function(o_elm, f_callback, i_timeout, s_data_name) {
        var i_timer_id = o_elm.data(s_data_name);
        typeof i_timer_id !== 'undefined' && clearTimeout(i_timer_id);
        o_elm.data(s_data_name, setTimeout(f_callback, i_timeout));
      };
      var f_animation_callback =  function(s_remove_class) {
        o_elm_top.removeClass(s_remove_class);
      };
      var f_animation_controll = function(s_remove_class) {
        f_overwrite_timer(o_elm_top, f_animation_callback.bind(undefined, s_remove_class), 380, 'timeout_move_top_animation');
      };
      var o_move_top_animation = {
        show: function() {
          if ((o_elm_top.hasClass('is-active is-hide') || !o_elm_top.hasClass('is-active'))) {
            o_elm_top.removeClass('is-hide').addClass('is-active is-show');
            f_animation_controll('is-show');
          }
        },
        hide: function() {
          if (o_elm_top.hasClass('is-active') && !o_elm_top.hasClass('is-hide')) {
            o_elm_top.removeClass('is-show').addClass('is-hide');
            f_animation_controll('is-active is-hide');
          }
        }
      };
      var f_direction_controll = function() {
        return (i_start_scroll - 10) > window.pageYOffset;
      }
      var f_fixed_controll = o_static_elm.length > 0 ? function(i_height, i_outer) {
        return i_outer > i_height && o_static_elm.hasClass('is-static') && f_direction_controll() ? o_move_top_animation.show() : o_move_top_animation.hide();
      } : function(i_height, i_outer) {
        return i_outer > i_height && f_direction_controll() ? o_move_top_animation.show() : o_move_top_animation.hide();
      };
      return function() {
        if (i_start_scroll === 0) {
          i_start_scroll = window.pageYOffset;
        }
        f_overwrite_timer($(this), function() {
          var i_height = window.innerHeight, o_header = $('.str-header'), i_header = 0;
          if (o_header.length > 0) {
            i_header = o_header.offset().top + o_header.outerHeight(true);
          }
          f_fixed_controll(i_height + i_header, window.pageYOffset + i_height);
          f_start_scroll_init();
        }, 150, 'timeout_move_top');
      };
    }()));
  }
  // 検索ボタン固定
  if ($('.Area_fixed_to_static').length > 0) {
    if (!/i(Pad|Phone)\sOS\s11.*GSA/.test(navigator.userAgent)) {
      $(window)
        .on('scroll.fixed_to_static', (function() {
          var o_static_elm = $('.Area_fixed_to_static').eq(0);
          return function() {
            var o_parent_elm = o_static_elm.parent(), i_parent_height = o_parent_elm.outerHeight();
            var i_static_point = o_parent_elm.offset().top + i_parent_height;
            var i_outer = window.pageYOffset + window.innerHeight;
            i_outer < i_static_point ? o_static_elm.removeClass('is-static') : o_static_elm.addClass('is-static');
          }
        }()))
        .on('resize.fixed_to_static', function() {
          $(this).trigger('scroll.fixed_to_static');
        });
    } else {
      $('.Area_fixed_to_static').addClass('is-static');
    }
  }
  $('body').scroll();
  // 旧トップに戻るボタンの無効化
  $('.btn-nav-top').remove();
};

/**
 * トピックパススクロール制御
 */
$.topicPathControll = (function() {
  var o_iscroll = null, o_iscroll_options = {
    scrollX: true,
    scrollY: false,
    bounce: false,
    useTransform: (/msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent)) ? false : true,
    preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/ }
  };
  return {
    _scrollControll: function () {
      o_iscroll !== null && (isNaN(o_iscroll.x) || o_iscroll.x >= 0 ? $('.cmn-topic-path').removeClass('is-slide-active') : $('.cmn-topic-path').addClass('is-slide-active'));
    },
    _initScroll: function() {
      o_iscroll.scrollToElement($('#topicPath_Area').find('li').last().get(0));
      this._scrollControll();
    },
    _initEvents: function() {
      typeof $.fn.on === 'function' ? $('#topicPath_Area').on('touchmove', function(e) {
        $.topicPathControll._scrollControll();
      }) : $('.cmn-topic-path').delegate('#topicPath_Area', 'touchmove', function(e) {
        $.topicPathControll._scrollControll();
      });
    },
    _refreshScroll: function() {
      o_iscroll.refresh();
      this._initScroll();
    },
    initialize: function () {
      $('#topicPath_Area').find('li').length > 0 && setTimeout(function() {
        o_iscroll = new IScroll('.cmn-topic-path-slide', o_iscroll_options);
        $.topicPathControll._initScroll();
        $.topicPathControll._initEvents();
      }, 0);
    },
    refresh: function() {
      o_iscroll === null ? this.initialize() : this._refreshScroll();
    }
  }
}());

$.headerButtons = function() {
  var a_url_match = location.host.match(/^(.+-)?(www|ssl)(\.tour\.(ne\.jp|div1(\.opendoor\.local)?))/), s_www = '';
  if (a_url_match !== null) {
    if (typeof a_url_match[1] === 'undefined' || a_url_match[1] === 'ts-' || a_url_match[1] === 'rs-' || a_url_match[1] === 'st-') {
      s_www = 'https://' + (typeof a_url_match[1] === 'undefined' ? '' : a_url_match[1]) + 'www' + a_url_match[3];
    } else {
      s_www = 'http://' + a_url_match[1] + 'www' + a_url_match[3];
    }
  }
  // 履歴ボタン
  var o_history_button = $('.Act_history_button');
  o_history_button.length > 0 && o_history_button.on('click', $.travelko_history.checkAndMoveToHistory);
  // よくある質問ボタン
  var o_faq_button = $('.Act_faq_button');
  o_faq_button.length > 0 && o_faq_button.on('click', (function() {
    var a_menu = ['w_hotel', 'w_tour', 'w_air', 'w_dp', 'w_optional', 'w_wifi', 'j_hotel', 'j_tour', 'j_air', 'j_dp', 'j_optional', 'j_bus', 'j_bustour', 'j_rentacar']
      , o_reg = new RegExp('^\/(' + a_menu.join('|') + ')\/.*$')
      , s_menu = '', a_match = location.pathname.match(o_reg);
    if (a_match !== null && typeof a_match[1] !== 'undefined') {
      s_menu = a_match[1] + '/';
    }
    return function() {
      location.href = s_www + '/faq/' + s_menu;
    }
  }()));
};