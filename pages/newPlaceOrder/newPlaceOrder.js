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
		showLocation: false,
		showPriceList: false,
		showInput: false,
		longitude: "",
		latitude: "",
		price_list: [],
		document_id: "",
		file_name: "",
		imgs: [],
		remark: '',
		src: '',
		paper_type: 0,
		paper_type_str: "",
		wh:1.4
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var action = options.action;
		var document_id = options.document_id;
		var file_name = options.file_name;
		var src = options.src;
		var paper_type = options.photo_type;
		console.log(options)
		console.log("file_name:" + file_name)
		console.log(action);
		console.log(document_id);
		console.log(src)
		console.log(paper_type)
		var paper_type_str = ''
		switch (paper_type) {
		case '0':
			paper_type_str = '';
			break;
		case '3':
			paper_type_str = '一寸照片';
			break;
		case '4':
			paper_type_str = '二寸照片';
			break;
		case '5':
			paper_type_str = '大一寸照片';
			break;
		case '6':
			paper_type_str = '简历照片';
			break;
		case '7':
			paper_type_str = '教师资格证';
			break;
		case '8':
			paper_type_str = '四六级';
			break;
		case '9':
			paper_type_str = '驾驶证';
			break;
		case '10':
			paper_type_str = '小一寸';
			break;
		case '11':
			paper_type_str = '小二寸';
			break;
		}
		var wh=1.4
		switch(paper_type){
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
		console.log(paper_type_str)
		this.getSchool()
		this.getAdver()
		this.setData({
			wh:wh,
			file_name: file_name,
			document_id: document_id,
			src: src,
			paper_type: paper_type,
			paper_type_str:paper_type_str
		})
		if (undefined != action) {
			if (action == 'print') {
				this.hasFile()
			} else {
				this.photo_img()
			}
		}
	},
	photo_img: function () {
		var that = this;
		var src = that.data.src
		wx.showLoading({
			title: '图片加载中......',
			mask: true
		})
		var url = app.globalData.requestUrl +src
		console.log(url)
		var filePath = wx.env.USER_DATA_PATH + '/' + "智能证件照.jpg"
		wx.downloadFile({
			url: url,
			filePath:filePath,
			success(res) {
				if (res.statusCode === 200) {
					var file_path = res.filePath
					console.log(file_path)
					var url = app.globalData.requestUrl + '/Api/File/upload?';
					wx.uploadFile({
						filePath: file_path,
						name: 'file',
						url: url,
						header: {
						'Content-Type': 'multipart/form-data',
						'token': wx.getStorageSync("token"),
						},
						success(res) {
							if (res.statusCode == 200) {
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
								data.data.file_num = 1
								data.data.print_color = 3
								data.data.print_page = 5
								data.data.paper_size = 0
								data.data.paper_type = that.data.paper_type
								data.data.img_url=app.globalData.requestUrl+src
								that.data.fileArray = [data].concat(that.data.fileArray)
								that.setData({
									fileNum: that.data.fileNum + 1,
									fileArray: that.data.fileArray
								})
								wx.hideLoading({
									success: (res) => {},
								})

							} else {
								wx.showToast({
									title: '服务器异常',
								})

							}
						}
					})
				} else {
					wx.hideLoading({
						success: (res) => {},
					})
					wx.showToast({
						title: '服务器异常',
					})
				}
			}
		})
	},
	hasFile: function () {
		var that = this;
		var document_id = that.data.document_id;
		wx.showLoading({
			title: '文件处理中......',
			mask: true
		})
		var typeUrl = app.globalData.requestUrl + '/Api/Library/getDocumentType?document_id=' + document_id + '&token=' + wx.getStorageSync("token");
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
						var url = app.globalData.requestUrl + '/Api/File/upload?'
						wx.uploadFile({
							filePath: filePath,
							name: 'file',
							url: url,
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
								wx.hideLoading({
									success: (res) => {},
								})
							},
							fail(e) {
								wx.hideLoading({
									success: (res) => {},
								})
								wx.showToast({
									title: e.errMsg,
								})
								console.log(e)
							}
						})
					},
					fail(res) {
						wx.hideLoading({
							success: (res) => {},
						})
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
			},
			fail(res) {
				wx.hideLoading({
				success: (res) => {},
				})
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
		console.log(fileObj.data.print_page)
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
		data.remark = this.data.remark
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
				// console.log("请求下单成功")    
				console.log(res.data)
				if (res.data.code != 0) {
					wx.showToast({
						title: res.data.msg,
						icon: 'none'
					})
					return
				}

				wx.redirectTo({
					url: '../payOrder/payOrder?id=' + res.data.data.id + "&price_fen=" + res.data.data.price_fen + "&original_price=" + res.data.data.original_price + "&campaign_name=" + res.data.data.campaign_name,
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
		console.log(this.data.fileNum)
		if (this.data.fileNum > 4) {
			wx.showToast({
				title: '上传文件个数不能大于5',
				icon: 'none'
			})
			return
		}
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
						console.log(tempFilePaths[0].size)
						var size = tempFilePaths[0].size / 1024 / 1024
						console.log(size)
						if (size > 20) {
							wx.showToast({
								title: '所选文件不能大于20M',
								icon: 'none'
							})
							return
						}
						var url = app.globalData.requestUrl + '/Api/File/upload?';
						wx.showLoading({
							title: '文件上传中......',
							mask: true
						})
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
								// console.log(data.msg)
								console.log(data.code)
								if (data.code != 0) {
									wx.hideLoading({
									success: (res) => {},
									})
									wx.showToast({
									title: data.msg,
									})
									return
								}
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
								console.log(that.data.fileArray)
								that.data.fileArray = [data].concat(that.data.fileArray)
								that.setData({
									fileNum: that.data.fileNum + 1,
									fileArray: that.data.fileArray
								})

								console.log(that.data.fileArray[0].name)
								wx.hideLoading({
									success: (res) => {},
								})
							},
							fail(e) {
								wx.hideLoading({
									success: (res) => {},
								})
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
		storeValue: this.data.storeValue
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
	getStore(school_id) {// 获取校区门店数据
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
				firstData.id = 0;
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
					console.log(res.data.data[1].id)
					that.setData({
						storeValue: res.data.data[1].id,
						storeName: res.data.data[1].store_name,
						latitude: res.data.data[1].latitude,
						longitude: res.data.data[1].longitude,
						markers: markers
					})
					console.log(that.data.storeValue)
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
	// showinput(){},
	getAdver() { // 获取广告
		var that = this
		var url = app.globalData.requestUrl + '/Api/Advertisement/getAdvertisingList'
		console.log(wx.getStorageSync("token"))
		wx.request({
			url: url,
			header: {
				'Content-Type': 'application/json',
				'token': wx.getStorageSync("token")
			},
			success(res) {
				console.log(res.data)
				if (res.data.code == 0) {
					console.log(res.data)
					console.log(res.data.data[0])
					var images = res.data.data
					for (var i = 0; i < images.length; i++) {
						console.log(images[i].img_path)
						images[i].img_path = app.globalData.requestUrl + images[i].img_path
						console.log(images[i].img_path)
					}
					that.setData({
						imgs: images
					})
				} else if (res.data.code == 999) {
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
				} else {
					wx.showToast({
						title: res.data.msg,
						icon: 'none'
					})
				}
			},
			fail(res) {
				console.log(res)
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
				console.log()
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
			},
			fail(res) {
				console.log(res)
				wx.showToast({
					title: '定位失败',
					icon: 'none'
				})
				wx.request({
					url: app.globalData.requestUrl + '/Api/File/getSchool?latitude=' + 0 + "&longitude=" + 0,
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
			fail: function (err) {}
		});
	},
	preview(e) { // 预览文件
		var id = e.currentTarget.dataset.index;
		console.log("预览" + id)
		console.log(this.data.fileArray[id].data.path)
		var self = this;
		var source_name = this.data.fileArray[id].data.path
		var sss = this.data.fileArray[id].data.path.split('/')
		source_name = sss[sss.length - 1]
		console.log(source_name)
		var ddd = source_name.split('.')
		var lastName = ddd[ddd.length - 1]
		if (lastName == 'jpg' || lastName == 'jpeg' || lastName == 'JPG' || lastName == 'png') {
			var urls = [app.globalData.requestUrl + this.data.fileArray[id].data.path + "?token=" + wx.getStorageSync("token")]
			wx.previewImage({
				urls: urls // 需要预览的图片http链接列表
			})
		} else {
			var url = app.globalData.requestUrl + this.data.fileArray[id].data.path + "?token=" + wx.getStorageSync("token");
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
					wx.hideLoading({
						success: (res) => {},
					})
					console.log("下载成功")
					var tempFilePath = res.tempFilePath;
					wx.openDocument({
						filePath: res.filePath,
							success(res) {
							console.log("成功")
						},
						fail(res) {
							console.log(res)
							wx.hideLoading({
								success: (res) => {},
							})
							wx.showToast({
								title: '文件下载错误',
							})	
						}
					})
				},
				fail(res) {
					console.log(res)
					wx.hideLoading({
						success: (res) => {},
					})
					wx.showToast({
						title: '文件下载错误',
					})
				}
			})
		}
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
		console.log('radio发生change事件，携带value值为：' + e.detail.value)
		var paper_type = e.detail.value;
		var index = e.currentTarget.dataset.index;
		console.log('index=' + index)
		this.data.fileArray[index].data.paper_type = paper_type;
		console.log('paper_typer=' + this.data.fileArray[index].data.paper_type)
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
		fileArray: this.data.fileArray,
		// fileNum:this.data.fileNum-1
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
			fileArray: this.data.fileArray,
			fileNum: this.data.fileNum - 1
		})
		console.log("删除后" + this.data.fileArray.length)
	},
	toAdv(e){
		var index = e.currentTarget.dataset.index;
		console.log(index)
		var imgs=this.data.imgs;
		console.log(imgs[index].type)
		console.log(imgs[index].url)
		
		// wx.previewImage({
		//   urls: ['http://cd-stg.lovecangda.com/Upload/PrintFile/20210305/2021030518277841.jpg'],
		// })
		if(imgs[index].type==2){
			wx.navigateTo({
				url: '../thirdPartyPage/thirdPartyPage?url='+imgs[index].url,
			})
		}
	
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
		console.log(url)
		wx.request({
			url: url,
			header: {
				'Content-Type': 'application/json',
				'token': wx.getStorageSync("token")
			},
			success(res) {
				console.log("获取门店价格成功")
				console.log(res)
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
	},
	showinput() {
		this.setData({
			showInput: true
		})
	},
	hideinput() {
		this.setData({
			showInput: false,
		// remark: ""
		})
	},
	setRemark() {
		console.log("setRemark" + this.data.remark)
		if (this.data.remark == '') {
			wx.showToast({
				title: '请输入备注信息',
				icon: 'none'
			})
			return
		}
		this.setData({
			showInput: false,
			remark: this.data.remark
		})
	},
	inputchange(e) {
		console.log(e.detail.value)
		this.data.remark = e.detail.value
	}


})