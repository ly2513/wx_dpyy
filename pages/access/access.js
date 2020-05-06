//index.js
//获取应用实例
const app = getApp();
app.globalData.userInftrueo = {};
var dev = false;
// https://www.lovecangda.com
// 后端地址
app.globalData.requestUrl = (dev === false) ? 'http://dp-dev.dpyunyin.com' : 'https://dp-stg.dpyunyin.com';
// app.globalData.requestUrl = (dev === false) ? 'http://127.0.0.1:1026' : 'https://dp-stg.dpyunyin.com';
app.globalData.phone = '';
app.globalData.token = '';
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
  agreeGetUser: function (e) { //获取用户信息新接口
    let that = this;
    that.setData({
      hidden: false
    });
    //设置用户信息本地存储
    try {
      wx.setStorageSync('userInfo', e.detail.userInfo);
      wx.login({
        success: function (res) {
          if (res.code) {
            // 登录后台
            wx.request({
              url: app.globalData.requestUrl + '/Api/Login/login/' + res.code,
              dataType: 'json',
              data: app.globalData.userInfo,
              method: 'POST',
              // header: { 'Content-Type': 'application/json','token': wx.getStorageSync("token") },
              success: function (res) {
                if (res.data.code === 0) {
                  that.setData({
                    hidden: true
                  });
                  //必须先清除，否则res.data.data.token会报错
                  wx.removeStorageSync('token') ;
                  //储存res.data.data.token
                  //wx.setStorageSync("token", res.data.data.token) ;
                  wx.setStorageSync("token", res.data.data.token) ;
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
                    title: '提示',
                    content: res.data.msg,
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
    } catch (e) {
      wx.showToast({
        title: '系统提示:网络错误',
        icon: 'warn',
        duration: 1500,
      })
    }
    that.userLogin(e.detail.userInfo)
  },
  userLogin: function (e) {
    // 设置用户信息
    app.globalData.userInfo = e;
    // 跳转到登陆页面
    // wx.redirectTo({
    //   url: '../login/login',
    // })
  },
  noticeUserMsg: function (e){
    wx.showModal({
      title: '温馨提示',
      content: '为确保用户的文印数据安全和服务，请您设置手机号码，以此作平台唯一的安全身份标识。',
      success: function (res) {
        console.log(res);
        // 取消
        if (res.cancel){
          // 跳转到菜单
          wx.switchTab({
            url: '../menu/menu',
          })
        }
        // 确定
        if(res.confirm){
          // 跳转到注册页面
          wx.navigateTo({
            url: '../register/register',
          })
        }
      },
      fail: function (rs){
        wx.showModal({
          title: '提示',
          content: '网络异常，请稍后继续操作。',
          success: function (res) {
            
          },
          fail: function (rs) {

          }
        })
      }
    })
  },
  // getPhoneNumber: function (e){ // 手机号码授权
  //   var ivObj = e.detail.iv
  //   var telObj = e.detail.encryptedData
  //   var codeObj = "";
  //   var that = this;
  //   if (e.detail.errMsg == 'getPhoneNumber:fail user deny') { //用户点击拒绝
  //     wx.showModal({
  //       title: '提示',
  //       content: '拒绝授权!',
  //       showCancel: false,
  //       success: function (resbtn) {
         
  //       }
  //     })
  //     return false;
  //   }
  //   //------执行Login
  //   wx.login({
  //     success: res => {
  //       console.log('code转换', res.code); //用code传给服务器调换session_key
  //       if (res.code) {
  //         wx.request({
  //           url: app.globalData.requestUrl + '/Api/Login/getWxPhone', //接口地址
  //           dataType: 'json',
  //           data: {code: res.code,encryptedData: telObj,iv: ivObj},
  //           method: 'POST',
  //           header: { 'content-type': 'application/json'  },// 默认值
  //           success: function (res) {
  //             console.log(res);
  //             if(res.data.code ==0){
  //               //phoneObj = res.data.phoneNumber;
  //               console.log("手机号=", res.data.data.phoneNumber)
  //               //存储数据并准备发送给下一页使用
  //               wx.setStorage(
  //                 { key: "phoneNo",data: res.data.data.phoneNumber}
  //               );
  //               wx.setStorage(
  //                 { key: "unionId", data: res.data.data.unionId }
  //               );
  //               // 跳转到注册页面
  //               wx.navigateTo({
  //                 url: '../register/register',
  //               })
  //             } else {
  //               wx.showModal({
  //                 title: '提示',
  //                 content: res.data.msg,
  //                 showCancel: false,
  //                 success: function (resbtn) {
  //                   that.setData({
  //                     hidden: true
  //                   });
  //                 }
  //               })
  //             }
  //           },
  //           fail:function(e){
  //             wx.showModal({
  //               title: '提示',
  //               content: '授权失败！',
  //               showCancel: false,
  //               success: function (resbtn) {
  //                 that.setData({
  //                   hidden: true
  //                 });
  //               }
  //             })
  //           }
  //         })
  //       }
  //     }
  //   });
  //   //---------登录有效期检查
  //   wx.checkSession({
  //     success: function () {
  //       //session_key 未过期，并且在本生命周期一直有效
  //     },
  //     fail: function () {
  //       // session_key 已经失效，需要重新执行登录流程
  //       wx.login() //重新登录
  //     }
  //   });
  // }
})
