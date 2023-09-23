// menu.js
//获取应用实例
const app = getApp();
app.globalData.openId = '';
app.globalData.unionId = '';
Page({
  	data: {
		phone:''
	},
  //事件处理函数
  	bindViewTap: function() {
		wx.navigateTo({
			url: '../logs/logs'
		})
  	},
	orderList: function (e) {
		// redirectTo是两个页面之间的平行跳转，navigateTo是父页面与子页面之间的跳转
		// switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
		// 跳转不带tab的页面还是用redirectTo或者navigateTo 
		wx.navigateTo({
			url: '../success/success',
			success:function (res){
				console.log('跳转成功');
			},
			fail:function(e){
				console.log(e);
				console.log('跳转失败');
			}
		})
	},
	onLoad: function () {
		// 检测是否登陆
		var token = wx.getStorageSync("token");
		if(!token){
			wx.showModal({
				title: '系统提示',
				content: "请登录后在操作!",
				showCancel: true,
				success: function (resbtn) {
					if (resbtn.confirm) {
						// 跳转登录页
						wx.navigateTo({
							url: '../access/access'
						})
					}
					return false;
				}
			})
		}
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			})
		}
		// 设置手机号码
		this.setData({
			phone: app.globalData.phone,
		})
	},
	placeOrder :function(e){ // 下单打印
		var token = wx.getStorageSync("token");
		if(!token){
			wx.showModal({
				title: '系统提示',
				content: "请登录后在操作!",
				showCancel: true,
				success: function (resbtn) {
				if (resbtn.confirm) {
					// 跳转登录页
					wx.navigateTo({
						url: '../access/access'
					})
				}
				return false;
				}
			})
		}else{
			wx.navigateTo({
				url: '../newPlaceOrder/newPlaceOrder',
				success: function (res) {
					console.log('跳转成功');
				},
				fail: function (e) {
					console.log(e);
					console.log('跳转失败');
				}
			})
		}
	},
	smart_photo:function(e){
		var token = wx.getStorageSync("token");
		if(!token){
			wx.showModal({
				title: '系统提示',
				content: "请登录后在操作!",
				showCancel: true,
				success: function (resbtn) {
				if (resbtn.confirm) {
					// 跳转登录页
					wx.navigateTo({
					url: '../access/access'
					})
				}
				return false;
				}
			})
		}else{
			wx.navigateTo({
				url: '../chosePhotoSize/chosePhotoSize',
				success: function (res) {
					console.log('跳转成功');
				},
				fail: function (e) {
					console.log(e);
					console.log('跳转失败');
				}
			})
		}
	},
	myOrder: function (e) { // 订单查询
		var token = wx.getStorageSync("token");
		if(!token){
			wx.showModal({
				title: '系统提示',
				content: "请登录后在操作!",
				showCancel: true,
				success: function (resbtn) {
				if (resbtn.confirm) {
					// 跳转登录页
					wx.navigateTo({
						url: '../access/access'
					})
				}
					return false;
				}
			})
		}else{
			wx.switchTab({
				url: '../order/order',
				success: function (res) {
					console.log('跳转成功');
				},
				fail: function (e) {
					console.log(e);
					console.log('跳转失败');
				}
			})
		}
	},
	complaintProposal : function(e){ // 共享文库 
		var token = wx.getStorageSync("token");
		if(!token){
			wx.showModal({
				title: '系统提示',
				content: "请登录后在操作!",
				showCancel: true,
				success: function (resbtn) {
					if (resbtn.confirm) {
						// 跳转登录页
						wx.navigateTo({
						url: '../access/access'
						})
					}
					return false;
				}
			})
		}else{
			wx.navigateTo({
				url: '../shareLibrary/shareLibrary',
				success: function (res) {
					console.log('跳转成功');
				},
				fail: function (e) {
					console.log(e);
					console.log('跳转失败');
				}
			})
		}
	},
})



