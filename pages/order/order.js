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
  payOrder: function(e) {
    // 订单ID
    var id = e.currentTarget.dataset.favorite 
    // 发起支付
    wx.request({
      url: app.globalData.requestUrl + '/Api/Order/payOrder/' + id,//后台语言的处理 
      method: 'POST',   
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res);
        var nonceStr = res.data.nonceStr;
        var appId = res.data.appId;
        var pkg = 'prepay_id=' + res.data.prepay_id;
        var timeStamp = res.data.timeStamp;
        var paySign = res.data.paySign;
        var sign = res.data.sign;
        //console.log(pkg);  
        wx.requestPayment({
          timeStamp: timeStamp,
          nonceStr: nonceStr,
          package: pkg,
          signType: 'MD5',
          paySign: paySign,
          success: function (res) {
            that.changeOrderIdPay(orderId);
          }
        })
      }
    }); 
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
