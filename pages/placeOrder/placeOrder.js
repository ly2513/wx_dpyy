//index.js
//获取应用实例
const app = getApp()
// wx.showNavigationBarLoading(); // 在当前页面显示导航条加载动画
// wx.hideNavigationBarLoading(); // 隐藏导航条加载动画
// '请选择派送时间',
Page({
  data: {},
    //事件处理函数
  bindViewTap: function() {
      wx.navigateTo({
          url: '../logs/logs'
      })
  },
  onLoad: function () {
    console.log(app.globalData.openId);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        openId: app.globalData.openId,
        requestUrl: app.globalData.requestUrl
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

