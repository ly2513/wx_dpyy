// pages/orderDetail/orderDetail.js
const app = getApp();
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    orderNo:'',
    delivery_method: 1,
    delivery_status: '',
    time: ''
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    this.getData(options.order_id, options.orderNo);
  },
  // 用户点击右上角分享
  onShareAppMessage: function () {

  },
  getData: function (id, orderNo){
    console.log(orderNo);
    var that = this;
    that.setData({
      orderNo: orderNo
    })
    // 查看详情
    wx.request({
      url: app.globalData.requestUrl + '/Api/Order/getOrderInfo/' + id,
      method: 'POST',
      header: { 'content-type': 'application/json', 'content-type': 'application/x-www-form-urlencoded' },
      dataType: 'json',
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res.data.data);
          that.setData({
            fileList: res.data.data.list,
            delivery_method: res.data.data.delivery_method,
            delivery_status: res.data.data.delivery_status,
            time: res.data.data.time
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
  callPhone:function(){
    wx.makePhoneCall({// 拨打号码
      phoneNumber: '17779185328' //电话号码
    })
  },
  // // 分享
  // onShareAppMessage: function () {

  // }
})