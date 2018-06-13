//index.js
//获取应用实例
const app = getApp();
app.globalData.userInfo = {};
var dev = false;
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
    // wx.openSetting({
    //   success: function success(resopen) {
    //     resopen.authSetting = {
    //       "scope.userInfo": true,
    //       "scope.userLocation": true
    //     }
    //   }   
    // });
  },
  userLogin:function(){
    var that = this;
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.requestUrl + '/Api/Login/getOpenId/' + res.code,
            data: {},
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res);
              app.globalData.openId = res.data.openid; //返回openid
              app.globalData.userInfo.openid = res.data.openid;
              // 登录后台
              wx.request({
                url: app.globalData.requestUrl + '/Api/Login/login',
                data: app.globalData.userInfo,
                dataType: 'json',
                method: 'POST',
                header: { 'Content-Type': 'application/json' },
                success: function (res) {
                  console.log(res);
                  if (res.data.code === 0) {
                    app.globalData.userInfo.avatarUrl = res.data.data.avatar_url;
                    app.globalData.userInfo.nickName = res.data.data.nickname;
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
                    // 获取用户信息
                    wx.getUserInfo({
                      success: function (res) {
                        console.log(res);
                        console.log(3333);
                        app.globalData.userInfo = res.userInfo
                        // openid
                        app.globalData.userInfo.openid = app.globalData.openId;
                        if (app.globalData.userInfo) {
                          // 添加会员信息
                          wx.request({
                            url: app.globalData.requestUrl + '/Api/Login/addMember',
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
                                    // wx.authorize({
                                    //   scope: 'scope.userInfo',
                                    //   success() {
                                    //     // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                                    //     wx.startRecord()
                                    //   }
                                    // });
                                    wx.openSetting({
                                      success: function success(resopen) {
                                        console.log(resopen);
                                        console.log(res.authSetting["scope.userInfo"]);
                                        //  获取用户数据
                                        // that.checkSettingStatu();
                                        that.userLogin();
                                      }
                                    });
                                    wx.getSystemInfo({
                                      success:function(res){
                                        console.log(res);
                                      }
                                    })
                                  }
                                }
                              })
                              console.log('请求失败!')
                            }
                          })
                        }
                      }, fail: function (res) {
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
                        console.log(res);
                        
                      }
                    })
                  }
                },
                fail: function () {
                  wx.showModal({
                    title: '提示',
                    content: '服务器异常!',
                    showCancel: false,
                    success: function (resbtn) {
                      
                    }
                  })
                  console.log('服务器异常!')
                }
              })
              
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },checkSettingStatu:function(){

  }
})
