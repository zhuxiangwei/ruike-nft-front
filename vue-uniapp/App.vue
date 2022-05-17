<script>
	export default {
		onLaunch: function() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
			
			var clicaptchaUrl = "";
			if(process.env.NODE_ENV == "development"){
				clicaptchaUrl = "/base/"
			}else{
				clicaptchaUrl = "/"
			}
			uni.setStorage({
			    key: 'clicaptchaUrl',
			    data: clicaptchaUrl,
			    success: function () {
			        console.log('clicaptchaUrl success');
			    }
			});
			uni.setStorage({
			    key: 'baseUrl',
			    data: "http://116.205.243.252:12345/",
			    success: function () {
			        console.log('baseUrl success');
			    }
			});
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style lang="scss">
	/* uview全局样式，一定要放第一行 */
	@import "@/uni_modules/uview-ui/index.scss";
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css'; 
	@import url('./static/css/iconfont');
	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>


