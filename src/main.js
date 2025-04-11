import Vue from "vue";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import VueAxios from "vue-axios";
import VueClipboard from "vue-clipboard2";
import store, { LOGOUT } from "./store";
import jsoneditor from "jsoneditor";
import vueHljs from "vue-hljs";
import hljs from "highlight.js";
import { BACKEND_URL } from "./constvars";
import "highlight.js/styles/github.css";
import "@/assets/fontawesome-free-6.4.2/css/all.css";
import resource from "./resource";
import moment from "moment";
Vue.prototype.$jsoneditor = jsoneditor;
Vue.prototype.$resource = resource;
Vue.prototype.$moment = moment;

import "element-ui/lib/theme-chalk/index.css"; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import "./assets/css/theme-lightblue/index.css"; // 浅色主题
import "./assets/css/icon.css";
import "./assets/css/cg_css.css";
import "./components/common/directives";
import "jsoneditor/dist/jsoneditor.min.css";
import "jsoneditor/dist/jsoneditor.min";
import "babel-polyfill";

Vue.config.productionTip = false;

const backend_url = localStorage.getItem("backend_url");
if (backend_url) {
  axios.defaults.baseURL = backend_url;
} else {
  axios.defaults.baseURL = BACKEND_URL;
}

axios.interceptors.request.use(
  (config) => {
    if(config.url.startsWith('http')){
      return config;
    }
    if (store.state.token) {
      config.headers.Authorization = `Bearer ${store.state.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  async (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      store.commit(LOGOUT);
      router.replace({ name: "login" });
    }
    return Promise.reject(error);
  }
);
export const requests = axios;

Vue.use(VueAxios, axios);
Vue.use(vueHljs, { hljs });
Vue.use(VueClipboard);
Vue.use(ElementUI, {
  size: "small",
});

let app = null;
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | 系统管理`;
  let token = "";
  if (app) {
    // console.log(app.$store.state.userinfo);
    token = app.$store.state.token;
  }
  // const role = localStorage.getItem('ms_username');
  const role = "admin";
  if (
    !token &&
    to.path !== "/login" &&
    to.path.indexOf("/ArticelView") < 0 &&
    to.path !== "/404"
  ) {
    next({ name: "login", query: { redirect: to.fullPath } });
  } else {
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf("MSIE") > -1 && to.path === "/editor") {
      Vue.prototype.$alert(
        "不兼容IE10及以下浏览器，请使用更高版本的浏览器查看",
        "浏览器不兼容通知",
        {
          confirmButtonText: "确定",
        }
      );
    } else {
      next();
    }
  }
});

app = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
