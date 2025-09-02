import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/view/Layout.vue";
import Home from "@/view/home/index.vue";
import TopCategory from "@/view/category/index.vue";
import subCategory from "@/view/category/sub.vue";

// 路由配置
const routes = [
  // 一级路由布局
  {
    path: "/",
    component: Layout,
    children: [
      { path: "/", component: Home },
      { path: "/category/:id", component: TopCategory },
      { path: "/category/sub/:id", component: subCategory },
    ],
  },
];

const router = createRouter({
  //使用哈希的路由模式
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 };
  },
});

export default router;
