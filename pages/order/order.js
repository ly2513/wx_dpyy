//index.js
//获取应用实例
const app = getApp()
// wx.showNavigationBarLoading(); // 在当前页面显示导航条加载动画
// wx.hideNavigationBarLoading(); // 隐藏导航条加载动画
// var url = app.globalData.requestUrl + '/Api/Order/getOrder?open_id=' + app.globalData.openId;
// var page = 0;
// var page_size = 20;
// var sort = "last";
// var is_easy = 0;
// var lange_id = 0;
// var pos_id = 0;
// var unlearn = 0;


// 获取数据的方法，具体怎么获取列表数据大家自行发挥
// var getList = function (that) {
//   that.setData({
//     hidden: false
//   });
//   wx.request({
//     url: url,
//     data: {
//       page: page,
//       page_size: page_size,
//       sort: sort,
//       is_easy: is_easy,
//       lange_id: lange_id,
//       pos_id: pos_id,
//       unlearn: unlearn
//     },
//     success: function (res) {
//       console.info(that.data.list);
//       var list = that.data.list;
//       for (var i = 0; i < res.data.list.length; i++) {
//         list.push(res.data.list[i]);
//       }
//       that.setData({
//         list: list
//       });
//       page++;
//       that.setData({
//         hidden: true
//       });
//     }
//   });
// }
console.log(app.globalData.openId);

Page({
  data: {
    hidden: true,
    list: {},
    scrollTop: 0,
    scrollHeight: 0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //   这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        openId: app.globalData.openId
      })
    }
    this.getOrder();
    // getList(this)
  },
  payOrder: function(e) {
    var that = this;
    // 订单ID
    var id = e.currentTarget.dataset.favorite 
    // 发起支付
    wx.request({
      url: app.globalData.requestUrl + '/Api/Order/payOrder/' + id,//后台语言的处理 
      method: 'POST',   
      header: { 'content-type': 'application/json', 'content-type': 'application/x-www-form-urlencoded' },
      dataType: 'json',
      success: function (res) {
        if (res.data.code == 0){
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
              wx.request({
                url: app.globalData.requestUrl + '/Api/Order/updateOrderStatus/' + id,//后台语言的处理 
                method: 'POST',
                header: { 'content-type': 'application/json', 'content-type': 'application/x-www-form-urlencoded' },
                dataType: 'json',
                success: function (res) {
                  if (res.data.code == 0){
                    that.getOrder();
                    console.log('更新订单成功！');
                  }else{
                    console.log(res.data.msg);
                  }
                },fail:function(res){
                  console.log('网络异常！');
                }
              });
            },
            fail: function (res) {
              if (res.data){
                console.log(res.data.msg);
              }
              alert('支付取消！');
            }
          })
        }else{
          console.log(res.data.msg);
          alert('支付失败！');
        }
      }, fail:function(res){
        console.log(res.data.msg);
        alert('支付失败！');
      }
    }); 
  },
  getOrder:function(){
    var that = this;
    // // 获取订单数据
    // wx.request({
    //   url: app.globalData.requestUrl + '/Api/Order/getOrder?open_id=' + app.globalData.openId,
    //   data: {},
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     console.log(res)
    //     if (res.data.code === 0) {
    //       console.log(res.data.data)
    //       that.setData({
    //         orderList: res.data.data
    //       })
    //     } else {
    //       console.log(res.msg);
    //       alert('获取数据失败！');
    //     }
    //   }
    // })
    var url = app.globalData.requestUrl + '/Api/Order/getOrder?open_id=' + app.globalData.openId;
    var page = 0;
    var page_size = 20;
    var sort = "last";
    var is_easy = 0;
    var lange_id = 0;
    var pos_id = 0;
    var unlearn = 0;
    this.setData({
      hidden: false
    });
    wx.request({
      url: url,
      data: {
        page: page,
        page_size: page_size,
        sort: sort,
        is_easy: is_easy,
        lange_id: lange_id,
        pos_id: pos_id,
        unlearn: unlearn
      },
      success: function (res) {
        console.info(that.data.list);
        console.info(res);
        // var list = that.data.list;
        // for (var i = 0; i < res.data.list.length; i++) {
        //   list.push(res.data.list[i]);
        // }
        // that.setData({
        //   list: list
        // });
        // page++;
        // that.setData({
        //   hidden: true
        // });
      }
    });
  },
  onShow: function () {
    //   在页面展示之后先获取一次数据
    var that = this;
    // getList(that);
    this.getOrder();
  },
  bindDownLoad: function () {
    //   该方法绑定了页面滑动到底部的事件
    var that = this;
    // getList(that);
    this.getOrder();
  },
  scroll: function (event) {
    //   该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  refresh: function (event) {
    //   该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
    page = 0;
    this.setData({
      list: [],
      scrollTop: 0
    });
    // getList(this)
    this.getOrder();
  }
})