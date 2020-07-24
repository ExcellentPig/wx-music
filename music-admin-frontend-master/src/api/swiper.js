import request from '@/utils/request.js'

const baseURL = 'http://localhost:3000'

export function fetchList(){
	return request({
		url: `${baseURL}/swiper/list`,
		method: 'GET'
	})
}

export function del(params){
	return request({
		params,
		url: `${baseURL}/swiper/del`,
		method: 'GET'
	})
}