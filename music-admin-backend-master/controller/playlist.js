const Router = require('koa-router')
const router = new Router()
const rp = require('request-promise')


//const getAccessToken = require('../utils/getAccessToken.js')

const callCloudFn = require('../utils/callCloudFn')
const callCloudDB = require('../utils/callCloudDB')

//const ENV = 'test-hryjr'
//const FUNCTION_NAME = 'music'

router.get('/list', async (ctx, next) => {
	//查询歌单列表
	//ctx.body = '歌单列表'

	//const ACCESS_TOKEN = await getAccessToken()

	//const URL =`https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${ENV}&name=${FUNCTION_NAME}`
	// const query = ctx.request.query
	// var options = {
	// 	method: 'POST',
	// 	uri: URL,
	// 	body: {
	// 		$url: 'playlist',
	// 		start: parseInt(query.start),
	// 		count: parseInt(query.count)
	// 	},
	// 	json: true
	// }
	// const data = await rp(options).then((res) => {
	// 	//console.log(res)
	// 	return JSON.parse(res.resp_data).data
	// }).catch((err) => {
	// 	console.log(err)
	// })
	// ctx.body = {  //这个是koa-cors要求的
	// 	data,
	// 	code: 20000
	// }
	//改造后
	const query = ctx.request.query
	const res = await callCloudFn(ctx, 'music', {
		$url: 'playlist',
		start: parseInt(query.start),
		count: parseInt(query.count)
	})
	let data = []
	if (res.resp_data) {
		data = JSON.parse(res.resp_data).data
	}
	ctx.body = { //这个是koa-cors要求的
		data,
		code: 20000
	}

})


router.get('/getById', async (ctx, next) => {
	const query = `db.collection('playlist').doc('${ctx.request.query.id}').get()`
	const res = await callCloudDB(ctx, 'databasequery', query)
	ctx.body = {
		code: 20000,
		data: JSON.parse(res.data)
	}
})


//npm install koa-body
router.post('/updatePlaylist', async (ctx, next) => {
	const params = ctx.request.body
	const query =
		`
        db.collection('playlist').doc('${params._id}').update({
            data: {
                name: '${params.name}',
                copywriter: '${params.copywriter}'
            }
        })
    `
	const res = await callCloudDB(ctx, 'databaseupdate', query)
	ctx.body = {
		code: 20000,
		data: res
	}
})

router.get('/del', async (ctx,next)=>{
	const params = ctx.request.query
	const query = `db.collection('playlist').doc('${params.id}').remove()`
	const res = await callCloudDB(ctx, 'databasedelete', query)
	ctx.body = {
		code: 20000,
		data: res
	}
})


module.exports = router
