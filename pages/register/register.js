//index.js
//获取应用实例
const app = getApp()
var utilMd5 = require('../../js/md5.js');
Page({
  data: {
    phone: '',//手机号
    code: '',//验证码
    codename: '获取验证码',
    password:'',
    rePassword: '',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var phoneNo = '';
    var unionId = '';
    var that = this;
    wx.getStorage({//获取本地缓存
      key: "phoneNo",
      success: function (res) {
        that.setData({
          phoneNo: res.data
        });
      },
    })
    wx.getStorage({//获取本地缓存
      key: "unionId",
      success: function (res) {
        that.setData({
          unionId: res.data
        });
      },
    })
    wx.getStorage({//获取本地缓存
      key: "unionId",
      success: function (res) {
        that.setData({
          unionId: res.data
        });
      },
    })
  },
  getInputPhone: function (e) {// 获取手机号码
    console.log(e);
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
  getInputPassword:function(e){
    console.log(e);
    var that = this;
    that.setData({
      password: utilMd5.hexMD5(e.detail.value)
    })
  },
  getInputRePassword: function (e) {
    console.log(e);
    var that = this;
    that.setData({
      rePassword: utilMd5.hexMD5(e.detail.value)
    })
  },
  sentValidateCode: function(e){ // 获取验证码
    var that = this;
    console.log(this.data);
    var  phone = that.data.phone;
    phone = phone ? phone : e.currentTarget.dataset.phone;
    console.log(phone);
    die;
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
      console.log(phone);
      return false;
    }
    // 发送验证码
    wx.request({ 
      url: app.globalData.requestUrl + '/Api/Login/sentSmsCode',
      method: "POST",
      data: {phone: phone},
      success: function (res) {
        var dataModel = res.data;
        console.log(dataModel);
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
  save:function(e){
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    var that = this;

    if (that.data.phone == "") {
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
    if (that.data.code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (that.data.password == ""){
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (that.data.rePassword == "") {
      wx.showToast({
        title: '确认密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (that.data.rePassword != that.data.password) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    // 发送验证码
    wx.request({
      url: app.globalData.requestUrl + '/Api/Login/register',
      method: "POST",
      data: { phone: that.data.phone, password: that.data.password, rePassword: that.data.rePassword, code: that.data.code, unionId: that.data.unionId},
      success: function (res) {
        var dataModel = res.data;
        console.log(res);
        console.log(dataModel);
        if (dataModel.code == 0) { // 
          wx.showModal({
            title: '提示',
            content: '注册成功',
            showCancel: false,
            success: function (resbtn) {
              // 跳转到登陆页面
              wx.redirectTo({
                url: '../login/login',
              })
            }
          })
        } else { // 
          wx.showModal({
            title: '提示',
            content: dataModel.msg,
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
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  cancel:function(e){ // 取消
    // 跳转到登陆页面
    wx.navigateBack({})
  }
})
