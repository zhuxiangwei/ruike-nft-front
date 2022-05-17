<template>
	<view>
		<view class="container">
			<view class="notice">
				<uni-notice-bar text="为了您的资金安全，需验证您的身份才可以进行其他操作；认证信息一经验证不能修改，请务必如实填写"></uni-notice-bar>
			</view>
			<view class="form">
				<u--form
					labelPosition="left"
					:model="model"
					:rules="rules"
					labelWidth="30%"
					ref="form"
				>
					<u-form-item
						label="国家地区"
						borderBottom
						ref="item1"
					>
						<u--input
							value="中国大陆"
							disabled
							border="none"
						></u--input>
					</u-form-item>
					<u-form-item
						label="真实姓名"
						prop="userInfo.realname"
						borderBottom
						:required="true"
						ref="item1"
					>
						<u--input
							v-model="model.userInfo.realname"
							border="none"
						></u--input>
					</u-form-item>
					<u-form-item
						label="证件号码"
						prop="userInfo.idcardno"
						borderBottom
						:required="true"
						ref="item1"
					>
						<u--input
							v-model="model.userInfo.idcardno"
							border="none"
						></u--input>
					</u-form-item>
				</u--form>
				<button type="primary" @click="submitForm">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					userInfo: {
						realname: '',
						idcardno: '',
					},
				},
				rules: {
					'userInfo.realname': {
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					},
					'userInfo.idcardno': {
						type: 'string',
						required: true,
						message: '请填写身份证号',
						trigger: ['blur', 'change']
					},
				},
			}
		},
		methods: {
			submitForm() {
				var that = this
				that.$refs.form.validate().then(res => {
					that.$ajax.post({
						url: 'user/modify',
						data: JSON.stringify(that.model.userInfo)
					}).then(res => {
						var data = res.data
						if (data.code == 200) {
							uni.showModal({
								title: '提示',
								content: '提交成功，请等待审核',
								complete: function(res) {
									uni.switchTab({
										url: '/pages/user/user'
									});
								}
							});
						} else {
							uni.showToast({
								title: res.message,
								icon: 'error'
							});
						}
					})
				}).catch(errors => {
					uni.showToast({
						title: '请按要求填写相关信息',
						icon: 'error'
					});
					return
				})
			
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background: #fff;
	}
	
	.form {
		padding: 0 6%;
		
		button{
			margin-top: 40rpx;
		}
	}
</style>
