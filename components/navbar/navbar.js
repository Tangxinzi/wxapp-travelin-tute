// components/navbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShare: {
      //如果是分享页主页按钮需要显示
      type: Boolean,
      value: false
    },
    title: {
      //页面的标题
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
   
  },

  attached: function() {
    var pages = getCurrentPages();
    //获取页面集合
    let startBarHeight = 20;
    //设置默认状态栏高度
    let navgationHeight = 52;
    //设置默认导航栏高度44,52
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        var isIphone = true;
        //是否为苹果手机，用于后面判断是否需要显示状态栏高度
        var isHome = false;
        //记录是否是首页
        if (res.model == 'iPhone X') {
          startBarHeight == 44
          //如果是苹果手机，则状态栏高度为44
        }
        if (res.model.indexOf('iphone') == -1) {
          isHome = true;
          //是否是首页赋值
        } else {
          isHome = pages.length === 1 ? false : true
          //其他页面根据页面栈来赋值
        }
        that.setData({
          startBarHeight: startBarHeight,
          navgationHeight: navgationHeight,
          isIphone: isIphone,
          isHome: isHome
        })
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    backPrev: function backPrev() {
      wx.navigateBack({});
      //返回上一级按钮事件
    },
    goHome: function goHome() {
      if (this.data.isShare) {
        wx.redirectTo({
          //如果是分享则使用跳转到首页
          url: '/pages/home/index',
        })
      } else {
        wx.navigateBack({
          delta: 9999999
          //其他页面则返回到首页
        })
      }
    }
  }

})