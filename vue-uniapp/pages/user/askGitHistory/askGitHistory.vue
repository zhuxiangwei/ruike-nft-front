<template>
	<view class="content">
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<view class="searchView">
				<view >
					<uni-easyinput class="searchInput"  prefixIcon="search"  placeholder="请输入作品名称" />
				</view>
			</view>
			
			<view class="content-items">
				<view class="content-item" v-for="count in 4">
					<view class="item-top">
						<view class="item-top-title">
							<text>咆哮滚滚#1</text>
						</view>
						<view class="item-top-time">
							<text>2022-03-25 16:17:20</text>
						</view>
					</view>
					<view class="item-body">
						<view class="item-left">
							<image src="../../../static/683d435b-47e9-4b5b-82c7-0cf913150e1b.jpg"></image>
						</view>
						<view class="item-center">
							<view>作品ID：<text>C823476</text></view>
							<view>
								作品编号：
								<text>#1/1000</text>
								<text>系列作品</text>
							</view>
						</view>
						<view class="item-right">
							<image src="../../../static/image/icon-way.png"></image>
						</view>
					</view>
					
					<view class="item-bottom">
						<view class="item-bottom-line">
							<u-line></u-line>
						</view>
						<view class="item-button">
							<u-button text="查看留言"></u-button>
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
				dataList: []
			}
		},
		methods: {
			queryList: function(){
				
			}
		}
	}
</script>

<style>
	@import url('/static/css/common.css');
	
	.content-items{
		margin-top: 140rpx;
	}
	.content-item{
		background: #fff;
		margin: auto;
		width: 95%;
		border-radius: 40rpx;
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
	
	.item-body{
		
	}
	.item-body::after{
		content: '';
		display: block;
		clear: both;
	}
	.item-left{
		float: left;
		width: 160rpx;
		height: 160rpx;
	}
	.item-left image{
		width: 100%;
		height: 100%;
	}
	.item-center{
		float: left;
	}
	.item-right{
		position: relative;
		float: right;
		width: 160rpx;
		height: 160rpx;
	}
	.item-right image{
		width: 100%;
		height: 100%;
	}
	
	.item-bottom{
		margin-top: 20rpx;
	}
	.item-bottom-line{
		padding-left: 20rpx;
		padding-right: 20rpx;
	}
	.item-button{
		padding-top: 10rpx;
		padding-bottom: 40rpx;
	}
	.item-button button{
		width: 160rpx;
		margin-right: 20rpx;
	}
</style>
