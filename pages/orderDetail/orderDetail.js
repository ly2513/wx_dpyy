// pages/orderDetail/orderDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    orderNo: '',
    delivery_method: 1,
    delivery_status: '',
    time: '',
    total_price: 0.00,
    status: 0,
    order_id: 0,
    phone_no: '',
    store_name: '',
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    this.getData(options.order_id, options.orderNo, options.status, options.store_name, options.phone_no);

  },
  // 用户点击右上角分享
  onShareAppMessage: function () {

  },
  getData: function (id, orderNo, status, store_name, phone_no) {
    console.log(orderNo);
    var that = this;
    that.setData({
      orderNo: orderNo,
      status: status,
      order_id: id,
      store_name: store_name,
      phone_no: phone_no,
    })
    // 查看详情
    wx.request({

      url: app.globalData.requestUrl + '/Api/Order/getOrderInfo/' + id,
      method: 'POST',
      header: { 'content-type': 'application/json', 'content-type': 'application/x-www-form-urlencoded' },
      dataType: 'json',
      success: function (res) {
        console.log(id);
        if (res.data.code == 0) {
          console.log(res.data.data);
          that.setData({
            fileList: res.data.data.list,
            delivery_method: res.data.data.delivery_method,
            delivery_status: res.data.data.delivery_status,
            time: res.data.data.time,
            total_price: res.data.data.total_price,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: true,
            showSuccess: false
          })
        }
      }, fail: function (res) {
        console.log(res.data.msg);
        wx.showModal({
          title: '提示',
          content: '服务器休息了',
          showCancel: true
        })
      }
    });
  },
  callPhone: function (e) {
    
    console.log(e.currentTarget.dataset.phone_no);
    wx.makePhoneCall({// 拨打号码
      phoneNumber: e.currentTarget.dataset.phone_no //电话号码
    })
  },

  showtoast:function(e){
    console.log(e.currentTarget.dataset.content);
      wx.showToast({
        title: e.currentTarget.dataset.content,
        icon:'none',
      })
  },
  // // 分享
  // onShareAppMessage: function () {

  // }

  payOrder: function (e) {// 订单支付
    // 订单ID
    var id = e.currentTarget.dataset.favorite
    var aa = this;
    // 发起支付
    wx.request({
      url: app.globalData.requestUrl + '/Api/Order/payOrder/' + id,//后台语言的处理 
      method: 'POST',
      header: { 'content-type': 'application/json', 'content-type': 'application/x-www-form-urlencoded' },
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
                    aa.setData({
                      status: 2,
                    })
                    // aa.getData();
                  }
                }
              })
            },
            fail: function (res) {
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

  cancelOrder: function (e) { // 取消订单
    var that = this;
    // 订单ID
    var id = e.currentTarget.dataset.order_id;
    wx.request({
      url: app.globalData.requestUrl + '/Api/Order/cancelOrder/' + id,//后台语言的处理 
      method: 'POST',
      header: { 'content-type': 'application/json', 'content-type': 'application/x-www-form-urlencoded' },
      dataType: 'json',
      success: function (res) {
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: '操作成功',
            showCancel: true,
            success: function (resbtn) {
              if (resbtn.confirm) {
                that.setData({
                  status: 2
                })
                // that.getData();
              }
            }
          })
        } else {
          console.log(res.data.msg);
        }
      }, fail: function (res) {
        console.log('网络异常！');
      }
    });
  },

})