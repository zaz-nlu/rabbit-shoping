// src/main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "@/App.vue"; // 确保 App.vue 路径正确
import router from "@/router/index"; // ./router 或 ./router/index 都行
import UI from "./component/libiray";

// 重置样式的库
import "normalize.css";

// 自己定义的样式库
import "@/assets/style/common.less";

// 引入nav-ui的样式
import naive from "naive-ui";

const app = createApp(App);

// pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // 先给 pinia 挂插件

// mockjs
import "@/mock/index.js";

app.use(pinia);
app.use(UI);
app.use(router);
app.use(naive);
app.mount("#app");
