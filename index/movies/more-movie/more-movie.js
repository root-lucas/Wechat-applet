// index/movies/more-movie/more-movie.js
var app = getApp()
var util = require('../../utils/utils.js')

Page({
  data: {
    navigateTitle:"",
    movies:{},
    requestUrl:"",
    totalCount:0,
    isEmpty:true,
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
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData)
  },
  /*3.上拉加载数据*/
  onScrollLower:function(event){
      // console.log("加载更新")
      var nextUrl = this.data.requestUrl + "&start=" + this.data.totalCount + "&count=20";
      util.http(nextUrl, this.processDoubanData);
      wx.showNavigationBarLoading(); 
  },
  /*4.开启当前页面下拉刷新会触发的系统函数*/
  onPullDownRefresh: function (event) {
    console.log("下拉按钮")
    var refreshUrl = this.data.requestUrl +
      "&start=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();//标题栏显示加载图标
  },
  /*2.处理数据*/
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
    var totalMovies = {};

     //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
    if(!this.data.isEmpty){
        totalMovies = this.data.movies.concat(movies)
    }else{
        totalMovies = movies;
        this.data.isEmpty = false;
    }
    this.setData({ movies: totalMovies});
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();  //加载完成后隐藏加载图标
    wx.stopPullDownRefresh();       //停止下拉刷新
  },
  /*1导航栏标题只能在生命周期onReady使用*/
  onReady:function(event){
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,  //这个是动态设置导航栏上面的页面标题,等于"navigationBarTitleText":"电影列表"
      success: function (res) {
      }
    })
  },
  /*5.跳转电影详情*/
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "../movie-detail/movie-detail?id=" + movieId
    })
  },
})