//index.js
//获取应用实例
const app = getApp()
var utilMd5 = require('../../js/md5.js');
Page({
  data: {
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
  getInputPhone: function (e) {// 获取手机号码
    console.log(e);
    var that = this;
    that.setData({
      phone: e.detail.value
    })
  },
  getInputPassword: function (e) {// 获取密码
    console.log(e);
    var that = this;
    that.setData({
      password: e.detail.value
    })
  },
  login: function(){
    var that = this;
    if (that.data.phone == ''){
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
        showCancel: false,
        success: function (resbtn) {
          that.setData({
            hidden: true
          });
        }
      })
      console.log(phone);
      return false;
    }
    if (that.data.password == '') {
      wx.showModal({
        title: '提示',
        content: '请输入密码',
        showCancel: false,
        success: function (resbtn) {
          that.setData({
            hidden: true
          });
        }
      })
      console.log(phone);
      return false;
    }
    var password = utilMd5.hexMD5(that.data.password); 
    app.globalData.userInfo.password = password;
    app.globalData.userInfo.phone = that.data.phone;
    console.log(app.globalData.userInfo);
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
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  cancel: function (e) { // 取消
    // 跳转到登陆页面
    wx.navigateBack({})
  }
})
