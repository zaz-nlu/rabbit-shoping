import { createRouter, createWebHashHistory } from "vue-router";
import { useUserStore } from "@/stores/modules/user.js";
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
      // 使用相对路径，确保在 Layout 的 <router-view> 中渲染
      { path: "", component: Home },
      { path: "category/:id", component: TopCategory },
      { path: "category/sub/:id", component: subCategory },
      { path: "product/:id", component: GoodsDetail },
      { path: "cart", component: () => import("@/view/cart/index.vue") },
      {
        path: "/pay/callback",
        component: () => import("@/view/member/pay/result.vue"),
      },
      // 会员中心布局路由
      {
        path: "member",
        component: () => import("@/view/member/layout.vue"),
        children: [
          // 个人中心（默认页）
          {
            path: "",
            redirect: "/member/home",
          },
          {
            path: "home",
            component: () => import("@/view/member/home/index.vue"),
          },
          // 我的账户
          {
            path: "message",
            component: () => import("@/view/member/message/index.vue"),
          },
          {
            path: "profile",
            component: () => import("@/view/member/profile/index.vue"),
          },
          {
            path: "security",
            component: () => import("@/view/member/security/index.vue"),
          },
          {
            path: "address",
            component: () => import("@/view/member/address/index.vue"),
          },
          {
            path: "points",
            component: () => import("@/view/member/points/index.vue"),
          },
          {
            path: "footprint",
            component: () => import("@/view/member/footprint/index.vue"),
          },
          {
            path: "invite",
            component: () => import("@/view/member/invite/index.vue"),
          },
          {
            path: "lottery",
            component: () => import("@/view/member/lottery/index.vue"),
          },
          // 交易管理
          {
            path: "order",
            component: () => import("@/view/member/order/index.vue"),
          },
          {
            path: "order/:id",
            component: () => import("@/view/member/order/component/detail.vue"),
          },
          {
            path: "pay",
            component: () => import("@/view/member/pay/index.vue"),
          },
          {
            path: "checkout",
            component: () => import("@/view/member/pay/checkout.vue"),
          },
          {
            path: "coupon",
            component: () => import("@/view/member/coupon/index.vue"),
          },
          {
            path: "giftcard",
            component: () => import("@/view/member/giftcard/index.vue"),
          },
          {
            path: "review",
            component: () => import("@/view/member/review/index.vue"),
          },
          {
            path: "service",
            component: () => import("@/view/member/service/index.vue"),
          },
          // 我的收藏
          {
            path: "collect/goods",
            component: () => import("@/view/member/collect/goods.vue"),
          },
          {
            path: "collect/topic",
            component: () => import("@/view/member/collect/topic.vue"),
          },
          {
            path: "collect/brand",
            component: () => import("@/view/member/collect/brand.vue"),
          },
        ],
      },
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

// 前置守卫
router.beforeEach((to, from, next) => {
  // 如果目标路由需要登录且用户未登录，且路径里带/member，则跳转到登录页
  const userStore = useUserStore();
  if (!userStore.profile.token && to.path.startsWith("/member")) {
    return next("/login?redirectUrl=" + encodeURIComponent(to.fullPath));
  }
  next();
});

export default router;
