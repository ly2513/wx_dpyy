// pages/payOrder/payOrder.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl_1:"",
    imgUrl_2:"",
    imgUrl_3:"",
    id:"",
    price_fen:"",
    price:0,
    imgs:[]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id;
    var price_fen=options.price_fen;
    console.log(id)
    console.log(price_fen)
    this.getAdver()
    if(id==undefined||price_fen==undefined){
      wx.showToast({
        title: '参数错误，请重新再试',
        icon:"none"
      })
      return
    }
    this.setData({
      imgUrl_1:app.globalData.requestUrl + '/Static/images/v1.1/banner_1.jpeg',
      imgUrl_2:app.globalData.requestUrl + '/Static/images/v1.1/banner_2.jpeg',
      imgUrl_3:app.globalData.requestUrl + '/Static/images/v1.1/banner_3.jpeg',
      id:id,
      price_fen:price_fen,
      price:price_fen/100.00
    })
  },
  
  pay(){
    var that=this;
    wx.request({
      url: app.globalData.requestUrl + '/Api/Order/payOrder/' +this.data.id ,//后台语言的处理 
      method: 'POST',
      header: { 'content-type': 'application/json', 'content-type': 'application/x-www-form-urlencoded', 'token': wx.getStorageSync("token")},
      dataType: 'json',
      success: function (res) {
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
              console.log(res)
              wx.showModal({
                title: '提示',
                content: '支付成功',
                showCancel: true,
                success: function (resbtn) {
                  if (resbtn.confirm) {
                    wx.requestSubscribeMessage({
                      tmplIds: ['fUBqODd2mYiBNkasdBseV1InmntcrHvKNOdUCJwqNrM'],
                      success(res){
                        console.log(res.errMsg+res.TEMPLATE_ID);
                        wx.navigateBack({
                          complete: (res) => {},
                        })
                      },
                      fail(res){
                        console.log(res.errCode+res.errMsg);
                        wx.navigateBack({
                          complete: (res) => {},
                        })
                      }
                    })
                    // aa.getData();

                  }
                }
              })
            },
            fail: function (res) {
              wx.navigateBack({
                complete: (res) => {},
              })
              wx.showModal({
                title: '支付取消',
                content: '支付取消。',
                showCancel: false,
                success: function (resbtn) {
                  if (resbtn.confirm) {
                    
                  }
                }
              })
            }
          })
        } else {
          wx.navigateBack({
            complete: (res) => {},
          })
          wx.showModal({
            title: '支付失败',
            content: res.data.msg,
            showCancel: true,
            showSuccess: false,
            success: function (resbtn) {

            }
          })
        }
      }, fail: function (res) {
        console.log(res.data.msg);
        wx.navigateBack({
          complete: (res) => {},
        })
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
    });
  },
  getAdver() {
    var that=this
    var url = app.globalData.requestUrl + '/Api/Order/getAdvertisingList'
    wx.request({
      url: url,
      header: {
        'Content-Type': 'application/json',
        'token': wx.getStorageSync("token")
      },
      success(res) {
        console.log(res.data)
        console.log(res.data.data[0])
        var images=res.data.data
        for(var i=0;i<images.length;i++){
          console.log(images[i].img_path)
          images[i].img_path=app.globalData.requestUrl+images[i].img_path
        }
        that.setData({
          imgs:images
        })
      }
    })
  }
  
})