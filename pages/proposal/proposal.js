//index.js
//获取应用实例
const app = getApp()
// wx.showNavigationBarLoading(); // 在当前页面显示导航条加载动画
// wx.hideNavigationBarLoading(); // 隐藏导航条加载动画
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})

function get_single_by_slug(slug) {
  wx.request({
    url: "your-site/wp-json/wp/v2/posts?slug=" + slug,
    success: function (res) {
      if (res.data.length !== 0) {
        let pid = res.data[0].id
        wx.navigateTo({
          url: '../single/single?pid=' + pid.toString(),
          fail: function (res) {
            no_request()
          }
        })
      }
    },
    fail: function () {
      no_request()
    }
  })
}
