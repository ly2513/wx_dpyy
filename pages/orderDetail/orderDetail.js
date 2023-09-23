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
		total_price: 0,
		status: 0,
		order_id: 0,
		phone_no: '',
		store_name: '',
		firstNo: "",
		lastNo: "",
		create_time:'',
		sub_price:0,
		original_price:0
	},
  // 生命周期函数--监听页面加载
	onLoad: function (options) {
		this.getData(options.order_id, options.orderNo, options.status, options.store_name, options.phone_no,options.create_time);
	},
  // 用户点击右上角分享
	onShareAppMessage: function () {

	},
	getData: function (id, orderNo, status, store_name, phone_no,create_time) {
		console.log(orderNo);
		var first_no=orderNo.substring(0,orderNo.length-4);
		var last_no=orderNo.substring(orderNo.length-4);
		var that = this;
		that.setData({
			orderNo: orderNo,
			status: status,
			order_id: id,
			store_name: store_name,
			phone_no: phone_no,
			firstNo: first_no,
			lastNo: last_no,
			create_time:create_time
		})
		// 查看详情
		wx.request({
			url: app.globalData.requestUrl + '/Api/Order/getOrderInfo/' + id,
			method: 'POST',
			header: {
				'content-type': 'application/json',
				'content-type': 'application/x-www-form-urlencoded',
				'token': wx.getStorageSync("token")
			},
			dataType: 'json',
			success: function (res) {
				console.log(res.data);
				if (res.data.code == 0) {
					console.log(res.data.data);
					for (var i = 0; i < res.data.data.list.length; i++) {
						var suffix = "";
						var file_path = res.data.data.list[i].file_path;
						console.log(file_path);
						if (res.data.data.list[i].print_color>=3){
							res.data.data.list[i].file_path=app.globalData.requestUrl+res.data.data.list[i].file_path;
							console.log(res.data.data.list[i].file_path)
						}
						var arr = file_path.split('.');
						if (arr.length > 0) {
							suffix = arr[arr.length - 1]
						}
						console.log('后缀：'+suffix)
						res.data.data.list[i].suffix=suffix;
					}
					var sub_price=res.data.data.original_price-res.data.data.total_price
					that.setData({
						fileList: res.data.data.list,
						delivery_method: res.data.data.delivery_method,
						delivery_status: res.data.data.delivery_status,
						time: res.data.data.time,
						total_price: res.data.data.total_price,
						original_price:res.data.data.original_price,
						sub_price:sub_price
					})
				} else {
					wx.showModal({
						title: '提示',
						content: res.data.msg,
						showCancel: true,
						showSuccess: false
					})
				}
			},
			fail: function (res) {
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
			success: function (res) {},
			fail: function (err) {}
		});
	},
	downFile: function (file_path, source_name) {
		var self = this;
		var timestamp = Date.parse(new Date());
		timestamp = timestamp / 1000;
		console.log("当前时间戳为：" + timestamp);
		var url = app.globalData.requestUrl + '/Api/Order/getFile?' + "1=" + encodeURI(file_path) + "&2=" + encodeURI(source_name) + "&3=" + encodeURI(timestamp);
		console.log(url);
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
					complete: (res) => {},
				})
			}
		})
	},
	getfile: function (e) {
		var self = this;
		var file_path = e.currentTarget.dataset.file_path;
		var source_name = e.currentTarget.dataset.source_name;
		console.log(file_path);
		console.log(source_name);
		wx.checkIsSupportSoterAuthentication({
			success(res) {
				var modeType = ""
				var isFinger = false;
				var isFacial = false;
				for (var i = 0; i < res.supportMode.length; i++) {
					if (res.supportMode[i] == 'facial') {
						isFacial = true;
					}
					if (res.supportMode[i] == 'fingerPrint') {
						isFinger = true;
					}
				}
				if (isFinger) {
					modeType = 'fingerPrint'
				} else {
					if (isFacial) {
						modeType = 'facial'
					} else {
						wx.showToast({
							title: '您的设备不支持生物认证，无法判断您的身份，请拨打门店电话或到门店找回您的文件',
							icon: 'none'
						})
						return
					}
				}
				console.log("支持的识别方式：" + modeType);
				wx.checkIsSoterEnrolledInDevice({
					checkAuthMode: modeType,
					success(res) {
						if (!res.isEnrolled) {
							if (modeType == 'fingerPrint') {
								modeType = 'facial'
							} else {
								if (modeType == 'facial') {
									modeType == 'fingerPrint'
								} else {
									wx.showToast({
										title: '您的设备没有输入指纹或面部识别，无法判断您的身份，请输入指纹或面部识别或拨打门店电话或到门店找回您的文件',
										icon: 'none'
									})
									return;
								}
								wx.checkIsSoterEnrolledInDevice({
									checkAuthMode: modeType,
									success(res) {
										if (!res.isEnrolled) {
											wx.showToast({
												title: '您的设备没有输入指纹或面部识别，无法判断您的身份，请输入指纹或面部识别或拨打门店电话或到门店找回您的文件',
												icon: 'none'
											})
											return
										}
									},
									fail(res) {
										wx.showToast({
											title: res.errMsg,
										})
									}
								})
							}
						}
					},
					fail(res) {
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
									var url = app.globalData.requestUrl + '/Api/Order/getFile?' + "1=" + encodeURI(file_path) + "&2=" + encodeURI(source_name) + "&3=" + encodeURI(timestamp);
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
							title: res.errCode + ":" + res.errMsg,
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
	callPhone: function (e) {
		console.log(e.currentTarget.dataset.phone_no);
		wx.makePhoneCall({ // 拨打号码
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
  	payOrder: function (e) { // 订单支付
		// 跳转至订单支付详情页
		// 订单ID
		console.log(e)
		var orderId = e.currentTarget.dataset.order_id
		wx.redirectTo({
			url: '../payOrder/payOrder?id=' + orderId + '&trade_type=' + app.globalData.tradeType,
			success: function (res) {
				console.log('跳转成功');
			},
			fail: function (e) {
				console.log(e);
				console.log('跳转失败');
			}
		})
		return ;
  	},
	cancelOrder: function (e) { // 取消订单
		var that = this;
		// 订单ID
		var id = e.currentTarget.dataset.order_id;
		wx.request({
			url: app.globalData.requestUrl + '/Api/Order/cancelOrder/' + id, //后台语言的处理 
			method: 'POST',
			header: {
				'content-type': 'application/json',
				'content-type': 'application/x-www-form-urlencoded',
				'token': wx.getStorageSync("token")
			},
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
			},
			fail: function (res) {
				console.log('网络异常！');
			}
		});
	},

})