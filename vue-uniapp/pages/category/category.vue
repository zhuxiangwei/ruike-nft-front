<template>
	<view class="content">
		<z-paging ref="paging" v-model="dataList" default-page-no="1" loading-more-no-more-text="我也是有底线的！" @query="queryList">
			<view class="searchView">
				<view >
					<uni-easyinput class="searchInput" v-model="param.keyword" @confirm="search" @iconClick="search" prefixIcon="search"  placeholder="请输入作品名称" confirmType="search" />
				</view>
			</view>
			<view class="filter">
				<sl-filter :ref="'slFilter'" :isTransNav="true" :navHeight="0" :color="titleColor" :themeColor="themeColor" :menuList="menuList" @result="filterResult"></sl-filter>
			</view>
			<view class="category-contents">
				<!-- 设置自己的emptyView组件，非必须。空数据时会自动展示空数据组件，不需要自己处理 -->
				<empty-view slot="empty"></empty-view>
				<view class="category-contents-item" v-for="(item, index) in dataList" >
					<view class="category-content-tag"></view>
					<view class="category-content-tip"></view>
					<view class="category-content-image" @click="goDetails(item)">
						<image :src="item.catalog_cover.split(',')[0]" v-if="item.catalog_cover"></image>
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
								<text>{{item.catalog_browse}}</text>
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
		</z-paging>
	</view>
</template>

<script>
	import slFilter from '@/components/sl-filter/sl-filter.vue';
	export default {
		components: {
			slFilter
		},
		data() {
			return {
				titleColor: "#666666",  //menuBar菜单标题颜色
				themeColor: "#000000",  //按钮选中颜色和确认按钮颜色
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
				menuList: [
				    {
				        'title': '全部类型',
				        'detailTitle': '类型筛选',
				        //'isMutiple': true,
				        'key': 'category',
				        'detailList': [
				            {
				                'title': '不限',
				                'value': ''
				            }
				        ]
				    },
				    {
				        'title': '全部品牌',
				        'detailTitle': '品牌筛选',
				        'key': 'aid',
				        'isMutiple': false,
				        'detailList': [
				            {
				                'title': '不限',
				                'value': ''
				            },
				        ]
				    },
				    {
				        'title': '排序',
				        'detailTitle': '排序筛选',
				        'key': 'sequence',
				        'isSort': true,
				        'isMutiple': false,
				        'detailList': [
				            {
				                'title': '最新上架',
				                'value': 'time'
				            },
				            {
				                'title': '价格升序',
				                'value': 'priceAsc'
				            },
							{
							    'title': '价格降序',
							    'value': 'price'
							},
				            {
				                'title': '最受欢迎',
				                'value': 'browse'
				            },
							
				        ]
				    }
				]
			}
		},
		onLoad(res){
			this.queryCateList()
			this.queryAthorList()
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
		onShow(){
			//this.queryList()
		},
		methods: {
			// 查询下拉数据--类型
			queryCateList(){
				var that = this
				that.$ajax.post({
					url: 'category/list',
				}).then(res => {
					var data = res.data
					if(data.code == 200){
						for (var i = 0; i < data.data.length; i++) {
							var menuItem = {'title': data.data[i].name, 'value': data.data[i].name}
							that.menuList[0].detailList.push(menuItem)
						}
					}else{
						that.menuList[0].detailList = []
					}
				})
			},
			// 查询下拉数据--品牌
			queryAthorList(){
				var that = this
				that.$ajax.post({
					url: 'catalog/author',
				}).then(res => {
					var data = res.data
					if(data.code == 200){
						for (var i = 0; i < data.data.length; i++) {
							var menuItem = {'title': data.data[i].name, 'value': data.data[i].id}
							that.menuList[1].detailList.push(menuItem)
						}
					}else{
						that.menuList[1].detailList = []
					}
				})
			},
			// 搜索
			search(){
				//this.queryList()
				this.$refs.paging.reload()
			},
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
			// 筛选结果
			filterResult(val) {
				console.log(val);
				console.log(JSON.stringify(val));
				var filter_result = JSON.stringify(val)
				this.param.category = val.category
				this.param.aid = val.aid
				if(val.sequence){
					if(val.sequence == 'priceAsc'){
						this.param.sequence = 'price'
						this.param.trend = 'asc'
					}else{
						this.param.sequence = val.sequence
						this.param.trend = 'desc'
					}
				}
				//this.queryList()
				this.$refs.paging.reload()
			},
		}
	}
</script>

<style>
	@import url('/static/css/common.css');
	
	.filter{
		position: fixed;
		width: 100%;
		margin-top: 118rpx;
		z-index: 2;
	}
	.category-contents{
		margin: auto;
		margin-top: 250rpx;
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
