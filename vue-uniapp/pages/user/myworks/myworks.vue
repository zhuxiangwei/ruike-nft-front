<template>
	<view class="content">
		<z-paging ref="paging" v-model="dataList" default-page-no="1" loading-more-no-more-text="我也是有底线的！"
			@query="queryList" :show-loading-more-when-reload="true">
			<!-- 顶部搜索框 -->

			<view class="searchView">
				<uni-easyinput class="searchInput" prefixIcon="search" v-model="requestParams.keyword" @confirm="search"
					@iconClick="search" placeholder="请输入创作者名称查询" />
			</view>
			<!-- 吸顶 -->
			<u-sticky offset-top="18">
				<!-- 顶部选项卡 -->
				<view class="tabs">
					<u-tabs :list="tabBars" lineColor="#f56c6c" :activeStyle="{
						color: '#303133',
						fontSize: '32rpx',
						fontWeight: 'bold',
					}" :inactiveStyle="{
						color: '#606266',
						transform: 'scale(1)'
					}" itemStyle="height: 100rpx;width: 19%;" :scrollable=false @click="tabClick">
					</u-tabs>
				</view>
			</u-sticky>
			<view class="work-items">
				<empty-view slot="empty"></empty-view>
				<view class="work-item" v-for="(item, index) in dataList" :key="index">
					<view class="work-firstline">
						<view class="work-name">{{item.production_name}}</view>
					</view>
					<view class="work-content">
						<view class="work-content-left">
							<image class="work-content-left-image" :src="item.production_images.split(',')[0]">
							</image>
						</view>

						<view class="work-content-right">
							<view class="work-content-right-worknum">作品ID:{{item.production_uuid}}</view>
							<view class="work-content-right-head">
								<view class="work-content-right-head-workid">作品编号:{{item.production_id}}</view>
								<view class="work-content-right-head-price">￥{{item.production_price}}</view>
							</view>
							<view class="work-content-right-bottom">
								<view class="work-content-right-bottom-avata">
									<image :src="item.author_logo"></image>
								</view>
								<view class="work-content-right-bottom-remark">
									<text>{{item.author_name}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="work-bottom">
						<view class="work-bottom-buttons">
							<view class="button-give">
								<!-- <button type="default" size="small" @click="giveGift(item)">赠送</button> -->
								<u-button text="赠送" size="small" @click="giveGift(item)"></u-button>
							</view>
							<view class="button-setavatar">
								<!-- <button type="default" disabled="true">设为头像</button> -->
								<u-button text="设为头像" size="small"></u-button>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view>
				<uni-popup ref="gift" type="bottom" background-color="#fff">
					<view class="gift-top">
						<view class="gift-title">
							<text>赠送</text>
						</view>
					</view>
					<view class="gift-con">
						<uni-forms ref="giftForm" :modelValue="formData">
							<uni-forms-item class="form-label" label="受让人(转增行为不可逆,请谨慎操作!)" labelWidth="300"
								labelPosition="top" required>
								<uni-easyinput type="text" v-model="formData.receiver" value=""
									placeholder="请输入受让人的用户ID" />
							</uni-forms-item>
							<uni-forms-item class="form-label" label="验证码" labelWidth="300" labelPosition="top"
								required>
								<view class="code-label">
									<uni-easyinput type="password" v-model="formData.code" value=""
										placeholder="请输入验证码" />
									<button class="btn-code sms-code-btn" :disabled="smsCodeBtnDisabled"
										@tap.stop="getSmsCode('update', userinfo.name)">
										<text v-if="!smsCodeBtnDisabled">获取验证码</text>
										<text v-else class="sms-code-resend">{{
											`重新发送 (${codeSeconds})`
											}}</text>
									</button>
								</view>
							</uni-forms-item>
						</uni-forms>
					</view>
					<view class="gift-con">
						<view class="gift-tips">
							<text>特别提醒:</text>
						</view>
						<view class="gift-tips">
							<text>1.赠受双方需预先在本平台创建有账号并完成实名认证，才能完成转赠功能；</text>
						</view>
						<view class="gift-tips">
							<text>2.转赠一经确认完成，不可撤销、不可取消，平台不对转赠行为承担其他任何担保责任，也不接受任何要求撤回或取消已经完成转赠的申请；</text>
						</view>
						<view class="gift-tips">
							<text>3.转赠时会产生上链服务费，以页面实际展示费用为准（活动期间暂不收取）。</text>
						</view>
					</view>
					<view class="gift-con">
						<button type="primary" @click="submit('giftForm')">赠送</button>
					</view>
				</uni-popup>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import VueClicaptcha from 'vue-clicaptcha-data';
	export default {
		data() {
			return {
				// tabCurrentIndex: 0, //当前选项卡索引
				// scrollLeft: 0, //顶部选项卡左滑距离
				// enableScroll: true,
				tabBars: [{
					name: '持有的',
					id: '0',
				}, {
					name: '已赠送',
					id: '1'
				}],
				formData: {
					receiver: '',
					code: '',
					pid: ''
				},
				dataList: [],
				requestParams: {
					keyword: "", //按名字搜索的关键字
					type: 0, //类型，0持有，1已赠送
					page: 1
				},
				codeSeconds: 60, // 验证码发送时间间隔
				smsCodeBtnDisabled: false,
				userinfo: {},
				clicaptchaUrl: ''
			}
		},
		computed: {},
		async onLoad() {
			var that = this
			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
					that.userinfo = res.data
				}
			});
			uni.getStorage({
				key: 'clicaptchaUrl',
				success: function(res) {
					that.clicaptchaUrl = res.data
				}
			});
		},
		onReady() {

		},
		methods: {
			//输入框查询
			search() {
				this.queryList(1);
				this.$refs.paging.reload()
			},
			//我的作品列表
			queryList(page, pageSize) {
				let that = this;
				that.requestParams.page = page;
				that.$ajax.post({
					url: "ownership/list",
					data: JSON.stringify(that.requestParams)
				}).then(res => {
					var data = res.data
					if (data.code == 200) {
						that.$refs.paging.complete(data.data);
					} else {
						that.$refs.paging.complete(false);
					}
				});
			},
			//tab切换
			tabClick(item) {
				this.requestParams.type = item.id
				this.queryList(1)
				this.$refs.paging.reload()
			},
			gotoOrderDetail() {
				uni.navigateTo({
					url: '/pages/user/myorders/orderDetail/orderDetail'
				})
			},

			giveGift(argv) {
				// console.log("赠送的礼物为：", argv);
				this.$refs.gift.open();
				this.formData.pid = argv.id;
			},
			submit(ref) {
				let that = this;
				this.$refs[ref].validate((err, value) => {
					console.log(err, value);
				});
				// 部分表单进行校验，接受一个参数，类型为 String 或 Array ，只校验传入 name 表单域的值
				this.$refs.giftForm.validateField(['id', 'pwd']).then((res) => {
					// 成功返回，res 为对应表单数据
					// 其他逻辑处理 
					// ...
					if (that.formData.receiver == null || that.formData.receiver == '') {
						uni.showToast({
							title: '请输入用户ID',
							icon: 'error'
						});
						return;
					}
					if (that.formData.pid == null || that.formData.pid == '') {
						uni.showToast({
							title: '系统错误，请刷新重试',
							icon: 'error'
						});
						return;
					}
					if (that.formData.code == null || that.formData.code == '') {
						uni.showToast({
							title: '请输入验证码',
							icon: 'error'
						});
						return;
					}
					that.$ajax.post({
						url: "production/present",
						data: JSON.stringify(that.formData)
					}).then(res => {
						var data = res.data
						if (data.code == 200) {
							uni.showToast({
								title: "赠送成功",
								icon: 'error',
								duration: 3000
							});
							that.loadNewsList("refresh");
						} else {
							uni.showToast({
								title: "系统异常，请刷新重试",
								icon: 'error',
								duration: 3000
							});
							return;
						}
					});
					console.log("成功：", res);
				}).catch((err) => {
					// 表单校验验失败，err 为具体错误信息
					// 其他逻辑处理
					// ...
					console.log("err:", err);
				})
			},
			// 发送验证码并进入倒计时
			async getSmsCode(usage = 'update') {
				if (this.formData.receiver == null || this.formData.receiver == '') {
					uni.showToast({
						title: '请输入用户ID',
						icon: 'error'
					});
					return;
				}
				if (this.formData.pid == null || this.formData.pid == '') {
					uni.showToast({
						title: '系统错误，请刷新重试',
						icon: 'error'
					});
					return;
				}
				if (this.userinfo.name == null || this.userinfo.name == '') {
					uni.showToast({
						title: '系统错误，请刷新重试',
						icon: 'error'
					});
					return;
				}
				var url = this.clicaptchaUrl + "clicaptcha-server/clicaptcha.php"
				VueClicaptcha({
					src: url, // 后端地址
					param: {
						token: this.userinfo.name
					},
					success: '验证成功！', // 成功提示，默认为“验证成功！”
					error: '未点中正确区域，请重试！', // 错误提示，默认为“未点中正确区域，请重试！”
					callback: (res) => {
						// 校验成功后执行后续业务
						if (res.data == 0) {
							this.smsCodeBtnDisabled = true
							var t = setInterval(() => {
								this.codeSeconds--
								if (this.codeSeconds == 0) {
									setInterval(t)
									this.smsCodeBtnDisabled = false
									this.codeSeconds = 60
								}
							}, 1000)
						} else if (res.data == 1) {
							uni.showToast({
								title: '手机号不正确',
								icon: 'error'
							});
						} else {
							uni.showToast({
								title: '异常错误，请刷新重试',
								icon: 'error'
							});
						}
					}
				});

			},
		}
	}
</script>

<style lang='scss'>
	@import url('/static/css/common.css');

	.tabs {
		background: #fff;
	}

	.work-items {
		margin-top: 140rpx;
	}

	.work-item {
		width: calc(100% - 40rpx);
		/* width: 100%; */
		background-color: #fff;
		border-radius: 20rpx;
		padding: 20rpx;
		margin: auto;
		margin-top: 20rpx;
		box-sizing: border-box;
		font-weight: 500;

		/* 第一行标题的设计 */
		.work-firstline {
			width: 100%;
			height: 50rpx;
			font-size: 32rpx;
			font-weight: 700;

			/* 作品名称 */
			.work-name {
				width: 100%;
			}
		}

		/* 中间部分的内容布局 */
		.work-content {
			width: 100%;
			height: 200rpx;
			border-bottom: 1px solid #eee;
		}

	}

	/* 中间部分左边头像布局 */
	.work-content-left {
		float: left;
		width: 30%;

		/* margin-right: 1rem; */
		/* 头像图片 */
		.work-content-left-image {
			overflow: hidden;
			border-radius: 10%;
			width: 180rpx;
			height: 180rpx;
		}
	}

	/* 中间部分右边文字内容布局 */
	.work-content-right {
		float: left;
		width: 70%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-content: space-between;

		&::after {
			content: "";
			display: inline-block;
			clear: both;
		}

		.work-content-right-head {
			width: 100%;

			.work-content-right-head-workid {
				float: left;
			}

			.work-content-right-head-price {
				float: right;
				color: #ff1034;
				font-weight: 600;
			}

			&::after {
				content: "";
				display: inline-block;
				clear: both;
			}
		}

		.work-content-right-worknum {
			/* float: left; */
			width: 100%;

			overflow: hidden;
			text-overflow: ellipsis;
			word-break: keep-all;
		}

		.work-content-right-bottom {
			/* float: left; */
			width: 100%;

			.work-content-right-bottom-avata {
				float: left;
				height: 45rpx;
				width: 45rpx;

				image {
					height: 100%;
					width: 100%;
					border-radius: 50%;
				}
			}

			.work-content-right-bottom-remark {
				float: left;
				margin-left: 10rpx;
				font-size: 28rpx;
			}

			&::after {
				content: "";
				display: inline-block;
				clear: both;
			}
		}
	}

	/* work-item底部布局 */
	.work-bottom {
		width: 100%;
		height: 80rpx;
		margin-top: 10rpx;
		padding: 5rpx;

		/* button组合 */
		.work-bottom-buttons {
			margin-left: 20%;
			display: flex;
		}
	}

	/* 对button的统一设置 */
	.button-give,
	.button-setavatar {
		flex: 1;
		font-size: 28rpx;
		font-weight: 500;

		button {
			font-size: 32rpx;
		}
	}

	.button-give {
		button {
			width: 160rpx;
			background-color: #fff;
		}
	}

	.gift-top {
		width: 100%;
		box-sizing: border-box;
		font-size: 36rpx;
		font-weight: 800;
		text-align: center;
		padding: 30rpx 0 10rpx;
	}

	.gift-con {
		width: 100%;
		padding: 0 40rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		line-height: 32rpx;

		.form-label {
			width: 100%;
			font-size: 28rpx;
		}

		.gift-tips {
			color: #888888;
		}

		button {
			margin: 20rpx 0 40rpx;
		}
	}

	.code-label {
		position: relative;
		box-sizing: border-box;

		button {
			margin: 0;
		}

		.btn-code {
			height: 32px;
			line-height: 32px;
			display: inline-block;
			padding: 0rpx 16rpx;
			border: 1px solid #09BB07;
			background-color: #007AFF;
			color: #fff;
			border-bottom-left-radius: 10rpx;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 6rpx;
			border-bottom-right-radius: 6rpx;
			position: absolute;
			bottom: calc(50% - 16px);
			right: 8rpx;
		}
	}
</style>
