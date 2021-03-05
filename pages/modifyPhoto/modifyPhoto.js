// pages/modifyPhoto/modifyPhoto.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_src: '',
    color: 1,
    photo_type: 1,
    temppaths: "",
    src:"",
    wh:1.4
  },

  /**
   * 生命周期函数--监听页面加载
   * http://dp-dev.dpyunyin.com/Api/File/getFinalPhoto?pic=PhotoFile/face_20210224/b85ef72c-768e-11eb-af9b-52540079445a.jpg
   */
  onLoad: function (options) {
    console.log(options)
    var src = options.src
    var temsrc=src
    src = app.globalData.requestUrl + src
    console.log(src)
    var photo_type = options.photo_type
    console.log(photo_type)
    var wh=1.4
    switch(photo_type){
      case 3:
      case 4:
        wh=1.4
        break
      case 5:
        wh=1.45
        break;
      case 6:
        wh=1.4
        break
      case 7:
        wh=1.4
        break
      case 8:
        wh=1.35
        break
      case 9:
        wh=1.45
        break
      case 10:
        wh=1.45
        break
    }
    var temppaths = options.temppaths
    console.log(temppaths)
    this.setData({
      img_src: src,
      photo_type: photo_type,
      temppaths: temppaths,
      src:temsrc,
      wh:wh
    })
  },
  color_1(e) {
    this.data.color = 1
    this.setData({
      color: 1
    })
    this.modify_color()

  },
  color_2(e) {
    this.data.color = 2
    this.setData({
      color: 2
    })
    this.modify_color()
  },
  color_3(e) {
    this.data.color = 3
    this.setData({
      color: 3
    })
    this.modify_color()
  },
  color_4(e) {
    this.data.color = 4
    this.setData({
      color: 4
    })
    this.modify_color()
  },
  save_img(e) {
    var that=this
    wx.showLoading({
      title: '图片保存中',
      icon:'none'
    })
    var filePath = wx.env.USER_DATA_PATH + '/' + "智能证件照.jpg"
    wx.downloadFile({
      url: that.data.img_src,
      filePath:filePath,
      success (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
       
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: filePath,
            success(res){
              wx.hideLoading({
                success: (res) => {},
              })
            },
            fail(res){
              console.log(res)
              wx.hideLoading({
                success: (res) => {},
              })
            }
          })
        }else{
          wx.hideLoading({
            success: (res) => {},
          })
          wx.showToast({
            title: '图片下载失败',
          })
        }
      },fail(res){
        console.log(res)
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '下载失败',
        })
      }
    })
  },
  make_order(e) {
    var that = this
    console.log(that.data.photo_type)
    var url = '../newPlaceOrder/newPlaceOrder?src=' + that.data.src + '&action=photo' + '&photo_type=' + that.data.photo_type;
    console.log(url)
    wx.navigateTo({
      url: url,
    })
  },
  modify_color() {
    var that = this
    wx.showLoading({
      title: '图片处理中......',
    })
    var url = app.globalData.requestUrl + '/Api/File/uploadIdPhoto';
    console.log(url)
    console.log(that.data.temppaths)
    wx.uploadFile({
      filePath: that.data.temppaths,
      name: 'file',
      url: url,
      header: {
        'Content-Type': 'application/json',
        'token': wx.getStorageSync("token")
      },
      success(res) {
        const data = res.data
        
        if (res.statusCode != 200) {
          wx.showToast({
            title: '服务器异常',
          })
        }
        console.log(data)
        var jsdata = JSON.parse(data)
        console.log(jsdata.code)
        if (jsdata.code == 0) {
          var file_path = jsdata.data.path
          console.log(file_path)
          var url=""
          if(that.data.color==2){
            url=app.globalData.requestUrl+"/Api/File/getPhoto?pic=" + file_path + "&wh="+that.data.wh+"&b=53&g=63&r=225&url="+app.globalData.pdfUrl
          }else if(that.data.color==3){
            url=app.globalData.requestUrl+"/Api/File/getPhoto?pic=" + file_path + "&wh="+that.data.wh+"&b=231&g=137&r=68&url="+app.globalData.pdfUrl
          }else if(that.data.color==4){
            url=app.globalData.requestUrl+"/Api/File/getPhoto?pic=" + file_path + "&wh="+that.data.wh+"&b=245&g=189&r=104&url="+app.globalData.pdfUrl
          }else if(that.data.color==1){
            url=app.globalData.requestUrl+"/Api/File/getPhoto?pic=" + file_path + "&wh="+that.data.wh+"&b=255&g=255&r=255&url="+app.globalData.pdfUrl
          }
          console.log(url)
          wx.request({
            url: url,
            header: {
              'Content-Type': 'application/json',
              'token': wx.getStorageSync("token")
            },
            success(res) {
              const data = res.data
              console.log(data)
              console.log(data.data.file_path)
              var src = data.data.file_path
              var temsrc=src
              src = app.globalData.requestUrl + src
              console.log(src)
              
              that.setData({
                img_src: src,
                src:temsrc
              })
              wx.hideLoading({
                success: (res) => {},
              })
            },
            fail(res) {
              console.log(res)
              wx.hideLoading({
                success: (res) => {},
              })
            }
          })
          // wx.navigateTo({
          //   url: '../modifyPhoto/modifyPhoto?src='+file_path+"&photo_type="+that.data.photo_type,
          // })
        } else {
          wx.showToast({
            title: jsdata.msg,
          })
          wx.hideLoading({
            success: (res) => {},
          })
        }
      },
      fail(e) {
        console.log(e)
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '服务器异常',
        })

      }
    })

  }

})