<template>
	<view class="w">
		<u-toast ref="uToast"></u-toast>
		<!-- <view class="back">
			<view class="item">
				<image src="../../static/image/br-back.png" mode=""></image>
			</view>
			<view class="item">
				<image src="../../static/image/br-home.png" mode=""></image>
			</view>
		</view> -->
		<view class="swiper-box">
			<view class="swiper-item">
				<image :src="detailData.production_images.split(',')[0]" v-if="detailData.production_images"></image>
			</view>
		</view>
		<view class="goods">
			<view class="title">
				<text class="txt">{{ detailData.production_name +"#"+ detailData.production_index}} </text>
				<!-- <image src="../../static/image/icon-goods-favorite-active.png" mode=""></image> -->
				<u-icon :name="detailData.favorite == 0 ? 'star' : 'star-fill'" @click="collect(detailData)"
					color="#2979ff" size="28"></u-icon>
			</view>
			<view class="label"><text>{{ detailData.production_name }}</text></view>
			<view class="param">
				<view class="browse">
					<text class="iconfont" style="font-size: 24rpx;margin-right: 10rpx;">&#xe624;</text>
					<text>{{ detailData.production_browse }}</text>
				</view>
				<view class="browse" @click="popShow">
					<text class="iconfont"
						style="font-size: 36rpx;margin-right: 10rpx;margin-bottom: 5rpx;">&#xe636;</text>
					<text>举报</text>
				</view>
			</view>
			<view class="from">
				<view class="item">
					<text class="name">权证地址：</text>
					<text class="cont address">{{ detailData.production_bcid }}</text>
				</view>
				<view class="item">
					<text class="name">上链时期：</text>
					<text class="cont">{{ detailData.production_time }}</text>
				</view>
				<view class="item">
					<text class="name">创作者：</text>
					<text class="cont">{{ detailData.author_name }}</text>
				</view>
				<view class="item">
					<text class="name">{{detailData.catalog_single == 1 ? "系列作品" : "单张作品" }}：</text>
					<text class="cont">{{ '#' + detailData.production_index + '/' + detailData.catalog_total }}</text>
				</view>
				<view class="item">
					<text class="name">作品ID：</text>
					<text class="cont">{{ detailData.production_uuid }}</text>
				</view>
			</view>
			<view class="user">
				<view class="item">
					<view class="left">
						<image :src="detailData.author_logo" mode=""></image>
						<view class="params">
							<view class="labels">发行方</view>
							<view class="name">{{ detailData.author_name }}</view>
						</view>
					</view>
					<view class="right" @click="goUserDetails(detailData.author_id)">
						<text>TA的主页</text>
						<text class="iconfont">&#xe702;</text>
					</view>
				</view>
				<view class="item" v-if="detailData.author_id != detailData.owner_id">
					<view class="left">
						<image :src="detailData.owner_avatar" mode=""></image>
						<view class="params">
							<view class="labels">拥有者</view>
							<view class="name">{{ detailData.owner_name }}</view>
						</view>
					</view>
					<view class="right" @click="goUserDetails(detailData.owner_id)">
						<text>TA的主页</text>
						<text class="iconfont">&#xe702;</text>
					</view>
				</view>
			</view>
			<view class="active-tit">创作者介绍</view>
			<view class="txt-cont">
				{{ detailData.author_description }}
			</view>
		</view>
		<view class="describe">
			<view class="active-tit">作品描述</view>
			<view class="txt-cont">
				{{ detailData.production_description }}
			</view>
		</view>
		<view class="describe">
			<view class="active-tit">作品副本</view>
			<view class="txt-cont">购买后将为您生成无水印原图及标记有持有者昵称的专属头像，您可根据需求选择下载，并用于社交账号的头像（如微信、抖音、微博等头像）</view>
			<view class="bookshelf">
				<scroll-view scroll-x="true" class="bookshelf-content">
					<block v-for="(item, index) in detailData.goodsImages" :key="index" style="display: flex;">
						<view class="item" @click="previewImage(index)">
							<view class="img">
								<image :src="item" mode="scaleToFill"></image>
							</view>
							<view class="goods_tit2">专属水印图</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
		<view class="describe">
			<view class="active-tit">历史记录</view>
			<view class="info" v-for="(item, index) in historyList" v-if="historyList.length != 0">
				<view class="left">
					<image :src="item.owner_avatar" mode=""></image>
					<view class="params">
						<view class="name">{{item.owner_name}}</view>
						<view class="price">
							<text class="txt">{{item.order_type | formatType}}</text>
							<text class="num">￥{{item.order_price}}</text>
						</view>
					</view>
				</view>
				<view class="right">
					<view class="lin-details" @click="chainShow">上链详情</view>
					<view class="time">{{ item.order_time }}</view>
				</view>
			</view>
			<u-empty
			        mode="history"
			        icon="http://cdn.uviewui.com/uview/empty/history.png"
					:show="historyList.length == 0"
			>
			</u-empty>
			
			<view class="explain">
				<view class="explain-tit">什么是数字藏品</view>
				<view class="explain-cont">
					本平台所承载的数字藏品是使用区块链技术进行唯一标识的经数字化的特定藏品。每个数字藏品都具有不可拆分、不可替代、独一无二的特点，其保真性、稀缺性具有一定的收藏价值。所有发行方/创作者、作品信息和交易记录都完整、永久记录在区块链上，任何人无法随意篡改。
				</view>
				<view class="explain-tit">特别提示</view>
				<view class="explain-cont">
					1.
					数字藏品为虚拟数字商品，而非实物，仅限实名认证为年满14周岁的中国大陆用户购买。数字藏品的版权由发行方或原作创作者拥有，除另行取得版权权利人书面同意外，您不得将数字藏品用于任何商业用途；
				</view>
			</view>
		</view>
		<!-- 链上详情 -->
		<uni-popup ref="chain" type="center">
			<view class="chain">
				<view class="tit">区块链存证证明</view>
				<text class="iconfont del" @click="chainDel()">&#xe604;</text>
				<view class="item">
					<view class="name">作品名称：</view>
					<view class="value">耀眼兔</view>
				</view>
				<view class="item">
					<view class="name">发行方：</view>
					<view class="value">SAFSFDSE</view>
				</view>
				<view class="item">
					<view class="name">作品ID：</view>
					<view class="value">C11144</view>
				</view>
				<view class="item">
					<view class="name">拥有者：</view>
					<view class="value">JIHHG</view>
				</view>
				<view class="item">
					<view class="name">交易地址：</view>
					<view class="value">0x3ca2c3c01dc97960adb48210d27ca771671f6cc06dff25eef358b10a0f92fc0e</view>
				</view>
				<view class="item">
					<view class="name">交易状态：</view>
					<view class="value">成功</view>
				</view>
				<view class="item">
					<view class="name">存证时间：</view>
					<view class="value">{{ '1648546838' | formatDate }}</view>
				</view>
				<view class="item">
					<view class="name">作品描述：</view>
					<view class="value">拥有高等智商的兔子是什么样的？与普通兔子不同，炫眼兔拥有一双彩虹般的双...</view>
				</view>
			</view>
		</uni-popup>
		<!-- 举报弹窗 -->
		<uni-popup ref="popup" type="center">
			<view class="popup_view">
				<view class="tit">举报</view>
				<text class="iconfont del" @click="popDel">&#xe604;</text>
				<view class="pop-tit" style="margin-top: 0;">
					<text class="txt">*</text>
					<text class="tit">举报类型</text>
				</view>
				<!-- <view class="pop-label" v-model="requestParam.type" >
					<view class="name" @click="changeType(item)">{{ item }}</view>
				</view> -->
				<view class="button-view">
					<u-button :type="requestParam.type == item ? 'primary' : 'defaul'" @click="changeType(item)" size="small" class="custom-button" v-for="(item, index) in typeList" :key="index" :text="item"></u-button>
				</view>
				
				<view class="pop-tit">
					<text class="txt">*</text>
					<text class="tit">举报内容</text>
				</view>
				<textarea value="" v-model="requestParam.note" placeholder="请输入你要举报的内容" />
				<view class="pop-tit"><text class="tit">{{`附件(${fileNum}/6)`}}</text></view>
				<u-upload
					:fileList="fileList"
					@afterRead="afterRead"
					@delete="deletePic"
					name="file"
					:previewFullImage="true"
					multiple
					:maxCount="6"
				></u-upload>
				<!-- <view class="add"><text class="iconfont">&#xe652;</text></view> -->
				<view class="pop-tit">
					<text class="txt">*</text>
					<text class="tit">联系方式</text>
				</view>
				<textarea value="" v-model="requestParam.contact" placeholder="请留下你的联系方式(如手机,微信邮箱等),方便通知你处理结果" />
				<view class="btn" @click="submit">提交</view>
			</view>
		</uni-popup>
		<!-- 求赠送弹窗 -->
		<uni-popup ref="give" type="center">
			<view class="popup_view">
				<view class="tit">求赠送</view>
				<text class="iconfont del" @click="giveDel">&#xe604;</text>
				<view class="pop-tit">
					<text class="txt">*</text>
					<text class="tit">求赠留言</text>
				</view>
				<textarea value="" placeholder="您的作品我非常喜欢,希望能和您交流一下~" />
				<view class="pop-tit">
					<text class="txt">*</text>
					<text class="tit">联系方式</text>
				</view>
				<textarea value="" placeholder="请留下你的联系方式(如手机,微信邮箱等),方便通知你处理结果" />
				<view class="tips">
					温馨提示：以上内容将以站内信的方式发送给作品拥有者，本平台暂未提供互动功能。
				</view>
				<view class="btn">提交</view>
			</view>
		</uni-popup>
		<!-- <view class="footer" @click="giveShow"><view class="btn">求赠送(0次)</view></view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				typeList: ['侵权类', '政治类', '涩情类', '暴恐类', '血腥类', '其它'],
				requestParam: {
					pid: '',
					type: '',
					note: '',
					contact: '',
					images: ''
				},
				detailData: {},
				historyList: [],
				fileNum: 0,
				fileList: [],
				fileUrlList: []
			}
		},
		filters: {
			addressHide(e) {
				let str = e.substring(0, 4) + '....' + e.substring(38)
				return str
			},
			formatDate(value) {
				// 十位数时间戳
				let date = new Date(parseInt(value) * 1000)
				let y = date.getFullYear()
				let m = date.getMonth() + 1
				m = m < 10 ? '0' + m : m
				let d = date.getDate()
				d = d < 10 ? '0' + d : d
				let h = date.getHours()
				h = h < 10 ? '0' + h : h
				let minute = date.getMinutes()
				let second = date.getSeconds()
				minute = minute < 10 ? '0' + minute : minute
				second = second < 10 ? '0' + second : second
				return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
			},
			formatType(value){
				switch(value){
					case 0 : return "购买"
						break;
					case 1 : return "赠送"
						break;
					case 2 : return "空投"
						break;
					case 3 : return "奖励"
						break;
				}
			}
		},

		onLoad(param) {
			console.log(param)
			let that = this
			that.requestParam.pid = param.pid
			that.getData()
			that.getGoodsViews()
			that.getGoodsHistory()
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					that.userInfo = res.data
			    }
			})
		},
		methods: {
			// 获取数据
			getData() {
				this.$ajax
					.post({
						url: 'production/fetch',
						data: JSON.stringify(this.requestParam)
					})
					.then(res => {
						var data = res.data
						if (data.code == 200) {
							this.detailData = res.data.data
							if(this.detailData.production_images){
								if(this.detailData.production_images.split(",").length > 0){
									this.detailData.goodsImages = this.detailData.production_images.split(",")
								}else{
									this.detailData.goodsImages.push(this.detailData.production_images)
								}
							}
						}
					})
					.catch(err => {
						uni.showToast({
							title: "系统错误",
							icon: 'error'
						});
					})
			},
			// 添加商品浏览量
			getGoodsViews() {
				this.$ajax
					.post({
						url: 'production/browse',
						data: JSON.stringify({
							pid: this.requestParam.pid
						})
					})
					.then(res => {
						var data = res.data
						if (data.code == 200) {
							
						}
					})
					.catch(err => {
						console.log(err, 'err')
					})
			},
			// 收藏
			collect(item) {
				var params = {
					pid: this.requestParam.pid,
					action: item.favorite == 0 ? 1 : 0
				}
				this.$ajax
					.post({
						url: 'favorite/production',
						data: JSON.stringify(params)
					})
					.then(res => {
						var data = res.data
						if (data.code == 200) {
							this.getData()
						}
					})
					.catch(err => {
						console.log(err, 'err')
					})
			},
			// 获取商品流转记录
			getGoodsHistory() {
				var that = this
				this.$ajax
					.post({
						url: 'order/history',
						data: JSON.stringify({
							pid: this.requestParam.pid
						})
					})
					.then(res => {
						let data = res.data
						if (data.code == 200) {
							that.historyList = data.data
						}
					})
					.catch(err => {
						console.log(err, 'err')
					})
			},
			// 举报类型选择
			changeType(type) {
				console.log(type)
				this.requestParam.type = type
			},
			// 举报上传文件时删除图片
			deletePic(event) {
				this.fileList.splice(event.index, 1)
			},
			// 上传图片之前触发
			async afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this.fileList.length
				lists.map((item) => {
					this.fileList.push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					this.fileUrlList.push(result)
					let item = this.fileList[fileListLen]
					this.fileList.splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
				this.fileNum = fileListLen
			},
			uploadFilePromise(url) {
				var that = this
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: '/api/upload/local', 
						filePath: url,
						name: 'file',
						formData: {
							uuid: that.userInfo.uuid,
							token: that.userInfo.token
						},
						success: (res) => {
							var data = JSON.parse(res.data);
							setTimeout(() => {
								resolve(data.data[0])
							}, 1000)
						}
					});
				})
			},
			// 举报
			submit() {
				let that = this
				if(that.requestParam.type == null || that.requestParam.type == ""){
					uni.showToast({
						title: '请选择举报类型',
						icon: 'error'
					});
					return
				}
				
				if(that.requestParam.note == null || that.requestParam.note == ""){
					uni.showToast({
						title: '请输入举报内容',
						icon: 'error'
					});
					return
				}
				
				if(that.requestParam.contact == null || that.requestParam.contact == ""){
					uni.showToast({
						title: '请输入联系方式',
						icon: 'error'
					});
					return
				}
				
				if(that.fileList.length > 0){
					that.requestParam.images = that.fileUrlList.toString()
				}
				
				that.$ajax
					.post({
						url: 'production/indictment',
						data: JSON.stringify(that.requestParam)
					})
					.then(res => {
						var data = res.data
						if (data.code == 200) {
							that.$refs.uToast.show({
								type: 'success',
								message: "举报成功",
								complete() {
									that.requestParam.type = ''
									that.requestParam.note = ''
									that.requestParam.contact = ''
									that.requestParam.images = ''
									that.fileNum = 0
									that.fileList = []
									that.popDel()
								}
							})
						}
					}).catch(err => {
						that.$refs.uToast.show({
							type: 'error',
							message: "系统错误"
						})
					})
			},
			// 跳转用户详情
			goUserDetails(uid) {
				uni.navigateTo({
					url: '/pages/user/user_detail/user_detail?id=' + uid
				})
			},
			// 查看图片
			previewImage(index) {
				let imageList = []
				this.works.map((item, index) => {
					imageList.push(item.image)
				})
				uni.previewImage({
					current: imageList[index],
					urls: imageList,
					indicator: 'number',
					loop: true
				})
			},
			// 球赠送弹窗显示
			giveShow() {
				this.$refs.give.open()
			},
			// 线上详情弹窗删除按钮
			giveDel() {
				this.$refs.give.close()
			},
			// 链上详情弹窗显示
			chainShow() {
				this.$refs.chain.open()
			},
			// 线上详情弹窗删除按钮
			chainDel() {
				this.$refs.chain.close()
			},
			// 举报弹窗显示
			popShow() {
				this.$refs.popup.open()
			},
			// 举报弹窗删除按钮
			popDel() {
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss">
	* {
		box-sizing: border-box !important;
	}

	.w {
		padding-bottom: 0rpx;
	}

	.chain {
		width: 650rpx;
		min-height: 1100rpx;
		border-radius: 30rpx;
		background-image: url(../../static/bg-cert.png);
		background-size: 100% 100%;
		padding: 210rpx 100rpx;
		position: relative;

		.tit {
			width: 100%;
			font-weight: bold;
			text-align: center;
			margin-bottom: 20rpx;
		}

		.del {
			font-size: 34rpx;
			font-weight: bold;
			position: absolute;
			top: 30rpx;
			right: 24rpx;
		}

		.item {
			display: flex;
			line-height: 50rpx;

			.name,
			.value {
				font-size: 24rpx;
			}

			.name {
				width: 140rpx;
				text-align: right;
			}

			.value {
				webkit-box-flex: 1;
				flex: 1;
				-webkit-line-clamp: 3;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				word-break: break-all;
			}
		}
	}

	.popup_view {
		width: 650rpx;
		border-radius: 30rpx;
		background-color: #ffffff;
		padding: 40rpx 24rpx;
		position: relative;

		.tips {
			font-size: 24rpx;
			line-height: 45rpx;
			color: #ff8231;
			padding: 3% 0;
		}

		.tit {
			width: 100%;
			font-weight: bold;
			text-align: center;
		}

		.del {
			font-size: 34rpx;
			font-weight: bold;
			position: absolute;
			top: 30rpx;
			right: 24rpx;
		}

		.pop-tit {
			// display: flex;
			// align-items: flex-start;
			margin-top: 30rpx;

			.txt {
				color: #ee0a24;
				font-size: 24rpx;
			}

			.tit {
				font-size: 28rpx;
			}
		}

		.pop-label {
			width: 100%;
			display: flex;
			align-items: center;
			flex-wrap: wrap;

			.name {
				align-items: center;
				padding: 5rpx 10rpx;
				font-size: 24rpx;
				margin-right: 15rpx;
				border: 1px solid #ebedf0;
				margin-bottom: 15rpx;
			}
		}
		
		.button-view{
			button{
				float: left;
				width: 130rpx;
				margin-top: 10rpx;
				margin-left: 20rpx;
			}
			.custom-button{
				border: 2rpx solid #ebedf0;
			}
		}
		.button-view::after{
			content: '';
			display: block;
			clear: both;
		}

		textarea {
			width: 100%;
			font-size: 28rpx;
			border-radius: 20rpx;
			height: 200rpx;
			background-color: #f7f7f7;
			padding: 3%;
		}

		.add {
			margin-top: 30rpx;
			width: 160rpx;
			height: 160rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 20rpx;
			background-color: #f7f8fa;

			text {
				font-size: 40rpx;
				color: #dcdee0 !important;
			}
		}

		.btn {
			width: 100%;
			line-height: 88rpx;
			text-align: center;
			font-size: 30rpx;
			color: #ffffff;
			border-radius: 20rpx;
			background-color: #1989fa;
			margin-top: 40rpx;
		}
	}

	.active-tit {
		border-left: #0066ee 10rpx solid;
		padding-left: 24rpx;
		font-size: 34rpx;
		font-weight: bold;
		margin: 40rpx 0;
	}

	.txt-cont {
		font-size: 26rpx;
	}

	.explain {
		background-color: #f6f6f6;
		padding: 0 24rpx 30rpx 24rpx;
		margin-top: 40rpx;
		margin-bottom: 80rpx;
		border-radius: 20rpx;

		.explain-tit {
			padding: 40rpx 0;
			font-size: 28rpx;
			font-weight: bold;
		}

		.explain-cont {
			font-size: 26rpx;
			color: #999;
		}
	}

	.footer {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		padding: 3%;
		background-color: #ffffff;
		z-index: 99;

		.btn {
			width: 100%;
			line-height: 80rpx;
			border-radius: 60rpx;
			text-align: center;
			background-color: #1277f1;
			color: #ffffff;
		}
	}

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

	.describe /deep/ .uni-scroll-view-content {
		display: flex !important;
	}

	.describe {
		padding: 3%;
		background-color: #ffffff;
		margin-top: 15rpx;

		.info {
			padding: 20rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #e6e6e6;

			.left {
				display: flex;
				align-items: center;

				image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 15rpx;
				}

				.params {
					.name {
						color: #000;
						font-size: 34rpx;
						font-weight: 700;
					}

					.price {
						display: flex;
						align-items: center;
						font-size: 28rpx;

						.txt {
							color: #666;
						}

						.num {
							color: #ff2347;
						}
					}
				}
			}

			.right {
				font-size: 28rpx;

				.lin-details {
					text-align: right;
					color: #1277f1;
				}

				.time {
					font-size: 24rpx;
					color: rgb(153, 153, 153);
				}
			}
		}

		.bookshelf {
			::-webkit-scrollbar {
				display: none;
			}

			.bookshelf-content {
				white-space: nowrap; // 滚动必须加的属性
				width: 100%;
				padding: 20upx;
				margin: 0 auto;
				box-sizing: border-box;
				background-color: #ffffff;
				display: flex;

				.item {
					width: 234rpx;
					height: 220rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					margin-right: 20rpx;

					.img {
						width: 220rpx;
						height: 234rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.goods_tit2 {
						text-align: center;
						font-size: 30rpx;
					}
				}
			}
		}
	}

	.swiper-box {
		width: 100%;
		height: 780rpx;

		.swiper-item {
			width: 100%;
			height: 780rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.goods {
		padding: 30rpx 24rpx;
		background-color: #ffffff;

		.label {
			color: #999;
			font-size: 26rpx;
			margin-top: 20rpx;
		}

		.title {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.txt {
				font-size: 37rpx;
				font-weight: 700;
			}

			image {
				width: 45rpx;
				height: 45rpx;
			}
		}

		.param {
			margin-top: 20rpx;
			display: flex;
			align-items: center;

			.browse {
				display: flex;
				align-items: center;
				margin-right: 40rpx;

				text {
					font-size: 26rpx;
					color: #999;
				}
			}
		}

		.from {
			background-color: #f7f7f7;
			border-radius: 20rpx;
			padding: 20rpx;
			margin-top: 20rpx;

			.item {
				display: flex;
				align-items: center;
				font-size: var(--fsize-28);
				line-height: 60rpx;

				.name {
					color: #999;
					min-width: 70px;
				}

				.address {
					color: #1277f1;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}

		.user {
			padding: 3% 0;

			.item {
				padding: 20rpx 0;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #e6e6e6;

				.left {
					display: flex;
					align-items: center;

					image {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						margin-right: 15rpx;
					}

					.params {
						.labels {
							background-color: rgb(230, 230, 230);
							color: rgb(102, 102, 102);
							font-size: 24rpx;
							border-radius: 10rpx;
							padding: 5rpx 0rpx;
							text-align: center;
							margin-bottom: 15rpx;
						}

						.name {
							color: #000;
							font-size: 34rpx;
							font-weight: 700;
						}
					}
				}

				.right {
					display: flex;
					align-items: center;
					color: #999;

					.iconfont {
						color: #999;
						font-size: 24rpx;
						margin-left: 15rpx;
					}
				}
			}
		}
	}
</style>
