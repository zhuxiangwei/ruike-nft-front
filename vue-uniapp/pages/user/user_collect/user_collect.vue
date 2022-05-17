<template>
	<view class="content">
		
		<z-paging ref="paging" v-model="dataList" default-page-no="1" loading-more-no-more-text="我也是有底线的！"
			@query="queryList" :show-loading-more-when-reload="true">
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
			
			<view class="collect-items">
				<empty-view slot="empty"></empty-view>
				<view class="collect-item" v-for="(item, index) in dataList" :key="index" v-if="param.type == 0">
					<view class="collect-content" @click="details(item)">
						<view class="collect-content-left">
							<image class="collect-content-left-image" :src="item.data.production_images.split(',')[0]" v-if="item.data.production_images">
							</image>
						</view>
				
						<view class="collect-content-right">
							<view class="collect-content-right-name">
								{{item.data.production_name}}
							</view>
							<view class="collect-content-right-bottom">
								<view class="collect-content-right-bottom-avata">
									<image :src="item.data.user_avatar"></image>
								</view>
								<view class="collect-content-right-bottom-remark">
									<text>{{item.data.author_name}}</text>
								</view>
								<view class="collect-content-right-bottom-price">￥{{item.data.production_price}}</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="collect-item" v-for="(item, index) in dataList" :key="index" v-if="param.type == 1">
					<view class="collect-content" @click="userDetails(item)">
						<view class="collect-content-left">
							<image class="collect-content-left-image collect-author-img" :src="item.data.user_avatar">
							</image>
						</view>
				
						<view class="collect-content-right">
							<view class="collect-content-right-name">
								{{item.data.author_name}}
							</view>
							<view class="collect-content-right-bottom">
								<view class="collect-content-right-bottom-remark">
									<text>作品: {{item.data.count}}</text>
								</view>
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
					name: '收藏的商品',
					reqname: "商品",
					id: 0,
				}, {
					name: '收藏的发行方',
					reqname: "发行方",
					id: 1
				}],
				param: {
					page: 1,
					type: 0
				},
				dataList: [],
			}
		},
		computed: {},
		onLoad() {
			
		},
		onReady() {
			
		},
		onShow() {
			
		},
		methods: {
			//我的作品列表
			queryList(page, pageSize) {
				let that = this;
				let dataList = []
				that.param.page = page
				that.$ajax.post({
					url: "favorite/list",
					data: JSON.stringify(that.param)
				}).then(res => {
					let data = res.data
					if(data.code == 200){
						// if(data.data){
						// 	for(let i = 0; i < data.data.length; i++){
						// 		dataList.push(data.data[i].data)
						// 	}
						// }
						// that.$refs.paging.complete(dataList);
						that.$refs.paging.complete(data.data);
					} else{
						that.$refs.paging.complete(false);
					}
				});
			},

			//tab切换
			tabClick(item){
				this.param.type = item.id
				//this.queryList(1)
				this.$refs.paging.reload()
			},
			details (item) {
			  let data = {
				  aid: item.aid,  //作者id
				  id: item.pid    //product id
			  }
			  uni.navigateTo({
			    url: `/pages/goods/details?pid=${item.pid}`
			  })
			},
			userDetails (item) {
			  let data = {
				  id: item.aid,  //作者id
			  }
			  uni.navigateTo({
			    url: `/pages/user/user_detail/user_detail?id=${data.id}`
			  })
			}
		}
	}
</script>

<style lang='scss'>
	.content {
		margin: 0%;
		background: #f9f9f9;
	}
	
	.tabs{
		background-color: #fff;
	}

	/* 收藏信息item */
	.collect-item {
		width: calc(100% - 40rpx);
		/* width: 100%; */
		background-color: #fff;
		border-radius: 20rpx;
		padding: 20rpx;
		margin: auto;
		margin-top: 20rpx;
		box-sizing: border-box;
		font-weight: 500;

		/* 内容布局 */
		.collect-content {
			width: 100%;
			height: 180rpx;
		}

	}

	/* item左边头像布局 */
	.collect-content-left {
		float: left;
		width: 30%;

		/* margin-right: 1rem; */
		/* 头像图片 */
		.collect-content-left-image {
			overflow: hidden;
			border-radius: 10%;
			width: 180rpx;
			height: 180rpx;
		}
		.collect-author-img{
			border-radius: 100%;
		}
	}


	/* 中间部分右边文字内容布局 */
	.collect-content-right {
		float: left;
		width: 70%;
		margin-top: 20rpx;
		/* padding: 1rpx 0; */
		/* border: 0.1rpx solid #007AFF; */

		.collect-content-right-name {
			width: 100%;
			font-size: 1.2rem;
			font-weight: 700;
		}

		.collect-content-right-bottom {
			float: left;
			width: 100%;
			margin-top: 40rpx;

			.collect-content-right-bottom-avata {
				float: left;
				height: 45rpx;
				width: 45rpx;

				image {
					height: 100%;
					width: 100%;
					border-radius: 50%;
				}
			}

			.collect-content-right-bottom-remark {
				float: left;
				margin-left: 10rpx;
				font-size: 28rpx;
			}

			.collect-content-right-bottom-price {
				float: right;
				color: #ff1034;
				font-weight: 700;
			}
		}
	}
</style>
