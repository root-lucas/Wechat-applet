// index/posts/post.js
// var postsData = require("/index/data/posts-data.js") //error,不能使用绝对路径，只能使用相对路径
var postsData = require("../data/posts-data.js")
var common = require('post-item/post-item-template.js')

Page({

  /**
   * Page initial data
   */
  data: {
    date: "Jun 6 2019",
    title: "锄禾日当午,粒粒皆辛苦",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    
    this.setData({ post_key: postsData.postList });   //小程序总是会读取data对象来做数据绑定
      // this.data.post_key = postsData.postList;  //error
    common.say()
    // var post_content2 = {

    // }
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