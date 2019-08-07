var postsData = require("../../data/posts-data.js")

Page({
  data: { collected: false },
  onLoad:function(option){  
    var postId = option.id; //这个id是post.js的navigate的自定义名称传值过来的
    this.data.currentPostId = postId
    var postData = postsData.postList[postId]; //根据postId值(下标)获取相应文章详情
    // console.log(postData)
    // this.data.postaData=postData;       //只能修改数据但不修改视图显示
    this.setData({postaData:postData});    //数据绑定,前面已经说过,相当于上面的data对象变量
    
    //实现收藏功能
    var postsCollected = wx.getStorageSync("posts_collected");    //注意这个键千万别填错
    if (postsCollected){
      var postCollected = postsCollected[postId]
      this.setData({collected:postCollected})
    }else{
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync("posts_collected", postsCollected)
    }
  },
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

})