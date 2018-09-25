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
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    modalHidden: true
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
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  callPhone:function(e){
    wx.makePhoneCall({// 拨打号码
      phoneNumber: '18679128532' //电话号码
    })
  },
  launchAppError: function (e) {
    console.log(e.detail.errMsg)
  }, 
  navigation:function(e){
    wx.openLocation({ //出发wx.openLocation API
      latitude: 28.669291,  //坐标纬度（从地图获取坐标）
      longitude: 115.819434,//坐标经度（从地图获取坐标
      name: "南昌市沧达广告有限公司", //打开后显示的地址名称
      scale: 28,
      address: '沧达'  //打开后显示的地址汉字
    })
  },callQq:function(){ // 复制QQ号
    wx.setClipboardData({
      data: '1225599688',
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '复制QQ成功',
          showCancel: false
        });
      }
    })
  },callWx:function(){
    this.setData({
      modalHidden: false
    })
  }
  
})
