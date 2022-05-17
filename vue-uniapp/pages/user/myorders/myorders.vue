<template>
	<view class="content">
		<z-paging ref="paging" v-model="dataList" default-page-no="1" loading-more-no-more-text="我也是有底线的！"
			@query="queryList" :show-loading-more-when-reload="true">

			<view class="searchView">
				<uni-easyinput class="searchInput" prefixIcon="search" v-model="requestParams.keyword"  @confirm="search" @iconClick="search"
					placeholder="请输入创作者名称查询" />
			</view>
			
			<!-- 顶部选项卡 -->
			<view class="tabs"  >
				<u-tabs
					:list="tabBars"
					lineColor="#f56c6c"
					:activeStyle="{
						color: '#303133',
						fontSize: '32rpx',
						fontWeight: 'bold',
					}"
					:inactiveStyle="{
						color: '#606266',
						transform: 'scale(1)'
					}"
					itemStyle="height: 100rpx;width: 19%;"
					:scrollable=false
					@click="tabClick"
				>
				</u-tabs>
			</view>
			
			<view class="work-items">
				<empty-view slot="empty"></empty-view>
				<view class="work-item" v-for="(item, index) in dataList" :key="index">
					<view @click="gotoOrderDetail(item)">
						<view class="work-firstline">
							<view class="work-name">
								<text>{{item.order_uuid}}</text>
								<uni-icons class="order-icon" custom-prefix="custom-icon" type="forward" size="16"></uni-icons>
							</view>
							<view class="work-status">
								<text v-if="item.order_status == 0">待支付</text>
								<text v-if="item.order_status == 1">已完成</text>
								<text v-if="item.order_status == 2">失败</text>
							</view>
						</view>
						<view class="work-content">
							<view class="work-content-left">
								<image class="work-content-left-image" :src="item.production_images.split(',')[0]">
								</image>
							</view>
				
							<view class="work-content-right">
								<view class="work-content-right-workname">{{item.production_name}}</view>
								<view class="work-content-right-head">
									<view class="work-content-right-head-workid">作品ID: {{item.production_uuid}}</view>
									<view class="work-content-right-head-price">￥{{item.production_price}}</view>
								</view>
								<view class="work-content-right-worknum">作品编号: #{{item.production_index}}/{{item.catalog_total}}</view>
							</view>
						</view>
					</view>
					<view class="work-bottom">
						<view class="work-bottom-buttons">
							<view class="button-setavatar">
								<button size="mini" type="default" v-if="item.order_status == 0">支付</button>
								<button size="mini" type="default">客服</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabBars: [{
					name: '购买',
					id: '0',
				}, {
					name: '赠送',
					id: '1'
				}, {
					name: '空投',
					id: '2',
				}, {
					name: '奖励',
					id: '3'
				}],
				dataList: [],
				requestParams: {
					keyword: "", //按名字搜索的关键字
					type: 0, //类型，0购买，1赠送，2空投，3奖励
					page: 1 //分页页码，数字类型
				}
			}
		},
		onLoad() {
			
		},
		onReady() {
			
		},
		methods: {
			//输入框查询
			search() {
				this.$refs.paging.reload()
			},
			//我的作品列表
			queryList(page, pageSize) {
				let that = this;
				that.requestParams.page = page;
				that.$ajax.post({
					url: "order/list",
					data: JSON.stringify(that.requestParams)
				}).then(res => {
					console.log("我的订单：", res);
					var data = res.data
					if (data.code == 200) {
						that.$refs.paging.complete(data.data);
					} else {
						that.$refs.paging.complete(false);
					}
				});
			},
			//tab切换
			tabClick(item){
				this.requestParams.type = item.id
				this.$refs.paging.reload()
			},
			gotoOrderDetail(item) {
				uni.navigateTo({
					url: `/pages/user/myorders/orderDetail/orderDetail?data=${JSON.stringify(item)}`
				})
			},
		}
	}
</script>

<style lang='scss'>
	@import url('/static/css/common.css');

	.tabs{
		background: #fff;
		margin-top: 126rpx;
	}
	
	.work-item {
		width: calc(100% - 20rpx);
		/* width: 100%; */
		background-color: #fff;
		border-radius: 20rpx;
		padding: 20rpx;
		margin: 10rpx;
		box-sizing: border-box;
		font-weight: 500;

		/* 第一行标题的设计 */
		.work-firstline {
			width: 100%;
			height: 55rpx;
			font-size: 30rpx;
			font-weight: 700;
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			/* 作品名称 */
			.work-name {
				width: calc(100% - 120rpx);
				max-width: 580rpx;
				padding-right: 20rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				position: relative;
				&::after
				{
					content: "";
					display: block;
					clear: both;
				}
				.order-icon{
					position: absolute;
					top: 0;
					right: 0;
				}
			}

			.work-status {
				width: 140rpx;
				font-size: 24rpx;
				font-weight: 500;
				text-align: right;
			}
		}

		/* 中间部分的内容布局 */
		.work-content {
			width: 100%;
			/* border-bottom: 1px solid #eee; */
		}

		.work-content::after {
			content: '';
			display: block;
			clear: both;
		}

	}

	/* 中间部分左边头像布局 */
	.work-content-left {
		float: left;
		/* width: 30%; */

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
		float: right;
		width: calc(100% - 200rpx);
		height: 180rpx;
		display: flex;
		flex-direction: column;
		word-break: keep-all;
		justify-content: space-between;
		.work-content-right-workname {
			font-size: 30rpx;
		}

		.work-content-right-head {
			width: 100%;
			font-size: 26rpx;
			line-height: 30rpx;
			
			position: relative;
			.work-content-right-head-workid {
				float: left;
				width: calc(100% - 100rpx);
				word-break: keep-all;
				text-overflow: ellipsis;
				overflow: hidden;
				
			}

			.work-content-right-head-price {
				float: right;
				font-size: 28rpx;
				color: #f40;
				font-weight: 700;
				position: absolute;
				top: 0;
				right: 0;
			}
		}

		.work-content-right-worknum {
			float: left;
			width: 100%;
			font-size: 26rpx;
		}

		.work-content-right-bottom {
			float: left;
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
		}
	}

	.work-content-right::after {
		content: '';
		display: block;
		clear: both;
	}

	/* work-item底部布局 */
	.work-bottom {
		width: 100%;
		height: 80rpx;
		padding: 5rpx;

		/* button组合 */
		.work-bottom-buttons {
			margin-left: 20%;
		}
	}

	/* 对button的统一设置 */
	.button-give,
	.button-setavatar {
		font-size: 28rpx;
		font-weight: 500;
		float: right;

		button {
			margin-left: 20rpx;
			font-size: 30rpx;
			background-color: rgba($color: #fff, $alpha: 0.0);
		}
	}

	.button-give {
		button {
			width: 160rpx;
			background-color: #fff;
		}
	}
</style>
