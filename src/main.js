// src/main.js
import { createApp } from "vue";
import App from "./App.vue";

// 状态管理
import pinia from './stores'

// 路由
import router from "./router/index"; // 确保有 src/router/index.js

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount("#app");
