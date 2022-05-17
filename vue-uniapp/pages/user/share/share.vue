<template>
	<view class="container">
		<view class="top">
			<image src="../../../static/image/share-top.png"></image>
		</view>
		<view class="content">
			<view class="content-top">
				推广分享
			</view>
			<view class="cotent-body">
				<YSteps :lineNum="0" color='#fff' :infoList='stepList'></YSteps>
			</view>
		</view>
		<view class="content">
			<view class="content-top">
				推广链接
			</view>
			<view class="cotent-body">
				<view class="link-view">
					<view class="link">{{invitaLink}}</view>
					<view class="copyIcon">
						<u-icon size="18" @click="copyLink" name="../../../static/image/icon-copy-blue.png"></u-icon>
					</view>
				</view>
					
				<view class="poster">
					<view class="poster-title">
						推广海报
					</view>
					<view class="poster-items">
						<view class="poster-item" v-for="(item, index) in invitaImage" :key="index">
							<view class="poster-image" @click="previewImage(index)">
								<image :src="item" ></image>
							</view>
							<!-- <view class="poster-button">
								<u-button text="下载" type="primary"></u-button>
							</view> -->
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="content-top">
				推广记录
			</view>
			<view class="cotent-body">
				<view class="content-table">
					<uni-table border stripe emptyText="暂无更多数据" >
					    <!-- 表头行 -->
					    <uni-tr>
					        <uni-th align="center" width="100">受邀用户名称</uni-th>
					        <uni-th align="center" width="100">注册时间</uni-th>
					        <uni-th align="center" width="100">我的奖品</uni-th>
					    </uni-tr>
						<uni-tr v-for="(item, index) in invitaList">
							<uni-td>{{item.accept[0].nick}}</uni-td>
							<uni-td>{{item.time}}</uni-td>
							<uni-td>{{item.gift[0].catalog_name +'#' + item.gift[0].production_index}}</uni-td>
						</uni-tr>
					</uni-table>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	// 引入复制文件
	import uniCopy from '@/common/uni-copy.js' 
	// 步骤条
	import YSteps from '@/components/Y-Steps/Y-Steps.vue'
	export default {
		components: {
			YSteps
		},
		data() {
			return {
				baseUrl: '',
				stepList:[
					{
						info: '分享以下链接或二维码或海报（海报内包含您的推广二维码）'
					},

					{
						info: '好友点击链接或扫码注册'
					},

					{
						info: '好友注册成功，您和TA均会获得NFT头像奖励'
					},
				],
				invitaLink: '',
				invitaImage: [],
				invitaListParam: {
					page: 1
				},
				invitaList: []
			}
		},
		onReady() {
			var that = this
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					that.invitaLink = "http://116.205.243.252/h5/#/pages/login/login?tabCurrentIndex=1&uuid="+res.data.uuid
			    }
			})
			that.queryInvitaIma()
			that.queryInvitaList()
		},
		methods: {
			// 邀请图片
			queryInvitaIma(){
				var that = this
				that.$ajax.post({
					url: 'user/share',
				}).then(res => {
					var data = res.data
					if(data.code == 200){
						that.invitaImage = data.data
					} else{
						uni.showToast({
							title: "系统异常",
							icon: 'error'
						});
					}
				})
			},
			// 邀请记录
			queryInvitaList(){
				var that = this
				that.$ajax.post({
					url: 'invite/list',
					data: JSON.stringify(that.invitaListParam)
				}).then(res => {
					var data = res.data
					if(data.code == 200){
						that.invitaList = data.data
					} else{
						uni.showToast({
							title: "系统异常",
							icon: 'error'
						});
					}
				})
			},
			// 复制方法
			copyLink(){
				var that = this
				 uniCopy({
					content: that.invitaLink,
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
			// 预览图片
			previewImage(index){
				var that = this
				uni.previewImage({
					current: index,
					urls: that.invitaImage,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			}
		}
	}
</script>

<style>
	.container{
		background: #698bf6;
		padding-bottom: 80rpx;
	}
	.top{
		width: 100%;
		height: 380rpx;
	}
	.top image{
		width: 100%;
		height: 100%;
	}
	.content{
		border-radius: 10rpx;
		background: #fff;
		padding: 20rpx;
		margin: 0 3% 30rpx;
	}
	.content::after{
		content: '';
		display: block;
		clear: both;
	}
	.content-top{
		margin: 20rpx;
		font-size: 31rpx;
		font-weight: 700;
	}
	.cotent-body{
		padding-left: 20rpx;
		padding-right: 20rpx;
	}
	.link-view::after{
		content: '';
		display: block;
		clear: both;
	}
	.link{
		width: 90%;
		float: left;
		height: 40rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 40rpx;
	}
	.copyIcon{
		float: left;
		line-height: 40rpx;
	}
	.poster{
		clear: both;
		margin-top: 40rpx;
	}
	.poster-title{
		font-size: 30rpx;
		font-weight: 700;
	}
	.poster-items{
		
	}
	.poster-item{
		width: 30%;
		float: left;
		margin-top: 20rpx;
		margin-left: 20rpx;
	}
	.poster-image{
		height: 200rpx;
	}
	.poster-image image{
		width: 100%;
		height: 100%;
	}
	.poster-button{
		
	}
	.uni-table-th{
		background: #d6f1f6;
		border-color: #fff;
	}
	.content-table{
		width: 100%;
	}
</style>
