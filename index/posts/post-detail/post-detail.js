var postsData = require("../../data/posts-data.js")

Page({
  onLoad:function(option){  
    var postIds = option.id; //这个id是post.js的navigate的自定义名称传值过来的
    console.log(postIds);  //获取数组指定的文章下标值
    var postData = postsData.postList[postIds]; //根据postIds值(下标)获取相应文章详情
    console.log(postData)
    // this.data.postaData=postData;     //只能修改数据但不修改视图显示
    this.setData({postaData:postData});    //数据绑定,前面已经说过,相当于上面的data对象变量

  }

})