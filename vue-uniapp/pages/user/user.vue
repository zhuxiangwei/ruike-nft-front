<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">  
			<view class="top_view"></view>  
		</view>  
		<!-- #endif --> 
		<view class="bg-view">
			<view class="avatar-view">
				<image v-if="userinfo != null && userinfo.avatar != null && userinfo.avatar != ''" 
					:src="userinfo.avatar">
				</image>
				<image v-else src="../../static/image/icon-user-big.png"></image>
			</view>
			<view class="info-view">
				<view class="nickname-view" @tap="goLogin()" v-if="userinfo == null">
					登录
				</view>
				<view class="nickname-view" v-else>
					<view class="nickname">
						<view class="nickname-text"><text @tap="goLogin()">{{userinfo.nick}}</text></view>
						<view class="nickname-icon" @tap="goSeting()"><u-icon name="setting-fill" size="24" color="#fff" labelColor="#fff" label="设置" labelSize="13"></u-icon></view>
					</view>
					<view class="ID-view">
						<view class="ID">ID: {{userinfo.uuid}}</view>
						<view class="copyIcon">
							<u-icon size="18" @click="copyLink(0)" name="../../static/image/icon-copy-blue.png"></u-icon>
						</view>
					</view>
					<view class="address-view">
						<view class="address">身份地址: {{userinfo.bcid}}</view>
						<view class="copyIcon">
							<u-icon size="18" @click="copyLink(1)" name="../../static/image/icon-copy-blue.png"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="item-big-view">
			<view class="item-view" @tap="goMyWorks()">
				<view class="item-view-left">
					<image src="/static/image/icon-goods.png"></image>
					<text>我的作品</text>
				</view>
				<view class="item-view-right">
					>
				</view>
			</view>
			<view class="item-view" @tap="goMyOrder()">
				<view class="item-view-left">
					<image src="/static/image/icon-order.png"></image>
					<text>订单</text>
				</view>
				<view class="item-view-right">
					>
				</view>
			</view>
			<view class="item-view" @tap="goUserCollect()">
				<view class="item-view-left">
					<image src="/static/image/icon-favorite.png"></image>
					<text>收藏</text>
				</view>
				<view class="item-view-right">
					>
				</view>
			</view>
			<!-- <view class="item-view" @tap="goAskGitHistory()">
				<view class="item-view-left">
					<image src="../../static/image/icon-want.png"></image>
					<text>历史求赠记录</text>
				</view>
				<view class="item-view-right">
					>
				</view>
			</view> -->
			<view class="item-view" @tap="goShare()">
				<view class="item-view-left">
					<image src="../../static/image/icon-share.png"></image>
					<text>分享</text>
				</view>
				<view class="item-view-right">
					>
				</view>
			</view>
			<view class="item-view" @tap="goMessage()">
				<view class="item-view-left">
					<image src="../../static/image/icon-message.png"></image>
					<text>消息</text>
				</view>
				<view class="item-view-right">
					>
				</view>
			</view>
			<view class="item-view" @tap="clickHelp()">
				<view class="item-view-left">
					<image src="../../static/image/icon-contact-tel.png"></image>
					<text>帮助</text>
				</view>
				<view class="item-view-right">
					>
				</view>
			</view>
			<view class="item-view" @tap="goApply()">
				<view class="item-view-left">
					<image src="../../static/image/icon-apply.png"></image>
					<text>申请入驻</text>
				</view>
				<view class="item-view-right">
					>
				</view>
			</view>
			<!-- 帮助弹窗 -->
			<view >
				<u-modal 
					:show="showHelpModal" 
					:title="modalTitle" 
					:content='modalContent' 
					confirmText="立即拨打"
					:showCancelButton='showModalCancelBtn'
					@confirm="helpModalConfirm"
					@cancel="showHelpModal=false"
				>
					<view class="slot-content">
						<view class="modal-content-phone">12306</view>
						<view class="modal-content-desc">线上客服即将上线，目前可联系电话客服</view>
						<!-- <rich-text :nodes="modalContent"></rich-text> -->
					</view>
				</u-modal>
			</view>
		</view>
	</view>
</template>

<script>
	// 引入复制文件
	import uniCopy from '@/common/uni-copy.js'
	export default {
		data() {
			return {
				showHelpModal: false,
				showModalCancelBtn: true,
				modalTitle: '客服电话',
				modalContent: '<div class="modalContentPhone">12345</div>`空山新雨后<br>天气晚来秋`', // 帮助弹窗内容
				baseUrl: '',
				userinfo: null,
				vipInfo: null,
				player: null
			}
		},
		onShow: function(options){
			var that = this
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					that.userinfo = res.data
			    }
			});
		},
		methods: {
			// 跳转设置页面
			goSeting: function(){
				uni.navigateTo({
				    url: '../userset/userset'
				});
			},
			// 跳转登录页面
			goLogin: function(){
				uni.navigateTo({
				    url: '../login/login'
				});
			},
			// 跳转求赠历史页面
			goAskGitHistory: function(){
				//在起始页面跳转到test.vue页面并传递参数
				uni.navigateTo({
				    url: './askGitHistory/askGitHistory'
				});
			},
			// 跳转分享页面
			goShare: function(){
				uni.navigateTo({
				    url: './share/share'
				});
			},
			// 跳转分享页面
			goShare: function(){
				uni.navigateTo({
				    url: './share/share'
				});
			},
			// 跳转分享页面
			goMessage: function(){
				uni.navigateTo({
				    url: './message/message'
				});
			},
			// 跳转申请入驻页面
			goApply: function(){
				uni.navigateTo({
				    url: './apply/apply'
				});
			},
			// 帮助选项点击事件
			clickHelp: function(){
				this.showHelpModal = true
			},
			// 帮助弹窗点击事件
			helpModalConfirm: function(){
				this.showHelpModal = false
			},
			// 跳转我的作品
			goMyWorks: function(){
				uni.navigateTo({
				    url: '/pages/user/myworks/myworks'
				});
			},
			// 跳转我的订单
			goMyOrder: function(){
				uni.navigateTo({
				    url: '/pages/user/myorders/myorders'
				});
			},
			// 跳转我的收藏
			goUserCollect: function(){
				uni.navigateTo({
				    url: '/pages/user/user_collect/user_collect'
				});
			},
			// 复制方法
			copyLink(type){
				var that = this
				 uniCopy({
					content: type == 0 ? that.userinfo.uuid : that.userinfo.bcid,
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
			
			structure: function(str){
				var arrBox = [...str]
				var s = ''
				arrBox.map((res, index) => {
					if(index > 3 && index < 8){
						s += '.'
					}else{
						s += res
					}
				});
				return s;
			}
		}
	}
</script>

<style>
	page{
		background: #F4F4F4;
	}
	.status_bar {
	    height: var(--status-bar-height);  
	    width: 100%;  
	    background-color: #F8F8F8;  
	}  
	.top_view {  
	    height: var(--status-bar-height);  
	    width: 100%;  
	    position: fixed;  
	    background-color: #F8F8F8;  
	    top: 0;  
	    z-index: 999;  
	} 
	
	.bg-view{
		margin: auto;
		width: 100%;
		padding-left: 20rpx;
		height: 20vh;
		background: url(../../static/image/bg-me.png) no-repeat 50%;
		background-size: cover;
		color: #fff;
	}
	.avatar-view{
		float: left;
		width: 150rpx;
		height: 150rpx;
		margin-top: 40rpx;
	}
	.avatar-view image{
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	.info-view{
		width: calc(100% - 200rpx);
		margin-left: 30rpx;
		margin-top: 40rpx;
		height: 150rpx;
		float: left;
		color: #FFFFFF;
	}
	.nickname-view{
		font-size: 28rpx;
	}
	.nickname{
		font-size: 36rpx;
		font-weight: 700;
	}
	.nickname::after{
		content: '';
		display: block;
		clear: both;
	}
	.nickname-text{
		float: left;
	}
	.nickname-icon{
		position: absolute;
		right: 20rpx;
	}
	.ID-view{
		margin-top: 10rpx;
		font-size: 26rpx;
	}
	.ID-view::after{
		content: '';
		display: block;
		clear: both;
	}
	.ID{
		width: 60%;
		float: left;
		height: 40rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 40rpx;
	}
	.copyIcon{
		float: left;
		margin-left: 10rpx;
		line-height: 40rpx;
	}
	.address-view{
		margin-top: 10rpx;
		font-size: 26rpx;
	}
	.address-view::after{
		content: '';
		display: block;
		clear: both;
	}
	.address{
		width: 80%;
		float: left;
		height: 40rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		line-height: 40rpx;
	}
	
	.bg-view-bottom{
		width: 90%;
		height: 70rpx;
		margin: auto;
		border-radius: 40rpx;
		margin-top: 40rpx;
		background-color:rgba(0,0,0,0.4);
		color: #FFFFFF;
		font-size: 26rpx;
	}
	.bg-view-bottom-left{
		height: 70rpx;
		width: 50%;
		float: left;
		padding-left: 30rpx;
		line-height: 70rpx;
	}
	.bg-view-bottom-left image{
		position: relative;
		width: 32rpx;
		height: 32rpx;
		top: 5rpx;
	}
	.bg-view-bottom-left text{
		margin-left: 20rpx;
	}
	.bg-view-bottom-right{
		float: right;
		padding-right: 30rpx;
		width: 40%;
		text-align: right;
		line-height: 70rpx;
	}
	
	.item-big-view{
		background: #FFFFFF;
		/* height: 270rpx; */
		width:100%;
		border-radius: .3rem .3rem 0 0;
		margin-top: -.3rem;
	}
	.item-view{
		font-weight: 700;
		height: 100rpx;
		border-bottom: solid 1rpx #F1F1F1;
	}
	.item-view-left{
		width: 50%;
		height: 100rpx;
		float: left;
		line-height: 100rpx;
		font-size: 30rpx;
	}
	.item-view image{
		margin-left: 25rpx;
		margin-top: 25rpx;
		height: 50rpx;
		width: 50rpx;
	}
	.item-view text{
		position: relative;
		margin-left: 20rpx;
		top: -14rpx;
	}
	.item-view-right{
		height: 100rpx;
		line-height: 100rpx;
		float: right;
		text-align: right;
		width: 20%;
		color: #CCCCCC;
		margin-right: 20rpx;
	}
	.modal-content-phone{
		text-align: center;
		font-size: 36rpx;
		font-weight: 700;
		color: #000;
	}
	.modal-content-desc{
		margin-top: 40rpx;
		text-align: center;
		font-size: 28rpx;
		color: #999999;
	}
</style>
