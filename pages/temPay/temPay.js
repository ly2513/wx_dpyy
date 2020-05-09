const app = getApp()
// pages/temPay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    action: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.action);
    var action = options.action;
    var document_id = options.document_id;
    var source_name = options.source_name;
    console.log(action);
    console.log(document_id);
    if (!document_id || !action) {
      wx.navigateBack({
        delta: 1,
      })
      return
    }
    if (action == 'pay') {
      this.action = 1;
      console.log(app.globalData.unionId);
      wx.request({
        url: app.globalData.requestUrl + '/Api/Library/addOrder?token=' + wx.getStorageSync("token"),
        method: 'POST',
        header: { 'content-type': 'application/json', 'content-type': 'application/x-www-form-urlencoded' },
        dataType: 'json',
        data: {
          document_id: document_id,
          token: wx.getStorageSync("token")
        },
        success(res) {
          console.log(res.data);
          if (res.data.code == 0) {
            console.log(res);
            var nonceStr = res.data.data.nonceStr;
            var appId = res.data.data.appId;
            var pkg = res.data.data.package;
            var timeStamp = res.data.data.timeStamp;
            var paySign = res.data.data.paySign;
            wx.requestPayment({
              timeStamp: timeStamp,
              nonceStr: nonceStr,
              package: pkg,
              signType: 'MD5',
              paySign: paySign,
              success: function (res) {
                wx.showModal({
                  title: '提示',
                  content: '支付成功,再次点击该文档即可下载',
                  showCancel: false,
                  success: function (btn) {
                    // wx.navigateBack({
                    //   complete: (res) => {}
                    // })
                  }
                })
              }, fail: function (res) {

              }
            })
          } else {
            console.log('失败' + res.msg)
            wx.showToast({
              title: res.data.msg,
            })
          }
        }, fail: function (res) {
          console.log(res.data.msg);
          wx.showModal({
            title: '支付失败',
            content: '支付失败。',
            showCancel: true,
            success: function (resbtn) {
              if (resbtn.confirm) {

              }
            }
          })
        }
      })
    } else if (action == 'share') {
      this.setData({
        action: 2
      });
    } else {
      var self=this;
      this.action = 3;
      var typeUrl = app.globalData.requestUrl + '/Api/Library/getDocumenType?document_id=' + document_id + '&token=' + wx.getStorageSync("token");
      wx.request({
        url: typeUrl,
        method: 'GET',
        header: { 'content-type': 'application/json', 'content-type': 'application/x-www-form-urlencoded' },
        dataType: 'json',
        success: function (res) {
          console.log(res.data)
          if (res.data.code == 0) {
            source_name=res.data.data;
            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            var url = app.globalData.requestUrl + '/Api/Library/downDocument?2=' + document_id + "&3=" + timestamp + '&token=' + wx.getStorageSync("token");
            console.log(url);
            var rootPath = wx.env.USER_DATA_PATH;
            var cachePath = rootPath + "/dpyy";
            if (!self.ifFile(cachePath)) {
              console.log("创建路径");
              self.mkdir(cachePath);
            }
            wx.downloadFile({
              url: url,
              filePath: cachePath + "/" + source_name,
              success(res) {
                var tempFilePath = res.tempFilePath;
                wx.openDocument({
                  filePath: res.filePath,
                  success(res) {
                    wx.navigateBack({
                      complete: (res) => { },
                    })
                  }
                })
              }, fail(res) {
                wx.showToast({
                  title: '文件下载错误',
                })
              }
            })
          } else {
            wx.navigateBack({
              complete: (res) => { },
            })
          }
        }
      })

    }

  },
  onShareAppMessage(res) {
    return {
      title: '达派云印',
      path: '/pages/access/access',
      imageUrl: '/images/shouye.png'
    }
  },
  onHide(res) {

  },
  ifFile: function (cachePath) {
    wx.getFileSystemManager().access({
      path: cachePath,
      success(res) {
        console.log("路径存在");
        return true;
      },
      fail(res) {
        console.log("路径不存在")
        return false;
      }
    })
  },
  mkdir: function (cachePath) {
    let fm = wx.getFileSystemManager();
    fm.mkdir({
      dirPath: cachePath,
      recursive: true,
      success: function (res) {

      },
      fail: function (err) {
        // wx.showToast({
        //   // title: 'title',
        //   // icon: "none"
        // })
      }
    });
  },

})