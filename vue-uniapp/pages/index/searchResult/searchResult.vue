<template>
	<view class="content">
		<z-paging ref="paging" v-model="dataList" loading-more-no-more-text="我也是有底线的！" @query="queryList">
			<view class="category-contents">
				<!-- 设置自己的emptyView组件，非必须。空数据时会自动展示空数据组件，不需要自己处理 -->
				<empty-view slot="empty"></empty-view>
				<view class="category-contents-item" v-for="(item, index) in dataList" >
					<view class="category-content-tag"></view>
					<view class="category-content-tip"></view>
					<view class="category-content-image" @click="goDetails(item)">
						<image :src="item.cover"></image>
					</view>
					<view class="category-content-title">
						<text>{{item.name}}</text>
					</view>
					<view class="category-content-num">
						<template v-if="item.single==1">
							<view class="category-content-num-left" >
								<text>单张：#0/</text>
								<text><text>{{item.number}}</text>份</text>
							</view>
							<view class="category-content-num-right">
								<uni-icons type="eye" size="14" color="#999"></uni-icons>
								<text>{{item.production_browse}}</text>
							</view>
						</template>
						<template v-else>
							<view class="category-content-num-left">
								<text>系列：</text>
								<text><text>{{item.number}}</text>份</text>
							</view>
							<view class="category-content-num-right">
								<uni-icons type="eye" size="14" color="#999"></uni-icons>
								<text>{{item.browse}}</text>
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
							<text class="category-content-bottom-price-num">{{item.price}}</text>
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
				page: 1,
				pageSize: 10,
				param: {
					"keyword": "",
					"condition": "all", 
					"category": "", 
					"aid": "", 
					"sequence": "time", 
					"trend": "desc", 
					"page": 1,
				},
				dataList: [],
			}
		},
		onLoad(res){
			console.log(res)
			if(res.keyword){
				this.param.keyword = res.keyword
			}
		},
		onReady(){
			
		},
		onShow(){
			console.log(222)
			this.queryList(this.page, this.pageSize)
		},
		methods: {
			// 查询列表数据
			queryList(page, pageSize) {
				var that = this
				that.param.page = page
				that.$ajax.post({
					url: 'catalog/list',
					data: JSON.stringify(that.param)
				}).then(res => {
					var data = res.data
					if(data.code == 200){
						that.$refs.paging.complete(data.data);
					}else{
						that.$refs.paging.complete(false);
					}
				})
			},
			// 查看详情事件
			goDetails(item){
				if(item.single == 1){
					uni.navigateTo({
					    url: '/pages/goods/details?id=' +item.id
					});
				}else{
					uni.navigateTo({
					    url: '/pages/goods/list?id=' +item.id+ '&name=' +item.name+ 
						'&productNumber=' +item.production_number+ '&productOnsale=' +item.production_onsale
					});
				}
			},
			// 跳转
			goAuthor(item){
				uni.navigateTo({
				    url: '/pages/user/user_detail/user_detail?id=' +item.author_id
				});
			},
		}
	}
</script>

<style>
	@import url('/static/css/common.css');
	
	.category-contents{
		margin: auto;
		margin-top: 40rpx;
		width: 94vw;
		padding: 0 3%;
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
