import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入全局样式表
import './assets/global.css'

//element全局引入
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入网络框架
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = '/api/'
// 配置默认请求头权限，每次api请求带上token字段到Authorization
// axios.interceptors.request.use(config => {
//   config.headers.token = window.sessionStorage.getItem('token')
//   return config
// })
Vue.prototype.$http = axios

// 把echarts挂载到 Vue原型上，以便在全局访问
// 别的组件中 this.$echarts使用echarts即可
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
