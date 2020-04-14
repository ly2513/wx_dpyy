// pages/shareLibrary.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var flag = Math.floor(Math.random() * 10);
    if (app.globalData.userInfo) {
      console.log(app.globalData.requestUrl + '/Api/File/sharLibrary?union_id=' + app.globalData.unionId + '&falg=' + flag);
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        requestUrl: app.globalData.requestUrl + '/Api/File/sharLibrary?union_id=' + app.globalData.unionId + '&falg=' + flag,
      })
    }
  },


})