<template>
	<view class="login">
		<!--顶部返回按钮--> 
		<text class="back-btn iconfont iconzuo" @tap="navBack"></text>
		<view class="login-top bg-active">
			<view class="desc">
				<view class="title">Hi~</view> 
				<text>{{ appName }}欢迎您</text>
			</view>
			<image class="login-pic" src="/static/image/login-pic.png"></image>
		</view>
		<view class="login-type-content">
			<image class="login-bg" src="/static/image/login-bg.png"></image>
			<view class="main">
				<view class="nav-bar">
					<view class="nav-bar-item" v-for="(item, index) in typeList" :key="index"
						:class="tabCurrentIndex === index ? 'nav-bar-item-active text-active' : ''"
						@tap="tabClick(index)">
						{{ item.text }}
					</view>
				</view>
				<block v-if="tabCurrentIndex === 0">
					<view class="login-type-form">
						<view class="input-item">
							<text class="iconfont iconzhanghuffffffpx"></text>
							<input class="login-type-input" type="number" name="user" v-model="updateParams.user"
								placeholder="请输入手机号码" maxlength="11" />
						</view>
						<view class="input-item" >
							<text class="iconfont iconmimaffffffpx"></text>
							<input class="login-type-input" type="password" v-model="updateParams.pwd"
								placeholder="请输入密码" maxlength="20" />
						</view>
						<view class="input-item input-item-sms-code" >
							<text class="iconfont iconyanzhengma"></text>
							<view class="input-wrapper">
								<view class="rf-input-wrapper">
									<input type="number" class="login-type-input" v-model="updateParams.code"
										placeholder="请输入验证码"  />
								</view>
								<button class="sms-code-btn" :disabled="smsCodeBtnDisabled"
									@tap.stop="getSmsCode('update', updateParams.user)">
									<text v-if="!smsCodeBtnDisabled">获取验证码</text>
									<text v-else class="sms-code-resend">{{
										`重新发送 (${codeSeconds})`
										}}</text>
								</button>
							</view>
						</view>
					</view>
					<view class="login-type-tips">
						<text @tap="navTo('../login')">登录</text>
					</view>
					<button class="confirm-btn bg-active" :disabled="btnLoading" :loading="btnLoading" @tap="toUpdate">
						修改
					</button>
				</block>
			</view>
		</view>
		<view class="login-type-bottom text-active">
			{{ appName }} 版权所有
		</view>
	</view>
</template>
<script>
	import VueClicaptcha from 'vue-clicaptcha-data'
	export default {
		data() {
			return {
				updateParams: {
					user: '',
					code: '',
					pwd: ''
				},
				clicaptchaUrl: '',
				btnLoading: false,
				reqBody: {},
				codeSeconds: 60, // 验证码发送时间间隔
				smsCodeBtnDisabled: false,
				userInfo: null,
				appName: 'RuiKe',
				tabCurrentIndex: 0,
				typeList: [{
						text: '修改密码'
					}
				]
			};
		},
		onLoad(options) {
			//this.tabCurrentIndex = parseInt(options.type || 0, 10);
			var that = this
			uni.getStorage({
			    key: 'clicaptchaUrl',
			    success: function (res) {
					that.clicaptchaUrl = res.data
			    }
			});
		},
		methods: {
			// 发送验证码并进入倒计时
			async getSmsCode(usage = 'update') {
				if(this.updateParams.user == null || this.updateParams.user == '' ){
					uni.showToast({
						title: '请输入手机号',
						icon: 'error'
					});
					return ;
				}
				var url =  this.clicaptchaUrl+"clicaptcha-server/clicaptcha.php"
				VueClicaptcha({ 
				    src: url,  // 后端地址
					param: {token: this.updateParams.user},
				    success: '验证成功！',  // 成功提示，默认为“验证成功！”
				    error: '未点中正确区域，请重试！',  // 错误提示，默认为“未点中正确区域，请重试！”
				    callback: (res) => {
				        // 校验成功后执行后续业务
						if(res.data == 0){
							this.smsCodeBtnDisabled = true
							var t = setInterval(() => {
								this.codeSeconds --
								if(this.codeSeconds == 0){
									setInterval(t)
									this.smsCodeBtnDisabled = false
									this.codeSeconds  = 60
								}
							}, 1000)
						}else if(res.data == 1){
							uni.showToast({
								title: '手机号不正确',
								icon: 'error'
							});
						}else{
							uni.showToast({
								title: '异常错误，请刷新重试',
								icon: 'error'
							});
						}
				    }
				});
				
			},
			// 返回上一页
			navBack() {
				uni.navigateBack();
			},
			// 统一跳转路由
			navTo(url) {
				uni.navigateTo({
					url
				});
			},
			// 提交表单
			async toUpdate() {
				if(this.updateParams.user == null || this.updateParams.user == '' ){
					uni.showToast({
						title: '请输入手机号',
						icon: 'error'
					});
					return ;
				}
				if(this.updateParams.pwd == null || this.updateParams.pwd == '' ){
					uni.showToast({
						title: '请输入新密码',
						icon: 'error'
					});
					return ;
				}
				if(this.updateParams.code == null || this.updateParams.code == '' ){
					uni.showToast({
						title: '请输入验证码',
						icon: 'error'
					});
					return ;
				}
				
				this.$ajax.post({
					url: 'user/password',
					data: JSON.stringify(this.updateParams)
				}).then(res => {
					var data = res.data
					if(data.code == 200){
						uni.showModal({
						    title: '提示',
						    content: '修改成功',
							showCancel: false,
						    success: function (res) {
						        if (res.confirm) {
						            uni.navigateTo({
						                url: '../login'
						            });
						        } else if (res.cancel) {
						            console.log('用户点击取消');
						        }
						    }
						});
					} else{
						uni.showToast({
							title: "系统异常，请刷新重试",
							icon: 'error',
							duration: 3000
						});
					}
				})
			},
			// 切换登录/注册
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
		}
	};
</script>
<style lang="scss">
	page {
		background: #fff;
	}

	.login {
		width: 100%;
		position: relative;

		.bg-active {
			background-color: $base-color;
			color: #fff;
		}

		.text-active,
		.iconfont {
			color: $base-color;
		}

		.back-btn {
			position: absolute;
			left: 40rpx;
			z-index: 9999;
			padding-top: var(--status-bar-height);
			top: 40rpx;
			font-size: 48rpx;
			color: #fff;
		}

		.login-top {
			height: 460rpx;
			position: relative;

			.desc {
				color: #fff;
				position: absolute;
				top: 200rpx;
				left: 40rpx;
				font-size: 48rpx;

				.title {
					font-size: 48rpx;
				}
			}

			.login-pic {
				position: absolute;
				width: 220rpx;
				height: 270rpx;
				right: 30rpx;
				top: 100rpx;
			}
		}

		.login-type-content {
			position: relative;
			top: -72rpx;

			.login-bg {
				width: 94vw;
				height: 110vw;
				margin: 0 3vw;
			}

			.main {
				width: 94vw;
				position: absolute;
				top: 0;
				left: 3vw;

				.nav-bar {
					display: flex;
					height: 100rpx;
					justify-content: center;
					align-items: center;
					position: relative;
					z-index: 10;

					.nav-bar-item {
						flex: 1;
						display: flex;
						height: 100%;
						line-height: 96rpx;
						font-size: 32rpx;
						display: flex;
						margin: 0 120rpx;
						justify-content: center;
					}

					.nav-bar-item-active {
						border-bottom: 5rpx solid;
					}
				}

				.login-type-form {
					width: 80%;
					margin: 50rpx auto;

					.input-item {
						position: relative;
						height: 90rpx;
						line-height: 90rpx;
						margin-bottom: 30rpx;

						.iconfont {
							font-size: 50rpx;
							position: absolute;
							left: 0;
						}

						.login-type-input {
							height: 90rpx;
							padding-left: 80rpx;
							border-bottom: 1rpx solid rgba(0, 0, 0, .1);
						}

						.sms-code-btn,
						sms-code-resend {
							width: 240rpx;
							font-size: 26rpx;
						}
					}
				}

				.login-type-tips {
					padding: 0 50rpx;
					display: flex;
					justify-content: flex-end;
					font-size: 28upx;
					color: #666;
				}

				.confirm-btn {
					margin-top: 60upx;
					width: 80%;
					height: 80rpx;
					line-height: 80rpx;
				}
			}
		}

		.login-type-bottom {
			width: 100%;
			padding-bottom: 30rpx;
			text-align: center;
			font-size: 32rpx;
		}

		// 发送验证码样式
		.input-item-sms-code {
			.input-wrapper {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.sms-code-btn {
				width: 200upx;
				background-color: #fff;
				display: flex;
				padding: 15upx 0;
				justify-content: center;
				align-items: center;
				border-radius: 12upx;
			}

			.sms-code-resend {
				color: #666;
			}
		}
	}
</style>
