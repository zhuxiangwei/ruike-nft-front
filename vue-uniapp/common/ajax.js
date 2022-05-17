// 引入 uni-ajax 模块
import ajax from '@/uni_modules/u-ajax/js_sdk'

// 创建请求实例
const instance = ajax.create({
	// 初始配置
	// #ifdef H5
	baseURL: '/api/',
	// #endif
	// #ifdef APP-PLUS || MP
	baseURL: 'http://116.205.243.252:12345/',
	// #endif
})

// 添加请求拦截器
instance.interceptors.request.use(
	config => {
		// 在发送请求前做些什么
		/* try {
			const res = uni.getStorageSync('userInfo');
			if (res) {
				if (config.data) {
					var jsonData = JSON.parse(config.data)
					jsonData.uuid = res.uuid
					jsonData.token = res.token
					config.data = JSON.stringify(jsonData)
				} else {
					var data = {
						token: res.data.token,
						uuid: res.data.uuid
					}
					config.data = data
				}
			}
			
		} catch (e) {
			console.log(e)
		} */
		
		uni.getStorage({
			key: 'userInfo',
			success: function(res) {
				if (config.data) {
					var jsonData = JSON.parse(config.data)
					jsonData.uuid = res.data.uuid
					jsonData.token = res.data.token
					console.log(jsonData)
					console.log(JSON.stringify(jsonData))
					config.data = JSON.stringify(jsonData)
				} else {
					var data = {
						token: res.data.token,
						uuid: res.data.uuid
					}
					config.data = data
				}
			},
			fail: function() {
				uni.reLaunch({
					url: '/pages/login/login'
				});
			}
		});
		return config
		
		
	},
	error => {
		// 对请求错误做些什么
		return Promise.reject(error)
	}
)

// 添加响应拦截器
instance.interceptors.response.use(
	response => {
		// 对响应数据做些什么
		if (response.data.code == 404 || response.data.code == 405) {
			uni.reLaunch({
				url: '/pages/login/login'
			});
		}
		return response
	},
	error => {
		// 对响应错误做些什么
		return Promise.reject(error)
	}
)
// 导出 create 创建后的实例
export default instance
