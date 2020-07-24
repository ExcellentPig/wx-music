//输入文字最大的个数
const MAX_WORDS_NUM = 140
const MAX_IMG_NUM = 9

const db = wx.cloud.database()

//输入的文字内容
let content = ''
let userInfo = {}

Page({
	data: {
		wordsNum: 0,
		footerBottom: 0,
		images: [],
		selectPhone: true
	},
	onLoad(options) {
		//console.log(options)
		userInfo = options
	},
	onInput(event) {
		//console.log(event.detail.value)
		let wordsNum = event.detail.value.length;
		if (wordsNum >= MAX_WORDS_NUM) {
			wordsNum = `最大字数为${MAX_WORDS_NUM}`
		}
		this.setData({
			wordsNum
		})
		content = event.detail.value
	},
	onFocus(event) {
		//模拟器获取的键盘高度为0
		//console.log(event)
		this.setData({
			footerBottom: event.detail.height
		})
	},
	onBlur() {
		this.setData({
			footerBottom: 0
		})
	},
	onChooseImage() {
		//还能再选几张图片
		let max = MAX_IMG_NUM - this.data.images.length
		wx.chooseImage({
			count: max,
			sizeType: ['original', 'compressed'],
			sorceType: ['album', 'camera'],
			success: (res) => {
				//console.log(res)
				this.setData({
					images: this.data.images.concat(res.tempFilePaths)
				})
				max = MAX_IMG_NUM - this.data.images.length
				this.setData({
					selectPhone: max <= 0 ? false : true
				})
			}
		})
	},
	onDeleteImage(event) {
		this.data.images.splice(event.target.dataset.index, 1)
		// console.log(a,this.data.images)
		this.setData({
			images: this.data.images
		})
		if (this.data.images.length == MAX_IMG_NUM - 1) {
			this.setData({
				selectPhone: true
			})
		}
	},
	onPreviewImage(event) {
		wx.previewImage({
			urls: this.data.images,
			current: event.target.dataset.imgsrc
		})
	},
	send() {
		//数据存储到云数据库中
		//fileID 云文件ID   openId  nickName  avatarUrl  time

		if(content.trim() === ''){
			wx.showModal({
				title: '请输入内容',
				content: ''
			})
			return
		}
		
		wx.showLoading({
			title: '发布中...',
			mask: true
		})
		
		
		let promiseArr = []
		let fileIds = []

		//图片上传
		for (let i = 0, len = this.data.images.length; i < len; i++) {
			let p = new Promise((resolve, reject) => {
				let item = this.data.images[i]
				//文件扩展名
				let suffix = /\.\w+$/.exec(item)[0]
				wx.cloud.uploadFile({
					cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
					filePath: item,
					success: (res) => {
						//console.log(res)
						fileIds = fileIds.concat(res.fileID)
						resolve()
					},
					fail: (err) => {
						//console.log(err)
						reject()
					}
				})
			})
			promiseArr.push(p)
		}

		//存入云数据库
		Promise.all(promiseArr).then((res)=>{
			db.collection('blog').add({
				data: {
					...userInfo,
					content,
					img: fileIds,
					createTime: db.serverDate()
				}
			}).then((res)=>{
				wx.hideLoading()
				wx.showToast({
					title: '发布成功'
				})
				//返回blog 并且刷新列表
				wx.navigateBack()
				const pages = getCurrentPages() //获取界面
				// console.log(pages)
				const prevPage = pages[pages.length - 2]
				prevPage.onPullDownRefresh();
			})
		}).catch((err)=>{
			wx.hideLoading()
			wx.showToast({
				title: '发布失败'
			})
		})

	}
})
