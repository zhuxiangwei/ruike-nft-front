<template>
	<view class="content">
		<view class="wrap-con">
			<view class="item-con" @click="gotoPersonalDetail()">
				<view class="left-con">
					<text>个人信息</text>
				</view>
				<view class="right-con">
					<uni-icons custom-prefix="custom-icon" type="forward" size="18"></uni-icons>
				</view>
			</view>
			<!-- <view class="item-con">
				<view class="left-con">
					<text>隐私设置</text>
				</view>
				<view class="right-con">
					<uni-icons custom-prefix="custom-icon" type="forward" size="18"></uni-icons>
				</view>
			</view> -->
			<view class="item-con" @click="loginOut()">
				<view class="left-con">
					<text>退出登录</text>
				</view>
				<view class="right-con">
					<uni-icons custom-prefix="custom-icon" type="forward" size="18"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onReady() {
			
		},
		methods: {
			// 跳转个人信息页面
			gotoPersonalDetail(){
				uni.navigateTo({
					url: 'personalDetail/personalDetail'
				})
			},
			// 退出登录
			loginOut(){
				var that = this
				uni.showModal({
				    title: '提示',
				    content: '是否确定退出？',
				    success: function (res) {
				        if (res.confirm) {
							that.$ajax.post({
								url: 'user/logout',
							}).then(res => {
								var data = res.data
								if(data.code == 200){
									uni.removeStorage({
									    key: 'userInfo',
									    success: function (res) {
									        console.log('退出success');
											uni.reLaunch({
											    url: '/pages/login/login'
											});
									    }
									});
								}
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
				
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		background-color: rgb(242, 242, 242);
		height: 100%;
		overflow: hidden;
		margin: 0%;
	}
	
	.wrap-con{
		width: 100%;
		background-color: #fff;
	}
	
	.item-con{
		width: calc(100% - 40rpx);
		background-color: #fff;
		padding: 26rpx;
		box-sizing: border-box;
		font-size: 30rpx;
		font-weight: 700;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 0 20rpx;
		border-bottom: 1px solid #F2F6FC;
		.right-con{
			color: #F2F3F5;
		}
	}


</style>
