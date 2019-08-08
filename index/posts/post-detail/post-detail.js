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
      var postsCollected = {};  //存放的格式
      postsCollected[postId] = false; //{"0":false}
      wx.setStorageSync("posts_collected", postsCollected)
    }
  },

  onColletionTap:function(event){
    var postsCollected = wx.getStorageSync("posts_collected")
    var postCollected = postsCollected[this.data.currentPostId]
    //再次点击收藏变成未收藏,未收藏变成收藏
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;  //{"0":true}

    this.showModal(postsCollected, postCollected)  //调用自定义函数
  },
  /*弹出对话框*/
  showModal: function (postsCollected, postCollected){
    var that = this;
    wx.showModal({
      title: '微信文章',
      content: postCollected ? "收藏该文章?" : "取消收藏该文章?",
      showCancel: 'true',
      cancelText: '取消',
      confirmText: '确认',
      cancelColor: '#333',
      confirmColor: '#405f80',
      success: function(res){
        if(res.confirm){
          wx.setStorageSync("posts_collected", postsCollected);
          that.setData({ collected: postCollected })  //this只能指向上级函数,参考es6语法
        }
      }
    })
  },
  /*隐式非交互*/
  showToast: function (postsCollected, postCollected){
    // 更新文章是否的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    // 更新数据绑定变量，从而实现切换图片
    this.setData({ collected: postCollected })

    wx.showToast({
      title: postCollected ? "收藏成功" : "取消收藏",
      duration: 1000,
    })
  },
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
})