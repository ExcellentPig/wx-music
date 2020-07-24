// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onTapQrCode(){
	  wx.showLoading({
		  title: '生成中...'
	  })
	  wx.cloud.callFunction({
		  name: 'getQrCode'
	  }).then((res)=>{
		  //console.log(res)
		  const fileId = res.result
		  wx.previewImage({
			  urls: [fileId],
			  current: fileId
		  })
		  wx.hideLoading()
	  })
  }
})