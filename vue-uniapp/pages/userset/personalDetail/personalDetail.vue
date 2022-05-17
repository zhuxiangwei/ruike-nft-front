<template>
	<view class="content">
		<view class="wrap-con">
			<view class="item-con">
				<view class="left-con">
					<text>头像</text>
				</view>
				<view class="right-con">
					<view class="user-img">
						<image :src="userinfo.avatar" mode=""></image>
					</view>
				</view>
			</view>
			<view class="item-con">
				<view class="left-con">
					<text>昵称</text>
				</view>
				<view class="right-con">
					<text>{{userinfo.nick}}</text>
				</view>
			</view>
			<view class="item-con">
				<view class="left-con">
					<text>手机号</text>
				</view>
				<view class="right-con">
					<text>{{userinfo.name}}</text>
				</view>
			</view>
			<view class="item-con">
				<view class="left-con">
					<text>实名认证</text>
				</view>
				<view class="right-con" v-if="userinfo.certified === 0">
					<text @click="doAuthenticate()">去认证</text>
					<uni-icons custom-prefix="custom-icon" type="forward" size="18"></uni-icons>
				</view>
				<view class="right-con" v-else>
					<text>已认证</text>
				</view>
			</view>
			<view class="item-con">
				<view class="left-con">
					<text>用户ID</text>
				</view>
				<view class="right-con">
					<text>{{userinfo.uuid}}</text>
				</view>
			</view>
			<view class="item-con">
				<view class="left-con">
					<text>身份地址</text>
				</view>
				<view class="right-con">
					<text>{{userinfo.bcid}}</text>
				</view>
			</view>
			<view class="item-con">
				<view class="left-con">
					<text>简介</text>
				</view>
				<view class="right-con">
					<text>{{userinfo.description}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userinfo: {
					
				}
			}
		},
		computed: {},
		onLoad() {
			var that = this
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					that.userinfo = res.data
			    }
			});
		},
		onReady() {
			
		},
		methods: {
			doAuthenticate(){
				uni.navigateTo({
					url: '/pages/userset/authenticate/authenticate'
				})
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
	}

	.content {
		margin: 0%;
	}

	.searchView {
		padding: 0;
		margin: auto;
		padding: 20rpx 24rpx;
		width: 90vw;
	}

	.searchInput {
		line-height: 80rpx;
		background-color: #EEEEEE;
	}

	/* 顶部tabbar */
	.nav-bar {
		position: relative;
		z-index: 10;
		height: 90upx;
		font-weight: 500;
		white-space: nowrap;
		box-shadow: 0 2upx 8upx rgba(0, 0, 0, .06);
		background-color: #fff;

		.nav-item {
			display: inline-block;
			/* width: 150upx; */
			width: 33%;
			height: 90upx;
			text-align: center;
			line-height: 90upx;
			font-size: 30upx;
			color: #646566;
			position: relative;

			&:after {
				content: '';
				width: 0;
				height: 0;
				border-bottom: 7upx solid #1277f1;
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				transition: .3s;
			}
		}

		.current {
			color: #1277f1;

			&:after {
				width: 50%;
			}
		}
	}

	.swiper-box {
		height: 100%;
	}

	.panel-scroll-box {
		height: 100%;
		background-color: #F2F6FC;

		.panel-item {
			background: #fff;
			padding: 30px 0;
			border-bottom: 2px solid #000;
		}
	}
	
	.wrap-con{
		width: 100%;
		background-color: #fff;
	}
	
	.item-con{
		width: calc(100% - 40rpx);
		height: 140rpx;
		background-color: #fff;
		padding: 20rpx;
		box-sizing: border-box;
		font-size: 30rpx;
		font-weight: 700;
		display: flex;
		flex-direction: row;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin: 0 20rpx;
		border-bottom: 1px solid #F2F6FC;
		.right-con{
			max-width: 60%;
			font-weight: 500;
			font-size: 30rpx;
			padding-right: 16rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			.user-img{
				width: 100rpx;
				height: 100rpx;
				overflow: hidden;
				border-radius: 100%;
				margin-right: -16rpx;
				background-image: url(../../../static/image/icon-user-big.png);
				background-size: 100% 100%;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}


</style>
