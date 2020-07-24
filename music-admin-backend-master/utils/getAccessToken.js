const rp = require('request-promise')
const APPID = 'wx47e3d301cb86fab1'
const APPSECRET = '40b2ec2887a1f752c2891b13d4d3b05f'
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`

const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname, './access_token.json')
//console.log(fileName)

const updateAccessToken = async () => {
	const resStr = await rp(URL)
	const res = JSON.parse(resStr)
	//console.log(res)
	//写文件
	if (res.access_token) {
		fs.writeFileSync(fileName, JSON.stringify({
			access_token: res.access_token,
			createTime: new Date()
		}))
	}else{
		await updateAccessToken()
	}
}

const getAccessToken = async ()=>{
	//读文件
	try{
		const readRes = fs.readFileSync(fileName,'utf8')
		const readObj = JSON.parse(readRes)
		//console.log(readObj)
		const createTime = new Date(readObj.createTime).getTime()
		const nowTime = new Date().getTime()
		if((nowTime - createTime) / 1000 / 60 / 60 >= 2){
			await updateAccessToken()
			await getAccessToken()
		}
		return readObj.access_token
	}catch(e){
		await updateAccessToken()
		await getAccessToken()
	}
	
}

//定时刷新  提前五分钟
setInterval(async ()=>{
	await updateAccessToken()
},(7200-300)*1000)


//updateAccessToken()

//console.log(getAccessToken())

module.exports = getAccessToken
