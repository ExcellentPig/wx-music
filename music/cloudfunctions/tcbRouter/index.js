// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})
  
  app.use(async (ctx,next)=>{
	  console.log('进入全局中间件')
	  ctx.data = {}
	  ctx.data.openId = event.userInfo.openId
	  await next()
	  console.log('退出全局中间件')
  })
  
  app.router('music',async(ctx,next)=>{
	  console.log('进入music中间件')
	  ctx.data.musicName = '数鸭子'
	  await next()
	  console.log('退出music中间件')
  },async (ctx,next)=>{
	  console.log('进入musicType中间件')
	  ctx.data.musicType = '儿歌'
	  ctx.body = {
		  data: ctx.data
	  }
	  console.log('退出musicType中间件')
  })
  
  app.router('movie',async(ctx,next)=>{
	  console.log('进入movie中间件')
  	  ctx.data.movieName = '一人之下'
  	  await next()
	  console.log('退出movie中间件')
  },async (ctx,next)=>{
	  console.log('进入movieType中间件')
  	  ctx.data.movieType = '动漫'
  	  ctx.body = {
  		  data: ctx.data
  	  }
	  console.log('退出movieType中间件')
  })
  
  return app.serve()
  
}