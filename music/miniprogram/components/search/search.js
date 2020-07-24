
const keyword = ''

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		placeholder: {
			type: String,
			value: '请输入关键字'
		}
	},
	externalClasses: [ //接受外部传入的class
		'iconfont',
		'icon-sousuo'
	],

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onInput(event){
			// keyword = event.detail.value
			//console.log(event)
			this.keyword = event.detail.value
		},
		onSearch(){
			//console.log(1)
			//console.log(this.keyword)
			//console.log(keyword)
			this.triggerEvent('search',{
				keyword: this.keyword
			})
		}
	}
})
