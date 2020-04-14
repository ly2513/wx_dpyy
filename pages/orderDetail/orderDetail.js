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
  downFile: function (file_path, source_name) {
    var self = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    var url = app.globalData.requestUrl + '/Api/Order/getFile?' + "1=" + encodeURI(file_path) + "&2=" + encodeURI(source_name)+"&3="+encodeURI(timestamp);
    console.log(url);
    // wx.getFileSystemManager().mkdirSync( "/dpyy",true)
    var rootPath = wx.env.USER_DATA_PATH;
    var cachePath = rootPath + "/dpyy";
    if (!self.ifFile(cachePath)) {
      console.log("创建路径");
      self.mkdir(cachePath);
    }
    wx.showLoading({
      title: '下载中......',
      mask: true
    })
    wx.downloadFile({
      url: url,
      filePath: cachePath + "/" + source_name,
      success(res) {
        console.log(res.filePath);
        wx.openDocument({
          filePath: res.filePath,
        })
      },
      fail(res) {
        console.log(res.errMsg);
      },
      complete() {
        wx.hideLoading({
          complete: (res) => { },
        })
      }
    })
  },
  getfile: function (e) {
    // console.log(encodeURI("张宝刚")); 
    var self = this;
    var file_path = e.currentTarget.dataset.file_path;
    var source_name = e.currentTarget.dataset.source_name;
    console.log(file_path);
    console.log(source_name);


    // var url = app.globalData.requestUrl + '/Api/Order/getFile?' + "file_path=" + file_path + "&source_name=" + source_name;
    //         console.log(url);
    //         // wx.getFileSystemManager().mkdirSync( "/dpyy",true)
    //         var rootPath = wx.env.USER_DATA_PATH;
    //         var cachePath = rootPath+"/cache";
    //         if(!this.ifFile(cachePath)){
    //           this.mkdir(cachePath);
    //         }
    //         wx.downloadFile({
    //           url: url,
    //           filePath: cachePath+"/"+source_name,
    //           success(res) {
    //             console.log(res.filePath);
    //             wx.openDocument({
    //               filePath: res.filePath,
    //             })
    //           },
    //           fail(res) {
    //             console.log(res.errMsg);
    //           }
    //         })


    wx.checkIsSupportSoterAuthentication({
      success(res) {
        var str = "";
        // for(var i=0;i<res.supportMode.length;i++){
        //   console.log(res.supportMode[i]);
        //   str=str+res.supportMode[i];
        // }
        var modeType = ""
        var isFinger = false;
        var isFacial=false;
        for (var i = 0; i < res.supportMode.length; i++) {
          if(res.supportMode[i]=='facial'){
            isFacial=true;
          }
          if (res.supportMode[i] == 'fingerPrint') {
            isFinger = true;
            // modeType = "fingerPrint";
          }
        }
        if(isFinger){
          modeType='fingerPrint'
        }else{
          if(isFacial){
            modeType='facial'
          }else{
            wx.showToast({
              title: '您的设备不支持生物认证，无法判断您的身份，请拨打门店电话或到门店找回您的文件',
              icon:'none'
            })
            return
          }
        }
        
        // if (!isFinger) {
        //   for (var i = 0; i < res.supportMode.length; i++) {
        //     if (res.supportMode[i] == 'facial') {
        //       modeType = "facial"
        //     }
        //   }
        // }
        console.log("支持的识别方式："+modeType);
        wx.checkIsSoterEnrolledInDevice({
          checkAuthMode: modeType,
          success(res){
            if(!res.isEnrolled){
              if(modeType=='fingerPrint'){
                modeType='facial'
              }else{
                if(modeType=='facial'){
                  modeType=='fingerPrint'
                }else{
                  wx.showToast({
                    title: '您的设备没有输入指纹或面部识别，无法判断您的身份，请输入指纹或面部识别或拨打门店电话或到门店找回您的文件',
                    icon:'none'
                  })
                  return;
                }
                wx.checkIsSoterEnrolledInDevice({
                  checkAuthMode:modeType ,
                  success(res){
                    if(!res.isEnrolled){
                      wx.showToast({
                        title: '您的设备没有输入指纹或面部识别，无法判断您的身份，请输入指纹或面部识别或拨打门店电话或到门店找回您的文件',
                        icon:'none'
                      })
                      return
                    }
                  },
                  fail(res){
                    wx.showToast({
                      title: res.errMsg,
                    })
                  }
                })
              }
            }
          },
          fail(res){
            wx.showToast({
              title: res.errMsg,
            })
          }
        })
        wx.startSoterAuthentication({
          requestAuthModes: [modeType],
          challenge: '123456',
          authContent: '请确认你的身份',
          success(res) {
            wx.showActionSheet({
              itemList: ['下载并打开文件', '复制下载链接去浏览器中下载'],
              success(res) {
                if (res.tapIndex == 0) {
                  self.downFile(file_path, source_name)
                } else {
                  var timestamp = Date.parse(new Date());
                  timestamp = timestamp / 1000;
                  console.log("当前时间戳为：" + timestamp);
                  var url = app.globalData.requestUrl + '/Api/Order/getFile?' + "1=" + encodeURI(file_path) + "&2=" + encodeURI(source_name)+"&3="+encodeURI(timestamp);
                  wx.setClipboardData({
                    data: url,
                    success(res) {
                      wx.showToast({

                        title: '下载链接已复制到剪切板，可自行去浏览器粘贴下载',
                        icon: "none"
                      })
                    }
                  })
                }
              },
              fail(res) {
                console.log(res.errMsg)
              }
            })

          },
          fail(res) {
            wx.showToast({
              title: res.errCode+":"+res.errMsg,
            })
          }
        })
      },
      fail(res) {
        wx.showToast({
          title: '获取识别设备失败',
          icon: 'none'
        })
      }
    })
  },

  downFileContent: function (file_path, source_name) {
    wx.downloadFile({
      url: app.globalData.requestUrl + '/Api/Order/payOrder?' + "file_path=" + file_path + "&source_name=" + source_name,
      success(res) {
        console.log(res.filePath);
      },
      fail(res) {
        console.log(res.errMsg);
      }
    })
  },
  callPhone: function (e) {

    console.log(e.currentTarget.dataset.phone_no);
    wx.makePhoneCall({// 拨打号码
      phoneNumber: e.currentTarget.dataset.phone_no //电话号码
    })
  },

  showtoast: function (e) {
    console.log(e.currentTarget.dataset.content);
    wx.showToast({
      title: e.currentTarget.dataset.content,
      icon: 'none',
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
                    wx.requestSubscribeMessage({
                      tmplIds: ['fUBqODd2mYiBNkasdBseV1InmntcrHvKNOdUCJwqNrM'],
                      success(res){
                        console.log(res.errMsg+res.TEMPLATE_ID);
                      },
                      fail(res){
                        console.log(res.errCode+res.errMsg);
                      }
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