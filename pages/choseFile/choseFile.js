// pages/choseFile.js
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
    // const eventChannel= this.getOpenerEventChannel()
    // this.setData({
    //   eventChannel:eventChannel
    // })
    var flag = Math.floor(Math.random() * 10);
    if (app.globalData.userInfo) {
      console.log(app.globalData.requestUrl + '/Api/File/chosefile?token=' + wx.getStorageSync("token") + '&falg=' + flag);
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        requestUrl: app.globalData.requestUrl + '/Api/File/chosefile?token=' + wx.getStorageSync("token") + '&falg=' + flag,
      })
    }
  },

  msgHandler: function (res) {
    //这边的res.detail.data是一个数组.存贮这每一次webview触发postMessage的值
    let data = res.detail.data; 
    //如果获取最新的postMessage的值,取数组最后一个就可以了
    let lastData = res.detail.data[res.detail.data.length - 1];
    const eventChannel= this.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', {data: lastData});
    console.log(lastData)
    console.log("取到传过来的值,处理业务啦~")
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
    })
},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})