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
    this.getOrder();
  },
  payOrder: function(e) {
    var that = this;
    // 订单ID
    var id = e.currentTarget.dataset.favorite 
    // 发起支付
    wx.request({
      url: app.globalData.requestUrl + '/Api/Order/payOrder/' + id,//后台语言的处理 
      method: 'POST',   
      header: { 'content-type': 'application/json', 'content-type': 'application/x-www-form-urlencoded' },
      dataType: 'json',
      success: function (res) {
        if (res.data.code == 0){
          console.log(res);
          var nonceStr = res.data.data.nonceStr;
          var appId = res.data.data.appId;
          var pkg = res.data.data.package;
          var timeStamp = res.data.data.timeStamp;
          var paySign = res.data.data.paySign; 
          wx.requestPayment({
            timeStamp: timeStamp,
            nonceStr: nonceStr,
            package: pkg,
            signType: 'MD5',
            paySign: paySign,
            success: function (res) {
              wx.request({
                url: app.globalData.requestUrl + '/Api/Order/updateOrderStatus/' + id,//后台语言的处理 
                method: 'POST',
                header: { 'content-type': 'application/json', 'content-type': 'application/x-www-form-urlencoded' },
                dataType: 'json',
                success: function (res) {
                  if (res.data.code == 0){
                    that.getOrder();
                    console.log('更新订单成功！');
                  }else{
                    console.log(res.data.msg);
                  }
                },fail:function(res){
                  console.log('网络异常！');
                }
              });
            },
            fail: function (res) {
              if (res.data){
                console.log(res.data.msg);
              }
              alert('支付取消！');
            }
          })
        }else{
          console.log(res.data.msg);
          alert('支付失败！');
        }
      }, fail:function(res){
        console.log(res.data.msg);
        alert('支付失败！');
      }
    }); 
  },
  getOrder:function(){
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
        if (res.data.code === 0) {
          console.log(res.data.data)
          that.setData({
            orderList: res.data.data
          })
        } else {
          console.log(res.msg);
          alert('获取数据失败！');
        }
      }
    })
  }
})
