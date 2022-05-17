<template>
	<view class="content">
		<view class="detail-top">
			<view class="author-wrap">
				<view class="author-name" @click="goUserDetail()">
					<text>{{orderData.author_name}}</text>
					<uni-icons custom-prefix="custom-icon" type="forward" size="16"></uni-icons>
				</view>
				<view class="order-status">
					<text v-if="orderData.order_status == 0">待支付</text>
					<text v-if="orderData.order_status == 1">已完成</text>
					<text v-if="orderData.order_status == 2">失败</text>
				</view>
			</view>
			<view class="author-opus">
				<view class="item-img">
					<image :src="orderData.order_image" mode=""></image>
				</view>
				<view class="item-con">
					<view class="item-name">
						<text>{{orderData.production_name}}</text>
					</view>
					<view class="item-price">
						<text>￥{{orderData.production_price}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="detail-content">
			<view class="order-row">
				<view class="row-title">
					<text>作品ID:</text>
				</view>
				<view class="row-val">
					<text>{{orderData.production_uuid}}</text>
				</view>
			</view>
			<view class="order-row">
				<view class="row-title">
					<text>作品编号:</text>
				</view>
				<view class="row-val">
					<text>#{{orderData.production_index}}/{{orderData.catalog_total}}</text>
				</view>
			</view>
			<view class="order-row">
				<view class="row-title">
					<text>订单编号:</text>
				</view>
				<view class="row-val">
					<text>{{orderData.order_uuid}}</text>
				</view>
			</view>
			<view class="order-row">
				<view class="row-title">
					<text>下单时间:</text>
				</view>
				<view class="row-val">
					<text>{{orderData.order_time}}</text>
				</view>
			</view>
			<view class="order-row">
				<view class="row-title">
					<text>交易地址:</text>
				</view>
				<view class="row-val">
					<text>{{orderData.order_hash}}</text>
				</view>
			</view>
			<view class="order-row" v-show="false">
				<view class="row-title">
					<text>支付方式:</text>
				</view>
				<view class="row-val">
					<text>微信</text>
				</view>
			</view>
		</view>
		<view class="detail-bottom">
			<view class="pay-text">
				<text>商品总额:</text>
			</view>
			<view class="pay-money">
				<view class="order-money">
					<text>￥{{orderData.production_price}}</text>
				</view>
				<view class="pay-total">
					实付款: 
					<text v-if="orderData.order_status == 1">￥{{orderData.production_price}}</text>
					<text v-else>￥0</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import mixAdvert from '@/components/mix-advert/vue/mix-advert';
	import json from '@/json'
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	let windowWidth = 0,
		scrollTimer = false,
		tabBar;
	export default {
		components: {
			mixPulldownRefresh,
			mixLoadMore,
			mixAdvert
		},
		data() {
			return {
				orderData:{},
				requestParams: {
					oid: 0,
				}
			}
		},
		computed: {},
		async onLoad(options) {
			// 获取屏幕宽度
			windowWidth = uni.getSystemInfoSync().windowWidth;
			let data = JSON.parse(options.data);

			this.queryOrder(data)
			
		},
		onReady() {
			uni.getSystemInfo({
				success: function(res) {
					console.log(res.model);
					console.log(res.pixelRatio);
				}
			});
		},
		methods: {
			/**
			 * 数据处理方法在vue和nvue中通用，可以直接用mixin混合
			 * 这里直接写的
			 * mixin使用方法看index.nuve
			 */
			queryOrder(item) {
				let that = this;
				that.requestParams.oid = item.order_id;
				that.$ajax.post({
					url: "order/fetch",
					data: JSON.stringify(that.requestParams)
				}).then(res => {
					var data = res.data
					if (data.code == 200) {
						that.orderData = data.data[0];
						that.orderData.order_image = that.orderData.production_images.split(",")[0];
						that.orderData.order_status = item.order_status;
					} else {
						uni.showToast({
							title: "系统异常，请刷新重试",
							icon: 'error',
							duration: 3000
						});
					}
				});
			},
			goUserDetail()
			{
				let _this = this;
				uni.navigateTo({
					url: `/pages/user/user_detail/user_detail?id=${_this.orderData.production_aid}`
				})
			},
			//获得元素的size
			getElSize(id) {
				return new Promise((res, rej) => {
					let el = uni.createSelectorQuery().select('#' + id);
					el.fields({
						size: true,
						scrollOffset: true,
						rect: true
					}, (data) => {
						res(data);
					}).exec();
				});
			},
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

	.detail-top,
	.detail-content,
	.detail-bottom{
		margin: 20rpx 0;
		background-color: #fff;
		padding: 20rpx;
		box-sizing: border-box;
	}
	.detail-top{
		.author-wrap{
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			.author-name{
				font-size: 32rpx;
				font-weight: 700;
			}
		}
		.author-opus{
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			margin: 10rpx 0;
			.item-img{
				width: 180rpx;
				height: 180rpx;
				overflow: hidden;
				border-top-left-radius: 20rpx;
				border-top-right-radius: 20rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.item-con{
				width: calc(100% - 160rpx);
				padding-left: 16rpx;
				height: 160rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				font-size: 34rpx;
				.item-price{
					font-weight: 700;
				}
			}
		}
	}
	.detail-content{
		.order-row{
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			font-size: 30rpx;
			margin: 16rpx 0;
			border-top-right-radius: 20rpx;
			border-top-left-radius: 20rpx;
			.row-title{
				margin-right: 10rpx;
				color: #A5A4A4;
				white-space: nowrap;
			}
			.row-val{
				word-break: break-all;
			}
		}
	}
	.detail-bottom{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		font-size: 30rpx;
		.pay-text{
			color: #A5A4A4;
		}
		.pay-money{
			text-align: right;
			.pay-total{
				margin-top: 16rpx;
				color: #A5A4A4;
				text{
					color: #000;
					margin-left: 10rpx;
				}
			}
		}
	}

</style>
