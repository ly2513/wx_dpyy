
const app = getApp()

Page({
  data: {
    requestUrl:""
  },
  onLoad: function (options) {
    var url = options.url;
    console.log(url)
    this.setData({
      requestUrl: url,
    })
    console.log(this.data.requestUrl)
  },
})