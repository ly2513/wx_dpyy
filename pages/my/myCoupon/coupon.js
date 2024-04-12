const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		this.getData();
		wx.setNavigationBarTitle({
			title: '优惠券列表',
	  })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
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

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
		console.log(111111)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    getData: function () {
		var self = this;
		var pageIndex = self.data.currentPage;
		wx.request({
			url: app.globalData.requestUrl + '/Coupon/Coupon/getMyCoupon',
			data: {
				perPage: 10,
				page: pageIndex,
			},
			header: { 'Content-Type': 'application/json','token': wx.getStorageSync("token") },
			success: function (res) {
				var dataModel = res.data;
				console.log(dataModel);
				if (dataModel.code == 0) {
					if (pageIndex == 1) { // 下拉刷新
						self.setData({
							allPages: dataModel.data.total_page,
							contentlist: dataModel.data.data,
							hideHeader: true
						})
					} else { // 加载更多
						console.log('加载更多');
						self.setData({
							contentlist: self.data.contentlist.concat(dataModel.data.data),
							hideBottom: true
						})
					}
				}else if(dataModel.code == 999){
					wx.showModal({
						title: '系统提示',
						content: dataModel.msg,
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
			},
			fail: function () {}
		})
  	},
	onPullDownRefresh: function () {
		wx.showNavigationBarLoading() //在标题栏中显示加载
		this.getData();
		//模拟加载
		setTimeout(function () {
			wx.hideNavigationBarLoading() //完成停止加载
			wx.stopPullDownRefresh() //停止下拉刷新
		}, 1500);
	},
})