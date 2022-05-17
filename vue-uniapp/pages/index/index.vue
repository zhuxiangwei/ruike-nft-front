<template>
	
	<view class="content">
		<view class="searchView">
			<view >
				<uni-easyinput class="searchInput" v-model="keyword" @confirm="search" prefixIcon="search"  placeholder="请输入作品名称" />
			</view>
		</view>
		
		<view class="swiper-view">
			<uni-swiper-dot :info="advertList" :current="current" field="content" :mode="mode">
				<swiper class="swiper-box" @change="change">
					<swiper-item v-for="(item ,index) in advertList" :key="index">
						<view class="swiper-item">
							<image :src="item.image"></image>
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>
		
		<view class="category-items">
			<!-- 精品 -->
			<view class="category-item">
				<view class="category-item-top">
					<view class="category-item-top-title">
						<text>精品</text>
					</view>
					<view class="category-item-top-more">
						查看全部 >
					</view>
				</view>
				<view class="category-contents">
					<view class="category-contents-item" v-for="(item ,index) in bestList">
						<view class="category-content-tag"></view>
						<view class="category-content-tip"></view>
						<view class="category-content-image" @click="goDetails(item)">
							<image v-if="item.catalog_single == 1" :src="item.catalog_cover.split(',')[0]" ></image>
							<image v-else :src="item.catalog_cover"></image>
						</view>
						<view class="category-content-title">
							<text>{{item.catalog_name}}</text>
						</view>
						<view class="category-content-num">
							<view class="category-content-num-left" v-if="item.catalog_single==1">
								<text>单张：#1/</text>
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
						<view class="category-content-bottom">
							<view class="category-content-bottom-user" @click="goAuthor(item)">
								<view class="category-content-bottom-user-avata">
									<image :src="item.author_logo"></image>
								</view>
								<view class="category-content-bottom-user-name">
									<text >{{item.author_name}}</text>
								</view>
							</view>
							<view class="category-content-bottom-price">
								<text>￥</text>
								<text class="category-content-bottom-price-num">{{item.catalog_price}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 推荐 -->
			<view class="category-item">
				<view class="category-item-top">
					<view class="category-item-top-title">
						<text>推荐</text>
						<image src="../../static/image/home-hot.png"></image>
					</view>
					<view class="category-item-top-more">
						查看全部 >
					</view>
				</view>
				<view class="category-contents">
					<view class="category-contents-item" v-for="(item ,index) in recommendList" >
						<view class="category-content-tag"></view>
						<view class="category-content-tip"></view>
						<view class="category-content-image" @click="goDetails(item)">
							<image v-if="item.catalog_single==1" :src="item.catalog_cover.split(',')[0]" ></image>
							<image v-else :src="item.catalog_cover"></image>
						</view>
						<view class="category-content-title">
							<text>{{item.catalog_name}}</text>
						</view>
						<view class="category-content-num">
							<template v-if="item.catalog_single==1">
								<view class="category-content-num-left" >
									<text>单张：#1/</text>
									<text><text>{{item.catalog_total}}</text>份</text>
								</view>
								<view class="category-content-num-right">
									<uni-icons type="eye" size="14" color="#999"></uni-icons>
									<text>{{item.catalog_browse}}</text>
								</view>
							</template>
							<template v-else>
								<view class="category-content-num-left">
									<text>系列：</text>
									<text><text>{{item.catalog_total}}</text>份</text>
								</view>
								<view class="category-content-num-right">
									<uni-icons type="eye" size="14" color="#999"></uni-icons>
									<text>{{item.catalog_total}}</text>
								</view>
							</template>
						</view>
						<view class="category-content-bottom">
							<view class="category-content-bottom-user" @click="goAuthor(item)">
								<view class="category-content-bottom-user-avata">
									<image :src="item.author_logo"></image>
								</view>
								<view class="category-content-bottom-user-name">
									<text>{{item.author_name}}</text>
								</view>
							</view>
							<view class="category-content-bottom-price">
								<text>￥</text>
								<text class="category-content-bottom-price-num">{{item.catalog_price}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 全部分类 -->
			<!-- <view class="category-item">
				<view class="category-item-top">
					<view class="category-item-top-title">
						<text>全部分类</text>
					</view>
				</view>
				<view class="category-contents">
					<view class="category-contents-item" v-for="(item, index) in  cateList">
						<view class="category-content-image2">
							<image src="../../static/73353b93-98ec-45d4-bf9d-fcd52c858bae.png"></image>
						</view>
						<view class="category-content-title2">
							<text>{{item.name}}</text>
						</view>
					</view>
				</view>
			</view> -->
			
			
		</view>
		
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				mode: 'dot',
				searchValue: '',
				advertList: [],
				keyword: "",
				param: {
					"condition": "all", 
					"category": "", 
					"aid": "", 
					"sequence": "time", 
					"trend": "desc", 
					"page": 1,
				},
				bestList: [],
				recommendList: [],
				recommendList: [],
				cateList: [],
			}
		},
		onLoad(){
			
		},
		onShow() {
			this.getAdvertList()
			this.getBaseList()
			this.getRecommendList()
			//this.getCateList()
		},
		methods: {
			// 获取轮播数据
			getAdvertList(){
				this.$ajax.post({
					url: 'advertising/list',
				}).then(res => {
					var data = res.data
					if(data.code == 200){
						this.advertList = data.data
					}else{
						this.advertList = []
					}
				})
			},
			// 获取精品列表数据
			getBaseList(){
				//var data = {"condition": "best", "category": "", "aid": "", "sequence": "time", "trend": "desc", "page": 1}
				this.param.condition = "best"
				this.$ajax.post({
					url: 'catalog/list',
					data: JSON.stringify(this.param)
				}).then(res => {
					var data = res.data
					if(data.code == 200){
						this.bestList = data.data
						/* if(this.bestList != null && this.bestList.length > 0){
							for(var i = 0; i < this.bestList.length; i++){
								// 找出单张的封面，从商品封面的取第一个
								if(this.bestList[i].single == 1){
									if(this.bestList[i].production_images){
										var production_images = this.bestList[i].production_images.split(",")
										if(production_images.length > 0){
											this.bestList[i].cover2 = production_images[0]
										}else{
											this.bestList[i].cover2 = this.bestList[i].production_images
										}
									}
								}
							}
						} */
					}else{
						this.bestList = []
					}
				})
			},
			// 获取推荐列表数据
			getRecommendList(){
				//var data = {"condition": "recommend", "category": "", "aid": "", "sequence": "time", "trend": "desc", "page": 1}
				this.param.condition = "recommend"
				this.$ajax.post({
					url: 'catalog/list',
					data: JSON.stringify(this.param)
				}).then(res => {
					var data = res.data
					if(data.code == 200){
						this.recommendList = data.data
						/* if(this.recommendList != null && this.recommendList.length > 0){
							for(var i = 0; i < this.recommendList.length; i++){
								// 找出单张的封面，从商品封面的取第一个
								if(this.recommendList[i].single == 1){
									if(this.recommendList[i].production_images){
										var production_images = this.recommendList[i].production_images.split(",")
										if(production_images.length > 0){
											this.recommendList[i].cover2 = production_images[0]
										}else{
											this.recommendList[i].cover2 = this.recommendList[i].production_images
										}
									}
								}
							}
						} */
					}else{
						this.recommendList = []
					}
				})
			},
			// 获取分类列表数据
			getCateList(){
				this.$ajax.post({
					url: 'category/list',
				}).then(res => {
					var data = res.data
					if(data.code == 200){
						this.cateList = data.data
					}else{
						this.cateList = []
					}
				})
			},
			// 查看详情事件
			goDetails(item){
				if(item.catalog_single == 1){
					uni.navigateTo({
					    url: '/pages/goods/details?pid=' +item.catalog_id
					});
				}else{
					uni.navigateTo({
					    url: '/pages/goods/list?cid=' +item.catalog_id+ '&name=' +item.catalog_name+ 
						'&productNumber=' +item.catalog_total+ '&productOnsale=' +item.catalog_onsale
					});
				}
			},
			// 跳转
			goAuthor(item){
				uni.navigateTo({
				    url: '/pages/user/user_detail/user_detail?id=' +item.author_id
				});
			},
			// 搜索
			search(){
				if(this.keyword){
					uni.navigateTo({
					    url: '/pages/index/searchResult/searchResult?keyword=' +this.keyword
					});
					this.keyword = ''
				}else{
					uni.switchTab({
					    url: '/pages/category/category'
					});
				}
			},
			
			
			// 轮播点击事件
			change(e) {
				this.current = e.detail.current;
			},
		}
	}
</script>

<style>
	@import url('/static/css/common.css');
	
	.swiper-view{
		margin: auto;
		margin-top: 124rpx;
		width: 95vw;	
	}
	.swiper-item{
		height: 38.22576vw;
		width: 94vw;
	}
	.swiper-item image{
		width: 100%;
		height: 100%;
		-o-object-fit: cover;
		object-fit: cover;
		border-radius: 3%;
	}
	
	.category-items {
	    width: 100vw;
	    margin-top: 40rpx;
	}
	.category-item {
		margin: auto;
		width: 94vw;
		margin-bottom: 40rpx;
		padding: 0 3%;
	}
	.category-item:last-child {
		margin-bottom: 0;
	}
	.category-item-top {
		height: 48rpx;
		margin-bottom: 30rpx;
	}
	.category-item-top-title {
		position: relative;
		font-size: 34rpx;
		font-weight: 700;
		color: #333;
		float: left;
	}
	.category-item-top-title::before{
		width: 6rpx;
		height: 30rpx;
		display: block;
		position: absolute;
		content: '';
		top: 15%;
		left: -12rpx;
		background: #1277f1;
	}
	.category-item-top-title image{
		margin-left: 15rpx;
		width: 30rpx;
		height: 30rpx;
	}
	.category-item-top-more {
		float: right;
		color: #999;
		font-size: 26rpx;
	}
	
	.category-contents{
		
	}
	.category-contents::after{
		content: '';
		display: block;
		clear: both;
	}
	
	.category-contents-item{
		width: 48%;
		float: left;
		margin-right: 4%;
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 30rpx;
	}
	.category-contents-item:nth-child(2n+2){
		margin-right: 0;
	}
	.category-content-tag{
		width: 100%;
	}
	.category-content-tip{
		width: 100%;
	}
	.category-content-image{
		width: 100%;
		height: 340rpx;
	}
	.category-content-image image{
		width: 100%;
		height: 100%;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}
	.category-content-image2{
		width: 100%;
		height: 192rpx;
	}
	.category-content-image2 image{
		width: 100%;
		height: 100%;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}
	.category-content-title{
		font-size: 28rpx;
		font-weight: 700;
		padding: 10rpx;
		margin-top: 10rpx;
	}
	.category-content-title2{
		font-size: 26rpx;
		text-align: center;
	}
	.category-content-num{
		height: 40rpx;
		font-size: 24rpx;
		padding-left: 10rpx;
		padding-right: 10rpx;
	}
	.category-content-num-left{
		float: left;
		color: #333;
	}
	.category-content-num-right{
		float: right;
		color: #999;
	}
	.category-content-bottom{
		padding: 10rpx;
		height: 40rpx;
		margin-bottom: 10rpx;
	}
	.category-content-bottom-user{
		float: left;
	}
	.category-content-bottom-user-avata{
		float: left;
		height: 45rpx;
		width: 45rpx;
	}
	.category-content-bottom-user-avata image{
		height: 100%;
		width: 100%;
		border-radius: 50%;
	}
	.category-content-bottom-user-name{
		float: left;
		margin-left: 10rpx;
		font-size: 28rpx;
		color: #1277f1;
	}
	.category-content-bottom-price{
		float: right;
		color: #666;
		font-weight: 400;
	}
	.category-content-bottom-price-num{
		color: #000;
		font-weight: 700;
	}
</style>
