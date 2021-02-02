// pages/chosePhotoSize.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  start_photo_1:function(e){
    wx.navigateTo({
      url: '../preparePhoto/preparePhoto?photo_type=3',
    })
  },
  start_photo_2:function(e){
    wx.navigateTo({
      url: '../preparePhoto/preparePhoto?photo_type=4',
    })
  },
  start_photo_3:function(e){
    wx.navigateTo({
      url: '../preparePhoto/preparePhoto?photo_type=5',
    })
  },
  start_photo_4:function(e){
    wx.navigateTo({
      url: '../preparePhoto/preparePhoto?photo_type=6',
    })
  },
  start_photo_5:function(e){
    wx.navigateTo({
      url: '../preparePhoto/preparePhoto?photo_type=7',
    })
  },
  start_photo_6:function(e){
    wx.navigateTo({
      url: '../preparePhoto/preparePhoto?photo_type=8',
    })
  },
  start_photo_7:function(e){
    wx.navigateTo({
      url: '../preparePhoto/preparePhoto?photo_type=4',
    })
  },
  start_photo_8:function(e){
    wx.navigateTo({
      url: '../preparePhoto/preparePhoto?photo_type=4',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  
})