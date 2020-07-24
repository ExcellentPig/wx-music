const app = getApp()

const db = wx.cloud.database()


const MAX_LIMIT = 10

Page({
	data: {
		blogList: []
	},

	onLoad: function(options) {
		//this._getListByCloudFn()
		this._getListByMiniprogram()
	},
	//云函数方法
	_getListByCloudFn() {
		wx.showLoading({
			title: '加载中'
		})
		wx.cloud.callFunction({
			name: 'blog',
			data: {
				$url: 'getListBtOpenid',
				start: this.data.blogList.length,
				count: MAX_LIMIT
			}
		}).then((res) => {
			//console.log(res)
			this.setData({
				blogList: this.data.blogList.concat(res.result)
			})
			wx.hideLoading()
		})
	},
	//小程序方法
	_getListByMiniprogram() { // 数据库权限设置为仅创建者可读写 所以不需要where
		wx.showLoading({
			title: '加载中',
		})
		db.collection('blog').skip(this.data.blogList.length)
			.limit(MAX_LIMIT).orderBy('createTime', 'desc').get().then((res) => {
				//console.log(res)
				let _bloglist = res.data
				for (let i = 0, len = _bloglist.length; i < len; i++) {
					_bloglist[i].createTime = _bloglist[i].createTime.toString() //这样的方式时间是NaN 需要循环转换为字符串
				}


				this.setData({
					blogList: this.data.blogList.concat(_bloglist)
				})

				wx.hideLoading()
			})
	},
	goComment(event) {
		wx.navigateTo({
			url: `../../pages/blog-comment/blog-comment?blogId=${event.target.dataset.blogid}`
		})
	},
	onReachBottom() {
		// this._getListByCloudFn()
		this._getListByMiniprogram()
	},
	onShareAppMessage(event) {
		const blog = event.target.dataset.blog
		return {
			title: blog.content,
			path: `/pages/blog-comment/blog-comment?blogId=${blog._id}`
		}
	}

})
