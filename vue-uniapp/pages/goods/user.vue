<template>
	<view class="w">
		<view class="back">
			<view class="item"><image src="../../static/image/br-back.png" mode=""></image></view>
			<view class="item"><image src="../../static/image/br-home.png" mode=""></image></view>
		</view>
		<view class="info">
			<view class="top">
				<view class="left">
					<image src="../../static/logo.png" mode="" class="logo"></image>
					<view class="param">
						<view class="name">AVAPUNK</view>
						<view class="id">
							<text>id:1513544</text>
							<image src="../../static/image/icon-copy-blue.png" mode=""></image>
						</view>
						<view class="address">
							<text>身份地址：{{ address | addressHide }}</text>
							<image src="../../static/image/icon-copy-blue.png" mode=""></image>
						</view>
					</view>
				</view>
				<view class="collection">收藏TA</view>
			</view>
			<view class="introduce">
				<view class="tit">简介</view>
				<view class="cont">
					AVAPUNK
					为阿瓦朋克平台官方发行渠道，主要发行自有及签约艺术设计师所创作头像数字藏品，所有作品均经过严格筛选及版权确认，努力为用户提供各类精彩及内涵丰富的NFT数字藏品。
				</view>
			</view>
		</view>
		<view class="works" :class="fixed ? 'fixed' : ''">TA创作的</view>
		<view class="goods-w">
			<view class="category-contents">
				<view class="category-contents-item" v-for="count in 8">
					<view class="category-content-tag"></view>
					<view class="category-content-tip"></view>
					<navigator url="../goods/list">
						<view class="category-content-image"><image src="../../static/1b9feaf9-fa09-47cb-8269-ef00621e7559.jpg"></image></view>
					</navigator>

					<view class="category-content-title"><text>原界-风华虎</text></view>
					<view class="category-content-num">
						<view class="category-content-num-left">
							<text>系列：</text>
							<text>100份</text>
						</view>
						<view class="category-content-num-right">
							<uni-icons type="eye" size="14" color="#999"></uni-icons>
							<text>104903</text>
						</view>
					</view>
					<view class="category-content-bottom">
						<view class="category-content-bottom-user">
							<view class="category-content-bottom-user-avata"><image src="../../static/home-avata.png"></image></view>
							<view class="category-content-bottom-user-name"><text>FLYING</text></view>
						</view>
						<view class="category-content-bottom-price">
							<text>￥</text>
							<text class="category-content-bottom-price-num">99.90</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			address: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
			fixed: false
		};
	},
	filters: {
		addressHide(e) {
			let str = e.substring(0, 4) + '....' + e.substring(38);
			return str;
		},
		formatDate(value) {
			// 十位数时间戳
			let date = new Date(parseInt(value) * 1000);
			let y = date.getFullYear();
			let m = date.getMonth() + 1;
			m = m < 10 ? '0' + m : m;
			let d = date.getDate();
			d = d < 10 ? '0' + d : d;
			let h = date.getHours();
			h = h < 10 ? '0' + h : h;
			let minute = date.getMinutes();
			let second = date.getSeconds();
			minute = minute < 10 ? '0' + minute : minute;
			second = second < 10 ? '0' + second : second;
			return m + '-' + d + ' ' + h + ':' + minute + ':' + second;
		}
	},
	onPageScroll(res) {
		console.log(res.scrollTop);
		if (res.scrollTop >= 300) {
			this.fixed = true;
		} else {
			this.fixed = false;
		}
	}
};
</script>

<style lang="scss">
.back {
	position: fixed;
	z-index: 1000;
	text-align: center;
	width: 80rpx;
	right: 24rpx;
	bottom: 5%;
	.item {
		width: 80rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10rpx;
		background: rgba(0, 0, 0, 0.3);
		margin-bottom: 24rpx;
		image {
			width: 50rpx;
			height: 50rpx;
		}
	}
}
.w {
	.fixed {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 99;
	}
	.info {
		background-color: #2f2f38;
		padding: 3%;
		.top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #ffffff;
			border-bottom: 1px solid #404048;
			padding: 3% 0;
			.left {
				display: flex;
				align-items: center;
				.logo {
					width: 156rpx;
					height: 156rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}
				.name {
					font-size: 40rpx;
					font-weight: bold;
				}
				.id,
				.address {
					display: flex;
					align-items: center;
					font-size: 26rpx;
					line-height: 50rpx;
					image {
						margin-left: 10rpx;
						width: 30rpx;
						height: 30rpx;
					}
				}
			}
			.collection {
				border: 1px solid #e6e6e6;
				padding: 5rpx 15rpx;
			}
		}
		.introduce {
			color: #ffffff;
			.tit {
				padding: 15rpx 0;
				font-size: 30rpx;
			}
			.cont {
				font-size: 28rpx;
			}
		}
	}
	.works {
		width: 100%;
		background-color: #ffffff;
		line-height: 88rpx;
		text-align: center;
		font-size: var(--fsize-30);
		color: rgb(0, 102, 237);
	}
	.goods-w {
		padding: 3%;
	}
	.category-contents {
	}
	.category-contents::after {
		content: '';
		display: block;
		clear: both;
	}

	.category-contents-item {
		width: 48%;
		float: left;
		margin-right: 4%;
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 30rpx;
	}
	.category-contents-item:nth-child(2n + 2) {
		margin-right: 0;
	}
	.category-content-tag {
		width: 100%;
	}
	.category-content-tip {
		width: 100%;
	}
	.category-content-image {
		width: 100%;
		height: 340rpx;
	}
	.category-content-image image {
		width: 100%;
		height: 100%;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}
	.category-content-image2 {
		width: 100%;
		height: 192rpx;
	}
	.category-content-image2 image {
		width: 100%;
		height: 100%;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}
	.category-content-title {
		font-size: 28rpx;
		font-weight: 700;
		padding: 10rpx;
		margin-top: 10rpx;
	}
	.category-content-title2 {
		font-size: 26rpx;
		text-align: center;
	}
	.category-content-num {
		height: 40rpx;
		font-size: 24rpx;
		padding-left: 10rpx;
		padding-right: 10rpx;
	}
	.category-content-num-left {
		float: left;
		color: #333;
	}
	.category-content-num-right {
		float: right;
		color: #999;
	}
	.category-content-bottom {
		padding: 10rpx;
		height: 40rpx;
		margin-bottom: 10rpx;
	}
	.category-content-bottom-user {
		float: left;
	}
	.category-content-bottom-user-avata {
		float: left;
		height: 45rpx;
		width: 45rpx;
	}
	.category-content-bottom-user-avata image {
		height: 100%;
		width: 100%;
		border-radius: 50%;
	}
	.category-content-bottom-user-name {
		float: left;
		margin-left: 10rpx;
		font-size: 28rpx;
		color: #1277f1;
	}
	.category-content-bottom-price {
		float: right;
		color: #666;
		font-weight: 400;
	}
	.category-content-bottom-price-num {
		color: #000;
		font-weight: 700;
	}
}
</style>
