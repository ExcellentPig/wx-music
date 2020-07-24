let movableAreaWidth = 0;
let movableViewWidth = 0;

const backgroundAudioManager = wx.getBackgroundAudioManager();

let currentSec = -1; //当前的秒数

//当前歌曲的总时长 秒单位 参与计算
let duration = 0;

let isMoving = false; //当前进度条是否拖拽  拖动和uodateTime冲突问题

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		isSame: Boolean
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		showTime: {
			currentTime: '00:00',
			totalTime: '00:00'
		},
		movableDis: 0,
		progress: 0
	},
	lifetimes: { //定义生命周期函数
		ready() {
			if(this.properties.isSame && this.data.showTime.totalTime == '00:00'){
				this._setTime();
			}
			this._getMovableDis();
			this._bindBGMEvent();
		}
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		onChange(event) {
			// console.log(event)
			if (event.detail.source == 'touch') {
				this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
				this.data.movableDis = event.detail.x
				isMoving = true;
				//console.log('change',isMoving)
			}
		},
		onTouchEnd() {
			const currentTimeFmt = this._dateFormat(Math.floor(backgroundAudioManager.currentTime))
			this.setData({
				progress: this.data.progress,
				movableDis: this.data.movableDis,
				['showTime.currentTime']: currentTimeFmt.min + ':' + currentTimeFmt.sec
			})
			backgroundAudioManager.seek(duration * this.data.progress / 100);
			isMoving = false;
			//console.log('end',isMoving)
		},
		_getMovableDis() {
			const query = this.createSelectorQuery() //获取组件相关信息
			query.select('.movable-area').boundingClientRect();
			query.select('.movable-view').boundingClientRect();
			query.exec((rect) => {
				//console.log(rect)
				movableAreaWidth = rect[0].width;
				movableViewWidth = rect[1].width;
				//console.log(movableAreaWidth,movableViewWidth)
			})
		},
		_bindBGMEvent() {
			backgroundAudioManager.onPlay(() => {
				//console.log('onplay');
				isMoving = false;
				this.triggerEvent('musicPlay')
			})
			backgroundAudioManager.onStop(() => {
				//console.log('onStop');
			})
			backgroundAudioManager.onPause(() => {
				//console.log('onPause');
				this.triggerEvent('musicPause')
			})
			backgroundAudioManager.onWaiting(() => {
				///console.log('onWaiting');
			})
			backgroundAudioManager.onCanplay(() => {
				//console.log('onCanplay');
				//console.log(backgroundAudioManager.duration) //总时长  有些时候是undefined

				if (typeof backgroundAudioManager.duration != 'undefined') {
					this._setTime();
				} else {
					setTimeout(() => {
						this._setTime();
					}, 1000)
				}
			})
			backgroundAudioManager.onTimeUpdate(() => {
				//console.log('onTimeUpdate');
				if (!isMoving) {
					const currentTime = backgroundAudioManager.currentTime
					const duration = backgroundAudioManager.duration;

					//console.log(currentTime)

					const sec = currentTime.toString().split('.')[0]
					//一秒只设置一次值
					if (sec != currentSec) {
						//console.log(currentTime)
						const currentTimeFmt = this._dateFormat(currentTime);
						this.setData({
							movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
							progress: currentTime / duration * 100,
							['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
						})
						currentSec = sec;
						//联动歌词
						this.triggerEvent('timeUpdate',{
							currentTime
						})
						
						
					}
				}
			})
			backgroundAudioManager.onEnded(() => {
				//console.log('onEnded');
				this.triggerEvent('musicEnd')
			})
			backgroundAudioManager.onError((res) => {
				//console.error(res.errMsg)
				//console.error(res.errorCode);
				wx.showToast({
					title: '错误' + res.errorCode
				})
			})
		},
		_setTime() {
			duration = backgroundAudioManager.duration;
			//console.log(duration);
			const durationFmt = this._dateFormat(duration);
			//console.log(durationFmt)
			this.setData({
				['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
			})
		},
		_dateFormat(sec) { //格式化时间
			const min = Math.floor(sec / 60);
			sec = Math.floor(sec % 60);
			return {
				'min': this._parse0(min),
				'sec': this._parse0(sec)
			}
		},
		_parse0(sec) { //05:05 补充0 
			return sec < 10 ? '0' + sec : sec
		}
	}
})
