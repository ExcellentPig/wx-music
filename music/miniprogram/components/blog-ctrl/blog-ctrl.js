let userInfo = {}

const db = wx.cloud.database()

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		blogId: String,
		blog: Object
	},
	externalClasses: [ //接受外部传入的class
		'iconfont',
		'icon-pinglun',
		'icon-fenxiang'
	],
	/**
	 * 组件的初始数据
	 */
	data: {
		loginShow: false, //登录
		modalShow: false, //底部弹层
		content: ''
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onComment() {
			//判斷用戶是否授權
			wx.getSetting({
				success: (res) => {
					//console.log(res)
					if (res.authSetting['scope.userInfo']) {
						wx.getUserInfo({
							success: (res) => {
								userInfo = res.userInfo
								this.setData({
									modalShow: true
								})
							}
						})
					} else {
						this.setData({
							loginShow: true
						})
					}
				}
			})
		},
		onLoginSuccess(event) {
			userInfo = event.detail
			this.setData({
				loginShow: false
			}, () => {
				this.setData({
					modalShow: true
				})
			})
		},
		onLoginFail() {
			wx.showModal({
				title: '授权用户才能评价',
				content: ''
			})
		},
		onInput(event) {
			//console.log(event)
			this.setData({
				content: event.detail.value
			})

		},
		onSend(event) {
			let formId = event.detail.formId
			let content = this.data.content
			//console.log(content)
			wx.requestSubscribeMessage({
				tmplIds: ['3Wc1t8JDfFl5FkcG6ws8ayfAgs9P4qF2K_q6a8P_CMA'],
				success: (res) => {
					//console.log(res)
					wx.cloud.callFunction({
						name: 'sendMessage',
						data: {
							content,
							blogId: this.properties.blogId
						}
					}).then((res) => {
						//console.log(res)
					}).catch((err) => {
						//console.log(err)
					})
				},
				fail(err) {
					//console.log(err)
				}
			})
			//插入云数据库

			//console.log(event)



			// this.setData({
			// 	content: event.detail.value.content
			// })

			if (content.trim() == '') {
				wx.showModal({
					title: '评论不能为空',
					content: ''
				})
				return
			}

			wx.showLoading({
				title: '评价中',
				mask: true
			})

			db.collection('blog-comment').add({
				data: {
					content,
					createTime: db.serverDate(),
					blogId: this.properties.blogId,
					nickName: userInfo.nickName,
					avatarUrl: userInfo.avatarUrl
				}
			}).then((res) => {

				//console.log(wx.canIUse('requestSubscribeMessage'))

				// wx.getSetting({
				// 	withSubscriptions: true,
				// 	success(res) {
				// 		//console.log(res.authSetting)
				// 		//console.log(res.subscriptionsSetting)
				// 	}
				// })


				wx.hideLoading()
				wx.showToast({
					title: '评论成功',
					icon: 'success'
				})
				this.setData({
					modalShow: false,
					content: ''
				})
				
				//父元素刷新评论
				this.triggerEvent('refreshCommentList')
				
			})
		}
	}
})
