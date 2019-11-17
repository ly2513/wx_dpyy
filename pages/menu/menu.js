// menu.js
//获取应用实例
const app = getApp();
app.globalData.openId = '';
app.globalData.unionId = '';
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
  //获取用户信息新接口
  agreeGetUser: function (e) {
    //设置用户信息本地存储
    try {
      wx.setStorageSync('userInfo', e.detail.userInfo)
    } catch (e) {
      wx.showToast({
        title: '系统提示:网络错误',
        icon: 'warn',
        duration: 1500,
      })
    }
    let that = this
    this.setData({
      hidden: false
    })
    that.userLogin(e.detail.userInfo)
  },
  userLogin: function (e) {
    var that = this;
    this.setData({
      hidden: false
    });
    app.globalData.userInfo = e;
    console.log(e);
    wx.login({
      success: function (res) {
        if (res.code) {
          // 登录后台
          wx.request({
            url: app.globalData.requestUrl + '/Api/Login/login/' + res.code,
            dataType: 'json',
            data: app.globalData.userInfo,
            method: 'POST',
            header: { 'Content-Type': 'application/json' },
            success: function (res) {
              console.log(res);
              if (res.data.code === 0) {
                app.globalData.openId = res.data.data.open_id; //返回openid
                app.globalData.unionId = res.data.data.union_id; //返回unionid
                that.setData({
                  hidden: true
                });
                wx.showModal({
                  title: '登陆提示',
                  content: '登录成功',
                  showCancel: true,
                  success: function (resbtn) {
                    if (resbtn.confirm) {
                      // 登录成功后跳转到首页
                      wx.switchTab({
                        url: '../menu/menu',
                        success: function (res) {
                          console.log('跳转成功');
                        },
                        fail: function (e) {
                          console.log(e);
                          console.log('跳转失败');
                        }
                      })
                    }
                  }
                })
              } else {
                wx.showModal({
                  title: '告示',
                  content: '亲爱的小达达们：达派云印小程序正在更新升级中，烦请移驾网站版下单，谢谢！请期待更新后的小程序为您带来更佳的体验吧！',
                  showCancel: true,
                  success: function (resbtn) {
                    that.setData({
                      hidden: true
                    });

                    //that.agreeGetUser();
                    //that.userLogin();
                  }
                })
              }
            },
            fail: function () {
              wx.showModal({
                title: '登陆提示',
                content: '服务器休息了!',
                showCancel: false,
                success: function (resbtn) {
                  that.setData({
                    hidden: true
                  });
                }
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  }
  // 分享
  // onShareAppMessage: function () {

  // }
})



