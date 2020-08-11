const app = getApp()
// pages/newPlaceOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [{
      iconPath: "/images/v2.0/location.png",
      id: 0,
      latitude: 0,
      longitude: 0,
      width: 20,
      height: 30
    }],
    schoolList: [],
    storeList: [],
    fileArray: [],
    fileNum: 0,
    schoolName: "请选择所在校区",
    storeName: "请选择打印门店",
    storeValue: 0,
    schoolValue: 0,
    imgUrl_1: "",
    imgUrl_2: "",
    imgUrl_3: "",
    showLocation: false,
    showPriceList: false,
    longitude: "",
    latitude: "",
    price_list: [],
    document_id: "",
    file_name: "",
    imgs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var action = options.action;
    var document_id = options.document_id;
    var file_name = options.file_name;
    console.log("file_name:" + file_name)
    console.log(action);
    console.log(document_id);
    this.getSchool()
    this.getAdver()
    this.setData({
      imgUrl_1: app.globalData.requestUrl + '/Static/images/v1.1/banner_1.jpeg',
      imgUrl_2: app.globalData.requestUrl + '/Static/images/v1.1/banner_2.jpeg',
      imgUrl_3: app.globalData.requestUrl + '/Static/images/v1.1/banner_3.jpeg',
      file_name: file_name,
      document_id: document_id
    })
    if (undefined != action) {
      this.hasFile()
    }
  },

  hasFile: function () {
    var that = this;
    var document_id = that.data.document_id;
    var typeUrl = app.globalData.requestUrl + '/Api/Library/getDocumenType?document_id=' + document_id + '&token=' + wx.getStorageSync("token");
    wx.request({
      url: typeUrl,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 0) {
          var source_name = res.data.data;
          console.log(source_name)
          var arr = source_name.split(".")
          var extension = arr[arr.length - 1]
          console.log('后缀名：' + extension)
          var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;
          console.log(document_id)
          var url = app.globalData.requestUrl + '/Api/Library/downDocument?2=' + document_id + "&3=" + timestamp + '&token=' + wx.getStorageSync("token");
          console.log(url);
          var filePath = wx.env.USER_DATA_PATH + '/' + source_name
          wx.downloadFile({
            url: url,
            filePath: filePath,
            success(res) {

              var filePath = res.filePath;
              wx.getFileInfo({
                filePath: filePath,
                success(res) {
                  console.log(res.size)
                  console.log(res.digest)
                }
              })
              console.log(res.filePath)
              var url = app.globalData.requestUrl + '/Api/File/upload?';
              console.log(that.file_name)
              wx.uploadFile({
                filePath: filePath,
                name: 'file',
                url: url,
                // formData: {
                //   "name": source_name,
                //   // "extension": extension,
                // },
                header: {
                  'Content-Type': 'multipart/form-data',
                  'token': wx.getStorageSync("token"),
                },
                success(res) {
                  console.log(res.data)
                  var data = JSON.parse(res.data)
                  console.log(data)
                  if (data.code != 0) {
                    wx.showToast({
                      title: data.msg,
                      icon: "none"
                    })
                    return
                  }
                  console.log(data.data.name)
                  data.data.file_num = 1
                  data.data.print_color = 1
                  if (data.data.extension == 'pdf' || data.data.extension == 'doc' || data.data.extension == 'docx' || data.data.extension == 'xls' || data.data.extension == 'xlsx' || data.data.extension == 'ppt' || data.data.extension == 'pptx') {
                    data.data.print_page = 1
                    data.data.paper_type = 1
                    data.data.paper_size = 0
                  } else {
                    data.data.print_page = 3
                    data.data.paper_size = 1
                    data.data.paper_type = 0
                  }
                  that.data.fileArray = [data].concat(that.data.fileArray)
                  that.setData({
                    fileNum: that.data.fileNum + 1,
                    fileArray: that.data.fileArray
                  })
                  console.log(that.data.fileArray[0].name)
                },
                fail(e) {
                  wx.showToast({
                    title: e.errMsg,
                  })
                  console.log(e)
                }
              })

            },
            fail(res) {
              wx.showToast({
                title: '文件下载错误',
              })
            }
          })
        } else {
          wx.navigateBack({
            complete: (res) => {},
          })
        }
      }
    })
  },
  formSubmit: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var data = e.detail.value;
    if (data.school_id == 0) {
      wx.showToast({
        title: '请选择所在校区',
      })
      return
    }
    if (data.store_id == 0) {
      wx.showToast({
        title: '请选择打印门店',
      })
      return
    }
    if (this.data.fileNum <= 0) {
      wx.showToast({
        title: "请上传文件"
      })
      return
    }
    var fileArray = this.data.fileArray;
    var page_num = [];
    var doc_id = [];
    var source_name = [];
    var pdf_file_url = [];
    var file_num = [];
    var file = [];
    var print_color = [];
    var print_page = [];
    var paper_type = [];
    var paper_size = [];
    console.log(fileArray)
    for (var i = 0; i < fileArray.length; i++) {
      var fileObj = fileArray[i];
      page_num.push(fileObj.data.page_num);
      doc_id.push(fileObj.data.doc_id);
      source_name.push(fileObj.data.name);
      pdf_file_url.push(fileObj.data.pdf_file_url);
      file_num.push(fileObj.data.file_num)
      file.push(fileObj.data.path)
      print_color.push(fileObj.data.print_color)
      print_page.push(fileObj.data.print_page)
      paper_type.push(fileObj.data.paper_type)
      paper_size.push(fileObj.data.paper_size)
    }
    data.page_num = page_num;
    data.doc_id = doc_id;
    data.source_name = source_name;
    data.pdf_file_url = pdf_file_url;
    data.file_num = file_num;
    data.file = file;
    data.print_color = print_color
    data.print_page = print_page
    data.paper_type = paper_type
    data.paper_size = paper_size
    data.union_id = wx.getStorageSync("token")
    console.log(data)
    var url = app.globalData.requestUrl + '/Api/Order/addOrder';
    wx.request({
      url: url,
      method: "POST",
      data: data,
      header: {
        'Content-Type': 'application/json',
        'token': wx.getStorageSync("token")
      },
      success(res) {
        console.log("请求下单成功")
        console.log(res.data)
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          return
        }

        wx.redirectTo({
          url: '../payOrder/payOrder?id=' + res.data.data.id + "&price_fen=" + res.data.data.price_fen,
          success: function (res) {
            console.log('跳转成功');

          },
          fail: function (e) {
            console.log(e);
            console.log('跳转失败');
          }
        })
      },
      fail(res) {
        console.log(res.data)
      }
    })

  },
  choseFile() {
    var that = this;
    wx.showActionSheet({
      itemList: ['手机本地文件', '微信文件'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '../choseFile/choseFile',
            events: {
              acceptDataFromOpenedPage: function (data) {
                console.log('从webview传过来的值')
                console.log(data)
                data.data.file_num = 1
                data.data.print_color = 1
                if (data.data.extension == 'pdf' || data.data.extension == 'doc' || data.data.extension == 'docx' || data.data.extension == 'xls' || data.data.extension == 'xlsx' || data.data.extension == 'ppt' || data.data.extension == 'pptx') {
                  data.data.print_page = 1
                  data.data.paper_type = 1
                  data.data.paper_size = 0
                } else {
                  data.data.print_page = 3
                  data.data.paper_size = 1
                  data.data.paper_type = 0
                }
                that.data.fileArray = [data].concat(that.data.fileArray)
                that.setData({
                  fileNum: that.data.fileNum + 1,
                  fileArray: that.data.fileArray
                })
                console.log("fileArray")
                // console.log(fileArray[0])
              }
            },
            success: function (res) {
              console.log('跳转成功');
            },
            fail: function (e) {
              console.log(e);
              console.log('跳转失败');
            }
          })
        } else if (res.tapIndex == 1) {
          wx.chooseMessageFile({
            count: 1,
            type: 'all',
            success(res) {
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFiles
              console.log(tempFilePaths[0].name)
              console.log(tempFilePaths[0].path)
              var url = app.globalData.requestUrl + '/Api/File/upload?';
              wx.uploadFile({
                filePath: tempFilePaths[0].path,
                name: 'file',
                url: url,
                formData: {
                  "name": tempFilePaths[0].name
                },
                header: {
                  'Content-Type': 'multipart/form-data',
                  'token': wx.getStorageSync("token"),
                },
                success(res) {
                  console.log(res.data)
                  var data = JSON.parse(res.data)
                  console.log(data.data.name)
                  data.data.file_num = 1
                  if (data.code != 0) {
                    wx.showToast({
                      title: data.msg,
                    })
                    return
                  }
                  data.data.print_color = 1
                  if (data.data.extension == 'pdf' || data.data.extension == 'doc' || data.data.extension == 'docx' || data.data.extension == 'xls' || data.data.extension == 'xlsx' || data.data.extension == 'ppt' || data.data.extension == 'pptx') {
                    data.data.print_page = 1
                    data.data.paper_type = 1
                    data.data.paper_size = 0
                  } else {
                    data.data.print_page = 3
                    data.data.paper_size = 1
                    data.data.paper_type = 0
                  }
                  that.data.fileArray = [data].concat(that.data.fileArray)
                  that.setData({
                    fileNum: that.data.fileNum + 1,
                    fileArray: that.data.fileArray
                  })
                  console.log(that.data.fileArray[0].name)
                },
                fail(e) {
                  wx.showToast({
                    title: e.errMsg,
                  })
                  console.log(e)
                }
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
  onStoreChange: function (e) {
    console.log(e.detail)
    this.data.storeName = this.data.storeList[e.detail.value].store_name;
    this.data.storeValue = this.data.storeList[e.detail.value].id;
    this.setData({
      storeName: this.data.storeName,
      storeValue: this.data.id
    })
    var url = app.globalData.requestUrl + '/Api/Order/setStore?store_id=' + this.data.storeValue + '&open_id=' + app.globalData.unionId;
    console.log(url)
    wx.request({
      url: url,
      header: {
        'Content-Type': 'application/json',
        'token': wx.getStorageSync("token")
      },
      success: function (res) {
        console.log(res.data)
      }
    })
    // this.getStore(school_id)
  },
  onSchoolChange: function (e) {
    console.log(e.detail)
    this.data.schoolName = this.data.schoolList[e.detail.value].school_name;
    var school_id = this.data.schoolList[e.detail.value].id;
    console.log(school_id)
    this.setData({
      schoolName: this.data.schoolName
    })
    if (school_id == 0) {
      return
    }
    this.getStore(school_id)
    wx.setStorage({
      data: school_id,
      key: 'school_id',
    })

  },
  getStore(school_id) {
    console.log(school_id)
    var url = app.globalData.requestUrl + '/Api/File/getStore?school_id=' + school_id;
    console.log(url)
    var that = this
    wx.request({
      url: url,
      header: {
        'Content-Type': 'application/json',
        'token': wx.getStorageSync("token")
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 0) {
          var data = res.data.data;
          var firstData = {};
          firstData.id = 1;
          firstData.store_name = "请选择打印门店"
          firstData.longitude = "0.0"
          firstData.latitude = "0.0"
          data.unshift(firstData)
          that.data.storeList = data;
          that.setData({
            storeList: that.data.storeList
          })
          if (res.data.data.length == 2) {
            var markers = that.data.markers;
            var marker = markers[0];
            marker.latitude = res.data.data[1].latitude;
            marker.longitude = res.data.data[1].longitude;
            markers[0] = marker;
            that.setData({
              storeValue: res.data.data[1].id,
              storeName: res.data.data[1].store_name,
              latitude: res.data.data[1].latitude,
              longitude: res.data.data[1].longitude,
              markers: markers
            })
            var url = app.globalData.requestUrl + '/Api/Order/setStore?store_id=' + res.data.data[1].id + '&open_id=' + app.globalData.unionId;
            console.log(url)
            wx.request({
              url: url,
              header: {
                'Content-Type': 'application/json',
                'token': wx.getStorageSync("token")
              },
              success: function (res) {
                console.log(res.data)
              }
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }

      }
    })
  },
  getDistance: function (lat1, lng1, lat2, lng2) {

    lat1 = lat1 || 0;

    lng1 = lng1 || 0;

    lat2 = lat2 || 0;

    lng2 = lng2 || 0;

    var rad1 = lat1 * Math.PI / 180.0;

    var rad2 = lat2 * Math.PI / 180.0;

    var a = rad1 - rad2;

    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

    var r = 6378137;

    return (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)

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
  },
  getSchool() {
    var that = this;

    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        // var url = app.globalData.requestUrl + '/Api/File/getSchool';
        // console.log(ur l)
        console.log(latitude)
        console.log(longitude)
        wx.request({
          url: app.globalData.requestUrl + '/Api/File/getSchool?latitude=' + latitude + "&longitude=" + longitude,
          header: {
            'Content-Type': 'application/json',
            'token': wx.getStorageSync("token")
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.code == 0) {
              var data = res.data.data;
              var firstData = {}
              firstData.id = 0
              firstData.school_name = "请选择所在校区"
              data.unshift(firstData)
              that.data.schoolList = res.data.data;
              wx.getStorage({
                key: 'school_id',
                success(res) {
                  console.log(res.data)
                  var schoolName = ""
                  for (var i = 0; i < data.length; i++) {
                    if (data[i].id == res.data) {
                      schoolName = data[i].school_name;
                    }
                  }
                  that.setData({
                    schoolValue: res.data,
                    schoolName: schoolName
                  })
                  that.getStore(res.data)

                },
                fail(res) {
                  console.log(res)
                }
              })
              that.setData({
                schoolList: that.data.schoolList
              })

            } else {
              wx.showToast({
                title: res.data.msg,
              })
            }
          },
          fail: function (res) {
            // console.log(res.data.msg)
            wx.showToast({
              title: res.data,
            })
          }
        })
      }
    })

  },
  printColorChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    console.log('radio发生change事件，携带dataset值为：', e.currentTarget.dataset.index)
    var print_color = e.detail.value;
    var index = parseInt(e.currentTarget.dataset.index);
    console.log("index:" + index)
    console.log(this.data.fileArray[index])
    this.data.fileArray[index].data.print_color = print_color;
  },
  printPageChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var print_page = e.detail.value;
    var index = e.currentTarget.dataset.index;
    this.data.fileArray[index].data.print_page = print_page;
  },
  paperTypeChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var paper_typer = e.detail.value;
    var index = e.currentTarget.dataset.index;
    this.data.fileArray[index].data.paper_typer = paper_typer;
  },
  paperSizeChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var paper_size = e.detail.value;
    var index = e.currentTarget.dataset.index
    this.data.fileArray[index].data.paper_size = paper_size;
  },
  subnum(e) {
    var index = e.currentTarget.dataset.index;
    console.log("---")
    if (this.data.fileArray[index].data.file_num <= 1) {
      return
    }
    console.log("index:" + index)
    this.data.fileArray[index].data.file_num = this.data.fileArray[index].data.file_num - 1;
    this.setData({
      fileArray: this.data.fileArray
    })
    console.log("file_num:" + this.data.fileArray[index].data.file_num)
  },
  addnum(e) {
    var index = e.currentTarget.dataset.index;
    console.log("+++")
    this.data.fileArray[index].data.file_num = this.data.fileArray[index].data.file_num + 1;
    this.setData({
      fileArray: this.data.fileArray
    })
    console.log("file_num:" + this.data.fileArray[index].data.file_num)
  },
  deleteFile(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    console.log("删除前" + this.data.fileArray.length)
    this.data.fileArray.splice(index, 1)
    this.setData({
      fileArray: this.data.fileArray
    })
    console.log("删除后" + this.data.fileArray.length)
  },
  show_time() {
    var storeList = this.data.storeList;
    var store = {}
    for (var i = 0; i < storeList.length; i++) {
      if (storeList[i].id == this.data.storeValue) {
        store = storeList[i]
      }
    }
    var opening_hours = store.opening_hours;
    if (opening_hours != undefined && opening_hours) {
      wx.showModal({
        title: '营业时间',
        content: opening_hours,
        showCancel: false,
        confirmText: "我知道了",
        confirmColor: "#0473FF"
      })
    }

  },
  show_location() {
    this.setData({
      showLocation: true
    })
  },
  show_price() {
    var that = this;
    if (this.data.storeValue == 0) {
      wx.showToast({
        title: '请选择门店',
        icon: "none"
      })
      return
    }
    var url = app.globalData.requestUrl + '/Api/Cost/getCost?store_id=' + this.data.storeValue
    wx.request({
      url: url,
      header: {
        'Content-Type': 'application/json',
        'token': wx.getStorageSync("token")
      },
      success(res) {
        console.log("获取门店价格成功")
        console.log(res.data)
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          return
        }
        that.setData({
          price_list: res.data.data,
          showPriceList: true
        })
      },
      fail(res) {
        console.log(res.data)
      }
    })
  },
  hideLocation() {
    this.setData({
      showLocation: false
    })
  },
  hidePrice() {
    this.setData({
      showPriceList: false
    })
  }

})