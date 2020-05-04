// pages/shareLibrary.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var flag = Math.floor(Math.random() * 10);
    var token = wx.getStorageSync("token");
    if(!token){
      wx.showModal({
        title: '系统提示',
        content: "请登录后在操作!",
        showCancel: true,
        success: function (resbtn) {
          if (resbtn.confirm) {
            // 跳转登录页
            wx.navigateTo({
              url: '../access/access'
            })
          }
          return false;
        }
      })
    }else{
      if (app.globalData.userInfo) {
        console.log(app.globalData.requestUrl + '/Api/File/sharLibrary?token=' + token + '&falg=' + flag);
        this.setData({
          requestUrl: app.globalData.requestUrl + '/Api/File/sharLibrary?token=' + token + '&falg=' + flag,
        })
      }
    }
  },


})