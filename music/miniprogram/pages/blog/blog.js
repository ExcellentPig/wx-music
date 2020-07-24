
//搜索的关键字
let keyword = ''

Page({
	data: {
		modalShow: false,
		blogList: []
	},
	onLoad(options) {
		//console.log(options.scene)  //扫描小程序码 获取的
		this._loadBlogList()
		
		//2  小程序端调用云数据库
		// const db = wx.cloud.database()  //最多20条  但是在云函数中查询是100条
		// db.collection('blog')
		// .orderBy('createTime','desc')
		// .get()
		// .then((res)=>{
		// 	//console.log(res)
		// 	const data = res.data
		// 	for(let i=0,len=data.length;i<len;i++){
		// 		data[i].createTime = data[i].createTime.toString()
		// 	}
		// 	this.setData({
		// 		blogList: data
		// 	})
		// })
		
	},
	onPublish() {
		wx.getSetting({
			success: (res) => {
				//console.log(res)
				if (res.authSetting["scope.userInfo"]) {
					wx.getUserInfo({
						success: (res) => {
							//console.log(res)
							this.onLoginSuccess({
								detail: res.userInfo
							})
						}
					})
				} else {
					this.setData({
						modalShow: true
					})
				}
			}
		})

	},
	onLoginSuccess(event) {
		//console.log(event)
		const detail = event.detail
		wx.navigateTo({
			url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`
		})
	},
	onLoginFail() {
		wx.showModal({
			title: '授权的用户才能发布',
			content: ''
		})
	},
	_loadBlogList(start = 0) {
		wx.showLoading({
			title: '拼命加载中...'
		})
		wx.cloud.callFunction({
			name: 'blog',
			data: {
				keyword,
				start,
				count: 10,
				$url: 'list'
			}
		}).then((res) => {
			this.setData({
				blogList: this.data.blogList.concat(res.result)
			})
			wx.hideLoading()
			wx.stopPullDownRefresh()
		})
	},
	onPullDownRefresh(){
		//console.log(1)
		this.setData({
			blogList: []
		})
		this._loadBlogList(0)
	},
	onReachBottom() {
		this._loadBlogList(this.data.blogList.length)
	},
	goComment(event){
		wx.navigateTo({
			url: `../../pages/blog-comment/blog-comment?blogId=${event.target.dataset.blogid}`
		})
	},
	onSearch(event){
		// console.log(event.detail.keyword)
		this.setData({
			blogList: []
		})
		keyword = event.detail.keyword
		this._loadBlogList(0)
	},
	onShareAppMessage(event){
		// console.log(event)
		let blogObj = event.target.dataset.blog
		return {
			title: blogObj.content,
			path: `/pages/blog-comment/blog-comment?blogId=${blogObj._id}`
		}
	}
})
