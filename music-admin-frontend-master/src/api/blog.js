import request from '@/utils/request.js'

const baseURL = 'http://localhost:3000'

export function fetchList(params){
	return request({
		url: `${baseURL}/blog/list`,
		method: 'GET',
		params: {
			...params
		}
	})
}

export function del(params){
	return request({
		url: `${baseURL}/blog/del`,
		method: 'POST',
		data: {
			...params
		}
	})
}