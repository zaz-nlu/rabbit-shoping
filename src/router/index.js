import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "@/view/Layout.vue";
import Home from "@/view/home/index.vue";
import TopCategory from "@/view/category/index.vue";
import subCategory from "@/view/category/sub.vue";
import GoodsDetail from "@/view/goods/index.vue";

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
      { path: "/product/:id", component: GoodsDetail },
      { path: "cart", component: () => import("@/view/cart/index.vue") },
    ],
  },
  {
    path: "/login",
    component: () => import("@/view/login/index.vue"),
  },
  {
    path: "/login/callback",
    component: () => import("@/view/login/callback.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/component/app-404.vue"),
  },
];

const router = createRouter({
  //使用哈希的路由模式
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 };
  },
});

export default router;
