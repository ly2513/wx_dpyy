//index.js
//获取应用实例
const app = getApp()
//webView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
// wx.showNavigationBarLoading(); // 在当前页面显示导航条加载动画
// wx.hideNavigationBarLoading(); // 隐藏导航条加载动画
// '请选择派送时间',
Page({
  	data: {},
	onLoad: function () {
		var flag = Math.floor(Math.random() * 10);
		if (app.globalData.userInfo) {
			console.log(app.globalData.requestUrl + '/Api/File/index?token=' + wx.getStorageSync("token") + '&falg=' + flag);
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true,
				requestUrl: app.globalData.requestUrl + '/Api/File/index?token=' + wx.getStorageSync("token") + '&falg=' + flag,
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
  onHide: function () { // 页面隐藏 当navigateTo或底部tab切换时调用。
    console.log('重新onHide');
    var self = this;
   // self.onLoad();
  }
})

