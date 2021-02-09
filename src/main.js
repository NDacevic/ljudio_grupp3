import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store.js'
import {MDTabs} from 'vue-material/dist/components';

Vue.config.productionTip = false
Vue.Use(MDTabs);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
