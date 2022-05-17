<template>
	<view class="content">
		<z-paging ref="paging" v-model="dataList" default-page-no="1" loading-more-no-more-text="我也是有底线的！"
			@query="queryList" :show-loading-more-when-reload="true">
			<!-- 内容部分 -->
			<view class="author-detail">
				<view class="author-top">
					<view  class="author-item clear-fix">
						<view class="item-lis author-img">
							<image class="img" :src="author.author_logo" mode=""></image>
						</view>
						<view class="item-lis author-msg">
							<view class="author-name">
								<text>{{author.author_name}}</text>
							</view>
							<view class="author-id">
								<view class="num-opus">
									<text>ID: {{author.user_uuid}}</text>
								</view>
								<view class="num-col">
									<view class="copyIcon" @click="copyLink(0)">
										<u-icon size="18" name="/static/image/icon-copy-blue.png"></u-icon>
									</view>
								</view>
							</view>
							<view class="author-num clear-fix">
								<view class="num-opus">
									<text>身份地址: {{author.user_bcid}}</text>
								</view>
								<view class="num-col">
									<view class="copyIcon" @click="copyLink(1)">
										<u-icon size="18" name="/static/image/icon-copy-blue.png"></u-icon>
									</view>
								</view>
							</view>
						</view>
						<view class="item-lis author-sel" v-if="author.favorite === 0">
							<button type="default" @click="collectAuthor()">收藏TA</button>
						</view>
						<view class="item-lis author-sel" v-if="author.favorite === 1">
							<button type="default" @click="collectAuthor()">取消收藏</button>
						</view>
					</view>
				</view>
				<view class="author-bottom">
					<view class="author-desc-title">
						<text>简介</text>
					</view>
					<view class="author-desc">
						<text>{{author.author_contact}}</text>
					</view>
				</view>
			</view>
			
			<view class="author-tab">
				<text>TA创作的</text>
			</view>
			
			<view class="item-content clear-fix">
				<view  class="sell-item clear-fix" v-for="item in dataList">
					<view class="item-img clear-fix" @click="details(item)">
						<image class="img" :src="item.catalog_cover" mode=""></image>
					</view>
					<view class="item-msg">
						<view class="item-name">
							<text>{{item.catalog_name}}</text>
						</view>
						<view class="item-num">
							<view class="category-content-num-left" v-if="item.catalog_single==1">
								<text>单张：#0/</text>
								<text><text>{{item.catalog_total}}</text>份</text>
							</view>
							<view class="category-content-num-left" v-else>
								<text>系列：</text>
								<text><text>{{item.catalog_total}}</text>份</text>
							</view>
							<view class="category-content-num-right">
								<uni-icons type="eye" size="14" color="#999"></uni-icons>
								<text>{{item.catalog_browse}}</text>
							</view>
						</view>
						<view class="item-author">
							<view class="author-img">
								<image class="img" :src="item.author_logo" mode=""></image>
							</view>
							<view class="author-name">
								<text>{{item.author_name}}</text>
							</view>
							<view class="item-money">
								￥<text>{{item.catalog_price}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

		<!-- </mix-pulldown-refresh> -->
		</z-paging>
	</view>
</template>

<script>
	import mixAdvert from '@/components/mix-advert/vue/mix-advert';
	import json from '@/json'
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	// 引入复制文件
	import uniCopy from '@/common/uni-copy.js'
	let windowWidth = 0, scrollTimer = false, tabBar;
	export default {
		components: {
			mixPulldownRefresh,
			mixLoadMore,
			mixAdvert
		},
		data() {
			return {
				tabCurrentIndex: 0, //当前选项卡索引
				scrollLeft: 0, //顶部选项卡左滑距离
				enableScroll: true,
				uid: 0,
				author: {
					
				},
				requestParams: {
					keyword: "",
					condition: "all",
					category: "",
					aid: "",
					sequence: "time",
					trend: "asc",
					page: 1
				},
				dataList:[]
			}
		},
		computed: {
			advertNavUrl(){
				let data = {
					title: '测试跳转新闻详情',
					author: '测试作者',
					time: '2019-04-26 21:21'
				}
				return `/pages/details/details?data=${JSON.stringify(data)}`;
			},
			
		},
		async onLoad(option) {
			// 获取屏幕宽度
			console.log("user_detail option", option)
			this.uid = option.id;
			this.requestParams.aid = option.id;
			windowWidth = uni.getSystemInfoSync().windowWidth;
			// this.loadTabbars();
			this.loadAuthor();
			// this.loadNewsList("add");
		},
		onReady(){
			uni.getSystemInfo({
			 	success: function (res) {
			 		console.log(res.model);
			 		console.log(res.pixelRatio);
			 		console.log(res.windowWidth);
			 		console.log(res.windowHeight);
			 		console.log(res.language);
			 		console.log(res.version);
			 		console.log(res.deviceId);
			 	}
			});
		},
		methods: {
			/**
			 * 数据处理方法在vue和nvue中通用，可以直接用mixin混合
			 * 这里直接写的
			 * mixin使用方法看index.nuve
			 */
			//我的作品列表
			queryList(page, pageSize) {
				let that = this;
				that.requestParams.page = page;
				that.$ajax.post({
					url: "catalog/list",
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
			collectAuthor(){
				let that = this;
				let requestParam = {
					aid: that.uid, 
					action: that.author.favorite === 0 ? 1 : 0
				}
				that.$ajax.post({
					url: "favorite/author",
					data: JSON.stringify(requestParam)
				}).then(res => {
					let data = res.data
					if(data.code == 200){
						that.loadAuthor();
						
					} else{
						uni.showToast({
							title: "系统异常，请刷新重试",
							icon: 'error',
							duration: 3000
						});
					}
				});
			},
			loadAuthor(){
				console.log(this.uid)
				let that = this;
				that.$ajax.post({
					url: "author/fetch",
					data: JSON.stringify({aid: that.uid})
				}).then(res => {
					
					let data = res.data
					if(data.code == 200){
						that.author = data.data;
						
					} else{
						uni.showToast({
							title: "系统异常，请刷新重试",
							icon: 'error',
							duration: 3000
						});
					}
				});
			},
			//新闻详情
			navToDetails(item){
				let data = {
					id: item.id,
					title: item.title,
					author: item.author,
					time: item.time
				}
				let url = item.videoSrc ? 'videoDetails' : 'details'; 

				uni.navigateTo({
					url: `/pages/details/${url}?data=${JSON.stringify(data)}`
				})
			},
			details(data){
				console.log(data,'data')
				uni.navigateTo({
					url:`/pages/goods/details?pid=${data.catalog_id}`
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
			// 复制方法
			copyLink(type){
				var that = this
				uniCopy({
					content: type == 0 ? that.author.user_uuid : that.author.user_bcid,
					success:(res)=>{
						uni.showToast({
							title: res,
							icon: 'none'
						})
					},
					error:(e)=>{
						uni.showToast({
							title: e,
							icon: 'none',
							duration:3000,
						})
					}
				})
			},
		}
	}
</script>

<style lang='scss'>
	
	page, .content{
		background-color: #F2F6FC;
		height: 100%;
		overflow: hidden;
	}
	
	.content {
		margin: 0%;
	}
	
	.searchView{
		padding: 0;
		margin: auto ;
		padding: 20rpx 24rpx;
		width: 90vw;
	}
	.searchInput{
		line-height: 80rpx;
	}

	/* 顶部tabbar */
	.nav-bar{
		position: relative;
		z-index: 10;
		height: 90upx;
		white-space: nowrap;
		box-shadow: 0 2upx 8upx rgba(0,0,0,.06);
		background-color: #fff;
		.nav-item{
			display: inline-block;
			/* width: 150upx; */
			width: 25%;
			height: 90upx;
			text-align: center;
			line-height: 90upx;
			font-size: 30upx;
			color: #646566;
			position: relative;
			&:after{
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
		.current{
			color: #1277f1;
			&:after{
				width: 50%;
			}
		}
	}
	.nav-bar-sort{
		background: #f2f2f2;
	}

	.swiper-box{
		height: 100%;
	}

	.panel-scroll-box{
		height: 100%;
		background-color: #F2F6FC;
		position: relative;
		.panel-item{
			background: #fff;
			padding: 30px 0;
			border-bottom: 2px solid #000;
		}
	}
	
	.author-detail{
		width: 100%;
		box-sizing: border-box;
		padding: 16rpx;
		background-color: #2f2f38;
		z-index: 10;
		.author-top,.author-bottom{
			padding: 10rpx 0;
		}
		.author-top{
			border-bottom: 2rpx solid #404048;
		}
		.author-bottom{
			color: #fff;
			font-size: 24rpx;
			padding: 10rpx;
			.author-desc-title{
				font-size: 32rpx;
				margin-bottom: 10rpx;
			}
			.author-desc{
				line-height: 30rpx;
			}
		}
	}
	
	.author-item{
		width: 100%;
		border-radius: 12rpx;
		padding: 0rpx;
		margin: 0rpx;
		position: relative;
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		color: #fff;
		.item-lis{
			
		}
		.author-img{
			width: 160rpx;
			height: 160rpx;
			overflow: hidden;
			border-radius: 50%;
			margin-right: 20rpx;
			image{
				width: 100%;
				height: 100%;

			}
		}
		.author-msg{
			width: calc(100% - 340rpx);
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			justify-content: space-around;
			overflow: hidden;
			text-overflow: ellipsis;
			.author-name{
				font-size: 32rpx;
				font-weight: 700;
			}
			.author-id{
				font-size: 20rpx;
				font-weight: 700;
			}
			.author-id,
			.author-num{
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				font-size: 20rpx;
				font-weight: 500;
				white-space: nowrap;
				overflow: hidden;
				.num-opus{
					margin-right: 4rpx;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
		.author-sel{
			width: 160rpx;
			height: 160rpx;
			font-weight: 700;
			float: right;
			display: flex;
			flex-direction: column;
			justify-content: center;
			button{
				background-color: rgba($color: #000000, $alpha: .0);
				color: #fff;
				font-size: 22rpx;
				border: 2rpx solid #fff;
			}
		}
		
	}

	.author-item::after{
		content: "";
		display: block;
		clear: both;
	}
	
	.author-tab{
		width: 100%;
		height: 60rpx;
		margin-bottom: 20rpx;
		background-color: #fff;
		text-align: center;
		color: blue;
		font-size: 32rpx;
		line-height: 60rpx;
		
	}
	
	.clear-fix::after{
		content: "";
		display: inline-block;
		clear: both;
	}
	
	.item-content{
		width: 100%;
		position: relative;
		&::after{
			content: "";
			display: block;
			clear: both;
		}
	}
	
	.sell-item{
		width: calc(50% - 30rpx);
		border-radius: 20rpx;
		overflow: hidden;
		margin-left: 20rpx;
		margin-right: 10rpx;
		margin-bottom: 20rpx;
		background-color: #fff;
		float: left;
		&:nth-child(2n){
			margin-left: 10rpx;
		}
		&::after{
			content: "";
			display: block;
			clear: both;
		}
		image{
			width: 100%;
			height: 100%;
		}
		.item-img{
			width: 100%;
			height: 0;
			padding-top: 100%;
			position: relative;
			float: left;
			image{
				position: absolute;
				top: 0;
				left: 0;
			}
		}
		.item-msg{
			width: 100%;
			position: relative;
			box-sizing: border-box;
			overflow: hidden;
			.item-name{
				padding: 10rpx 20rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 28rpx;
				font-weight: 700;
				color: #010101;
			}
			.item-num{
				padding: 0 20rpx 10rpx;
				font-size: 24rpx;
				color: #333;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
			}
			.item-author{
				padding: 0 20rpx 20rpx;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;
				.author-img{
					width: 40rpx;
					height: 40rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.author-name{
					font-size: 24rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					color: #1277f1;
				}
				.item-money{
					min-width: 60rpx;
					color: #010101;
					float: right;
					text-align: right;
					text{
						font-weight: 700;
					}
				}
			}
		}
	}

	




	




	



</style>
