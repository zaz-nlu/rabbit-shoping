import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";

// 路由配置
const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
];

const router = createRouter({
  //使用哈希的路由模式
  history: createWebHistory(),
  routes,
});

export default router;
