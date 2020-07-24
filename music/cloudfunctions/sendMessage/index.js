// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	const {
		OPENID
	} = cloud.getWXContext()
	try {
		const result = await cloud.openapi.subscribeMessage.send({
			touser: OPENID,
			page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
			data: {
				thing1: {
					value: '评价完成'
				},
				thing2: {
					value: event.content
				}
			},
			templateId: '3Wc1t8JDfFl5FkcG6ws8ayfAgs9P4qF2K_q6a8P_CMA',
			miniprogramState: 'developer'
		})
		return result
	} catch (err) {
		return err
	}
}
