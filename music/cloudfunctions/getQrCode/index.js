// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	const result = await cloud.openapi.wxacode.getUnlimited({
		scene: wxContext.OPENID,
		// page: '/pages/blog/blog'
		// lineColor: { //黑色区域的颜色
		// 	'r': 211,
		// 	'g': 60,
		// 	'b': 57
		// },
		// isHyaline: true  //透明
	})

	//console.log(result)
	//buffer转换

	const upload = await cloud.uploadFile({
		cloudPath: 'qrcode/' + Date.now() + '_' + Math.random() + '.png',
		fileContent: result.buffer
	})
	
	return upload.fileID

}
