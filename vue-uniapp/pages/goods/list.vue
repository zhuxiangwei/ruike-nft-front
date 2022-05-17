<template>
  <view class="w">
    <z-paging
      ref="paging"
      v-model="list"
      default-page-no="1"
      loading-more-no-more-text="我也是有底线的！"
      @query="queryList"
    >
      <!-- <view class="back">
        <view class="item"
          ><image src="../../static/image/br-back.png" mode=""></image
        ></view>
        <view class="item"
          ><image src="../../static/image/br-home.png" mode=""></image
        ></view>
      </view> -->
      <view class="top">
        <view class="searchView">
          <view
            ><uni-easyinput
              class="searchInput"
              v-model="param.keyword"
              @confirm="search"
              @iconClick="search"
              prefixIcon="search"
              placeholder="请输入作品名称"
          /></view>
        </view>
        <view class="head">
          <view class="item" @click="navClcik(0)">
            <text class="select">编号{{ state ? '↑' : '↓' }}</text>
          </view>
          <view class="item" @click="navClcik(1)">
            <text :class="navIndex == 1 ? 'select' : ''">在售</text>
            <view class="border" v-if="navIndex == 1"></view>
          </view>
          <view class="item" @click="navClcik(2)">
            <text :class="navIndex == 2 ? 'select' : ''">已售</text>
            <view class="border" v-if="navIndex == 2"></view>
          </view>
        </view>
      </view>
      <view class="title">
        <text class="name">{{ productName }}</text>
        <text class="txt">系列作品 在售情况：{{ sellNumber }}</text>
      </view>
      <view class="goods">
        <!-- 设置自己的emptyView组件，非必须。空数据时会自动展示空数据组件，不需要自己处理 -->
        <empty-view slot="empty"></empty-view>
        <view class="item" v-for="(item, index) in list" :key="index">
          <image
            :src="item.production_images.split(',')[0]"
            mode=""
            class="goods-img"
			v-if="item.production_images"
            @click="details(item)"
          ></image>
          <view class="param">
            <view class="tit">
              <view class="tit-left">
                {{ item.production_name + '#' + item.production_index }}
              </view>
              <view class="tit-right">
                <uni-icons type="eye" size="14" color="#999"></uni-icons>
                <text>{{ item.production_browse }}</text>
              </view>
            </view>
            <view class="footer">
              <view class="info">
                <image :src="item.author_logo" mode="" class="logo"></image>
                <text>{{ item.author_name }}</text>
              </view>
              <text class="price">¥{{ item.production_price }}</text>
            </view>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script>
import slFilter from '@/components/sl-filter/sl-filter.vue'
export default {
  components: {
    slFilter
  },
  data () {
    return {
      productName: '',
      sellNumber: '0/1500',
      navIndex: 1,
      state: true,
      param: { keyword: '', cid: '', onsale: 0, trend: 'asc', page: 1 },
      list: []
    }
  },
  onLoad (res) {
    this.productName = res.name
    this.sellNumber = res.productOnsale + '/' + res.productNumber
    this.param.cid = res.cid
    this.addGoodsbrowse()
  },
  methods: {
    // 增加编目浏览量
    addGoodsbrowse () {
      this.$ajax
        .post({
          url: 'catalog/browse',
          data: JSON.stringify({ cid: this.param.cid })
        })
        .then(res => {
          var data = res.data
          if (data.code == 200) {
            // 访问量成功后后端累计访问数量返回给前端
          }
        })
    },
	// 获取数据列表
	queryList (page, pageSize) {
	  var that = this
	  that.param.page = page
	  that.$ajax
	    .post({
	      url: 'production/list',
	      data: JSON.stringify(that.param)
	    })
	    .then(res => {
	      var data = res.data
	      if (data.code == 200) {
	        that.$refs.paging.complete(data.data)
	      } else {
	        that.$refs.paging.complete(false)
	      }
	    })
	},
	// tab切换
    navClcik (index) {
      if (index == 0) {
        this.state = !this.state
        if (this.state) {
          this.param.trend = 'asc'
        } else {
          this.param.trend = 'desc'
        }
      } else if (index == 1) {
        this.navIndex = index
        this.param.onsale = 0
      } else {
        this.navIndex = index
        this.param.onsale = 1
      }
      this.$refs.paging.reload()
    },
    // 搜索
    search () {
      this.$refs.paging.reload()
    },

    // 详情
    details (data) {
      console.log(data, 'data')
      uni.navigateTo({
        url: "details?pid="+data.production_id
      })
    }
  }
}
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
page {
  background-color: #f9f9f9;
}
.w {
  .top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 20rpx 24rpx;
    background-color: #ffffff;
    z-index: 9;
    .head {
      margin-top: 15rpx;
      width: 100%;
      display: flex;
      align-items: center;
      .item {
        width: 33%;
        line-height: 70rpx;
        text-align: center;
        font-size: 26rpx;
        position: relative;
        .border {
          width: 100rpx;
          height: 8rpx;
          background-color: rgb(18, 119, 241);
          border-radius: 60rpx;
          position: absolute;
          bottom: 0;
          left: 50%;
          margin-left: -50rpx;
        }
        .select {
          color: rgb(18, 119, 241);
        }
      }
    }
  }
  .title {
    padding: 0 24rpx;
    margin-top: 200rpx;
    display: flex;
    align-items: center;
    line-height: 120rpx;
    font-size: 26rpx;
    .name {
      font-weight: bold;
      margin-right: 10rpx;
    }
  }
  .goods {
    padding: 0 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    .item {
      width: 48%;
      background-color: #ffffff;
      border-radius: 20rpx;
      margin-bottom: 30rpx;
      image {
        width: 100%;
        height: 352rpx;
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;
      }
      .param {
        padding: 15rpx;
        height: 130rpx;
        .tit {
          .tit-left {
            font-size: 30rpx;
            font-weight: bold;
            float: left;
          }
          .tit-right {
            color: #999;
            font-size: 24rpx;
            float: right;
          }
        }
        .tit::after {
          content: '';
          display: block;
          clear: both;
        }

        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20rpx;
          .info {
            display: flex;
            align-items: center;
            .logo {
              width: 46rpx;
              height: 46rpx;
              border-radius: 50%;
              margin-right: 15rpx;
            }
            text {
              font-size: 28rpx;
              color: rgb(18, 119, 241);
            }
          }
          .price {
            font-size: 28rpx;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
