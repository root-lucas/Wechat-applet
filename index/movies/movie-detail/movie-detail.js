// index/movies/movie-detail/movie-detail.js
import { Movie } from 'class/Movie.js';
var app = getApp();

Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    var movieId = options.id;   //获得电影id编号,如27145041
    // console.log(movieId)
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId + "?apikey=0df993c66c0c636e29ecbb5344252a4a";
    var movie = new Movie(url);

    // util.http(url,this.processDoubanData);
    // var movieData = movie.getMovieData();  //同步
    // var that = this;
    // movie.getMovieData(function (movie) {
    //   that.setData({
    //     movie: movie
    //   })
    // })
    movie.getMovieData((moviee) => {   //异步
      this.setData({
        movie: moviee
      })
    })
  },


  // /*1.处理详情页面数据*/
  // processDoubanData:function(data){
  //   // console.log(data);  //检查是否成功获得对应编号数据
  //   if(!data){
  //     return;
  //   }
  //   //导演信息
  //   var director = {
  //     avatar:"",
  //     name:"",
  //     id:""
  //   }
  //   if(data.directors[0] != null){
  //     if(data.directors[0].avatars != null){
  //       director.avatar = data.directors[0].avatars.large;
  //     }
  //     director.name = data.directors[0].name;
  //     director.id = data.directors[0].id;
  //   }
  //   //需要的电影信息
  //   var movie = {
  //     movieImg: data.images ? data.images.large:"",
  //     country: data.countries[0],
  //     title: data.title,
  //     originalTitle: data.original_title,
  //     wishCount: data.wish_count,
  //     commentCount: data.comments_count,
  //     year: data.year,
  //     generes: data.genres.join("、"),
  //     stars: util.convertToStarsArray(data.rating.stars),
  //     score: data.rating.average,
  //     director: director,
  //     casts: util.convertToCastString(data.casts),
  //     castsInfo: util.convertToCastInfos(data.casts),
  //     summary: data.summary
  //   };
  //   console.log(movie);
  //   console.log(director);

  //   this.setData({
  //     movie:movie
  //   })
  // },
  /*2.实现详情大图阅览图片*/
  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
})