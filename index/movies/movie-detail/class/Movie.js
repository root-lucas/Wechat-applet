var util = require('../../../../index/utils/utils.js')
class Movie {
  constructor(url) {
    this.url = url;
  }

  getMovieData(cb) {
    this.cb = cb;   //这里的cb调用该类传进来的匿名方法包括全部内容this.setData({movie: moviee}) 
    util.http(this.url, this.processDoubanData.bind(this)); //只有绑定上面的this.cb的this,才能使用processDoubanData的this.cb
  }

  processDoubanData(data) {
    if (!data) {
      return;
    }
    var director = {
      avatar: "",
      name: "",
      id: ""
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large

      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var moviee = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join("、"),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    }
    this.cb(moviee);   //这个moviee对象会传回数据给调用该类(movie-detail.js)的getMovieData函数方法的形参moviee,然后再this.setData绑定数据
  }
}

export { Movie }