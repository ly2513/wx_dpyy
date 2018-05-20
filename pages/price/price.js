//获取应用实例
const app = getApp()

Page({
  data: {
    // listData: [
    //   { "code": "01", "text": "text1", "type": "type1" },
    //   { "code": "02", "text": "text2", "type": "type2" },
    //   { "code": "03", "text": "text3", "type": "type3" },
    //   { "code": "04", "text": "text4", "type": "type4" },
    //   { "code": "05", "text": "text5", "type": "type5" },
    //   { "code": "06", "text": "text6", "type": "type6" },
    //   { "code": "07", "text": "text7", "type": "type7" },
    //   { "code": "08", "text": "text08", "type": "type08" },
    //   { "code": "09", "text": "text09", "type": "type09" },
    //   { "code": "10", "text": "text10", "type": "type10" }
    // ]
  },
  // 事件处理函数
  bindViewTap: function () {
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
    }
    var that = this; 
    // 请求价格表
    wx.request({
      url: app.globalData.requestUrl + '/Api/Cost/getCost',
      data: {},
      dataType: 'json',
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        console.log(res);
        // console.log('请求成功！')
        if (res.data.code === 0) {
          console.log(res.data.data);
          // 登录成功后跳转到首页
          that.setData({
            listData: res.data.data
          });
         
        } else {
          console.log(res.data.msg)
        }
      },
      fail: function () {
        console.log('请求失败!')
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }

})