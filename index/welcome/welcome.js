// index/welcome/welcome.js
Page({

  /**
   * Page initial data
   */
  data: {

  },
  onTap:function(){
    // //1.跳转到非选项卡页面,隐藏当前页面,拥有返回按钮
    // wx.navigateTo({
    //   url: "../posts/post",
    //   fail: function(res) {console.log("error")},
    // })
    // //2.卸载当前页面,不存在返回按钮
    // wx.redirectTo({
    //   url: '../posts/post',
    // })
    //3.如果要跳转至带tab选项卡的页面必须使用switchTap方法
    wx.switchTab({
      url: "../posts/post"
    });
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