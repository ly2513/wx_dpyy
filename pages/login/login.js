//index.js
//获取应用实例
const app = getApp()
var utilMd5 = require('../../js/md5.js');
Page({
  data: {
    phone: '',//手机号
    code: '',//验证码
    codename: '获取验证码',
    phonename: '自动获取',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

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
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$$/;
    var that = this;
    if (that.data.phone == ''){
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    if (!myreg.test(that.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }

    if (that.data.code == '') {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    // 登录后台
    wx.request({
      url: app.globalData.requestUrl + '/Api/Login/newLogin/',
      dataType: 'json',
      data: { phone: that.data.phone, code: that.data.code},
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        console.log(res);
        if (res.data.code === 0) {
          //必须先清除，否则res.data.data.token会报错
          wx.removeStorageSync('token') ;
          //储存res.data.data.token
          //wx.setStorageSync("token", res.data.data.token) ;
          wx.setStorageSync("token", res.data.data.token) ;
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
        } else if(res.data.code === 3){ // 进行跳转注册
          wx.redirectTo({
            url: '../register/register',
            success: function (res) {
              console.log('跳转成功');
            },
            fail: function (e) {
              console.log('跳转失败');
            }
          })
        } else {
          wx.showModal({
            title: '告示',
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
    //wx.navigateBack({})
    wx.switchTab({
      url: '../menu/menu',
      success: function (res) {
        console.log('跳转成功');
      },
      fail: function (e) {
        console.log('跳转失败');
      }
    })
  },
  sentValidateCode: function(e){ // 获取验证码
    var that = this;
    console.log(this.data);
    var  phone = that.data.phone;
    phone = phone ? phone : e.currentTarget.dataset.phone;
    if (!phone){
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
      return false;
    }
    // 发送验证码
    wx.request({ 
      url: app.globalData.requestUrl + '/Api/Login/sentSmsCode',
      method: "POST",
      data: {phone: phone},
      success: function (res) {
        var dataModel = res.data;
        if (dataModel.code == 0) { // 
          that.countDown(60); // 60s倒计时
        }else{ // 
          wx.showModal({
            title: '提示',
            content: '获取验证码异常',
            showCancel: false,
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
          title: '提示',
          content: '服务器异常',
          showCancel: false,
          success: function (resbtn) {
            that.setData({
              hidden: true
            });
          }
        })
      }
    })
  },
  getPhoneNumber: function (e) { // 自动获取手机号码
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
                    that.setData({
                      phone:res.data.data.phoneNumber,
                      hidden: true
                    });
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
  },
  countDown:function (total_micro_second) { //发送验证码按钮
    var that = this;
    if (total_micro_second <= 0) {
      that.setData({
        codename: "重新发送"
      });
      console.log(codename);
      // timeout则跳出递归
      return false;
    } else {
      // 渲染倒计时时钟
      that.setData({
        codename: total_micro_second + "s"
      });
      console.log(that.data);
      total_micro_second--;
      if (total_micro_second >0) {
        setTimeout(function () {
          that.countDown(total_micro_second);
        }, 1000)
      } else {
        that.setData({
          codename: "重新发送"
        });
      }
    }
  },
  getInputPhone: function (e) {// 获取手机号码
    var that = this;
    that.setData({
      phone: e.detail.value
    })
  },
  getInputCode: function(e){// 获取验证码
    console.log(e);
    var that = this;
    that.setData({
      code: e.detail.value
    })
  },
})
