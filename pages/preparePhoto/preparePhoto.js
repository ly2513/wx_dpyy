// pages/preparePhoto/preparePhoto.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		photo_type:1,
		paper_type_str:'',
		wh:1.4
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options)
		var photo_type=options.photo_type
		var paper_type_str=""
		switch (photo_type) {
			case '0':
				paper_type_str = '';
				break;
			case '3':
				paper_type_str = '已选择：一寸照片';
				break;
			case '4':
				paper_type_str = '已选择：二寸照片';
				break;
			case '5':
				paper_type_str = '已选择：大一寸照片';
				break;
			case '6':
				paper_type_str = '已选择：简历照片';
				break;
			case '7':
				paper_type_str = '已选择：教师资格证';
				break;
			case '8':
				paper_type_str = '已选择：四六级';
				break;
			case '9':
				paper_type_str = '已选择：驾驶证';
				break;
			case '10':
				paper_type_str = '已选择：小一寸';
				break;
			case '11':
				paper_type_str = '已选择：小二寸';
				break;

		}
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
		this.setData({
			photo_type:photo_type,
			paper_type_str:paper_type_str,
			wh:wh
		})
	},

	choseImg:function(e){
		var that=this
		wx.chooseImage({
			count: 1,
			sourceType:['album'],
			success(res){
				const tempFilePaths = res.tempFilePaths
				console.log(tempFilePaths[0])
				wx.showLoading({
					title: '图片处理中......',
				})
				var url=app.globalData.requestUrl + '/Api/File/uploadIdPhoto';
				console.log(url)
				wx.uploadFile({
					filePath: tempFilePaths[0],
					name: 'file',
					url: url,
					header: {
						'Content-Type': 'application/json',
						'token': wx.getStorageSync("token")
					},
					success (res){
						const data = res.data
						if (res.statusCode!=200){
							if(res.data.code == 999){
								wx.showModal({
									title: '系统提示',
									content: res.data.msg,
									showCancel: true,
									success: function (resbtn) {
										if (resbtn.confirm) {
											// 跳转登录页
											wx.navigateTo({
												url: '../access/access'
											})
										}
									}
								})
							}
							wx.showToast({
								title: '服务器异常',
							})
							wx.hideLoading({
								success: (res) => {},
							})
							return
						}
						console.log(data)
						var jsdata=JSON.parse(data)
						console.log(jsdata.code)
						if (jsdata.code==0){
							var file_path=jsdata.data.path
							console.log(file_path)
							var url=app.globalData.requestUrl+"/Api/File/getPhoto?pic="+file_path+"&wh="+that.data.wh+"&b=255&g=255&r=255&url="+app.globalData.pdfUrl
							console.log(url)
							wx.request({
								url: url,
								header: {
								'Content-Type': 'application/json',
								'token': wx.getStorageSync("token")
								},
								success(res){
									const data = res.data
									console.log(data.data.file_path)
									console.log(data)
									if (data.code!=0){
										wx.showToast({
										icon:'none',
										title: data.msg,
										})
										return
									}
									wx.navigateTo({
										url: '../modifyPhoto/modifyPhoto?src='+data.data.file_path+"&photo_type="+that.data.photo_type+"&temppaths="+tempFilePaths[0],
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
							console.log(jsdata.code)
							if(jsdata.code == '999'){
								console.log('666')
								wx.showModal({
									title: '系统提示',
									content: jsdata.msg,
									showCancel: true,
									success: function (resbtn) {
										if (resbtn.confirm) {
										// 跳转登录页
											wx.navigateTo({
												url: '../access/access'
											})
										}
									}
								})
								return 
							}
							wx.showToast({
								title: jsdata.msg,
							})
						
						}
					},fail(e){
						console.log(e)
						wx.showToast({
							title: '服务器异常',
						})
						wx.hideLoading({
							success: (res) => {},
						})

					}
				})
			}
		})
	},
	takePhtoto:function(e){
		var that=this
		wx.chooseImage({
			count: 1,
			sourceType:['camera'],
			success(res){
				const tempFilePaths = res.tempFilePaths
				console.log(tempFilePaths[0])
				wx.showLoading({
					title: '图片处理中......',
				})
				var url=app.globalData.requestUrl + '/Api/File/uploadIdPhoto';
				console.log(url)
				wx.uploadFile({
					filePath: tempFilePaths[0],
					name: 'file',
					url: url,
					header: {
						'Content-Type': 'application/json',
						'token': wx.getStorageSync("token")
					},
					success (res){
						const data = res.data
						if (res.statusCode!=200){
							if(res.data.code == 999){
								wx.showModal({
									title: '系统提示',
									content: res.data.msg,
									showCancel: true,
									success: function (resbtn) {
										if (resbtn.confirm) {
										// 跳转登录页
											wx.navigateTo({
												url: '../access/access'
											})
										}
									}
								})
							}
							wx.showToast({
								title: '服务器异常',
							})
							wx.hideLoading({
								success: (res) => {},
							})
							return
						}
						console.log(data)
						var jsdata=JSON.parse(data)
						console.log(jsdata.code)
						if (jsdata.code==0){
							var file_path=jsdata.data.path
							console.log(file_path)
							var url=app.globalData.requestUrl+"/Api/File/getPhoto?pic="+file_path+"&wh=1.5&b=255&g=255&r=255&url="+app.globalData.pdfUrl
							console.log(url)
							wx.request({
								url: url,
								header: {
								'Content-Type': 'application/json',
								'token': wx.getStorageSync("token")
								},
								success(res){
									const data = res.data
									console.log(data.data.file_path)
									wx.navigateTo({
										url: '../modifyPhoto/modifyPhoto?src='+data.data.file_path+"&photo_type="+that.data.photo_type+"&temppaths="+tempFilePaths[0],
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
							if(jsdata.code == '999'){
								console.log('666')
								wx.showModal({
									title: '系统提示',
									content: jsdata.msg,
									showCancel: true,
									success: function (resbtn) {
										if (resbtn.confirm) {
										// 跳转登录页
											wx.navigateTo({
												url: '../access/access'
											})
										}
									}
								})
								return 
							}
							wx.showToast({
								title: jsdata.msg,
							})
						}
					},fail(){
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
	}
})