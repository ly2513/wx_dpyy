//index.js
//获取应用实例
const app = getApp();
app.globalData.userInfo = {};
var dev = true;
// https://www.lovecangda.com
// 后端地址
app.globalData.requestUrl = (dev === true) ? 'http://dp-dev.dpyunyin.com' : 'https://dp-stg.dpyunyin.com';
app.globalData.pdfUrl = (dev === true) ? 'https://pdf-dev.dpyunyin.com' : 'https://pdf-stg.dpyunyin.com';

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
    wx.setStorageSync('userInfo', e.detail.userInfo);
    let that = this;
    wx.showModal({
      title: '系统提示',
      content: '为确保用户的文印数据安全和服务，请您设置手机号码，以此作平台唯一的安全身份标识。',
      showCancel: true,
      success: function (resbtn) {
        that.setData({
          hidden: false
        });
        if (resbtn.confirm) {
          //设置用户信息本地存储
          // 跳转登录页
          wx.navigateTo({
            url: '../login/login'
          });
          that.setData({
            hidden: true
          });
        }
      }
    })
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
  }
})
