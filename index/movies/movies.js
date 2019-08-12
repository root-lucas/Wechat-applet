var app = getApp();
var util = require('../utils/utils.js')

Page({
  data: {
    inTheaters: {},   //也可以将{}写为单引号或者双引号''
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false,
    },
  onLoad:function(event){
      //设置API地址
      var inTheatersUrl = app.globalData.doubanBase +
        "/v2/movie/in_theaters" + "?start=0&count=3&apikey=0df993c66c0c636e29ecbb5344252a4a";
      var comingSoonUrl = app.globalData.doubanBase +
        "/v2/movie/coming_soon" + "?start=0&count=3&apikey=0df993c66c0c636e29ecbb5344252a4a";
      var top250Url = app.globalData.doubanBase +
        "/v2/movie/top250" + "?start=0&count=3&apikey=0df993c66c0c636e29ecbb5344252a4a";
      //请求获取API接口信息
      this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
      this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
      this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },

  /*1.网络请求函数*/
  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      data: '',
      method: 'GET',
      //必须要设置"content-type":"json",不然会报错 400 (Bad Request)
      header: {
        "Content-Type": "json"
      },
      success: function (res) { 
        console.log(categoryTitle,res)
        that.processDoubanData(res.data, settedKey, categoryTitle)
        },
      fail: function (error) { console.log("请求出错:", error) },
      complete: function () { },
    })
  },
  //2.对豆瓣API数据进行处理
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
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
      //执行到这里movies等于[{..},{..},{..}]
      var readyData = {};
      readyData[settedKey] = {
        movies: movies,
        categoryTitle: categoryTitle
      };  
      //执行到这里readyData[settedKey]等于{movies:Array(3)}
      //readyData则是{top250:{movies:[...],[...],[...]}},这里的top250是上面data定义的变量对象
    this.setData(readyData); 
  },
  /*3.跳转更多电影页面*/
  onMoreTap: function (event){
    var category = event.currentTarget.dataset.category;
      wx.navigateTo({
        url: 'more-movie/more-movie?category=' + category,
      })
  },
  /*4.获取搜索框焦点*/
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  /*5.隐藏搜索结果*/
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    }
    )
  },
  /*6.搜索结果*/
  onBindBlur: function (event) {
    var text = event.detail.value;
    var searchUrl = "https://movie.douban.com/j/subject_suggest?q=" + text + "&cat=1002";
    this.getMovieListData(searchUrl, "searchResult", "");
  },
})