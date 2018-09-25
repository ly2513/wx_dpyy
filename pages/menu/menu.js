// menu.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  orderList: function (e) {
    // console.log(e);
    // redirectTo是两个页面之间的平行跳转，navigateTo是父页面与子页面之间的跳转
    // switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
    // 跳转不带tab的页面还是用redirectTo或者navigateTo 
    wx.navigateTo({
      url: '../success/success',
      success:function (res){
        console.log('跳转成功');
      },
      fail:function(e){
        console.log(e);
        console.log('跳转失败');
      }
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
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
  },
  placeOrder :function(e){ // 下单打印
    wx.navigateTo({
      url: '../placeOrder/placeOrder',
      success: function (res) {
        console.log('跳转成功');
      },
      fail: function (e) {
        console.log(e);
        console.log('跳转失败');
      }
    })
  },
  myOrder: function (e) { // 历史订单
    wx.switchTab({
      url: '../order/order',
      success: function (res) {
        console.log('跳转成功');
      },
      fail: function (e) {
        console.log(e);
        console.log('跳转失败');
      }
    })
  },
  servicePrice: function(e){ // 服务价格表
    wx.navigateTo({
      url: '../price/price',
      success: function (res) {
        console.log('跳转成功');
      },
      fail: function (e) {
        console.log(e);
        console.log('跳转失败');
      }
    })
  },
  complaintProposal : function(e){ // 投诉建议 
    console.log(22222);
    wx.navigateTo({
      url: '../proposal/proposal',
      success: function (res) {
        console.log(11111);
        console.log('跳转成功');
      },
      fail: function (e) {
        console.log(e);
        console.log('跳转失败');
      }
    })
  }
})



