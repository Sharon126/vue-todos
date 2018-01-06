// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mock from './mock'
import store from './vuex/store'

Vue.config.productionTip = false

// 这里的作用是全局加载mock，并执行初始化函数；这样本地设定的接口可在全局调用了
Mock.start();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,           // 注入
  template: '<App/>',
  components: { App }
})
