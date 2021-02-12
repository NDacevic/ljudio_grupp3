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

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

Vue.use(MdButton);
Vue.use(MdContent);
Vue.use(MdTabs);
Vue.use(MdTable);
Vue.use(MdRipple);
Vue.use(MdIcon);

Vue.config.productionTip = false;

var vueApp = new Vue({
  router,
  store,
  render: (h) => h(App),
  methods: {
    initYoutube() {
    },
  }
}).$mount("#app");

window.onYouTubeIframeAPIReady = () => {
  vueApp.initYoutube();
};


