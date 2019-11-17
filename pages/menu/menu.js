// menu.js
//获取应用实例
const app = getApp();
app.globalData.openId = '';
app.globalData.unionId = '';
Page({
  data: {
    phone:''
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
    // 设置手机号码
    this.setData({
      phone: app.globalData.phone,
    })
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
    wx.navigateTo({
      url: '../proposal/proposal',
      success: function (res) {
        console.log('跳转成功');
      },
      fail: function (e) {
        console.log(e);
        console.log('跳转失败');
      }
    })
  },
  getPhoneNumber: function (e) { // 手机号码授权
    var ivObj = e.detail.iv
    var telObj = e.detail.encryptedData
    var codeObj = "";
    var that = this;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') { //用户点击拒绝
      wx.showModal({
        title: '提示',
        content: '拒绝授权!',
        showCancel: false,
        success: function (resbtn) {

        }
      })
      return false;
    }
    //------执行Login
    wx.login({
      success: res => {
        console.log('code转换', res.code); //用code传给服务器调换session_key
        if (res.code) {
          wx.request({
            url: app.globalData.requestUrl + '/Api/Login/getWxPhone', //接口地址
            dataType: 'json',
            data: { code: res.code, encryptedData: telObj, iv: ivObj },
            method: 'POST',
            header: { 'content-type': 'application/json' },// 默认值
            success: function (res) {
              console.log(res);
              if (res.data.code == 0) {
                //存储数据并准备发送给下一页使用
                app.globalData.phone = res.data.data.phoneNumber;
                wx.showModal({
                  title: '提示',
                  content: '授权成功!',
                  showCancel: false,
                  success: function (resbtn) {

                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel: false,
                  success: function (resbtn) {
                    that.setData({
                      hidden: true
                    });
                  }
                })
              }
            },
            fail: function (e) {
              wx.showModal({
                title: '提示',
                content: '授权失败！',
                showCancel: false,
                success: function (resbtn) {
                  that.setData({
                    hidden: true
                  });
                }
              })
            }
          })
        }
      }
    });
    //---------登录有效期检查
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        wx.login() //重新登录
      }
    });
  }
  // 分享
  // onShareAppMessage: function () {

  // }
})



