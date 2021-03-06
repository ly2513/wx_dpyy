// menu.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hideHeader: true,
    hideBottom: true,
    refreshTime: '', // 刷新的时间 
    contentlist: [], // 列表显示的数据源
    allPages: 0,    // 总页数
    currentPage: 1,  // 当前页数  默认是1
    file_name: '', // 搜索的文件名称
    loadMoreData: '加载更多……'
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getData();
  },
  onShow(){ // 记入页面刷新
    this.getData(); 
  },
  loadMore: function () { // 上拉加载更多
    var self = this;
    // 当前页是最后一页
    if (self.data.currentPage == self.data.allPages) {
      self.setData({
        loadMoreData: '已经到顶'
      })
      return;
    }
    setTimeout(function () {
      console.log('上拉加载更多');
      var tempCurrentPage = self.data.currentPage;
      tempCurrentPage = tempCurrentPage + 1;
      self.setData({
        currentPage: tempCurrentPage,
        hideBottom: false
      })
      self.getData();
    }, 300);
  },
  // 获取数据  pageIndex：页码参数
  getData: function () {
    var self = this;
    var pageIndex = self.data.currentPage;
    wx.request({
      url: app.globalData.requestUrl + '/Api/Order/getOrder',
      data: {
        open_id: app.globalData.openId,
        perPage: 5,
        page: pageIndex,
        fileName: this.data.file_name
      },
      success: function (res) {
        var dataModel = res.data;
        console.log(dataModel);
        if (dataModel.code == 0) {
          if (pageIndex == 1) { // 下拉刷新
            self.setData({
              allPages: dataModel.data.totalPage,
              contentlist: dataModel.data.list,
              hideHeader: true
            })
           
          } else { // 加载更多
            console.log('加载更多');
            var tempArray = self.data.contentlist;
            tempArray = tempArray.concat(dataModel.data.list);
            self.setData({
              allPages: dataModel.data.totalPage,
              contentlist: tempArray,
              hideBottom: true
            })
          }
        }
      },
      fail: function () {
      }
    })
  }, 
  onPullDownRefresh: function () {
    var self = this;
    console.log(1111);
    wx.showNavigationBarLoading() //在标题栏中显示加载
    self.getData();
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);

  },
  seachOrder: function(e){// 执行查询操作
    this.getData();
  },
  formName: function (e) {// 设置查询文件的名称
    this.setData({
      file_name: e.detail.value
    })
  },
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
                      currentPage: 1,
                      hideHeader: false
                    })
                    aa.getData();
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
  getOrderDetail: function(e){ // 订单详情
    var that = this;
    // 订单ID
    var id = e.currentTarget.dataset.order_id;
    var orderNo = e.currentTarget.dataset.order_no;
    console.log(orderNo);
    // 登录成功后跳转到首页
    wx.navigateTo({
      url: '../orderDetail/orderDetail?order_id=' + id + '&orderNo=' + orderNo,
      success: function (res) {
        
      },
      fail: function (e) {
        console.log('跳转失败');
      }
    })
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
                  currentPage: 1,
                  hideHeader: false
                })
                that.getData();
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
  // 分享
  // onShareAppMessage: function () {

  // }
})



