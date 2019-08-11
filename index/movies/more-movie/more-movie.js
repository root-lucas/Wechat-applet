// index/movies/more-movie/more-movie.js
var app = getApp()
var util = require('../../utils/utils.js')

Page({
  data: {
    navigateTitle:"",
    movies:{},
  },
  onLoad: function (options) {
    var category = options.category;
    this.data.navigateTitle = category;
    // console.log(category);  //获取路由跳转过来的参数,内容是如'正在热映','top250','即将上映'
    var dataUrl = '';
    switch (category){
      case '正在热映':
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/in_theaters" + "?apikey=0df993c66c0c636e29ecbb5344252a4a";
        break;
      case '即将上映':
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/coming_soon" + "?apikey=0df993c66c0c636e29ecbb5344252a4a";
        break;
      case '豆瓣Top250':
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/top250" + "?&apikey=0df993c66c0c636e29ecbb5344252a4a";
        break;
    }
    util.http(dataUrl, this.processDoubanData)
  },
  /*处理数据*/
  processDoubanData: function (moviesDouban) {
    var movies = [];  //设置空数组记录循环处理完的数据
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";  //设置电影标题长度为6个子
      }
      // [1,1,1,1,1] [1,1,1,0,0]
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }

    this.setData({movies:movies});         
  },
  onReady:function(event){
    //导航栏标题只能在生命周期onReady使用
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,  //这个是动态设置导航栏上面的页面标题,等于"navigationBarTitleText":"电影列表"
      success: function (res) {
      }
    })
  },

})