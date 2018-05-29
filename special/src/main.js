import jQuery from 'jquery';

const $ = jQuery;
// テキストを取得
const app = $('#app');

// 一旦bodyは非表示にする
$('body').css('visibility','hidden');

// 静的HTMLを読み込む
$.ajax({
  url: URL,
}).done((data)=>{
  // HTMLの中身を取得
  $ext.filterText(data);
}).fail(()=>{
  // console.log("err");
});

const $ext = {
  filterText(data){
    const travelko = "<?php echo $FW_ENV['site']['NAME']; ?>"
    const travelko_path = "<?php echo $FW_ENV['url']['WWW']; ?>"
    // phpタグを取得
    const php = data.match(/<\?php([\s\S]*?) \?>/g);
    // scriptタグを取得
    const script = data.match(/<script(?: .+?)?>[\s\S]*?<\/script>/g);

    // 文字列置換
    // <?php echo $FW_ENV['site']['NAME']; ?> -> トラベルコ
    // <?php echo $FW_ENV['url']['WWW']; ?>   -> https://www.tour.ne.jp/
    let str = data;
    for(let i in php){
      if(php[i] === travelko){
        str = str.replace(php[i],"トラベルコ")
      }else if (php[i] === travelko_path) {
        str = str.replace(php[i],"https://www.tour.ne.jp/")
      }else{
        str = str.replace(php[i],"")
      }
    }

    // scriptタグは一旦削除
    for(let i in script){
      str = str.replace(script[i],"")
    }

    this.createdMain(str, script.join(''));
  },
  createdMain(data, script){

    // 取得した文字列を一旦iframeの中に入れる
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    iframe.style.display = "none";
    const ifrm = iframe.contentWindow || iframe.contentDocument.document || iframe.contentDocument;
    ifrm.document.open();
    ifrm.document.write(data);
    ifrm.document.close();

    iframe.onload =  (e) =>{
      const that = e.target;
      const ifm = that.contentWindow || that.contentDocument.document || that.contentDocument;
      const head = ifm.document.getElementsByTagName('head')[0].innerHTML;
      const main = ifm.document.getElementById('str-main').innerHTML;
      const result =  '<div id="str-main">'+main+'</div>';

      document.body.removeChild(iframe);

      document.head.innerHTML = '<meta name="viewport" content="width=device-width">\n'+'<link rel="stylesheet" href="/element/shared/css/master/master.min.css">' + head;

      app.append(result);

      $(result).ready(()=>{
        setTimeout(()=>{

          app.append('<script src="/element/shared/lib/jquery/core/jquery-1.11.3.min.js"></script><script src="/element/shared/script/rwd/shared.rwd.min.js" charset="utf-8"></script>');

          app.append(script);
          $('body').css('visibility','visible');
        },1000);
      });

    }

  }
}
