//index.js
//获取应用实例
const app = getApp()
var dev = true;
// 后端地址
app.globalData.requestUrl = (dev===true) ? 'http://127.0.0.1:1025' : 'https://www.lovecangda.com';
// openID
app.globalData.openId = '';
Page({
  data: {},
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
  },
  userLogin:function(){
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
              
              app.globalData.openId = res.data.openid //返回openid
              // 获取用户信息
              wx.getUserInfo({
                success: function (res) {
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
                        // console.log('请求成功！')
                        if (res.data.code === 0) {
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
                        } else {
                          console.log(res.data.msg)
                        }
                      },
                      fail: function () {
                        console.log('请求失败!')
                      }
                    })
                  }
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
