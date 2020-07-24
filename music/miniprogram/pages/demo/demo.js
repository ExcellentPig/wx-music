// pages/demo/demo.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		openid: '',
		arr: ['a', 'b', 'c'],
		arrObj: [{
				id: 1,
				name: 'rose'
			},
			{
				id: 2,
				name: 'jack'
			},
			{
				id: 3,
				name: 'stone'
			},
			{
				id: 4,
				name: 'khan'
			}
		],
		num: 0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		wx.cloud.callFunction({
			name: 'login'
		}).then(res => {
			console.log(res);
			this.setData({
				openid: res.result.openid
			})
		})


		// setTimeout(()=>{
		// 	console.log(1)
		// },1000)
		// console.log(2)

		//callback hell

		// setTimeout(()=>{
		// 	console.log(1);
		// 	setTimeout(()=>{
		// 		console.log(2)
		// 		//.....
		// 	},2000)
		// },1000)


		//promise

		/*  pending   准备状态
		 *  fulfilled  成功状态
		 *  rejected   失败状态
		 */

		// new Promise((resolve,reject)=>{
		// 	setTimeout(()=>{
		// 		console.log(1)
		// 		resolve()
		// 	},1000)
		// }).then((res)=>{
		// 	setTimeout(()=>{
		// 		console.log(2)
		// 	},2000)
		// })

		// Prmise.all([p1,p2]).then(res=>{
		// 	console.log(2)
		// })

		// console.log(this.foo());
		// this.foo();

		// this.timeout();

		this.foo();

		wx.getUserInfo({
			success: (res) => {
				console.log(res)
			}
		})



	},
	async foo() {
		console.log('foo');
		let res = await this.timeout();
		console.log(res);
		//return 1;
	},
	timeout() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				console.log(1);
				resolve('resolved');
			}, 1000)
		})
	},
	sort() {
		const length = this.data.arr.length;
		for (let i = 0; i < length; i++) {
			const x = Math.floor(Math.random() * length);
			const y = Math.floor(Math.random() * length);
			const temp = this.data.arr[x];
			this.data.arr[x] = this.data.arr[y];
			this.data.arr[y] = temp;
		}
		this.setData({
			arr: this.data.arr
		})
	},
	sortObj() {
		const length = this.data.arrObj.length;
		for (let i = 0; i < length; i++) {
			const x = Math.floor(Math.random() * length);
			const y = Math.floor(Math.random() * length);
			const temp = this.data.arrObj[x];
			this.data.arrObj[x] = this.data.arrObj[y];
			this.data.arrObj[y] = temp;
		}
		this.setData({
			arrObj: this.data.arrObj
		})
	},
	getMusicInfo() {
		wx.cloud.callFunction({
			name: 'tcbRouter',
			data: {
				$url: 'music'
			}
		}).then(res => {
			console.log(res)
		})
	},
	getMovieInfo() {
		wx.cloud.callFunction({
			name: 'tcbRouter',
			data: {
				$url: 'movie'
			}
		}).then(res => {
			console.log(res)
		})
	},
	onGetUserInfo(event) {
		console.log(event)
	},
	getOpenId() {
		wx.cloud.callFunction({
			name: 'login'
		}).then((res) => {
			console.log(res)
		})
	},
	add(){
		this.setData({
			num: this.data.num +1
		})
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
