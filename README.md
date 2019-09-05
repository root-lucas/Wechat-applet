# Wechat-applet

## 缓存使用的方法
一般情况下当我们点击文章收藏按钮的时候会触发对应的方法状态响应给后端服务器进行保存数据,由于我们没有设置后端服务器，所以我们只能将收藏状态指令功能缓存在前端的浏览器上。
#### 设置缓存
```
wx.setStorageSync("keyValue", "root") 
```

`注意`:除非用户主动删除或因存储空间原因被系统清理，否则数据都一直可用。单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB。

#### 删除与清除所有缓存
```
 wx.removeStorageSync("keyValue")    //清除指定缓存方法
 wx.clearStorageSync()          //同步清除所有缓存
 wx.clearStorage()              //清理本地数据缓存
```

#### 获取缓存
```
var get = wx.getStorageSync("keyValue")     //这个键名千万别填错,注意！注意！
```

## 使用缓存实现文章收藏功能
``` javascript
    //检查是否有收藏
    var postsCollected = wx.getStorageSync("posts_collected");    //注意这个键千万别填错
    if(postsCollected){
      var postCollected = postsCollected[postId]
      this.setData({collected:postCollected})
    }else{
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync("posts_collected", postsCollected)
    }

  //点击收藏切换功能
  onColletionTap:function(event){
    var postsCollected = wx.getStorageSync("posts_collected")
    var postCollected = postsCollected[this.data.currentPostId]
    //再次点击收藏变成未收藏,未收藏变成收藏
    postCollected = !postCollected;
    //更新文章是否缓存
    postsCollected[this.data.currentPostId] = postCollected;
    wx.setStorageSync("posts_collected", postsCollected);
    //更新数据绑定变量从而实现切换图片
    this.setData({collected:postCollected})
  }
```

## 交互页面反馈 

#### 1.弹出交互动态界面[API](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html)
```
    wx.showToast({
      title: postCollected?"收藏成功":"取消收藏",
      duration: 1000,
    })
```

#### 2.显示模态对话框[API](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html)
```
    wx.showModal({
      title: '微信文章',
      content: postCollected ? "收藏该文章?" : "取消收藏该文章?",
      showCancel: 'true',
      cancelText: '不收藏',
      confirmText: '收藏',
      cancelColor: '#333',
      confirmColor: '#405f80',
    })
```
和上面相同的效果,区别是功能设置功能更多，但是属于堵塞式交互界面

#### 3.弹出分享功能
显示操作菜单[API](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showActionSheet.html)

```javascript
  /*实现分享功能*/
  onShareTap:function(event){
    var itemLists = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemLists,
      itemColor: "#405f80",
      success:function(res){
        //res.cancel 用户是否点击了取消按钮
        //res.tapIndex 是上面itemList数据元素的下标
        wx.showModal({
          title: '用户' + itemLists[res.tapIndex],
          content: "用户是否取消?" + res.cancel + '现在无法实现分享功能',
        })
      }
    })
  }
```

#### 4.同步异步方法对比
虽说异步能更好的减少服务器的并发压力，但是基本简单的功能建议还是用同步去实现。
```javascript
  onColletionTap:function(event){
    this.getPostsCollectedSyc()
    // this.getPostsCollectedAsy()
  },
  /*异步方法*/
  getPostsCollectedAsy:function(){
    var that = this
    wx.getStorage({
      key:"posts_collected",
      success:function(res){
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId]
        //再次点击收藏变成未收藏,未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;  //{"0":true}

        that.showToast(postsCollected, postCollected)  //调用自定义函数          
      }
    })
  },

  /*同步方法*/
  getPostsCollectedSyc:function(){
    var postsCollected = wx.getStorageSync("posts_collected")
    var postCollected = postsCollected[this.data.currentPostId]
    //再次点击收藏变成未收藏,未收藏变成收藏
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;  //{"0":true}

    this.showToast(postsCollected, postCollected)  //调用自定义函数
  }
```

## 音乐播放

#### 1.音乐播放
``` javascript
    //音乐启动暂停功能
     onMusicTap: function (event) {
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({isPlayingMusic: false})

            // app.globalData.g_currentMusicPostId = null;
            app.globalData.g_isPlayingMusic = false;
        }
        else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg,
            })
            this.setData({
                isPlayingMusic: true
            })
            app.globalData.g_currentMusicPostId = this.data.currentPostId;
            app.globalData.g_isPlayingMusic = true;
        }
    }
```

#### 2.快速图片切换的俩种方法
``` html
方法一
<image catchtap="onMusicTap" class="audio" src="{{isPlayingMusic?'/index/images/music/music-stop.png':'/index/images/music/music-start.png'}}"></image>

<image class="head-image" src="{{isPlayingMusic?postaData.music.coverImg:postaData.headImgSrc}}"></image>

方法二
<image wx:if="{{collected}}" catchtap="onColletionTap" class="share-img" src="/index/images/icon/collection.png"></image>
<image wx:else catchtap="onColletionTap" src="/index/images/icon/collection-anti.png"></image>
```

#### 3.后台播放音乐
打开全局配置文件`app.json`加上下面代码
```
  "requiredBackgroundModes": [
    "audio",
    "location"
  ]
```
没有配置会警告报错

#### 4.监听音乐播放和暂停
修复小程序的单击`外置框架UI播放器`与`单击图片`暂停与播放的图片没有相互匹配。下面实现由框架来调用API代码。

``` javascript
    //监听播放音乐背景图片
    var that = this;
    wx.onBackgroundAudioPlay(function(){
        that.setData({
          isPlayingMusic:true
        })
    })
    //监听暂停背景图片
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
    });
```

#### 5.重载页面图片初始化BUG
`BUG1`:解决返回后重新进入该页面后音乐背景图片继续显示。  
`BUG2`:解决正在播放的音乐，进入不同的新闻列表详情里只显示正在播放的音乐图片，而不是显示正确的详情文章(不是音乐)背景图片。   
使用setStorageSync的话效果不搭预期。可以通过修改全局配置文件`app.js`设置全局变量。

```
App({
  globalData:{
    g_idPlayingMusic:false,     //BUG1
    g_currentMusicPostId:null   //BUG2
  }
})
```

在页面引入全局变量`var app = getApp();`。

使用全局变量
```javascript
onLoad:function(option){
    .....
    if(app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){
      this.setData({isPlayingMusic:true})
    }
      this.setMusicMonitor();
    },
/*监听播放音乐背景图片*/
setMusicMonitor:function(){
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({isPlayingMusic: true})
      //返回——重新载入页面音乐背景图还会显示
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    })
    //监听暂停背景图片
    wx.onBackgroundAudioPause(function(){
      that.setData({isPlayingMusic: false})
      //返回——重新载入页面音乐背景图只会隐藏
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null; //播放暂停的时候把当前播放的音乐背景图片为空false
    })
  }
```

#### 6.线上程序清除缓存
```
wx.clearStorage()              //清理本地数据缓存,自定义设置按钮清除
```

#### 7.轮播图跳转文章详情

使用冒泡方式swiper跳转详情页面

```html
    <swiper catchtap="onSwiperTap" indicator-dots="true" indicator-color="#fff" autoplay="auto" interval="4000">
```
`post.js文件`
```javascript
  /*冒泡方式swiper跳转详情页面*/
  onSwiperTap:function(event){
    //target指的是当前点击的组件,而currentTarget指的是事件捕获的组件
    //target这里指的是image,而currentTarget指的是swiper
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId   //postId文章详情值由swiper-item标签的data-postid传值过来
    })  
  }
```

## 电影资讯页面

#### 1.三种常用路由跳转页面[API](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html)
``` javascript
    /*1.跳转到非选项卡页面,隐藏当前页面,拥有返回按钮*/
    wx.navigateTo({
      url: "../posts/post",
      fail: function(res) {console.log("error")},
    })
    /*2.跳转到非选项卡页面,卸载当前页面,不存在返回按钮*/
    wx.redirectTo({
      url: '../posts/post',
    })
    /*3.如果要跳转至带tab选项卡的页面必须使用switchTap方法*/
    wx.switchTab({
      url: "../posts/post"
    });
```

#### 2.制作底部tab栏
全局配置文件`app.json`。
```
  "tabBar": {
    "color": "#000000",
    "selectedColor": "#2E8B57",
    "backgroundColor": "#fff",
    "position":"bottom",
    "borderStyle":"black",
    "list": [
      {
        "pagePath": "index/movies/movies",
        "text": "电影热映",
        "iconPath":""
      },
      {
        "pagePath": "index/posts/post",
        "text": "新闻资讯"
      }
    ]
  }
```
**注意**:pages也需要增加相应的页面。

**注意**:写模板的时候尽量用相应的css类名称,比如container,写成调用movie-container,否则会在调用Import的时候产生覆盖同名css样式的冲突。

#### 3.双flex布局与多层模板嵌套
**说明1**:双flex，星星图片是行布局，图片与评分同样是行布局,查看文件1和文件2。    
**说明2**:多层嵌套不同的样式以及模板规则,查看文件1至文件5。  
文件1:`stars-template.wxml`
```html
    <view class="stars-container">
        <view class="stars">
            <image src="/index/images/icon/star.png"></image>
            <image src="/index/images/icon/star.png"></image>
            <image src="/index/images/icon/star.png"></image>
            <image src="/index/images/icon/star.png"></image>
            <image src="/index/images/icon/star.png"></image>
        </view>
        <text class='star-score'>8.7</text>
    </view>
```
文件2:`stars-template.wxss`
```css
.stars-container {
  display: flex;
  flex-direction: row;
}

.stars {
  display: flex;
  flex-direction: row;
  height: 17rpx;
  margin-right: 24rpx;
  margin-top: 6rpx;
}

.stars image {
  padding-left: 3rpx;
  height: 17rpx;
  width: 17rpx;
}

.star-score{
   color: #1f3463;
}

```
文件3:`movie-template.wxml`,由于这里使用了文件1的模板(is使用),那么同名wxss文件可以导入`@import "../stars/stars-template.wxss"`样式。
```html
<import src="../stars/stars-template.wxml" />
<template name="movieTemplate">
    <view class="movie-container">
        <image class="movie-img" src="/index/images/Monster.jpg"></image>
        <text class="title">哪吒之魔童降世</text>
        <template is="starsTemplate"></template>
    </view>
</template>
```
文件4:`movie-list-template.wxml`,那么这里的同名wxss文件必须导入文件3同名wxss样式文件`@import "../movie/movie-template.wxss";`。
```html
<import src="../movie/movie-template.wxml" />
<template name="movieListTemplate">
    <view>
        <text>正在热映</text>
        <view>
              <text>更多</text>
              <image src="/index/images/icon/arrow-right.png"></image>
        </view>
        <template is="movieTemplate" />
        <template is="movieTemplate" />
        <template is="movieTemplate" />
    </view> 
</template>
```
文件5:`movies.wxml`那么则在这里导入`@import "movie-list/movie-list-template.wxss";`
```html
<import src="movie-list/movie-list-template.wxml" />

<view>
    <template is="movieListTemplate" />
    <template is="movieListTemplate" />
    <template is="movieListTemplate" />
</view>
```
**注意**:不正确导入wxss样式文件会使样式无效。

**快捷方法**:如果movies.wxml是最终调用模板的主页面，这里`movies.wxss`也可以直接导入文件2`stars-template.wxss`的样式：@import "../stars/stars-template.wxss"。

布局模板与样式模板同理步骤:
>文件1——>文件2——>文件3——文件4(最后引入的模板)   

`文件1`是模板,`文件2`也是模板并且嵌套了`文件1`模板,`文件3`也还是模板并且嵌套了`文件2`的模板，也就是说`文件3`拥有三个模板布局或者样式,每嵌套一个模板或样式都必须引入上一个模板文件才能**生效**。引入方法如下:
```
布局模板:<import src="movie-list/movie-list-template.wxml" />
样式模板:@import "movie-list/movie-list-template.wxss";
```

#### 4.小程序的网络请求
```javascript
      wx.request({
        url: 'https://URL',
        data:'',
        //必须要设置"content-type":"json",不然会报错 400 (Bad Request)
        header: {
          "Content-Type": "json"
        },
        method:'GET',
        success: function (res){},
        fail: function (res){},
        complete: function(res){},
      });
```

还需在开发者工具——详情——本地项目里勾选`不校验合法域名、TLS版本以及HTTPS证书`才能使用网络请求功能。

#### 5.对豆瓣API数据进行处理
从网络请求到的数据后进行处理并赋值给本地的`data对象`属性使用。
```javascript
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
  }
```

## 更多电影页面
#### 1.路由跳转详情页面
```javascript
<view class="more" catchtap="onMoreTap" data-category="{{categoryTitle}}">更多

  onMoreTap: function (event){
    var category = event.currentTarget.dataset.category;
      wx.navigateTo({
        url: 'more-movie/more-movie?category=' + category, //category内容是如'正在热映','top250'
      })
  }
```

#### 2.动态设置导航栏标题
实现上述点击不同的`更多`按钮动态设置对应的页面导航栏标题。
```javascript
  onLoad: function (options) {
    var category = options.category;
    this.data.navigateTitle = category;
    console.log(category);  //获取路由跳转过来的参数,内容是如'正在热映','top250'
  },
  /*动态导航栏标题只能在生命周期onReady使用*/
  onReady:function(event){
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,  //等于"navigationBarTitleText":"电影列表"
      success: function (res) {
      }
    })
  }
```

#### 3.上拉滑动刷新
实现动态下(拉)滑动刷新数据。
```
  <scroll-view class="grid-container" scroll-y="true" scroll-x="false" bindscrolltolower="onScrollLower">
    <block wx:for="{{movies}}" wx:for-item="movie" wx:key="index">
        <view class="single-view-container">
            <template is="movieTemplate" data="{{...movie}}" />
        </view>
    </block>
  </scroll-view>
```

 **注意**

>①要想scroll下滑刷新生效必须要设置grid-container固定高度。

>②enable-flex=true启用 flexbox 布局。开启后，当前节点声明了 display: flex 就会成为 flex container，并作用于其孩子节点。

>③同样生效上下拉刷新。需将scroll-view改为view标签组件（因在滚动 scroll-view 时会阻止页面回弹，所以在 scroll-view 中滚动，是无法触发下拉事件 onPullDownRefresh），

>④如果仅仅只是需要上拉滑动刷新，只需onScrollLower事件和srcoll-view组件即可实现。

#### 4.下拉滑动刷新

```javascript
  /*3.滑动加载数据*/
  onScrollLower:function(event){
      // console.log("加载更新")
      var nextUrl = this.data.requestUrl + "&start=" + this.data.totalCount + "&count=20";
      util.http(nextUrl, this.processDoubanData);
      wx.showNavigationBarLoading(); //导航栏显示加载图标
      //wx.hideNavigationBarLoading();  //加载完成后隐藏导航栏加载图标
  }
```

>tip:如果在`app.json`的window属性加上`"enablePullDownRefresh":true`是否开启当前页面下拉刷新。缺点是全部页面都存在下拉效果。所以最好是在该页面json文件下使用。


#### 5.搜索功能实现
查找时隐藏其他页面,实现中途退出，以及搜索电影结果。
```html
<!-- 搜索框 -->
<view class="search">
  <icon type="search" class="search-img" size="13" color="#405f80"></icon>
  <input type="text" placeholder="输入搜索电影名" 
  placeholder-class="placeholder" bindfocus="onBindFocus"
  bindblur="onBindBlur"/>
  <image wx:if="{{searchPanelShow}}" src="/index/images/icon/xx.png" class="xx-img" bindtap="onCancelImgTap"></image>
</view>
```

```javascript
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
  } 
```

## 电影详情页面
#### 1.image组件[api](https://developers.weixin.qq.com/miniprogram/dev/component/image.html)

设置了node模式就必须给图片设置宽高，否则默认值产生的效果不理想。
```
    <image class="head-img" src="{{movie.movieImg}}" mode="aspectFit" />
```

#### 2.横向滑动
```html
    <scroll-view class="cast-imgs" scroll-x="true" style="width:100%">
      <block wx:for="{{movie.castsInfo}}" wx:for-item="item">
        <view class="cast-container">
          <image class="cast-img" src="{{item.img}}"></image>
          <text class="cast-name">{{item.name}}</text>
        </view>
      </block>
    </scroll-view>
```

**注意**:写样式的cast-imgs必须写`white-space: nowrap`; 否则向下填充换行。

#### 3.详情图片大图阅览
```
  /*实现详情大图阅览图片*/
  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
```

#### 4.修复无法使用上下拉刷新

由于微信版本更新了, 在滚动 scroll-view 时会阻止页面回弹，所以在 scroll-view 中滚动，是无法触发 onPullDownRefresh,若要使用下拉刷新，请使用页面的滚动。
改动1：文件`movie-grid-template.wxml`
```
  <view class="grid-container">
    <block wx:for="{{movies}}" wx:for-item="movie">
      <view class="single-view-container">
        <template is="movieTemplate" data="{{...movie}}" />
      </view>
    </block>
  </view>
```
这里改动就是将scroll-view组件换成view组件名，并去掉了scroll-view组件原有的属性。其他地方不用改动，即可还原以前的功能刷新和加载更多同时存在的功能。

改动2:文件`more-movie.js`
```javascript
// onScrollLower: function (event) {
  //   var nextUrl = this.data.requestUrl +
  //     "?start=" + this.data.totalCount + "&count=20";
  //   util.http(nextUrl, this.processDoubanData)
  //   wx.showNavigationBarLoading()
  // },

  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  }
```

屏蔽onScrollLower，新增onReachBottom函数。
