import request from '@/utils/request.js'

const baseURL = 'http://localhost:3000'

export function fetchList(params){
	return request({
		params,
		url: `${baseURL}/playlist/list`,
		method: 'GET'
	})
}

export function fetchId(params){
	return request({
		params,
		url: `${baseURL}/playlist/getById`,
		method: 'GET'
	})
}

export function update(params){
	return request({
		url: `${baseURL}/playlist/updatePlaylist`,
		data: {
			...params
		},
		method: 'POST'
	})
}

export function del(params){
	return request({
		params,
		url: `${baseURL}/playlist/del`,
		method: 'GET'
	})
}