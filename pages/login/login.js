//index.js
//获取应用实例
const app = getApp();
app.globalData.userInfo = {};
var dev = true;
// https://www.lovecangda.com
// 后端地址
app.globalData.requestUrl = (dev === true) ? 'http://127.0.0.1:1025' : 'https://www.lovecangda.com';
// openID
app.globalData.openId = '';
Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.setData({
      hidden: true
    });
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
                that.setData({
                  hidden: true
                });
                wx.showModal({
                  title: '提示',
                  content: '登录成功',
                  showCancel: false,
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
                  title: '提示',
                  content: '登录失败，请重新登陆',
                  showCancel: false,
                  success: function (resbtn) {
                    that.setData({
                      hidden: true
                    });
                    that.agreeGetUser();
                    that.userLogin();
                  }
                })
              }
            },
            fail: function () {
              wx.showModal({
                title: '提示',
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
})
