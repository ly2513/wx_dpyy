const app = getApp()
// pages/temPay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    action:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.action);
    var action=options.action;
    var document_id=options.document_id;
    console.log(action);
    console.log(document_id);
    if(!document_id||!action){
      wx.navigateBack({
        delta: 1,          
      })
      return
    } 
    if(action=='pay'){
      this.action=1;
      console.log(app.globalData.unionId);
    wx.request({
      url: app.globalData.requestUrl + '/Api/Library/addOrder',
      method: 'POST',
      header: { 'content-type': 'application/json', 'content-type': 'application/x-www-form-urlencoded' },
      dataType: 'json',
      data:{
        document_id:document_id,
        union_id:app.globalData.unionId
      },
      success(res){
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
            success:function (res) {
              wx.showModal({
                title: '提示',
                content: '支付成功,再次点击该文档即可下载',
                showCancel: false,
                success:function (btn) {
                  // wx.navigateBack({
                  //   complete: (res) => {}
                  // })
                }
              })
            },fail :function (res) {
              
            }
          })
        }else{
          console.log('失败'+res.data.msg)
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
    }else if(action=='share'){
      this.setData({
        action: 2
      });
    } else{
      this.action=3;
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var url = app.globalData.requestUrl + '/Api/Library/downDocument' + "?1=" + app.globalData.openId + "&2=" + document_id+"&3="+timestamp;
      console.log(url);
      wx.downloadFile({
        url: url,
        success(res){
          var tempFilePath=res.tempFilePath;
          wx.openDocument({
            filePath: tempFilePath,
            success(res){
              wx.navigateBack({
                complete: (res) => {},
              })
            }
          })
        },fail(res){
          wx.showToast({
            title: '文件下载错误',
          })
        }
      })
    }

  },
  onShareAppMessage(res){
    return {
      title: '达派云印',
      path: '/pages/access/access',
      imageUrl:'/images/shouye.png'
    }
  },
  onHide(res){
    wx.navigateBack({
      complete: (res) => {},
    })
  }
  
})