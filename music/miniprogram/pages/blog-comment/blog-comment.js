import formatTime from '../../utils/formatTime.js'


Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		blog: {},
		commentList: [],
		blogId: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		//console.log(options)
		this.setData({
			blogId: options.blogId
		})
		this._getBlogDetail()
	},
	_getBlogDetail() {
		wx.showLoading({
			title: '加载中...',
			mask: true
		})

		wx.cloud.callFunction({
			name: 'blog',
			data: {
				blogId: this.data.blogId,
				$url: 'detail'
			}
		}).then((res) => {
			let commentList = res.result.commentList.data
			for (let i = 0, len = commentList.length; i < len; i++) {
				commentList[i].createTime = formatTime(new Date(commentList[i].createTime))
			}

			this.setData({
				blog: res.result.detail[0],
				commentList: commentList
			})
			wx.hideLoading()
			//console.log(res)
		})

	},
	onShareAppMessage() {
		const blog = this.data.blog
		return {
			title: blog.content,
			path: `/pages/blog-comment/blog-comment?blogId=${blog._id}`
		}
	}
})
