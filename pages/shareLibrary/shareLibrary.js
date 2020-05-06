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
    console.log(app.globalData.openId);
    if (app.globalData.userInfo) {
      console.log(app.globalData.requestUrl + '/Static/daipai-project/daipai-project/indexList.html?url='+encodeURI(app.globalData.requestUrl)+'&token='+wx.getStorageSync("token"));
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        requestUrl: app.globalData.requestUrl + '/Static/daipai-project/indexList.html?open_id=' + app.globalData.openId + '&url=' + app.globalData.requestUrl+'&token='+wx.getStorageSync("token"),
      })
    }
  },


})