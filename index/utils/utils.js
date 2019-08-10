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

module.exports = {
  convertToStarsArray: convertToStarsArray,
}