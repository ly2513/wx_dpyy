// pages/payOrder/payOrder.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  	data: {
		id:'',// 订单ID
		order_no: '',// 订单号
		price_fen: 0,// 订单金额(折扣后)分
		original_price:0.00,// 订单金额(折扣前)
		price:0.00,// 订单金额(折扣后)元
		sub_price:0.00,// 优惠金额（元）
		coupon_price: 0.00,// 优惠券金额
		campaign_price: 0.00,// 营销活动金额
		delivery_price:0.00,// 派送费
		coupon_id:0,//优惠券ID
		imgs:[],// 轮播图
	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		var id = options.id;
		// 加载轮播图
		this.getAdver();
		// 获取订单支付费用
		this.getPayPrice(id);
	},
	pay(){// 支付订单
		wx.request({
			url: app.globalData.requestUrl + '/Api/Pay/payOrder/' + this.data.id +'?trade_type=' + app.globalData.tradeType,//后台语言的处理 
			method: 'POST',
			header: { 'content-type': 'application/json', 'content-type': 'application/x-www-form-urlencoded', 'token': wx.getStorageSync("token")},
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
										wx.requestSubscribeMessage({
											tmplIds: ['fUBqODd2mYiBNkasdBseV1InmntcrHvKNOdUCJwqNrM'],
											success(res){
												console.log(res.errMsg+res.TEMPLATE_ID);
												wx.navigateBack({
												complete: (res) => {},
												})
											},
											fail(res){
												console.log(res.errCode+res.errMsg);
												wx.navigateBack({
												complete: (res) => {},
												})
											}
										})
									}
								}
							})
						},
						fail: function (res) {
							wx.navigateBack({
								complete: (res) => {},
							})
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
					wx.navigateBack({
						complete: (res) => {},
					})
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
				wx.navigateBack({
					complete: (res) => {},
				})
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
	getAdver() { // 获取轮播图
		var that=this
		var url = app.globalData.requestUrl + '/Api/Advertisement/getAdvertisingList'
		wx.request({
			url: url,
			header: {
				'Content-Type': 'application/json',
				'token': wx.getStorageSync("token")
			},
			success(res) {
				console.log(res.data)
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
	getPayPrice(orderId){// 获取订单价格明细
		var that=this
		wx.request({
			url: app.globalData.requestUrl + '/Api/Pay/getPayPrice?order_id=' + orderId,
			header: {
				'Content-Type': 'application/json',
				'token': wx.getStorageSync("token")
			},
			success(res) {
				if(res.data.code == 0){
					that.setData({
						id:orderId,
						order_no:res.data.data.order_no,
						price:res.data.data.price_fee/100.00,
						original_price:res.data.data.original_price_fee/100.00,
						sub_price: (res.data.data.coupon_price_fee + res.data.data.campaign_price_fee)/100.00,
						delivery_price:res.data.data.delivery_fee/100.00,
						coupon_price: res.data.data.coupon_price_fee/100.00,
						campaign_price: res.data.data.campaign_price_fee/100.00,
						coupon_id: res.data.data.coupon_id,
					})
				}else{
					console.log(res.data.msg);
					wx.showModal({
						title: '提示',
						content: '服务异常',
						showCancel: false
					})
				}
			},
			fail: function (res) {
				console.log(res.data.msg);
				wx.showModal({
					title: '提示',
					content: '服务器休息了',
					showCancel: false
				})
			}
		})
	}
})