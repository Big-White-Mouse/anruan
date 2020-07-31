import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/font/iconfont.css'

// 导入axios
import axios from 'axios'

import './plugins/element.js'
// 配置请求根路径
axios.defaults.baseURL = 'https://bird.ioliu.cn/v1?url=http://47.96.237.42/'
// axios.defaults.timeout = 3000 //超时时间
// axios.defaults.headers[ 'mytoken' ] = '....' //设置请求头
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
