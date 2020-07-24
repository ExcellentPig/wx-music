const app = getApp();

let musiclist = []
//正在播放歌曲的index
let nowPlayingIndex = 0

//全局唯一音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager();

Page({

	data: {
		picUrl: '',
		isPlaying: false,
		isLyricShow: false, //歌词是否显示
		lyric: '',
		isSame: false, //表示是否为同一首歌
	},
	onLoad: function(options) {
		//console.log(options)
		nowPlayingIndex = options.index;
		musiclist = wx.getStorageSync('musiclist');
		//console.log(musiclist)
		this._loadMusicDetail(options.musicId);
	},
	_loadMusicDetail(musicId) {
		if (musicId == app.getPlayingMusicId()) {
			this.setData({
				isSame: true
			})
		} else {
			this.setData({
				isSame: false
			})
		}
		if (!this.data.isSame) {
			backgroundAudioManager.stop();
		}

		let music = musiclist[nowPlayingIndex];
		//console.log(music)
		wx.setNavigationBarTitle({
			title: music.name
		})
		this.setData({
			picUrl: music.al.picUrl,
			isPlaying: false
		})

		//console.log(musicId, typeof musicId) //type不同

		app.setPlayingMusicId(musicId)


		wx.showLoading({
			title: '歌曲加载中...'
		})

		wx.cloud.callFunction({
			name: 'music',
			data: {
				musicId,
				$url: 'musicUrl'
			}
		}).then(res => {
			//console.log(res)
			//console.log(JSON.parse(res.result));
			let result = JSON.parse(res.result);
			if(result.data[0].url == null){
				wx.showToast({
					title: '无权限播放'
				})
				return
			}
			if (!this.data.isSame) {
				backgroundAudioManager.src = result.data[0].url;
				backgroundAudioManager.title = music.name;
				backgroundAudioManager.coverImgUrl = music.al.picUrl;
				backgroundAudioManager.singer = music.ar[0].name;
				backgroundAudioManager.epname = music.al.name;
			
				//保存播放历史
				this.savePlayHistory()
			}
			this.setData({
				isPlaying: true
			})
			wx.hideLoading();

			wx.cloud.callFunction({
				name: 'music',
				data: {
					musicId,
					$url: 'lyric'
				}
			}).then((res) => {
				// console.log(res)
				let lyric = '暂无歌词'
				const lrc = JSON.parse(res.result).lrc;
				if (lrc) {
					lyric = lrc.lyric
				}
				this.setData({
					lyric
				})
			})

		})
	},
	togglePlayiing() {
		if (this.data.isPlaying) {
			backgroundAudioManager.pause()
		} else {
			backgroundAudioManager.play()
		}
		this.setData({
			isPlaying: !this.data.isPlaying
		})
	},
	onPrev() {
		nowPlayingIndex--;
		if (nowPlayingIndex < 0) {
			nowPlayingIndex = musiclist.length - 1;
		}
		this._loadMusicDetail(musiclist[nowPlayingIndex].id)
	},
	onNext() {
		nowPlayingIndex++;
		if (nowPlayingIndex === musiclist.length) {
			nowPlayingIndex = 0;
		}
		this._loadMusicDetail(musiclist[nowPlayingIndex].id)
	},
	onChangeLyricShow() {
		this.setData({
			isLyricShow: !this.data.isLyricShow
		})
	},
	timeUpdate(event) {
		this.selectComponent('.lyric').update(event.detail.currentTime)
	},
	onPlay() {
		this.setData({
			isPlaying: true
		})
	},
	onPause() {
		this.setData({
			isPlaying: false
		})
	},
	//保存播放历史
	savePlayHistory(){
		//当前播放个歌曲
		const music = musiclist[nowPlayingIndex]
		const openid = app.globalData.openid
		const history = wx.getStorageSync(openid)
		let bHave = false
		for(let i=0,len=history.length;i<len;i++){
			if(history[i].id == music.id){
				bHave = true
				break
			}
		}
		if(!bHave){
			history.unshift(music)
			wx.setStorage({
				key: openid,
				data: history
			})
		}
	}
})
