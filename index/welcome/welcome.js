// index/welcome/welcome.js
Page({

  /**
   * Page initial data
   */
  data: {

  },
  onTap:function(){
    wx.navigateTo({
      url: '../posts/post',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    // wx.redirectTo({
    //   url: '../posts/post',
    // })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

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