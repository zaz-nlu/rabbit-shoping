// src/main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "@/App.vue"; // 确保 App.vue 路径正确
import router from "@/router/index"; // ./router 或 ./router/index 都行

// 重置样式的库
import "normalize.css";

// 自己定义的样式库
import "@/assets/style/common.less";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // 先给 pinia 挂插件

app.use(pinia);
app.use(router);
app.mount("#app");
