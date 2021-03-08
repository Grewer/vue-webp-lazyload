// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import lazyLoad from '../dist/index.js'

Vue.use(lazyLoad, {
  loadImg: '/static/loading.svg',
  failImg: '/static/fail.png',
  openWebp: true
})


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
