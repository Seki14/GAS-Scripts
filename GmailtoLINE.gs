// Tool name         :GmailToLINE
// Module name       :GmailToLINE.gs
// Detail            :Gmailの特定のメールアドレスから来たメールをLINEに通知するスクリプト
// Implementer       :R.Ishikawa
// Version           :1.1
// Last update       :2022/2/22

// Version History
//  1. Create New                              R.Ishikawa  Ver.1.1  2022/2/22

// LINE_NOTIFY_TOKEN: LINE Notify トークンを指定
const LINE_NOTIFY_TOKEN = "INPUT YOUR LINE NOTIFY TOKEN"; //LINE notify token

// query: 問い合わせ条件を指定（from:送信元をメールアドレスまたは名前の部分一致で検索）
const query = "問い合わせ条件を入力"

// url: Line NotifyのURL
const url = "https://notify-api.line.me/api/notify";

//メールをチェックし条件に該当するメールをLINEに通知する
function getMail(){
 
  //指定した条件でスレッドを検索して取得 
  var myThreads = GmailApp.search(query, 0, 10);
  
  //スレッドからメールを取得し二次元配列に格納
  var myMessages = GmailApp.getMessagesForThreads(myThreads);
  
 
  for(var i in myMessages){
    for(var j in myMessages[i]){
 
      //スターがないメッセージのみ処理   
      if(!myMessages[i][j].isStarred()){ 
        
        var strDate　=　myMessages[i][j].getDate();
        var strmsg = Utilities.formatDate(myMessages[i][j].getDate(), 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss')+"\n"; //タイムスタンプ
        strmsg += myMessages[i][j].getSubject() + "\n";//Subject 
        strmsg += myMessages[i][j].getPlainBody().slice(0,400);//本文の先頭から400文字
        
        //LINEにメッセージを送信
        sendLineMessage(strmsg);
 
        //処理済みのメッセージをスターをつける
        myMessages[i][j].star(); 

        //処理済みのメッセージを既読にする
        myMessages[i][j].markRead();
      }
    }
  }
}
 
//LINEにメッセージを送信する
function sendLineMessage(msg) {
  var response = UrlFetchApp.fetch(url, {
    "method": "post",
    "headers": {
      "Authorization": "Bearer " + LINE_NOTIFY_TOKEN
    },
    "payload": {
      "message": msg
    }
  });
}
