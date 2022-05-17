
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

// 导入uview
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

// 导入api调用工具
import ajax from './common/ajax' 
// Vue2：挂载在 Vue 原型链上，则通过 this.$ajax 调用
Vue.prototype.$ajax = ajax

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif