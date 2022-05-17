<template>
	<view class="container">
		<view class="notice">
			<uni-notice-bar text="请认真填写下方申请信息，提交后工作人员会第一时间与您联系！"></uni-notice-bar>
		</view>

		<view class="form">
			<u--form labelPosition="left" :model="model" :rules="rules" labelWidth="30%" ref="form">
				<u-form-item label="入驻类型" prop="userInfo.type" borderBottom :required="true" ref="item1">
					<u-radio-group v-model="model.userInfo.type" placement="row" @change="groupChange">
						<u-radio :customStyle="{marginLeft: '30rpx'}" v-for="(item, index) in radioTypelist"
							:key="index" :label="item.name" :name="item.id">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item :label="model.userInfo.type == 0 ? '姓名' : '公司名称'" prop="userInfo.name" borderBottom
					:required="true" ref="item1">
					<u--input v-model="model.userInfo.name" :placeholder="`请输入${model.userInfo.type == 0 ? '姓名' : '公司名称'}`" border="none"></u--input>
				</u-form-item>
				<u-form-item v-if="model.userInfo.type == 1" label="联系人" prop="userInfo.contact" borderBottom
					:required="true" ref="item1">
					<u--input v-model="model.userInfo.contact" placeholder="请输入联系人" border="none"></u--input>
				</u-form-item>
				<u-form-item label="手机号" prop="userInfo.phone" borderBottom :required="true" ref="item1">
					<u--input v-model="model.userInfo.phone" placeholder="请输入手机号" border="none"></u--input>
				</u-form-item>
				<u-form-item label="微信号" prop="userInfo.wechat" borderBottom :required="true" ref="item1">
					<u--input v-model="model.userInfo.wechat" placeholder="请输入微信号" border="none"></u--input>
				</u-form-item>
				<u-form-item label="擅长方向" prop="userInfo.skill" borderBottom ref="item1">
					<u-checkbox-group v-model="model.userInfo.skill" placement="column"  @change="skillChange">
						<u-checkbox :customStyle="{marginBottom: '8px'}" v-for="(item, index) in checkboxList"
							:key="index" :label="item.name" :name="item.name">
						</u-checkbox>
					</u-checkbox-group>
				</u-form-item>
				<u-form-item :label="`作品示例(${fileNum}/6)`" :required="true" ref="item1">
 
				</u-form-item>
				<uni-notice-bar background-color="#fff" color="#999" text="请上传拥有全部版权的作品示例，以便我们更高效的与您沟通联系">
				</uni-notice-bar>
				<u-form-item label="" borderBottom ref="item1">
					<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="file"
						:previewFullImage="true" multiple :maxCount="6"></u-upload>
				</u-form-item>


				<u-form-item label="留言" ref="item1">
					
				</u-form-item>
				<u-form-item  prop="userInfo.note" borderBottom ref="item1">
					<u--textarea v-model="model.userInfo.note" placeholder="请输入留言内容"></u--textarea>
				</u-form-item>

			</u--form>
			<button type="primary" @click="submitForm">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseUrl: '',
				userInfo: '',
				fileNum: 0,
				model: {
					userInfo: {
						type: 0,
						name: '',
						contact: '',
						phone: '',
						wechat: '',
						skill: [],
						note: '',
						images: '',
					},
				},
				checkboxValue: 0,
				checkboxList: [],
				radioTypelist: [{
						id: 0,
						name: '个人',
						disabled: false
					},
					{
						id: 1,
						name: '公司',
						disabled: false
					}
				],
				fileList: [],
				fileUrlList: [],
				rules: {
					'userInfo.type': {
						type: 'number',
						required: true,
						message: '请选择入驻类型',
						trigger: ['blur', 'change']
					},
					'userInfo.name': {
						type: 'string',
						required: true,
						message: '请填写姓名(公司名称)',
						trigger: ['blur', 'change']
					},
					'userInfo.contact': {
						type: 'string',
						required: true,
						message: '请填写联系人',
						trigger: ['blur', 'change']
					},
					'userInfo.phone': {
						type: 'number',
						required: true,
						message: '请填写手机号',
						trigger: ['blur', 'change']
					},
					'userInfo.wechat': {
						type: 'string',
						required: true,
						message: '请填写微信号',
						trigger: ['blur', 'change']
					},
				},
				radio: '',
			}
		},
		mounted() {

		},
		onReady() {
			var that = this
			uni.getStorage({
				key: 'baseUrl',
				success: function(res) {
					that.baseUrl = res.data
				}
			})
			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
					that.userInfo = res.data
				}
			})
			this.getSkillData()
		},
		methods: {
			getSkillData(n) {
				let that = this
				that.$ajax.post({
					url: 'author/skill',
				}).then(res => {
					let data = res.data
					if (data.code == 200) {
						for(let i = 0; i < data.data.length; i++){
							let item = {name: data.data[i]}
							that.checkboxList.push(item)
						}
					} else {
						uni.showToast({
							title: res.message,
							icon: 'error'
						});
					}
				})
			},
			groupChange(n) {
				/* if(n == 0){
					//this.rules.userInfo.name.message = "请填写姓名"
				}else{
					//this.rules.name.message = "请填写公司名称"
				} */
			},
			skillChange(n) {
				console.log('change', n);
			},
			// 删除图片
			deletePic(event) {
				this.fileList.splice(event.index, 1)
			},
			// 新增图片
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
						url: '/api/upload/local', // 仅为示例，非真实的接口地址
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
			submitForm() {
				var that = this
				that.$refs.form.validate().then(res => {
					uni.$u.toast('校验通过')
					if (that.fileList.length == 0) {
						uni.showToast({
							title: '请上传作品实例',
							icon: 'error'
						});
						return
					}
					that.model.userInfo.skill = that.model.userInfo.skill.toString()
					that.model.userInfo.images = that.fileUrlList.toString()

					that.$ajax.post({
						url: 'author/request',
						data: JSON.stringify(that.model.userInfo)
					}).then(res => {
						var data = res.data
						if (data.code == 200) {
							uni.showModal({
								title: '提示',
								content: '申请成功，请等待审核',
								complete: function(res) {
									uni.switchTab({
										url: '/pages/user/user'
									});
								}
							});
						} else {
							uni.showToast({
								title: res.message,
								icon: 'error'
							});
						}
					})

				}).catch(errors => {
					uni.showToast({
						title: '请按要求填写相关信息',
						icon: 'error'
					});
					return
				})

			}
		}
	}
</script>

<style>
	.container {
		background: #fff;
	}

	.form {
		padding: 0 5%;
	}
</style>
