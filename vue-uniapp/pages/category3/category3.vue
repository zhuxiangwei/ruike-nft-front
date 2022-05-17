<template>
	<view class="content">
		<z-paging ref="paging" v-model="dataList" default-page-no="1" loading-more-no-more-text="我也是有底线的！"
			@query="queryList">
			<!-- 顶部选项卡 -->
			<!-- 吸顶 -->
			<!-- <u-sticky offset-top="18"> -->
				<!-- 顶部选项卡 -->
				<view class="tabs">
					<u-tabs :list="tabBarsTop" lineColor="#f56c6c" :activeStyle="{
						color: '#303133',
						fontSize: '32rpx',
						fontWeight: 'bold',
					}" :inactiveStyle="{
						color: '#606266',
						transform: 'scale(1)'
					}" itemStyle="height: 80rpx;width: 19%;" :scrollable=false @click="tabClick">
					</u-tabs>
				</view>
			<!-- </u-sticky> -->
		
			<view class="searchView">
				<uni-easyinput class="searchInput" prefixIcon="search" v-model="requestParams.keyword"  @confirm="search"
						@iconClick="search"  placeholder="请输入创作者名称查询" />
			</view>
		
			<!-- 排序选项卡 -->
			<scroll-view id="nav-bar-sort"  class="nav-bar nav-bar-sort" scroll-with-animation :scroll-left="scrollLeft">
				<view 
					v-for="(item,index) in tabBars" :key="item.id"
					class="nav-item"
					:class="{current: index === tabCurrentIndex}"
					:id="'tab'+index"
					@click="changeTab(index)"
				>{{item.name}}
					<uni-icons class="icon-arrow" type="arrow-down" v-if="item.sort == 0" style="font-size: 30rpx;" color="{'#1277f1': index === tabCurrentIndex}"></uni-icons>
					<uni-icons class="icon-arrow"  type="arrow-up" v-if="item.sort == 1" style="font-size: 30rpx;" color="{'#1277f1': index === tabCurrentIndex}"></uni-icons>
				</view>
			</scroll-view>
			
			<!-- 内容部分 -->
			<view class="public-contents">
				<empty-view slot="empty"></empty-view>
				<view class="author-item clear-fix" v-for="(item, index) in dataList" :key="index">
					<view class="item-lis author-img" @click="navToDetails(item)">
						<image class="img" :src="item.logo" mode=""></image>
					</view>
					<view class="item-lis author-msg" @click="navToDetails(item)">
						<view class="author-name">
							<text>{{item.name}}</text>
						</view>
						<view class="author-num clear-fix">
							<view class="num-opus">
								<text>{{item.production_count}}作品</text>
							</view>
							<view class="num-col">
								<text>{{item.favorite_count}}收藏</text>
							</view>
						</view>
					</view>
					<view class="item-lis author-sel" v-if="item.favorite === 0">
						<button type="default" @click="collectAuthor(item)">收藏TA</button>
					</view>
					<view class="item-lis author-sel" v-if="item.favorite === 1">
						<button type="default" @click="collectAuthor(item)">取消收藏</button>
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
				tabBarsTop:[{
					name: '全部',
					id: '1',
				}, {
					name: '创作者',
					id: '2'
				}, {
					name: '知名IP',
					id: '3'
				}, {
					name: '其他',
					id: '4'
				}],
				tabBars: [{
					name: '综合',
					id: '0',
					sort: 0
				}, {
					name: '入驻时间',
					id: '1',
					sort: 0
				}, {
					name: '作品数量',
					id: '2',
					sort: 0
				}, {
					name: '售卖数量',
					id: '3',
					sort: 0
				}],
				dataList:[],
				requestParams:{
					category: "全部",
					sequence: "综合",
					trend: "asc",
					page: 1,
					keyword: ""
				}
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
		async onLoad() {
			// 获取屏幕宽度
			windowWidth = uni.getSystemInfoSync().windowWidth;
			// this.loadTabbars();
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
					url: "author/list",
					data: JSON.stringify(this.requestParams)
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
				this.requestParams.category = item.name;
				this.queryList(1);
				this.$refs.paging.reload();
			},
			gotoOrderDetail() {
				uni.navigateTo({
					url: '/pages/user/myorders/orderDetail/orderDetail'
				})
			},
			//收藏作者
			collectAuthor(item){
				let that = this;
				let requestParam = {
					aid: item.uid, 
					action: item.favorite === 0 ? 1 : 0
				}
				that.$ajax.post({
					url: "favorite/author",
					data: JSON.stringify(requestParam)
				}).then(res => {
					let data = res.data
					if(data.code == 200){
						item.favorite = requestParam.action;
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
					url: `/pages/user/user_detail/user_detail?id=${item.uid}`
				})
			},
			//tab切换
			async changeTab(e){
				
				if(scrollTimer){
					//多次切换只执行最后一次
					clearTimeout(scrollTimer);
					scrollTimer = false;
				}
				let index = e;
				//e=number为点击切换，e=object为swiper滑动切换
				if(typeof e === 'object'){
					index = e.detail.current
				}
				// if(typeof tabBar !== 'object'){
				// 	tabBar = await this.getElSize("nav-bar-top")
				// }
				if(typeof tabBar !== 'object'){
					tabBar = await this.getElSize("nav-bar-sort")
				}
				
				//计算宽度相关
				let tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0; 
				let nowWidth = 0;
				//获取可滑动总宽度
				for (let i = 0; i <= index; i++) {
					let result = await this.getElSize('tab' + i);
					width += result.width;
					if(i === index){
						nowWidth = result.width;
					}
				}
				if(typeof e === 'number'){
					//点击切换时先切换再滚动tabbar，避免同时切换视觉错位

					if(this.tabCurrentIndex == index)
					{
						if(this.tabBars[index].sort === 0)
						{
							this.tabBars[index].sort = 1;
						}
						else
						{
							this.tabBars[index].sort = 0;
						}
					}
					this.tabCurrentIndex = index; 
				}
				
				//更新查询
				this.requestParams.sequence = this.tabBars[this.tabCurrentIndex].name;
				this.requestParams.trend = this.tabBars[this.tabCurrentIndex].sort === 0 ? "desc" : "asc";
				this.tabBars[this.tabCurrentIndex].page = 1;
				console.log("发行方param", this.requestParams);
				
				//延迟300ms,等待swiper动画结束再修改tabbar
				scrollTimer = setTimeout(()=>{
					if (width - nowWidth/2 > windowWidth / 2) {
						//如果当前项越过中心点，将其放在屏幕中心
						this.scrollLeft = width - nowWidth/2 - windowWidth / 2;
					}else{
						this.scrollLeft = 0;
					}
					if(typeof e === 'object'){
						this.tabCurrentIndex = index; 
					}
					if(typeof type === 'number')
					{
						this.tabCurrentIndex = index; 
					}
					
					this.queryList(1);
					this.$refs.paging.reload();
				}, 300)
				
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
	.uni-page-body{
		width: 100%;
		height: 100%;
	}
	.content {
		margin: 0%;
		background: #f9f9f9;
		height: 100%;
	}
	.searchView{
		/* position: fixed;
		top: 0rpx; */
		background: #F2F2F2;
		width: 100%;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		z-index: 2;
	}
	.searchView view{
		width: 97%;
		margin: auto;
	}
	.searchInput{
		line-height: 80rpx;
		background-color: #fff;
	}
	
	.tabs {
		background: #fff;
	}
/* 	page, .content{
		background-color: #fff;
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
			font-size: 30rpx;
			color: #646566;
			position: relative;
			&::after{
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
			.icon-arrow{
				font-size: 30upx;
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
		background: #fff;
	}

	.swiper-box{
		height: 100%;
	}

	.panel-scroll-box{
		height: 100%;
		background-color: #F2F6FC;
		.panel-item{
			background: #fff;
			padding: 30px 0;
			border-bottom: 2px solid #000;
		}
	}
	
	.author-item{
		width: calc(100% - 20rpx);
		background-color: #fff;
		border-radius: 10rpx;
		padding: 10rpx;
		margin: 10rpx;
		position: relative;
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		.item-lis{
			
		}
		.author-img{
			width: 160rpx;
			height: 160rpx;
			overflow: hidden;
			border-radius: 50%;
			margin-right: 10rpx;
		}
		.author-msg{
			width: calc(100% - 320rpx);
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
			.author-num{
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				color: #999;
				font-size: 24rpx;
				font-weight: 500;
				.num-opus{
					margin-right: 60rpx;
				}
			}
		}
		.author-sel{
			width: 160rpx;
			height: 160rpx;
			font-size: 20rpx;
			font-weight: 700;
			float: right;
			display: flex;
			flex-direction: column;
			justify-content: center;
			button{
				font-size: 24rpx;
			}
		}
		
	}

	.author-item::after{
		content: "";
		display: block;
		clear: both;
	}
	
	.clear-fix::after{
		content: "";
		display: inline-block;
		clear: both;
	}
	
	/**
	 * 新闻列表 直接拿的nvue样式修改，,
	 * 一共需要修改不到10行代码, 另外px需要直接修改为upx，只有单位不一样，计算都是一样的
	 * 吐槽：难道不能在编译的时候把nuve中的upx转为px? 这样就不用修改单位了
	 */
	.video-wrapper{
		width: 100%;
		height: 440upx;
		.video{
			width: 100%;
		}
	}
	
	view{
		display:flex;
		flex-direction: column;
	}
	.img{
		width: 100%;
		height: 100%;
	}
	.news-item{
		position:relative;
	}
	/* 修改结束 */
	
	/* 新闻列表  emmm 仅供参考 */
	.news-item{
		width: 750upx;
		padding: 24upx 30upx;
		border-bottom-width: 1px;
		border-color: #eee;
		background-color: #fff;
	}
	.title{
		font-size: 32upx;
		color: #303133;
		line-height: 46upx;
	}
	.bot{
		flex-direction: row;
	}
	.author{
		font-size: 26upx;
		color: #aaa;
	}
	.time{
		font-size: 26upx;
		color: #aaa;
		margin-left: 20upx;
	}
	.img-list{
		flex-shrink: 0;
		flex-direction: row;
		background-color: #fff;
		width: 220upx;
		height: 140upx;
	}
	.img-wrapper{
		flex: 1;
		flex-direction: row;
		height: 140upx;
		position: relative;
		overflow: hidden;
	}
	.img{
		flex: 1;
	}
	.img-empty{
		height: 20upx;
	}
	
	/* 图在左 */
	.img-list1{
		position:absolute;
		left: 30upx;
		top: 24upx;
	}
	.title1{
		padding-left: 240upx; 
	}
	.bot1{
		padding-left: 240upx; 
		margin-top: 20upx;
	}
	/* 图在右 */
	.img-list2{
		position:absolute;
		right: 30upx;
		top: 24upx;
	}
	.title2{
		padding-right: 210upx; 
	}
	.bot2{
		margin-top: 20upx;
	}
	/* 底部3图 */
	.img-list3{
		width: 700upx;
		margin: 16upx 0upx;
	}
	.img-wrapper3{
		margin-right: 4upx;
	}
	/* 底部大图 */
	.img-list-single{
		width: 690upx;
		height: 240upx;
		margin: 16upx 0upx;
	}
	.img-wrapper-single{
		height: 240upx;
		margin-right: 0upx;
	}
	
	.video-tip{
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.3);
	}
	.video-tip-icon{
		width: 60upx;
		height:60upx; 
	}
</style>
