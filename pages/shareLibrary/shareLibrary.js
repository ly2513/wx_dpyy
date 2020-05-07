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
      console.log(app.globalData.requestUrl + '/Static/daipai-project/indexList.html?open_id=' + app.globalData.openId + '&url=' + app.globalData.requestUrl+'&token='+wx.getStorageSync("token"));
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        requestUrl: app.globalData.requestUrl + '/Static/daipai-project/indexList.html?open_id=' + app.globalData.openId + '&url=' + app.globalData.requestUrl+'&token='+wx.getStorageSync("token"),
      })
    }
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var flag = Math.floor(Math.random() * 10);
        var token = wx.getStorageSync("token");
        if (!token) {
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
        } else {
            console.log(app.globalData.openId);
            var link = app.globalData.requestUrl + '/Static/daipai-project/indexList.html';
            if (app.globalData.userInfo) {
                console.log(link + '?token=' + token + '&open_id=' + app.globalData.openId + '&url=' + app.globalData.requestUrl);
                this.setData({
                    userInfo: app.globalData.userInfo,
                    hasUserInfo: true,
                    requestUrl: link + '?token=' + token + '&open_id=' + app.globalData.openId + '&url=' + app.globalData.requestUrl,
                })
            }
        }
    },
})