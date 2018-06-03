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
        hasUserInfo: true,
        openId: app.globalData.openId
      })
    }
    var that = this;
    // 获取订单数据
    wx.request({
      url: app.globalData.requestUrl + '/Api/Order/getOrder?open_id=' + app.globalData.openId,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if(res.data.code === 0){
          console.log(res.data.data)
          that.setData({
            orderList: res.data.data
          })
        }else{
          console.log(res.msg);
        }
        
      }
    })
      
    
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
