import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store.js";
import {
  MdButton,
  MdContent,
  MdTabs,
  MdTable,
  MdRipple,
  MdIcon,
} from "vue-material/dist/components";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

Vue.use(MdButton);
Vue.use(MdContent);
Vue.use(MdTabs);
Vue.use(MdTable);
Vue.use(MdRipple);
Vue.use(MdIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");


