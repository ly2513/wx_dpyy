//index.js
//获取应用实例
const app = getApp()
var dev = true;
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

  },
  userLogin:function(){
    var that = this;
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxdf7ab6b5266fa384&secret=7b6bcdd8eaf5292cbfcf79eb71b63379&js_code=' + res.code + '&grant_type=authorization_code',
            data: {},
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res);
              app.globalData.openId = res.data.openid //返回openid
              // 获取用户信息
              wx.getUserInfo({
                success: function (res) {
                  console.log(res);
                  console.log(3333);
                  app.globalData.userInfo = res.userInfo
                  // openid
                  app.globalData.userInfo.openid = app.globalData.openId;
                  if (app.globalData.userInfo) {
                    console.log(app.globalData.userInfo);
                    // 执行登录操作
                    wx.request({
                      url: app.globalData.requestUrl + '/Api/Login/login',
                      data: app.globalData.userInfo,
                      dataType: 'json',
                      method: 'POST',
                      header: { 'Content-Type': 'application/json' },
                      success: function (res) {
                        console.log(res);
                        if (res.data.code === 0) {
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
                            content: res.data.msg,
                            showCancel: false,
                            success: function (resbtn) {
                              if (resbtn.confirm) {
                                
                              }
                            }
                          })
                          console.log(res.data.msg)
                        }
                      },
                      fail: function () {
                        wx.showModal({
                          title: '用户未授权',
                          content: '如需正常使用该小程序功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
                          showCancel: false,
                          success: function (resbtn) {
                            if (resbtn.confirm) {
                              wx.openSetting({
                                success: function success(resopen) {
                                  console.log(resopen);
                                  //  获取用户数据
                                  // that.checkSettingStatu();
                                }
                              });
                            }
                          }
                        })
                        console.log('请求失败!')
                      }
                    })
                  }
                }, fail: function (res) {
                  console.log(res);
                }
              })
              // }
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  }
})
