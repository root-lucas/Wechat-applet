// index/posts/post.js
// var postsData = require("/index/data/posts-data.js") //error,不能使用绝对路径，只能使用相对路径
var postsData = require("../data/posts-data.js")
// var common = require('post-item/post-item-template.js')

Page({

  /**
   * Page initial data
   */
  data: {
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    
    this.setData({ post_key: postsData.postList });   //小程序总是会读取data对象来做数据绑定
      // this.data.post_key = postsData.postList;  //error
      // common.say()
  },
  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postidNum;
    //currentTarget表示当前鼠标点击的组件
    //dataset表示所有自定义属性的集合,然后dataset其中一个属性名是postId的存放的值(如data-postId={{值}})
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})