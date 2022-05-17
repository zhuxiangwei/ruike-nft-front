<template>
	<view class="container">
		<z-paging ref="paging" v-model="dataList" default-page-no="1" loading-more-no-more-text="我也是有底线的！" 
			@query="queryList" :show-loading-more-when-reload="true">
			<!-- 顶部选项卡 -->
			<view class="tabs"  >
				<u-tabs
					:list="tabList"
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
			
			<view class="content-items">
				<!-- 设置自己的emptyView组件，非必须。空数据时会自动展示空数据组件，不需要自己处理 -->
				<empty-view slot="empty"></empty-view>
				<view class="content-item" v-for="(item, index) in dataList" >
					<view class="item-top">
						<view class="item-top-title">
							<text>消息提醒</text>
						</view>
						<view class="item-top-time">
							<text>{{item.time}}</text>
						</view>
					</view>
					<view class="message">
						<view>
							{{item.content}}
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
				param: {
					"type": 0,
					"page": 1,
				},
				tabList: [{
					name: '交易消息',
					id: 0,
				}, {
					name: '系统消息',
					id: 1
				}],
				dataList: [],
				transactionList: [],
				systemList: [],
				tabCurrent: "1"
			}
		},
		onShow() {
		},
		methods: {
			queryList(page, pageSize){
				var that = this
				that.param.page = page
				that.$ajax.post({
					url: 'message/list',
					data: JSON.stringify(that.param)
				}).then(res => {
					var data = res.data
					if(data.code == 200){
						that.$refs.paging.complete(data.data);
					} else{
						that.$refs.paging.complete(false);
					}
				})
			},
			tabClick(item){
				this.param.type = item.id
				this.$refs.paging.reload()
			}
		}
	}
</script>

<style>
	.container{
		
	}
	.tabs{
		background: #fff;
	}
	
	.content-items{
		margin-top: 20rpx;
	}
	.content-item{
		background: #fff;
		margin: auto;
		width: 95%;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}
	.content-item::after{
		content: '';
		display: block;
		clear: both;
	}
	.item-top{
		padding: 20rpx;
	}
	.item-top::after{
		content: '';
		display: block;
		clear: both;
	}
	.item-top-title{
		float: left;
		font-size: 32rpx;
		font-weight: 700;
	}
	.item-top-time{
		float: right;
		font-size: 24rpx;
		color: #999999;
	}
	.message{
		padding: 20rpx;
	}
</style>
