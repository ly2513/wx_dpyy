//index.js
//获取应用实例
const app = getApp()
console.log(app.globalData.requestUrl);
// wx.showNavigationBarLoading(); // 在当前页面显示导航条加载动画
// wx.hideNavigationBarLoading(); // 隐藏导航条加载动画
Page({
  data: {
    timeIndex: 0,
    time: ['请选择派送时间','9:00', '9:30', '10:00', '11:30','12:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30']
  },  
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
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
  bindPickerChange: function (e) {
    console.log(this.data.time);
    console.log('下拉选择的是', this.data.time[e.detail.value])
    this.setData({
      timeIndex: e.detail.value
    })
  },
  returnBack: function () {
    wx.navigateBack({
      url: '../menu/menu',
      success: function (res) {
        console.log('跳转成功');
      },
      fail: function (e) {
        console.log(e);
        console.log('跳转失败');
      }
    })
  },
  chooseimage: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9 
      // 可以指定是原图还是压缩图，默认二者都有 
      sizeType: ['original', 'compressed'],
      // 可以指定来源是相册还是相机，默认二者都有
      sourceType: ['album', 'camera'],
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.requestUrl + '/Api/File/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var data = res.data
            console.log(res);
            //do something
          }
        })
        _this.setData({
          tempFilePaths: res.tempFilePaths
        })
      }
    })
  } 
})

