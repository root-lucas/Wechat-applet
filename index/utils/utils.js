//该文件存放的是公共方法


/*星星评分*/
function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    }
    else {
      array.push(0);
    }
  }
  return array;//[1,1,1,1,1] [1,1,1,0,0],1代码着黄色星星
}

/*网络http请求*/
function http(url,callBack) {
  wx.request({
    url: url,
    data: '',
    method: 'GET',  //必须要设置"content-type":"json",不然会报错 400 (Bad Request)
    header: {
      "Content-Type": "json"
    },
    success: function (res) {
      callBack(res.data)
    },
    fail: function (error) { console.log("请求出错:", error) },
  })
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http,
}